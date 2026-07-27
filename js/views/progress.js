/* Экран «Прогресс» — вес, % жира, объёмы, фото по датам + график веса с линией цели */
(function () {
  const { DB, Calc } = App;
  const { esc, openModal, closeModal, toast, confirmDialog, parseISO, fmtDateShort, compressImage } = App.UI;

  const MEASURE_FIELDS = [
    ['waist', 'Талия'], ['chest', 'Грудь'], ['hips', 'Бёдра'], ['thigh', 'Бедро'], ['arm', 'Рука'],
  ];

  function weightChartSvg(history, profile) {
    if (!history.length) return '';
    const w = 600, h = 170, padL = 34, padR = 10, padT = 12, padB = 22;
    const weights = history.map((p) => p.weight);
    const allW = weights.concat([profile.goalWeight, profile.startWeight]);
    const minW = Math.min(...allW) - 1.5;
    const maxW = Math.max(...allW) + 1.5;
    const t0 = parseISO(history[0].date).getTime();
    const t1 = parseISO(history[history.length - 1].date).getTime();
    const xScale = (d) => (t1 === t0 ? padL + (w - padL - padR) / 2 : padL + ((parseISO(d).getTime() - t0) / (t1 - t0)) * (w - padL - padR));
    const yScale = (v) => padT + (1 - (v - minW) / (maxW - minW)) * (h - padT - padB);
    const cls = profile.id === 'me' ? 'me' : 'her';

    const linePts = history.map((p) => `${xScale(p.date).toFixed(1)},${yScale(p.weight).toFixed(1)}`).join(' ');
    const dots = history.map((p) => `<circle class="dot-${cls}" cx="${xScale(p.date).toFixed(1)}" cy="${yScale(p.weight).toFixed(1)}" r="3.5"><title>${esc(fmtDateShort(p.date))}: ${p.weight} кг</title></circle>`).join('');
    const goalY = yScale(profile.goalWeight).toFixed(1);

    return `
      <div class="chart-wrap"><svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <line class="grid-line" x1="${padL}" y1="${padT}" x2="${padL}" y2="${h - padB}"></line>
        <line class="grid-line" x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}"></line>
        <line class="goal-line" x1="${padL}" y1="${goalY}" x2="${w - padR}" y2="${goalY}"></line>
        <text class="axis-text" x="${padL + 4}" y="${Number(goalY) - 5}">цель ${profile.goalWeight} кг</text>
        <polyline class="line-${cls}" points="${linePts}"></polyline>
        ${dots}
        <text class="axis-text" x="${padL}" y="${h - 6}">${esc(fmtDateShort(history[0].date))}</text>
        <text class="axis-text" x="${w - padR}" y="${h - 6}" text-anchor="end">${esc(fmtDateShort(history[history.length - 1].date))}</text>
        <text class="axis-text" x="2" y="${padT + 8}">${maxW.toFixed(0)}</text>
        <text class="axis-text" x="2" y="${h - padB}">${minW.toFixed(0)}</text>
      </svg></div>
    `;
  }

  function openAddModal(personId, existing) {
    const e = existing || { date: DB.todayISO(), weight: '', bodyFatPct: '', measurements: {}, note: '' };
    let photos = existing && existing.photos ? existing.photos.slice() : [];

    const body = openModal(existing ? 'Изменить запись' : 'Новая запись', `
      <div class="field-row">
        <div class="field"><label>Дата</label><input type="date" id="pg-date" value="${esc(e.date)}"></div>
        <div class="field"><label>Вес, кг</label><input type="number" id="pg-weight" value="${e.weight}" min="30" max="250" step="0.1"></div>
      </div>
      <div class="field"><label>% жира (если измеряли, необязательно)</label><input type="number" id="pg-fat" value="${e.bodyFatPct != null ? e.bodyFatPct : ''}" min="3" max="60" step="0.1"></div>
      <h3>Объёмы, см (необязательно)</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${MEASURE_FIELDS.map(([k, l]) => `<div class="field"><label>${esc(l)}</label><input type="number" id="pg-m-${k}" value="${e.measurements && e.measurements[k] != null ? e.measurements[k] : ''}" min="0" step="0.5"></div>`).join('')}
      </div>
      <div class="field">
        <label>Фото (необязательно)</label>
        <input type="file" id="pg-photo" accept="image/*" multiple>
        <div class="photo-grid" id="pg-photos"></div>
      </div>
      <div class="field"><label>Заметка</label><textarea id="pg-note">${esc(e.note || '')}</textarea></div>
      <button class="btn primary block" id="pg-save">Сохранить</button>
    `);

    function renderPhotos() {
      const grid = body.querySelector('#pg-photos');
      grid.innerHTML = photos.map((src, idx) => `
        <div class="photo-thumb"><img src="${src}"><button class="del" data-rm-photo="${idx}">✕</button></div>
      `).join('');
      grid.querySelectorAll('[data-rm-photo]').forEach((btn) => {
        btn.addEventListener('click', () => { photos.splice(Number(btn.dataset.rmPhoto), 1); renderPhotos(); });
      });
    }
    renderPhotos();

    body.querySelector('#pg-photo').addEventListener('change', async (ev) => {
      const files = Array.from(ev.target.files || []);
      for (const f of files) {
        try {
          const dataUrl = await compressImage(f, 700, 0.6);
          photos.push(dataUrl);
        } catch (err) { console.error(err); }
      }
      ev.target.value = '';
      renderPhotos();
    });

    body.querySelector('#pg-save').addEventListener('click', () => {
      const date = body.querySelector('#pg-date').value;
      const weight = Number(body.querySelector('#pg-weight').value);
      if (!date) { toast('Укажите дату'); return; }
      if (!weight) { toast('Укажите вес'); return; }
      const fatVal = body.querySelector('#pg-fat').value;
      const measurements = {};
      MEASURE_FIELDS.forEach(([k]) => {
        const v = body.querySelector(`#pg-m-${k}`).value;
        if (v !== '') measurements[k] = Number(v);
      });
      const data = {
        date, weight,
        bodyFatPct: fatVal !== '' ? Number(fatVal) : null,
        measurements,
        photos,
        note: body.querySelector('#pg-note').value.trim(),
      };
      if (existing) DB.updateProgress(personId, existing.id, data);
      else DB.addProgress(personId, data);
      closeModal();
      toast('Сохранено');
    });
  }

  function viewPhoto(src) {
    openModal('Фото', `<img src="${src}" style="width:100%;border-radius:10px;display:block">`);
  }

  // Сводка по рациону за последние 7 дней (включая сегодня) — считается по тому, что стоит
  // в плане на каждый день, т.к. отдельного учёта "реально съедено" в приложении пока нет.
  function weekNutritionSummary(personId) {
    const profile = DB.getProfile(personId);
    const target = Calc.macros(profile).kcal;
    const dishesById = Object.fromEntries(DB.getDishes().map((d) => [d.id, d]));
    const products = DB.getProducts();
    const today = DB.todayISO();
    const days = [6, 5, 4, 3, 2, 1, 0].map((i) => App.UI.addDays(today, -i));

    let daysLogged = 0;
    let daysOnTarget = 0;
    let sumKcal = 0, sumProtein = 0, sumFat = 0, sumCarbs = 0;

    days.forEach((dateISO) => {
      const entries = DB.getDay(dateISO)[personId] || [];
      if (!entries.length) return;
      daysLogged += 1;
      let dayKcal = 0, dayProtein = 0, dayFat = 0, dayCarbs = 0;
      entries.forEach((e) => {
        const dish = dishesById[e.dishId];
        if (!dish) return;
        const t = Calc.dishTotals(dish.items, products);
        const portion = e.portion || 1;
        dayKcal += t.kcal * portion;
        dayProtein += t.protein * portion;
        dayFat += t.fat * portion;
        dayCarbs += t.carbs * portion;
      });
      sumKcal += dayKcal; sumProtein += dayProtein; sumFat += dayFat; sumCarbs += dayCarbs;
      if (target && Math.abs(dayKcal - target) / target <= 0.15) daysOnTarget += 1;
    });

    return {
      target, daysLogged, daysOnTarget,
      avgKcal: daysLogged ? sumKcal / daysLogged : 0,
      avgProtein: daysLogged ? sumProtein / daysLogged : 0,
      avgFat: daysLogged ? sumFat / daysLogged : 0,
      avgCarbs: daysLogged ? sumCarbs / daysLogged : 0,
    };
  }

  function render(container, personId) {
    const profile = DB.getProfile(personId);
    const history = DB.getProgress(personId); // по возрастанию даты

    const totalDiff = profile.weight - profile.startWeight;
    const toGoal = profile.goalWeight - profile.weight;
    const s = weekNutritionSummary(personId);

    container.innerHTML = `
      <div class="card">
        <div class="card-row">
          <h2 style="margin:0">Динамика веса</h2>
          <button class="btn primary sm" id="pg-add">+ Запись</button>
        </div>
        ${history.length ? weightChartSvg(history, profile) : '<div class="empty-state"><div class="big">📈</div>Записей пока нет — добавьте первую.</div>'}
        ${history.length ? `
        <div class="stat-grid" style="margin-top:10px">
          <div class="stat"><div class="v">${profile.weight} кг</div><div class="l">Сейчас</div></div>
          <div class="stat"><div class="v">${totalDiff > 0 ? '+' : ''}${Calc.fmtKg(totalDiff)} кг</div><div class="l">С начала</div></div>
          <div class="stat"><div class="v">${toGoal > 0 ? '+' : ''}${Calc.fmtKg(toGoal)} кг</div><div class="l">До цели</div></div>
        </div>` : ''}
      </div>
      <div class="card">
        <h2>Рацион за последние 7 дней</h2>
        ${s.daysLogged ? `
        <div class="stat-grid">
          <div class="stat"><div class="v">${Math.round(s.avgKcal)}</div><div class="l">Ккал/день, в среднем</div></div>
          <div class="stat"><div class="v">${s.daysOnTarget}/${s.daysLogged}</div><div class="l">Дней в норме (±15%)</div></div>
          <div class="stat"><div class="v">${Math.round(s.target)}</div><div class="l">Цель, ккал</div></div>
        </div>
        <div class="hint">Б ${Math.round(s.avgProtein)} г · Ж ${Math.round(s.avgFat)} г · У ${Math.round(s.avgCarbs)} г — в среднем за дни с записями (${s.daysLogged} из 7).
        Считается по плану на день, т.к. отдельного учёта фактически съеденного пока нет.</div>
        ` : '<div class="hint">За последние 7 дней в рационе нет ни одной записи.</div>'}
      </div>
      <div class="card">
        <h2>История</h2>
        <div class="list" id="pg-history"></div>
      </div>
    `;

    const hist = document.getElementById('pg-history');
    if (!history.length) {
      hist.innerHTML = `<div class="hint">Пока нет ни одной записи.</div>`;
    } else {
      const rows = history.slice().reverse().map((entry, idxRev) => {
        const idx = history.length - 1 - idxRev;
        const prev = idx > 0 ? history[idx - 1] : null;
        const delta = prev ? entry.weight - prev.weight : 0;
        const measureStr = MEASURE_FIELDS.filter(([k]) => entry.measurements && entry.measurements[k] != null)
          .map(([k, l]) => `${l} ${entry.measurements[k]}`).join(' · ');
        return `
          <div class="list-item" style="align-items:flex-start">
            <div class="main">
              <div class="title">${esc(fmtDateShort(entry.date))} · ${entry.weight} кг ${prev ? `<span class="muted" style="font-weight:400">(${delta > 0 ? '+' : ''}${Calc.fmtKg(delta)})</span>` : ''}</div>
              <div class="meta">${entry.bodyFatPct != null ? `% жира: ${entry.bodyFatPct} · ` : ''}${esc(measureStr)}</div>
              ${entry.note ? `<div class="meta">${esc(entry.note)}</div>` : ''}
              ${entry.photos && entry.photos.length ? `<div class="photo-grid">${entry.photos.map((src, i) => `<div class="photo-thumb" data-view-photo="${entry.id}|${i}"><img src="${src}"></div>`).join('')}</div>` : ''}
            </div>
            <div class="actions">
              <button class="icon-btn" data-edit-entry="${entry.id}">✎</button>
              <button class="icon-btn" data-del-entry="${entry.id}">🗑</button>
            </div>
          </div>
        `;
      }).join('');
      hist.innerHTML = rows;

      hist.querySelectorAll('[data-view-photo]').forEach((el) => {
        el.addEventListener('click', () => {
          const [entryId, photoIdx] = el.dataset.viewPhoto.split('|');
          const entry = history.find((h) => h.id === Number(entryId));
          if (entry) viewPhoto(entry.photos[Number(photoIdx)]);
        });
      });
      hist.querySelectorAll('[data-edit-entry]').forEach((el) => {
        el.addEventListener('click', () => {
          const entry = history.find((h) => h.id === Number(el.dataset.editEntry));
          openAddModal(personId, entry);
        });
      });
      hist.querySelectorAll('[data-del-entry]').forEach((el) => {
        el.addEventListener('click', () => {
          if (confirmDialog('Удалить эту запись прогресса?')) {
            DB.deleteProgress(personId, Number(el.dataset.delEntry));
            toast('Запись удалена');
          }
        });
      });
    }

    document.getElementById('pg-add').addEventListener('click', () => openAddModal(personId, null));
  }

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};
  window.App.Views.progress = { render };
})();
