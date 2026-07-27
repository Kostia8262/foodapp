/* Слой хранения. Всё состояние — один JSON-объект в localStorage. Глобальный объект App.DB */
(function () {
  const STORAGE_KEY = 'ration_app_state_v1';

  function todayISO() {
    const d = new Date();
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  }

  function defaultState() {
    return {
      version: 1,
      profiles: {
        me: {
          id: 'me', name: 'Я', sex: 'm',
          height: 176, age: 30, weight: 69,
          activityLevel: 'light',
          goalType: 'bulk', goalWeight: 80, startWeight: 69, startDate: todayISO(),
          deficitSurplusPct: 15, proteinPerKg: 2.0, fatPerKg: 0.9,
        },
        her: {
          id: 'her', name: 'Девушка', sex: 'f',
          height: 180, age: 30, weight: 73,
          activityLevel: 'light',
          goalType: 'cut', goalWeight: 63, startWeight: 73, startDate: todayISO(),
          deficitSurplusPct: 35, proteinPerKg: 2.2, fatPerKg: 0.7,
        },
      },
      products: [],
      dishes: [],
      plan: {},      // { 'YYYY-MM-DD': { me: [ {mealType, dishId, portion} ], her: [...] } }
      progress: { me: [], her: [] }, // [{ id, date, weight, bodyFatPct, measurements:{}, photo, note }]
    };
  }

  function migrate(state) {
    // Место для будущих миграций схемы. Пока просто гарантируем наличие всех ключей.
    const d = defaultState();
    state.profiles = Object.assign({}, d.profiles, state.profiles);
    state.profiles.me = Object.assign({}, d.profiles.me, state.profiles.me);
    state.profiles.her = Object.assign({}, d.profiles.her, state.profiles.her);
    state.products = state.products || [];
    state.dishes = state.dishes || [];
    state.plan = state.plan || {};
    state.progress = state.progress || { me: [], her: [] };
    state.progress.me = state.progress.me || [];
    state.progress.her = state.progress.her || [];
    return state;
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return migrate(JSON.parse(raw));
    } catch (e) {
      console.error('Не удалось прочитать данные, использую значения по умолчанию', e);
      return defaultState();
    }
  }

  let saveTimer = null;
  let onChangeCb = null;

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('Ошибка сохранения (возможно, переполнено хранилище)', e);
      return false;
    }
  }

  function save() {
    const ok = persist();
    if (onChangeCb) onChangeCb();
    return ok;
  }

  function nextId(list) {
    return list.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
  }

  const api = {
    todayISO,
    onChange(cb) { onChangeCb = cb; },
    getState() { return state; },

    // ---- Профили ----
    getProfile(personId) { return state.profiles[personId]; },
    updateProfile(personId, patch) {
      Object.assign(state.profiles[personId], patch);
      save();
    },

    // ---- Продукты ----
    getProducts() { return state.products; },
    addProduct(p) {
      const id = nextId(state.products);
      state.products.push(Object.assign({ id }, p));
      save();
      return id;
    },
    updateProduct(id, patch) {
      const p = state.products.find((x) => x.id === id);
      if (p) Object.assign(p, patch);
      save();
    },
    deleteProduct(id) {
      state.products = state.products.filter((x) => x.id !== id);
      state.dishes.forEach((d) => {
        d.items = d.items.filter((it) => it.productId !== id);
      });
      save();
    },
    // Докидывает в базу продукты из seedList, которых там ещё нет (сверка по названию, без учёта регистра).
    // Существующие продукты и правки пользователя не трогает — безопасно вызывать при каждом запуске.
    mergeSeedProducts(seedList) {
      const existing = new Set(state.products.map((p) => p.name.trim().toLowerCase()));
      let added = 0;
      seedList.forEach((p) => {
        const key = p.name.trim().toLowerCase();
        if (existing.has(key)) return;
        const id = nextId(state.products);
        state.products.push(Object.assign({ id }, p));
        existing.add(key);
        added += 1;
      });
      if (added) save();
      return added;
    },

    // Докидывает блюда из пакета (JSON с product­Name вместо productId — устойчиво к разному порядку
    // id продуктов). Продукты ищутся по названию в текущей базе; блюдо с уже существующим именем
    // пропускается. Профили/прогресс/текущий рацион не трогает. Возвращает {added, skipped, missing}.
    mergeDishesByName(dishDefs) {
      const existingDishNames = new Set(state.dishes.map((d) => d.name.trim().toLowerCase()));
      const productByName = new Map(state.products.map((p) => [p.name.trim().toLowerCase(), p.id]));
      let added = 0;
      let skipped = 0;
      const missing = [];
      dishDefs.forEach((def) => {
        const key = def.name.trim().toLowerCase();
        if (existingDishNames.has(key)) { skipped += 1; return; }
        const items = [];
        (def.items || []).forEach((it) => {
          const pid = productByName.get(it.productName.trim().toLowerCase());
          if (pid == null) { missing.push(`${def.name} → ${it.productName}`); return; }
          items.push({ productId: pid, grams: it.grams });
        });
        if (!items.length) { skipped += 1; return; }
        const id = nextId(state.dishes);
        state.dishes.push({
          id, name: def.name, mealType: def.mealType, forWho: def.forWho,
          note: def.note || '', items,
        });
        existingDishNames.add(key);
        added += 1;
      });
      if (added) save();
      return { added, skipped, missing };
    },

    // ---- Блюда ----
    getDishes() { return state.dishes; },
    addDish(d) {
      const id = nextId(state.dishes);
      state.dishes.push(Object.assign({ id }, d));
      save();
      return id;
    },
    updateDish(id, patch) {
      const d = state.dishes.find((x) => x.id === id);
      if (d) Object.assign(d, patch);
      save();
    },
    deleteDish(id) {
      state.dishes = state.dishes.filter((x) => x.id !== id);
      // чистим из плана
      Object.values(state.plan).forEach((day) => {
        ['me', 'her'].forEach((who) => {
          if (day[who]) day[who] = day[who].filter((e) => e.dishId !== id);
        });
      });
      save();
    },

    // ---- Рацион по датам ----
    getDay(dateISO) {
      return state.plan[dateISO] || { me: [], her: [] };
    },
    addMeal(dateISO, personId, entry) {
      if (!state.plan[dateISO]) state.plan[dateISO] = { me: [], her: [] };
      if (!state.plan[dateISO][personId]) state.plan[dateISO][personId] = [];
      const list = state.plan[dateISO][personId];
      const id = list.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
      list.push(Object.assign({ id }, entry));
      save();
      return id;
    },
    removeMeal(dateISO, personId, entryId) {
      if (!state.plan[dateISO] || !state.plan[dateISO][personId]) return;
      state.plan[dateISO][personId] = state.plan[dateISO][personId].filter((e) => e.id !== entryId);
      save();
    },
    copyDayForPerson(fromISO, toISO, personId) {
      if (!state.plan[fromISO] || !state.plan[fromISO][personId]) return;
      if (!state.plan[toISO]) state.plan[toISO] = { me: [], her: [] };
      const src = state.plan[fromISO][personId];
      let id = 1;
      state.plan[toISO][personId] = src.map((e) => Object.assign({}, e, { id: id++ }));
      save();
    },
    clearDay(dateISO, personId) {
      if (!state.plan[dateISO]) return;
      if (personId) state.plan[dateISO][personId] = [];
      else delete state.plan[dateISO];
      save();
    },

    // ---- Прогресс ----
    getProgress(personId) {
      return state.progress[personId].slice().sort((a, b) => a.date < b.date ? -1 : 1);
    },
    addProgress(personId, entry) {
      const id = state.progress[personId].reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
      state.progress[personId].push(Object.assign({ id }, entry));
      // держим current weight профиля в актуальном состоянии
      if (entry.weight) state.profiles[personId].weight = entry.weight;
      save();
      return id;
    },
    updateProgress(personId, id, patch) {
      const e = state.progress[personId].find((x) => x.id === id);
      if (e) Object.assign(e, patch);
      save();
    },
    deleteProgress(personId, id) {
      state.progress[personId] = state.progress[personId].filter((x) => x.id !== id);
      save();
    },
    latestProgress(personId) {
      const list = api.getProgress(personId);
      return list.length ? list[list.length - 1] : null;
    },

    // ---- Бэкап ----
    exportJSON() {
      return JSON.stringify(state, null, 2);
    },
    importJSON(json) {
      const parsed = JSON.parse(json);
      state = migrate(parsed);
      save();
    },
    resetAll() {
      state = defaultState();
      save();
    },
  };

  window.App = window.App || {};
  window.App.DB = api;
})();
