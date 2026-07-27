/* Экран «Профиль» — параметры человека, цель, авторасчёт нормы калорий и БЖУ */
(function () {
  const { DB } = App;
  const { Calc } = App;
  const { esc } = App.UI;

  const ACTIVITY_OPTS = Object.entries(Calc.ACTIVITY)
    .map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('');

  const GOAL_OPTS = [
    ['cut', 'Похудение (дефицит)'],
    ['bulk', 'Набор массы (профицит)'],
    ['maintain', 'Поддержание веса'],
  ];

  function render(container, personId) {
    const p = DB.getProfile(personId);
    const m = Calc.macros(p);
    const bmrVal = Calc.bmr(p);
    const tdeeVal = Calc.tdee(p);
    const rate = Calc.weeklyRateKg(p);
    const eta = Calc.etaWeeks(p);
    const goalDiff = p.goalWeight - p.weight;

    container.innerHTML = `
      <div class="card">
        <h2>Параметры</h2>
        <div class="field-row">
          <div class="field">
            <label>Рост, см</label>
            <input type="number" id="f-height" value="${p.height}" min="100" max="230" step="1">
          </div>
          <div class="field">
            <label>Возраст</label>
            <input type="number" id="f-age" value="${p.age}" min="14" max="90" step="1">
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Текущий вес, кг</label>
            <input type="number" id="f-weight" value="${p.weight}" min="30" max="250" step="0.1">
          </div>
          <div class="field">
            <label>Активность</label>
            <select id="f-activity">${ACTIVITY_OPTS}</select>
          </div>
        </div>
        <div class="hint">Текущий вес также обновляется автоматически при добавлении записи на вкладке «Прогресс».</div>
      </div>

      <div class="card">
        <h2>Цель</h2>
        <div class="field-row">
          <div class="field">
            <label>Тип цели</label>
            <select id="f-goaltype">${GOAL_OPTS.map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select>
          </div>
          <div class="field">
            <label>Целевой вес, кг</label>
            <input type="number" id="f-goalweight" value="${p.goalWeight}" min="30" max="250" step="0.1">
          </div>
        </div>
        <div class="field-row" id="pct-row">
          <div class="field">
            <label id="pct-label">Дефицит/профицит, %</label>
            <input type="number" id="f-pct" value="${p.deficitSurplusPct}" min="0" max="40" step="1">
          </div>
          <div class="field">
            <label>Старт: дата / вес</label>
            <input type="text" value="${esc(p.startDate)} / ${p.startWeight} кг" disabled>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Белок, г/кг веса</label>
            <input type="number" id="f-protein" value="${p.proteinPerKg}" min="0.5" max="4" step="0.1">
          </div>
          <div class="field">
            <label>Жиры, г/кг веса</label>
            <input type="number" id="f-fat" value="${p.fatPerKg}" min="0.3" max="2" step="0.1">
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Расчёт нормы</h2>
        <div class="stat-grid">
          <div class="stat"><div class="v">${Calc.fmt0(bmrVal)}</div><div class="l">БМР, ккал</div></div>
          <div class="stat"><div class="v">${Calc.fmt0(tdeeVal)}</div><div class="l">Поддержание, ккал</div></div>
          <div class="stat"><div class="v">${m.kcal}</div><div class="l">Цель, ккал/день</div></div>
        </div>
        <div style="height:12px"></div>
        <div class="stat-grid">
          <div class="stat"><div class="v">${m.proteinG} г</div><div class="l">Белки</div></div>
          <div class="stat"><div class="v">${m.fatG} г</div><div class="l">Жиры</div></div>
          <div class="stat"><div class="v">${m.carbsG} г</div><div class="l">Углеводы</div></div>
        </div>
        ${m.overBudget ? '<div class="hint" style="color:var(--bad)">Белки+жиры уже превышают целевой калораж — снизьте г/кг или процент дефицита/профицита.</div>' : ''}
        <div class="hint">
          ${rate === 0 ? 'При текущих настройках калораж равен норме поддержания — веса не изменит.'
            : `Расчётный темп: ${rate > 0 ? '+' : ''}${Calc.fmtKg(rate)} кг/нед.`}
          ${eta ? ` До цели (${goalDiff > 0 ? '+' : ''}${Calc.fmtKg(goalDiff)} кг) — примерно ${Math.ceil(eta)} нед.` : ''}
        </div>
      </div>
    `;

    const bind = (id, field, parse) => {
      document.getElementById(id).addEventListener('change', (e) => {
        const v = parse(e.target.value);
        DB.updateProfile(personId, { [field]: v });
      });
    };
    bind('f-height', 'height', Number);
    bind('f-age', 'age', Number);
    bind('f-weight', 'weight', Number);
    bind('f-activity', 'activityLevel', String);
    bind('f-goaltype', 'goalType', String);
    bind('f-goalweight', 'goalWeight', Number);
    bind('f-pct', 'deficitSurplusPct', Number);
    bind('f-protein', 'proteinPerKg', Number);
    bind('f-fat', 'fatPerKg', Number);

    document.getElementById('f-activity').value = p.activityLevel;
    document.getElementById('f-goaltype').value = p.goalType;
    const pctLabel = document.getElementById('pct-label');
    pctLabel.textContent = p.goalType === 'cut' ? 'Дефицит, %' : p.goalType === 'bulk' ? 'Профицит, %' : 'Не используется, %';
  }

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};
  window.App.Views.profile = { render };
})();
