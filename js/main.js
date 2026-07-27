/* Инициализация приложения, переключение вкладок и активного человека */
(function () {
  const { DB, UI } = App;
  const esc = UI.esc;

  const TABS = [
    { id: 'dashboard', label: 'Дашборд', icon: '🏠', perPerson: false, sub: 'Обзор и прогноз' },
    { id: 'plan', label: 'Рацион', icon: '📅', perPerson: true, sub: 'План питания по дням' },
    { id: 'progress', label: 'Прогресс', icon: '📈', perPerson: true, sub: 'Вес, объёмы, фото' },
    { id: 'products', label: 'Продукты', icon: '🥩', perPerson: false, sub: 'База продуктов' },
    { id: 'dishes', label: 'Блюда', icon: '🍲', perPerson: false, sub: 'Ваши блюда' },
    { id: 'pairs', label: 'Парные', icon: '🤝', perPerson: false, sub: 'Общие блюда на двоих' },
    { id: 'profile', label: 'Профиль', icon: '👤', perPerson: true, sub: 'Параметры и цель' },
  ];

  let activeTab = 'dashboard';
  let activePerson = 'me';

  function meta() { return TABS.find((t) => t.id === activeTab); }

  function renderPersonSwitch() {
    const slot = document.getElementById('person-switch-slot');
    if (!meta().perPerson) { slot.innerHTML = ''; return; }
    const me = DB.getProfile('me');
    const her = DB.getProfile('her');
    slot.innerHTML = `
      <div class="person-switch">
        <button class="${activePerson === 'me' ? 'active me' : ''}" data-person="me">${esc(me.name)}</button>
        <button class="${activePerson === 'her' ? 'active her' : ''}" data-person="her">${esc(her.name)}</button>
      </div>
    `;
    slot.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => { activePerson = b.dataset.person; render(); });
    });
  }

  function renderTabbar() {
    const bar = document.getElementById('tabbar');
    bar.innerHTML = TABS.map((t) => `
      <button class="${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}">
        <span class="ic">${t.icon}</span><span class="lbl">${esc(t.label)}</span>
      </button>
    `).join('');
    bar.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => { activeTab = b.dataset.tab; render(); });
    });
  }

  function render() {
    document.body.classList.toggle('context-her', meta().perPerson && activePerson === 'her');
    document.getElementById('topbar-sub').textContent = meta().sub;
    renderPersonSwitch();
    renderTabbar();
    const root = document.getElementById('view-root');
    const view = App.Views[activeTab];
    if (meta().perPerson) view.render(root, activePerson);
    else view.render(root);
  }

  function openBackupModal() {
    const body = UI.openModal('Данные приложения', `
      <div class="list">
        <button class="btn block" id="bk-export">⬇ Скачать бэкап (JSON)</button>
        <label class="btn block" style="text-align:center;cursor:pointer" id="bk-import-label">⬆ Загрузить бэкап
          <input type="file" id="bk-import" accept="application/json" style="display:none">
        </label>
        <button class="btn danger block" id="bk-reset">Сбросить все данные</button>
      </div>
      <div class="hint">Все данные хранятся локально в этом браузере (localStorage), без сервера и интернета.
      Бэкап полезен, чтобы не потерять их при очистке кэша браузера или для переноса на другое устройство.</div>
    `);
    body.querySelector('#bk-export').addEventListener('click', () => {
      const blob = new Blob([DB.exportJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ratsion-backup-${DB.todayISO()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
    body.querySelector('#bk-import').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (parsed && parsed.type === 'ration-dishes-v1') {
            const { added, skipped, missing } = DB.mergeDishesByName(parsed.dishes || []);
            UI.closeModal();
            UI.toast(`Блюда: добавлено ${added}, пропущено ${skipped}${missing.length ? ` (не найдено ${missing.length} продуктов)` : ''}`);
            if (missing.length) console.warn('Не найдены продукты для:', missing);
          } else {
            DB.importJSON(reader.result);
            UI.toast('Данные импортированы');
            UI.closeModal();
          }
        } catch (err) {
          UI.toast('Не удалось прочитать файл');
        }
      };
      reader.readAsText(file);
    });
    body.querySelector('#bk-reset').addEventListener('click', () => {
      if (UI.confirmDialog('Удалить все данные без возможности восстановления (если нет бэкапа)?')) {
        DB.resetAll();
        DB.mergeSeedProducts(App.SEED_PRODUCTS);
        DB.mergeDishesByName(App.SEED_DISHES);
        UI.closeModal();
        UI.toast('Данные сброшены');
      }
    });
  }

  App.Nav = {
    goTo(tab, person) {
      activeTab = tab;
      if (person) activePerson = person;
      render();
    },
  };

  function init() {
    DB.mergeSeedProducts(App.SEED_PRODUCTS);
    const dishResult = DB.mergeDishesByName(App.SEED_DISHES);
    if (dishResult.added) console.log(`Автоматически добавлено блюд: ${dishResult.added}`);
    DB.onChange(render);
    document.getElementById('btn-backup').addEventListener('click', openBackupModal);
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
