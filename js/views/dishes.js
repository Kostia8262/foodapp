/* Экран «Блюда» — сборка блюда из продуктов (граммовки), автоподсчёт ккал/БЖУ, привязка к приёму пищи */
(function () {
  const { DB, Calc } = App;
  const { esc, openModal, closeModal, toast, confirmDialog } = App.UI;

  const MEAL_TYPES = [
    ['breakfast', 'Завтрак'], ['lunch', 'Обед'], ['dinner', 'Ужин'], ['snack', 'Перекус'],
  ];
  const MEAL_LABEL = Object.fromEntries(MEAL_TYPES);
  const WHO_OPTS = [['both', 'Оба'], ['me', 'Только я'], ['her', 'Только она']];
  const WHO_LABEL = Object.fromEntries(WHO_OPTS);
  const MEAL_EMOJI = { breakfast: '🍳', lunch: '🍲', dinner: '🍽️', snack: '🥤' };

  let filterMeal = 'all';
  let query = '';

  function takeToday(dish) {
    const today = DB.todayISO();
    const add = (personId) => {
      DB.addMeal(today, personId, { mealType: dish.mealType, dishId: dish.id, portion: 1 });
      toast(`Добавлено на сегодня (${personId === 'me' ? 'мне' : 'ей'}): ${dish.name}`);
    };
    // Метка "для кого" на блюде — это подсказка, а не запрет: спрашиваем всегда,
    // чтобы случайно не добавить чужое блюдо не тому человеку молча.
    const body = openModal('Кому добавить на сегодня?', `
      <div class="row-gap">
        <button class="btn block flex1" id="tt-me">Мне</button>
        <button class="btn block flex1" id="tt-her">Ей</button>
      </div>
    `);
    body.querySelector('#tt-me').addEventListener('click', () => { add('me'); closeModal(); });
    body.querySelector('#tt-her').addEventListener('click', () => { add('her'); closeModal(); });
  }

  function openDishModal(existing) {
    const products = DB.getProducts();
    let items = existing ? JSON.parse(JSON.stringify(existing.items)) : [];

    const body = openModal(existing ? 'Изменить блюдо' : 'Новое блюдо', `
      <div class="field">
        <label>Название</label>
        <input type="text" id="df-name" value="${esc(existing ? existing.name : '')}" placeholder="Например, Гречка с курицей и овощами">
      </div>
      <div class="field-row">
        <div class="field">
          <label>Приём пищи</label>
          <select id="df-meal">${MEAL_TYPES.map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select>
        </div>
        <div class="field">
          <label>Для кого</label>
          <select id="df-who">${WHO_OPTS.map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select>
        </div>
      </div>
      <div class="field">
        <label>Добавить ингредиент</label>
        <div class="field-row">
          <select id="df-add-product" class="flex1">
            <option value="">— выбрать продукт —</option>
            ${products.sort((a, b) => a.name.localeCompare(b.name, 'ru')).map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}
          </select>
        </div>
        <div class="field-row" style="margin-top:8px">
          <input type="number" id="df-add-grams" placeholder="Граммы" min="1" step="1" style="max-width:110px">
          <button class="btn" id="df-add-btn">Добавить</button>
        </div>
      </div>
      <h3 style="margin-top:16px">Состав</h3>
      <div class="list" id="df-items"></div>
      <div class="card" style="margin-top:12px;background:var(--bg-elev-2)" id="df-totals"></div>
      <div class="field" style="margin-top:12px">
        <label>Заметка (необязательно)</label>
        <textarea id="df-note">${esc(existing && existing.note ? existing.note : '')}</textarea>
      </div>
      <button class="btn primary block" id="df-save">Сохранить</button>
    `);

    function renderItems() {
      const list = body.querySelector('#df-items');
      if (!items.length) {
        list.innerHTML = `<div class="hint">Пока пусто — добавьте продукты выше.</div>`;
      } else {
        list.innerHTML = items.map((it, idx) => {
          const p = products.find((pr) => pr.id === it.productId);
          const t = Calc.dishTotals([it], products);
          const isAvoid = p && p.category === 'avoid';
          return `
            <div class="list-item">
              <div class="main">
                <div class="title">${esc(p ? p.name : '—')} ${isAvoid ? '<span class="chip bad">⚠</span>' : ''}</div>
                <div class="meta">${Math.round(t.kcal)} ккал</div>
              </div>
              <div class="actions">
                <input type="number" data-grams-idx="${idx}" value="${it.grams}" min="1" step="1" style="width:70px">
                <button class="icon-btn" data-rm-idx="${idx}">✕</button>
              </div>
            </div>
          `;
        }).join('');
      }
      const t = Calc.dishTotals(items, products);
      body.querySelector('#df-totals').innerHTML = `
        <div class="stat-grid">
          <div class="stat"><div class="v">${Math.round(t.kcal)}</div><div class="l">Ккал всего</div></div>
          <div class="stat"><div class="v">${t.grams} г</div><div class="l">Вес порции</div></div>
          <div class="stat"><div class="v">${Math.round(t.kcal / Math.max(t.grams, 1) * 100)}</div><div class="l">Ккал/100г</div></div>
        </div>
        <div class="hint">Б ${Math.round(t.protein)} г · Ж ${Math.round(t.fat)} г · У ${Math.round(t.carbs)} г</div>
      `;
      list.querySelectorAll('[data-grams-idx]').forEach((inp) => {
        inp.addEventListener('change', (e) => {
          items[Number(inp.dataset.gramsIdx)].grams = Number(e.target.value) || 0;
          renderItems();
        });
      });
      list.querySelectorAll('[data-rm-idx]').forEach((btn) => {
        btn.addEventListener('click', () => {
          items.splice(Number(btn.dataset.rmIdx), 1);
          renderItems();
        });
      });
    }

    body.querySelector('#df-add-btn').addEventListener('click', () => {
      const sel = body.querySelector('#df-add-product');
      const gramsInp = body.querySelector('#df-add-grams');
      const pid = Number(sel.value);
      const grams = Number(gramsInp.value);
      if (!pid) { toast('Выберите продукт'); return; }
      if (!grams || grams <= 0) { toast('Укажите граммы'); return; }
      const existingIdx = items.findIndex((it) => it.productId === pid);
      if (existingIdx >= 0) items[existingIdx].grams += grams;
      else items.push({ productId: pid, grams });
      sel.value = ''; gramsInp.value = '';
      renderItems();
    });

    if (existing) {
      body.querySelector('#df-meal').value = existing.mealType;
      body.querySelector('#df-who').value = existing.forWho;
    }

    body.querySelector('#df-save').addEventListener('click', () => {
      const name = body.querySelector('#df-name').value.trim();
      if (!name) { toast('Введите название блюда'); return; }
      if (!items.length) { toast('Добавьте хотя бы один продукт'); return; }
      const data = {
        name,
        mealType: body.querySelector('#df-meal').value,
        forWho: body.querySelector('#df-who').value,
        note: body.querySelector('#df-note').value.trim(),
        items,
      };
      if (existing) DB.updateDish(existing.id, data);
      else DB.addDish(data);
      closeModal();
      toast('Блюдо сохранено');
    });

    renderItems();
  }

  function render(container) {
    const products = DB.getProducts();
    if (!products.length) {
      container.innerHTML = `<div class="empty-state"><div class="big">🍲</div>Сначала добавьте продукты на вкладке «Продукты» — из них собираются блюда.</div>`;
      return;
    }
    const dishes = DB.getDishes().filter((d) => {
      if (filterMeal !== 'all' && d.mealType !== filterMeal) return false;
      if (query && !d.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    const pills = ['all'].concat(MEAL_TYPES.map((m) => m[0])).map((k) => {
      const label = k === 'all' ? 'Все' : MEAL_LABEL[k];
      return `<div class="pill ${filterMeal === k ? 'active' : ''}" data-meal="${k}">${esc(label)}</div>`;
    }).join('');

    container.innerHTML = `
      <div class="search-row">
        <input type="text" id="dish-search" placeholder="Поиск блюда…" value="${esc(query)}">
        <button class="btn primary" id="dish-add">+ Блюдо</button>
      </div>
      <div class="pill-row">${pills}</div>
      <div class="dish-grid" id="dish-list"></div>
    `;

    const list = document.getElementById('dish-list');
    if (!dishes.length) {
      list.innerHTML = `<div class="empty-state"><div class="big">🍽️</div>Блюд пока нет — добавьте первое.</div>`;
    } else {
      const pairedIds = new Set();
      Calc.findDishPairs(DB.getDishes()).forEach((p) => { pairedIds.add(p.her.id); pairedIds.add(p.me.id); });
      list.innerHTML = dishes.map((d) => {
        const t = Calc.dishTotals(d.items, products);
        const hasAvoid = Calc.dishHasAvoid(d.items, products);
        return `
          <div class="dish-card" data-open="${d.id}">
            <div class="dish-thumb ${esc(d.forWho)}"><span>${MEAL_EMOJI[d.mealType] || '🍽️'}</span></div>
            <div class="dish-card-body">
              <div class="dish-card-title">${esc(d.name)}</div>
              <div class="dish-card-kcal">${Math.round(t.kcal)} ккал</div>
              <div class="dish-card-meta">${esc(MEAL_LABEL[d.mealType] || '')} · ${esc(WHO_LABEL[d.forWho] || '')} ${pairedIds.has(d.id) ? '<span class="chip good">🤝 парное</span>' : ''} ${hasAvoid ? '<span class="chip bad">⚠ калорийное</span>' : ''}</div>
            </div>
            <div class="dish-card-actions">
              <button class="btn sm primary flex1" data-take-today="${d.id}">+ Сегодня</button>
              <button class="icon-btn" data-edit="${d.id}">✎</button>
              <button class="icon-btn" data-del="${d.id}">🗑</button>
            </div>
          </div>
        `;
      }).join('');
    }

    document.getElementById('dish-search').addEventListener('input', (e) => {
      query = e.target.value;
      render(container);
      const val = document.getElementById('dish-search');
      val.focus();
      val.selectionStart = val.selectionEnd = val.value.length;
    });
    document.getElementById('dish-add').addEventListener('click', () => openDishModal(null));
    container.querySelectorAll('.pill').forEach((el) => {
      el.addEventListener('click', () => { filterMeal = el.dataset.meal; render(container); });
    });
    container.querySelectorAll('[data-edit]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const dish = dishes.find((d) => d.id === Number(el.dataset.edit));
        openDishModal(dish);
      });
    });
    container.querySelectorAll('[data-del]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(el.dataset.del);
        const dish = dishes.find((d) => d.id === id);
        if (confirmDialog(`Удалить блюдо «${dish.name}»? Оно также исчезнет из рациона, где было запланировано.`)) {
          DB.deleteDish(id);
          toast('Блюдо удалено');
        }
      });
    });
    container.querySelectorAll('[data-open]').forEach((el) => {
      el.addEventListener('click', () => {
        const dish = dishes.find((d) => d.id === Number(el.dataset.open));
        openDishModal(dish);
      });
    });
    container.querySelectorAll('[data-take-today]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const dish = dishes.find((d) => d.id === Number(el.dataset.takeToday));
        takeToday(dish);
      });
    });
  }

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};
  window.App.Views.dishes = { render, MEAL_TYPES, MEAL_LABEL, WHO_LABEL, MEAL_EMOJI, openDishModal, takeToday };
})();
