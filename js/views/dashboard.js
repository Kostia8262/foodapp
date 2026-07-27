/* Экран «Дашборд» — сводка по обоим сразу: прогресс к цели, темп, план на сегодня */
(function () {
  const { DB, Calc } = App;
  const { esc, parseISO } = App.UI;

  function daysBetween(a, b) {
    return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);
  }

  function personCard(personId) {
    const p = DB.getProfile(personId);
    const history = DB.getProgress(personId);
    const toGoal = p.goalWeight - p.weight;
    const plannedRate = Calc.weeklyRateKg(p);
    const eta = Calc.etaWeeks(p);

    let actualRateStr = 'Недостаточно данных';
    if (history.length >= 2) {
      const a = history[history.length - 2];
      const b = history[history.length - 1];
      const days = daysBetween(a.date, b.date);
      if (days > 0) {
        const rate = ((b.weight - a.weight) / days) * 7;
        actualRateStr = `${rate > 0 ? '+' : ''}${Calc.fmtKg(rate)} кг/нед (по факту)`;
      }
    }

    const today = DB.todayISO();
    const day = DB.getDay(today);
    const entries = day[personId] || [];
    const dishesById = Object.fromEntries(DB.getDishes().map((d) => [d.id, d]));
    const products = DB.getProducts();
    const todayKcal = entries.reduce((sum, e) => {
      const dish = dishesById[e.dishId];
      if (!dish) return sum;
      return sum + Calc.dishTotals(dish.items, products).kcal * (e.portion || 1);
    }, 0);
    const target = Calc.macros(p).kcal;
    const pct = target ? Math.min(100, Math.round((todayKcal / target) * 100)) : 0;
    const cls = personId === 'me' ? 'me' : 'her';

    return `
      <div class="card context-${cls}">
        <div class="card-row">
          <h2 style="margin:0">${esc(p.name)}</h2>
          <span class="chip ${cls}">${p.goalType === 'cut' ? 'Похудение' : p.goalType === 'bulk' ? 'Набор массы' : 'Поддержание'}</span>
        </div>
        <div class="stat-grid">
          <div class="stat"><div class="v">${p.weight} кг</div><div class="l">Сейчас</div></div>
          <div class="stat"><div class="v">${p.goalWeight} кг</div><div class="l">Цель</div></div>
          <div class="stat"><div class="v">${toGoal > 0 ? '+' : ''}${Calc.fmtKg(toGoal)} кг</div><div class="l">Осталось</div></div>
        </div>
        <div class="hint">План: ${plannedRate > 0 ? '+' : ''}${Calc.fmtKg(plannedRate)} кг/нед${eta ? `, цель примерно через ${Math.ceil(eta)} нед.` : ''}<br>Факт: ${actualRateStr}</div>
        <h3 style="margin-top:14px">Сегодня</h3>
        <div class="card-row"><span class="muted" style="font-size:13px">${Math.round(todayKcal)} / ${Math.round(target)} ккал</span></div>
        <div class="bar kcal"><i class="${todayKcal <= 0 ? '' : Math.abs(todayKcal - target) / target <= 0.05 ? 'good' : Math.abs(todayKcal - target) / target <= 0.15 ? 'warn' : 'bad'}" style="width:${pct}%"></i></div>
        ${entries.length ? '' : '<div class="hint">На сегодня пока ничего не запланировано.</div>'}
        <button class="btn sm block" style="margin-top:10px" data-goto-plan="${personId}">Открыть рацион →</button>
      </div>
    `;
  }

  function render(container) {
    container.innerHTML = `<div class="dashboard-grid">${personCard('me')}${personCard('her')}</div>`;
    container.querySelectorAll('[data-goto-plan]').forEach((el) => {
      el.addEventListener('click', () => {
        if (App.Nav) App.Nav.goTo('plan', el.dataset.gotoPlan);
      });
    });
  }

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};
  window.App.Views.dashboard = { render };
})();
