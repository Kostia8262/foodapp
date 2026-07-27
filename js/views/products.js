/* Экран «Продукты» — база продуктов с ккал/БЖУ на 100г, общая для обоих */
(function () {
  const { DB } = App;
  const { esc, openModal, closeModal, toast, confirmDialog } = App.UI;
  const CATS = App.CATEGORIES;

  let filterCat = 'all';
  let query = '';

  function productForm(existing) {
    const p = existing || { name: '', category: 'other', kcal100: '', protein100: '', fat100: '', carbs100: '' };
    return `
      <div class="field">
        <label>Название</label>
        <input type="text" id="pf-name" value="${esc(p.name)}" placeholder="Например, Куриная грудка">
      </div>
      <div class="field">
        <label>Категория</label>
        <select id="pf-cat">${Object.entries(CATS).map(([k, l]) => `<option value="${k}" ${k === p.category ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>
      </div>
      <div class="field-row">
        <div class="field"><label>Ккал / 100г</label><input type="number" id="pf-kcal" value="${p.kcal100}" min="0" step="1"></div>
        <div class="field"><label>Белки / 100г</label><input type="number" id="pf-protein" value="${p.protein100}" min="0" step="0.1"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Жиры / 100г</label><input type="number" id="pf-fat" value="${p.fat100}" min="0" step="0.1"></div>
        <div class="field"><label>Углеводы / 100г</label><input type="number" id="pf-carbs" value="${p.carbs100}" min="0" step="0.1"></div>
      </div>
      <button class="btn primary block" id="pf-save">Сохранить</button>
    `;
  }

  function openProductModal(existing) {
    const body = openModal(existing ? 'Изменить продукт' : 'Новый продукт', productForm(existing));
    body.querySelector('#pf-save').addEventListener('click', () => {
      const name = body.querySelector('#pf-name').value.trim();
      if (!name) { toast('Введите название'); return; }
      const data = {
        name,
        category: body.querySelector('#pf-cat').value,
        kcal100: Number(body.querySelector('#pf-kcal').value) || 0,
        protein100: Number(body.querySelector('#pf-protein').value) || 0,
        fat100: Number(body.querySelector('#pf-fat').value) || 0,
        carbs100: Number(body.querySelector('#pf-carbs').value) || 0,
        unit: 'g',
      };
      if (existing) DB.updateProduct(existing.id, data);
      else DB.addProduct(data);
      closeModal();
      toast('Сохранено');
    });
  }

  function render(container) {
    const all = DB.getProducts();
    const filtered = all.filter((p) => {
      if (filterCat !== 'all' && p.category !== filterCat) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    const pills = ['all'].concat(Object.keys(CATS)).map((k) => {
      const label = k === 'all' ? 'Все' : CATS[k];
      return `<div class="pill ${filterCat === k ? 'active' : ''}" data-cat="${k}">${esc(label)}</div>`;
    }).join('');

    container.innerHTML = `
      <div class="search-row">
        <input type="text" id="prod-search" placeholder="Поиск продукта…" value="${esc(query)}">
        <button class="btn primary" id="prod-add">+ Продукт</button>
      </div>
      <div class="pill-row">${pills}</div>
      <div class="list" id="prod-list"></div>
    `;

    const list = document.getElementById('prod-list');
    if (!filtered.length) {
      list.innerHTML = `<div class="empty-state"><div class="big">🥕</div>Ничего не найдено.<br>Добавьте продукт кнопкой выше.</div>`;
    } else {
      list.innerHTML = filtered.map((p) => `
        <div class="list-item">
          <div class="main">
            <div class="title">${esc(p.name)}</div>
            <div class="meta">${p.kcal100} ккал · Б${p.protein100} Ж${p.fat100} У${p.carbs100} на 100г · ${esc(CATS[p.category] || '')}</div>
          </div>
          <div class="actions">
            <button class="icon-btn" data-edit="${p.id}">✎</button>
            <button class="icon-btn" data-del="${p.id}">🗑</button>
          </div>
        </div>
      `).join('');
    }

    document.getElementById('prod-search').addEventListener('input', (e) => {
      query = e.target.value;
      render(container);
      document.getElementById('prod-search').focus();
      const val = document.getElementById('prod-search');
      val.selectionStart = val.selectionEnd = val.value.length;
    });
    document.getElementById('prod-add').addEventListener('click', () => openProductModal(null));
    container.querySelectorAll('.pill').forEach((el) => {
      el.addEventListener('click', () => { filterCat = el.dataset.cat; render(container); });
    });
    container.querySelectorAll('[data-edit]').forEach((el) => {
      el.addEventListener('click', () => {
        const prod = all.find((p) => p.id === Number(el.dataset.edit));
        openProductModal(prod);
      });
    });
    container.querySelectorAll('[data-del]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = Number(el.dataset.del);
        const prod = all.find((p) => p.id === id);
        if (confirmDialog(`Удалить «${prod.name}»? Он также пропадёт из блюд, где используется.`)) {
          DB.deleteProduct(id);
          toast('Продукт удалён');
        }
      });
    });
  }

  window.App = window.App || {};
  window.App.Views = window.App.Views || {};
  window.App.Views.products = { render };
})();
