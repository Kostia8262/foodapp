/* Экран «Рацион на неделю» — план по дням/приёмам пищи на человека, сверка с целевым калоражем */
(function () {
  const { DB, Calc } = App;
  const { esc, openModal, closeModal, toast, confirmDialog, addDays, startOfWeek, weekdayShort, fmtDateShort } = App.UI;
  const { MEAL_TYPES, MEAL_LABEL } = App.Views.dishes;

  let refDate = DB.todayISO();

  function statusClass(total, target) {
    if (total <= 0) return '';
    const diff = Math.abs(total - target) / target;
    if (diff <= 0.05) return 'good';
    if (diff <= 0.15) return 'warn';
    return 'bad';
  }

  function openAddMealModal(container, personId, dateISO) {
    const dishes = DB.getDishes();
    if (!dishes.length) {
      toast('Сначала добавьте блюда на вкладке «Блюда»');
      return;
    }
    const products = DB.getProducts();
    // Метка "для кого" на блюде — это просто подсказка, а не запрет: показываем все блюда,
    // но подходящие под текущего человека — выше списка.
    const matches = (d) => d.forWho === 'both' || d.forWho === personId;
    const sorted = dishes.slice().sort((a, b) => {
      const s = Number(!matches(a)) - Number(!matches(b));
      return s !== 0 ? s : a.name.localeCompare(b.name, 'ru');
    });
    const body = openModal('Добавить приём пищи', `
      <div class="field">
        <label>Приём пищи</label>
        <select id="am-meal">${MEAL_TYPES.map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select>
      </div>
      <div class="field">
        <label>Блюдо</label>
        <select id="am-dish">
          ${sorted.map((d) => {
            const t = Calc.dishTotals(d.items, products);
            const otherTag = matches(d) ? '' : (d.forWho === 'me' ? ' — его рецепт' : ' — её рецепт');
            const avoidTag = Calc.dishHasAvoid(d.items, products) ? ' ⚠' : '';
            return `<option value="${d.id}">${esc(d.name)} (${Math.round(t.kcal)} ккал)${otherTag}${avoidTag}</option>`;
          }).join('')}
        </select>
      </div>
      <div class="field">
        <label>Порция (множитель от рецепта)</label>
        <input type="number" id="am-portion" value="1" min="0.25" step="0.25">
      </div>
      <button class="btn primary block" id="am-save">Добавить</button>
    `);
    body.querySelector('#am-save').addEventListener('click', () => {
      const mealType = body.querySelector('#am-meal').value;
      const dishId = Number(body.querySelector('#am-dish').value);
      const portion = Number(body.querySelector('#am-portion').value) || 1;
      DB.addMeal(dateISO, personId, { mealType, dishId, portion });
      closeModal();
    });
  }

  function buildShoppingList(days, dishesById, products) {
    const totals = {}; // productId -> граммы, суммарно на обоих за все дни недели
    days.forEach((dateISO) => {
      const day = DB.getDay(dateISO);
      ['me', 'her'].forEach((who) => {
        (day[who] || []).forEach((e) => {
          const dish = dishesById[e.dishId];
          if (!dish) return;
          const portion = e.portion || 1;
          dish.items.forEach((it) => {
            totals[it.productId] = (totals[it.productId] || 0) + it.grams * portion;
          });
        });
      });
    });
    const rows = Object.entries(totals).map(([pid, grams]) => {
      const p = products.find((pr) => pr.id === Number(pid));
      return p ? { id: p.id, name: p.name, category: p.category, grams } : null;
    }).filter(Boolean);
    const catLabel = (c) => (App.CATEGORIES[c] || 'Прочее');
    rows.sort((a, b) => catLabel(a.category).localeCompare(catLabel(b.category), 'ru') || a.name.localeCompare(b.name, 'ru'));
    return rows;
  }

  function fmtAmount(grams) {
    const g = Math.round(grams / 5) * 5;
    return g >= 1000 ? `${(g / 1000).toFixed(2).replace(/\.?0+$/, '')} кг` : `${g} г`;
  }

  function buildShoppingListText(rows, days) {
    const catLabel = (c) => (App.CATEGORIES[c] || 'Прочее');
    const lines = [`Список покупок (${fmtDateShort(days[0])} — ${fmtDateShort(days[days.length - 1])})`, ''];
    let lastCat = null;
    rows.forEach((r) => {
      if (r.category !== lastCat) {
        lines.push(`${catLabel(r.category)}:`);
        lastCat = r.category;
      }
      lines.push(`- ${r.name} — ${fmtAmount(r.grams)}`);
    });
    return lines.join('\n');
  }

  function openShoppingListModal(days) {
    const products = DB.getProducts();
    const dishesById = Object.fromEntries(DB.getDishes().map((d) => [d.id, d]));
    const rows = buildShoppingList(days, dishesById, products);
    if (!rows.length) {
      toast('На этой неделе пока ничего не запланировано — нечего закупать');
      return;
    }
    let lastCat = null;
    const itemsHtml = rows.map((r) => {
      const catLabel = App.CATEGORIES[r.category] || 'Прочее';
      const header = r.category !== lastCat ? `<h3 style="margin-top:14px">${esc(catLabel)}</h3>` : '';
      lastCat = r.category;
      return `${header}<label class="list-item" style="cursor:pointer">
        <span class="main"><span class="title">${esc(r.name)}</span></span>
        <span class="row-gap" style="align-items:center"><input type="checkbox" style="width:auto"><span class="muted">${fmtAmount(r.grams)}</span></span>
      </label>`;
    }).join('');
    const text = buildShoppingListText(rows, days);
    const body = openModal('Список покупок на неделю', `
      <div class="row-gap" style="margin-bottom:10px">
        <button class="btn sm flex1" id="sl-copy">📋 Скопировать текстом</button>
        <button class="btn sm flex1" id="sl-download">⬇ Скачать .txt</button>
      </div>
      <div class="list">${itemsHtml}</div>
      <div class="hint">Собрано из блюд, назначенных на видимую неделю — на обоих. Отметьте купленное; список не сохраняется после закрытия.
      Кнопки выше — чтобы переслать список, например, в Telegram.</div>
    `);
    body.querySelector('#sl-copy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text);
        toast('Список скопирован — можно вставить в Telegram');
      } catch (e) {
        toast('Не удалось скопировать — браузер не дал доступ к буферу обмена');
      }
    });
    body.querySelector('#sl-download').addEventListener('click', () => {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spisok-pokupok-${DB.todayISO()}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  function dayBlockHtml(dateISO, personId, target, dishesById, products) {
    const day = DB.getDay(dateISO);
    const entries = (day[personId] || []).slice().sort((a, b) => {
      const order = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
      return order[a.mealType] - order[b.mealType];
    });
    let total = 0;
    const rows = entries.map((e) => {
      const dish = dishesById[e.dishId];
      const t = dish ? Calc.dishTotals(dish.items, products) : { kcal: 0 };
      const kcal = t.kcal * (e.portion || 1);
      total += kcal;
      const portionLabel = e.portion !== 1 ? ` ×${e.portion}` : '';
      const hasAvoid = dish && Calc.dishHasAvoid(dish.items, products);
      return `
        <div class="meal-row">
          <div class="mtype">${esc(MEAL_LABEL[e.mealType] || e.mealType)}</div>
          <div class="mname">${esc(dish ? dish.name : '(удалено)')}${portionLabel} ${hasAvoid ? '<span class="chip bad">⚠</span>' : ''}</div>
          <div class="mkcal">${Math.round(kcal)} ккал</div>
          <button class="icon-btn" data-rm-entry="${dateISO}|${personId}|${e.id}">✕</button>
        </div>
      `;
    }).join('');

    const cls = statusClass(total, target);
    const pct = target ? Math.min(100, Math.round((total / target) * 100)) : 0;
    const isToday = dateISO === DB.todayISO();

    return `
      <div class="day-block">
        <div class="day-head">
          <div class="name">${weekdayShort(dateISO)}, ${fmtDateShort(dateISO)}${isToday ? ' · сегодня' : ''}</div>
          <div class="row-gap">
            <span class="kcal">${Math.round(total)} / ${Math.round(target)} ккал</span>
            <button class="icon-btn" data-copy-prev="${dateISO}" title="Скопировать с предыдущего дня">⧉</button>
            ${entries.length ? `<button class="icon-btn" data-clear-day="${dateISO}" title="Очистить день">🗑</button>` : ''}
          </div>
        </div>
        <div class="bar kcal"><i class="${cls}" style="width:${pct}%"></i></div>
        <div style="height:8px"></div>
        ${rows || '<div class="day-empty">Приёмов пищи ещё нет.</div>'}
        <button class="btn sm" data-add-meal="${dateISO}">+ Добавить приём пищи</button>
      </div>
    `;
  }

  function render(container, personId) {
    const weekStart = startOfWeek(refDate);
    const days = [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(weekStart, i));
    const profile = DB.getProfile(personId);
    const target = Calc.macros(profile).kcal;
    const dishes = DB.getDishes();
    const products = DB.getProducts();
    const dishesById = Object.fromEntries(dishes.map((d) => [d.id, d]));

    if (!dishes.length) {
      container.innerHTML = `<div class="empty-state"><div class="big">📅</div>Сначала создайте блюда на вкладке «Блюда» — потом расставите их по дням недели.</div>`;
      return;
    }

    const weekEnd = addDays(weekStart, 6);
    container.innerHTML = `
      <div class="week-nav">
        <button class="icon-btn" id="wk-prev">◀</button>
        <div class="lbl">${fmtDateShort(weekStart)} — ${fmtDateShort(weekEnd)}</div>
        <button class="icon-btn" id="wk-next">▶</button>
      </div>
      <button class="btn sm block" id="wk-shop" style="margin-bottom:12px">🛒 Список покупок на эту неделю (на обоих)</button>
      <div id="days-root"></div>
    `;
    const daysRoot = document.getElementById('days-root');
    daysRoot.innerHTML = days.map((d) => dayBlockHtml(d, personId, target, dishesById, products)).join('');

    document.getElementById('wk-prev').addEventListener('click', () => { refDate = addDays(refDate, -7); render(container, personId); });
    document.getElementById('wk-next').addEventListener('click', () => { refDate = addDays(refDate, 7); render(container, personId); });
    document.getElementById('wk-shop').addEventListener('click', () => openShoppingListModal(days));

    daysRoot.querySelectorAll('[data-add-meal]').forEach((el) => {
      el.addEventListener('click', () => openAddMealModal(container, personId, el.dataset.addMeal));
    });
    daysRoot.querySelectorAll('[data-rm-entry]').forEach((el) => {
      el.addEventListener('click', () => {
        const [dateISO, who, entryId] = el.dataset.rmEntry.split('|');
        DB.removeMeal(dateISO, who, Number(entryId));
      });
    });
    daysRoot.querySelectorAll('[data-copy-prev]').forEach((el) => {
      el.addEventListener('click', () => {
        const dateISO = el.dataset.copyPrev;
        const prevISO = addDays(dateISO, -1);
        DB.copyDayForPerson(prevISO, dateISO, personId);
        toast('Скопировано с предыдущего дня');
      });
    });
    daysRoot.querySelectorAll('[data-clear-day]').forEach((el) => {
      el.addEventListener('click', () => {
        const dateISO = el.dataset.clearDay;
        if (confirmDialog('Очистить приёмы пищи за этот день?')) {
          DB.clearDay(dateISO, personId);
        }
      });
    });
  }

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};
  window.App.Views.plan = { render };
})();
