/* Общие UI-хелперы: экранирование, модалки, тосты, форматирование. Глобальный объект App.UI */
(function () {
  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toast(msg, ms) {
    const root = document.getElementById('toast-root');
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    root.appendChild(t);
    setTimeout(() => t.remove(), ms || 2000);
  }

  function closeModal() {
    const root = document.getElementById('modal-root');
    root.innerHTML = '';
  }

  function openModal(title, bodyHtml, opts) {
    opts = opts || {};
    const root = document.getElementById('modal-root');
    root.innerHTML = `
      <div class="modal-backdrop" id="modal-backdrop">
        <div class="modal">
          <div class="modal-head">
            <h2>${esc(title)}</h2>
            <button class="icon-btn" id="modal-close" aria-label="Закрыть">✕</button>
          </div>
          <div id="modal-body">${bodyHtml}</div>
        </div>
      </div>
    `;
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
    document.getElementById('modal-close').addEventListener('click', closeModal);
    const body = document.getElementById('modal-body');
    if (opts.onMount) opts.onMount(body);
    return body;
  }

  const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  function parseISO(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function toISO(date) {
    const tz = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tz).toISOString().slice(0, 10);
  }
  function addDays(iso, n) {
    const d = parseISO(iso);
    d.setDate(d.getDate() + n);
    return toISO(d);
  }
  function weekdayShort(iso) {
    const d = parseISO(iso);
    const idx = (d.getDay() + 6) % 7; // Пн=0
    return WEEKDAYS[idx];
  }
  function fmtDateShort(iso) {
    const d = parseISO(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }
  function startOfWeek(iso) {
    const d = parseISO(iso);
    const idx = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - idx);
    return toISO(d);
  }

  function compressImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality || 0.6));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function confirmDialog(msg) {
    return window.confirm(msg);
  }

  window.App = window.App || {};
  window.App.UI = {
    esc, toast, openModal, closeModal, confirmDialog,
    parseISO, toISO, addDays, weekdayShort, fmtDateShort, startOfWeek,
    compressImage,
  };
})();
