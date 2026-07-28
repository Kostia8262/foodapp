/* Экран «Дашборд» — сводка по обоим сразу: прогресс к цели, темп, план на сегодня,
   плюс форма «Что съесть?», которая готовит промпт для Claude с оставшимся на сегодня бюджетом. */
(function () {
  const { DB, Calc } = App;
  const { esc, parseISO } = App.UI;

  function daysBetween(a, b) {
    return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);
  }

  // Суммарная калорийность и БЖУ того, что уже стоит в плане на сегодня
  function todayTotals(personId) {
    const today = DB.todayISO();
    const day = DB.getDay(today);
    const entries = day[personId] || [];
    const dishesById = Object.fromEntries(DB.getDishes().map((d) => [d.id, d]));
    const products = DB.getProducts();
    return entries.reduce((acc, e) => {
      const dish = dishesById[e.dishId];
      if (!dish) return acc;
      const t = Calc.dishTotals(dish.items, products);
      const portion = e.portion || 1;
      acc.kcal += t.kcal * portion;
      acc.protein += t.protein * portion;
      acc.fat += t.fat * portion;
      acc.carbs += t.carbs * portion;
      return acc;
    }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });
  }

  function personCard(personId) {
    const p = DB.getProfile(personId);
    const history = DB.getProgress(personId);
    const toGoal = p.goalWeight - p.weight;
    const plannedRate = Calc.weeklyRateKg(p);
    const eta = Calc.etaWeeks(p);
    const goalPct = Calc.goalProgressPct(p);

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

    const totals = todayTotals(personId);
    const entries = (DB.getDay(DB.todayISO())[personId] || []);
    const target = Calc.macros(p).kcal;
    const pct = target ? Math.min(100, Math.round((totals.kcal / target) * 100)) : 0;
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
        <div class="card-row" style="margin-top:12px"><span class="muted" style="font-size:13px">Прогресс к цели</span><span style="font-size:13px;font-weight:700">${goalPct}%</span></div>
        <div class="bar"><i style="width:${goalPct}%"></i></div>
        <div class="hint">План: ${plannedRate > 0 ? '+' : ''}${Calc.fmtKg(plannedRate)} кг/нед${eta ? `, цель примерно через ${Math.ceil(eta)} нед.` : ''}<br>Факт: ${actualRateStr}</div>
        <h3 style="margin-top:14px">Сегодня</h3>
        <div class="card-row"><span class="muted" style="font-size:13px">${Math.round(totals.kcal)} / ${Math.round(target)} ккал</span></div>
        <div class="bar kcal"><i class="${totals.kcal <= 0 ? '' : Math.abs(totals.kcal - target) / target <= 0.05 ? 'good' : Math.abs(totals.kcal - target) / target <= 0.15 ? 'warn' : 'bad'}" style="width:${pct}%"></i></div>
        ${entries.length ? '' : '<div class="hint">На сегодня пока ничего не запланировано.</div>'}
        <button class="btn sm block" style="margin-top:10px" data-goto-plan="${personId}">Открыть рацион →</button>
      </div>
    `;
  }

  // Промпт для Claude: описываем идею блюда + сколько каждому из двоих осталось на сегодня по калориям и БЖУ
  function buildAskPrompt(idea) {
    function personLine(personId) {
      const p = DB.getProfile(personId);
      const totals = todayTotals(personId);
      const target = Calc.macros(p);
      const remKcal = Math.max(0, Math.round(target.kcal - totals.kcal));
      const remProtein = Math.max(0, Math.round(target.proteinG - totals.protein));
      const remFat = Math.max(0, Math.round(target.fatG - totals.fat));
      const remCarbs = Math.max(0, Math.round(target.carbsG - totals.carbs));
      return `${p.name}: съедено сегодня ${Math.round(totals.kcal)} из ${target.kcal} ккал. Осталось примерно ${remKcal} ккал (Б ${remProtein} г / Ж ${remFat} г / У ${remCarbs} г).`;
    }
    return [
      `Хотим приготовить/съесть на двоих: "${idea}".`,
      '',
      personLine('me'),
      personLine('her'),
      '',
      'Подскажи: 1) сколько грамм (или штук, если продукт поштучный) стоит взять для меня и отдельно для неё, ' +
      'исходя из оставшегося на сегодня бюджета калорий и БЖУ у каждого; 2) калорийность и БЖУ получившейся порции; ' +
      '3) если блюдо не укладывается в бюджет целиком — предложи компромиссную порцию. ' +
      'Ответь кратко, отдельной строкой на каждого: «Я:» и «Она:».',
    ].join('\n');
  }

  function askCard() {
    return `
      <div class="card">
        <h2>💡 Что съесть?</h2>
        <div class="field"><textarea id="ai-idea" placeholder="Например: паста с курицей и сыром"></textarea></div>
        <div class="row-gap">
          <button class="btn primary flex1" id="ai-ask">🤖 Спросить в Claude</button>
          <button class="btn flex1" id="ai-copy">📋 Скопировать промпт</button>
        </div>
        <div class="hint">Опишите идею — откроется Claude с уже готовым вопросом: сколько грамм взять каждому,
        с учётом того, что вы уже съели сегодня и сколько осталось до нормы.</div>
      </div>
    `;
  }

  function wireAskCard(container) {
    const idea = () => container.querySelector('#ai-idea').value.trim();
    container.querySelector('#ai-ask').addEventListener('click', () => {
      const text = idea();
      if (!text) { App.UI.toast('Опишите, что хотите съесть'); return; }
      window.open('https://claude.ai/new?q=' + encodeURIComponent(buildAskPrompt(text)), '_blank');
    });
    container.querySelector('#ai-copy').addEventListener('click', async () => {
      const text = idea();
      if (!text) { App.UI.toast('Опишите, что хотите съесть'); return; }
      try {
        await navigator.clipboard.writeText(buildAskPrompt(text));
        App.UI.toast('Промпт скопирован');
      } catch (e) {
        App.UI.toast('Не удалось скопировать');
      }
    });
  }

  function render(container) {
    container.innerHTML = `${askCard()}<div class="dashboard-grid">${personCard('me')}${personCard('her')}</div>`;
    wireAskCard(container);
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
