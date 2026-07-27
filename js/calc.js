/* Формулы расчёта нормы калорий и БЖУ. Без зависимостей, глобальный объект App.Calc */
(function () {
  const ACTIVITY = {
    sedentary: { label: 'Сидячий образ жизни', mult: 1.2 },
    light: { label: 'Лёгкая активность (1-3 трен/нед)', mult: 1.375 },
    moderate: { label: 'Умеренная активность (3-5 трен/нед)', mult: 1.55 },
    high: { label: 'Высокая активность (6-7 трен/нед)', mult: 1.725 },
  };

  const KCAL_PER_KG = 7700; // приближённая энергетическая плотность кг массы тела

  function bmr(p) {
    const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
    return p.sex === 'm' ? base + 5 : base - 161;
  }

  function tdee(p) {
    const a = ACTIVITY[p.activityLevel] || ACTIVITY.light;
    return bmr(p) * a.mult;
  }

  function targetCalories(p) {
    const t = tdee(p);
    const pct = (p.deficitSurplusPct || 0) / 100;
    if (p.goalType === 'cut') return t * (1 - pct);
    if (p.goalType === 'bulk') return t * (1 + pct);
    return t;
  }

  function macros(p) {
    const kcal = targetCalories(p);
    const proteinG = (p.proteinPerKg || 2) * p.weight;
    const fatG = (p.fatPerKg || 0.9) * p.weight;
    const proteinKcal = proteinG * 4;
    const fatKcal = fatG * 9;
    let carbsKcal = kcal - proteinKcal - fatKcal;
    const overBudget = carbsKcal < 0;
    if (overBudget) carbsKcal = 0;
    const carbsG = carbsKcal / 4;
    return {
      kcal: Math.round(kcal),
      proteinG: Math.round(proteinG),
      fatG: Math.round(fatG),
      carbsG: Math.round(carbsG),
      overBudget,
    };
  }

  // Оценка изменения веса в неделю (кг), с учётом знака: похудение отрицательно, набор положительно
  function weeklyRateKg(p) {
    const t = tdee(p);
    const target = targetCalories(p);
    const dailyDelta = target - t;
    return (dailyDelta * 7) / KCAL_PER_KG;
  }

  // Прогноз срока достижения цели в неделях (null если не движется в нужную сторону)
  function etaWeeks(p) {
    const rate = weeklyRateKg(p);
    const remaining = p.goalWeight - p.weight;
    if (Math.abs(rate) < 0.001) return null;
    const weeks = remaining / rate;
    return weeks > 0 ? weeks : null;
  }

  // Есть ли в составе блюда хоть один продукт из категории "не рекомендуется"
  function dishHasAvoid(items, products) {
    return (items || []).some((it) => {
      const p = products.find((pr) => pr.id === it.productId);
      return p && p.category === 'avoid';
    });
  }

  // Суммарная калорийность/БЖУ блюда по списку ингредиентов [{productId, grams}]
  function dishTotals(items, products) {
    const totals = { kcal: 0, protein: 0, fat: 0, carbs: 0, grams: 0 };
    (items || []).forEach((it) => {
      const p = products.find((pr) => pr.id === it.productId);
      if (!p) return;
      const f = (it.grams || 0) / 100;
      totals.kcal += p.kcal100 * f;
      totals.protein += p.protein100 * f;
      totals.fat += p.fat100 * f;
      totals.carbs += p.carbs100 * f;
      totals.grams += it.grams || 0;
    });
    return totals;
  }

  // Парные блюда называются "База (её порция)" / "База (его порция)" — вычленяем базу и человека.
  const PAIR_RE = /^(.+?) \((её|его) порция(?:, парная)?\)$/;
  function pairKeyOf(name) {
    const m = name.match(PAIR_RE);
    if (!m) return null;
    return { base: m[1], person: m[2] === 'её' ? 'her' : 'me' };
  }

  // Находит блюда, у которых есть парный аналог для другого человека (одинаковая база в названии).
  function findDishPairs(dishes) {
    const groups = {};
    dishes.forEach((d) => {
      const p = pairKeyOf(d.name);
      if (!p) return;
      groups[p.base] = groups[p.base] || {};
      groups[p.base][p.person] = d;
    });
    return Object.entries(groups)
      .filter(([, g]) => g.her && g.me)
      .map(([base, g]) => ({ base, her: g.her, me: g.me }));
  }

  function fmtKg(n) {
    return (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');
  }

  function fmt0(n) {
    return Math.round(n).toString();
  }

  window.App = window.App || {};
  window.App.Calc = {
    ACTIVITY,
    bmr,
    tdee,
    targetCalories,
    macros,
    weeklyRateKg,
    etaWeeks,
    dishTotals,
    dishHasAvoid,
    pairKeyOf,
    findDishPairs,
    fmtKg,
    fmt0,
  };
})();
