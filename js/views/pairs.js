/* Экран «Парные» — блюда с общей основой на двоих: готовится вместе, расходится разными порциями */
(function () {
  const { DB, Calc } = App;
  const { esc, toast, openModal } = App.UI;
  const { MEAL_LABEL, MEAL_EMOJI, openDishModal } = App.Views.dishes;

  const MEAL_TYPES = App.Views.dishes.MEAL_TYPES;
  let filterMeal = 'all';

  function addPairToday(pair) {
    const today = DB.todayISO();
    DB.addMeal(today, 'her', { mealType: pair.her.mealType, dishId: pair.her.id, portion: 1 });
    DB.addMeal(today, 'me', { mealType: pair.me.mealType, dishId: pair.me.id, portion: 1 });
    toast(`Добавлено на сегодня обоим: ${pair.base}`);
  }

  function render(container) {
    const dishes = DB.getDishes();
    const products = DB.getProducts();
    let pairs = Calc.findDishPairs(dishes);

    if (!pairs.length) {
      container.innerHTML = `<div class="empty-state"><div class="big">🤝</div>Парных блюд пока нет.<br>Они появляются, когда для одной и той же основы есть версия «её порция» и «его порция».</div>`;
      return;
    }

    if (filterMeal !== 'all') pairs = pairs.filter((p) => p.her.mealType === filterMeal);

    const pills = ['all'].concat(MEAL_TYPES.map((m) => m[0])).map((k) => {
      const label = k === 'all' ? 'Все' : MEAL_LABEL[k];
      return `<div class="pill ${filterMeal === k ? 'active' : ''}" data-meal="${k}">${esc(label)}</div>`;
    }).join('');

    container.innerHTML = `
      <div class="hint" style="margin-bottom:12px">Одна основа готовится сразу на двоих — расходится по тарелкам разными порциями и добавками.</div>
      <div class="pill-row">${pills}</div>
      <div class="list" id="pairs-list"></div>
    `;

    const list = document.getElementById('pairs-list');
    list.innerHTML = pairs.sort((a, b) => a.base.localeCompare(b.base, 'ru')).map((p) => {
      const th = Calc.dishTotals(p.her.items, products);
      const tm = Calc.dishTotals(p.me.items, products);
      return `
        <div class="card">
          <div class="card-row">
            <h2 style="margin:0">${MEAL_EMOJI[p.her.mealType] || '🍽️'} ${esc(p.base)}</h2>
            <span class="chip">${esc(MEAL_LABEL[p.her.mealType] || '')}</span>
          </div>
          <div class="stat-grid" style="grid-template-columns:1fr 1fr">
            <div class="stat" style="background:var(--accent-her-soft)">
              <div class="v">${Math.round(th.kcal)} ккал</div><div class="l">Она</div>
            </div>
            <div class="stat" style="background:var(--accent-me-soft)">
              <div class="v">${Math.round(tm.kcal)} ккал</div><div class="l">Я</div>
            </div>
          </div>
          <button class="btn primary block" style="margin-top:10px" data-add-pair="${p.her.id}|${p.me.id}">+ Сегодня (обоим)</button>
          <div class="row-gap" style="margin-top:8px">
            <button class="btn sm flex1" data-view="${p.her.id}">Детали — она</button>
            <button class="btn sm flex1" data-view="${p.me.id}">Детали — я</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.pill').forEach((el) => {
      el.addEventListener('click', () => { filterMeal = el.dataset.meal; render(container); });
    });
    list.querySelectorAll('[data-add-pair]').forEach((el) => {
      el.addEventListener('click', () => {
        const [herId, meId] = el.dataset.addPair.split('|').map(Number);
        const pair = { base: '', her: dishes.find((d) => d.id === herId), me: dishes.find((d) => d.id === meId) };
        pair.base = pairs.find((p) => p.her.id === herId).base;
        addPairToday(pair);
      });
    });
    list.querySelectorAll('[data-view]').forEach((el) => {
      el.addEventListener('click', () => {
        const dish = dishes.find((d) => d.id === Number(el.dataset.view));
        openDishModal(dish);
      });
    });
  }

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};
  window.App.Views.pairs = { render };
})();
