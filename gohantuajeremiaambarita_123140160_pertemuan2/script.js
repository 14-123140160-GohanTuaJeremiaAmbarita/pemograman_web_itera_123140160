/* Pertemuan 2 — ES6+, OOP, async/await, dan penyimpanan lokal. */
(() => {
  'use strict';
  const STORAGE_KEY = 'gohan:dashboard:v1';
  const $ = (id) => document.getElementById(id);
  const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
  const dateLabel = (value) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
  const localDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const isDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    && new Date(`${value}T00:00:00`).getDate() === Number(value.slice(-2));
  class TaskItem {
    // Destructuring parameter + default value untuk data baru dan data dari storage.
    constructor({ id = makeId(), title, course, due, priority = 'normal', note = '', done = false }) {
      Object.assign(this, { id, title, course, due, priority, note, done });
    }
    static isValid(item) {
      return item && typeof item.id === 'string' && typeof item.title === 'string'
        && item.title.trim().length >= 3 && item.title.length <= 120
        && typeof item.course === 'string' && item.course.trim().length > 0 && item.course.length <= 80
        && isDate(item.due) && ['normal', 'high', 'low'].includes(item.priority)
        && typeof item.note === 'string' && item.note.length <= 500 && typeof item.done === 'boolean';
    }
  }
  class DashboardApp {
    constructor() {
      this.tasks = this.loadTasks();
      this.bindEvents(); this.render();
      $('today').textContent = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
      this.fetchQuote();
    }
    showWarning(message) {
      $('storage-warning').textContent = message; $('storage-warning').hidden = false;
    }
    loadTasks() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || !parsed.every(TaskItem.isValid)
          || new Set(parsed.map(({ id }) => id)).size !== parsed.length) throw new Error('Data tidak valid');
        return parsed.map((item) => new TaskItem(item));
      } catch {
        this.showWarning('Data lokal tidak dapat dibaca. Tugas baru tetap dapat ditambahkan; penyimpanan berikutnya akan memperbarui data.');
        return [];
      }
    }
    saveTasks() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
        $('storage-warning').hidden = true;
      } catch {
        this.showWarning('Penyimpanan browser tidak tersedia. Perubahan hanya tersimpan selama halaman ini terbuka.');
      }
    }
    bindEvents() {
      $('task-form').addEventListener('submit', (event) => this.submitTask(event));
      $('cancel-edit').addEventListener('click', () => this.resetForm());
      $('search').addEventListener('input', () => this.render());
      $('status-filter').addEventListener('change', () => this.render());
      $('refresh-quote').addEventListener('click', () => this.fetchQuote());
      ['title', 'course', 'due'].forEach((field) => $(`task-${field}`).addEventListener('input', () => {
        $(`${field}-error`).textContent = ''; $(`task-${field}`).removeAttribute('aria-invalid');
      }));
      $('task-list').addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const { action, id } = button.dataset;
        if (action === 'edit') this.editTask(id);
        if (action === 'delete') this.deleteTask(id);
      });
      $('task-list').addEventListener('change', (event) => {
        if (event.target.matches('input[data-toggle]')) this.toggleTask(event.target.dataset.toggle);
      });
    }
    submitTask(event) {
      event.preventDefault();
      const values = {
        title: $('task-title').value.trim(), course: $('task-course').value.trim(),
        due: $('task-due').value, priority: $('task-priority').value, note: $('task-note').value.trim(),
      };
      const errors = {
        title: values.title.length < 3 ? 'Nama tugas minimal 3 karakter.' : values.title.length > 120 ? 'Nama tugas maksimal 120 karakter.' : '',
        course: !values.course ? 'Mata kuliah wajib diisi.' : values.course.length > 80 ? 'Mata kuliah maksimal 80 karakter.' : '',
        due: !isDate(values.due) ? 'Pilih tanggal tenggat yang valid.' : '',
      };
      Object.entries(errors).forEach(([key, message]) => {
        $(`${key}-error`).textContent = message;
        $(`task-${key}`).setAttribute('aria-invalid', String(Boolean(message)));
      });
      const first = Object.keys(errors).find((key) => errors[key]);
      if (first) { $(`task-${first}`).focus(); return; }
      const id = $('task-id').value;
      // Spread + map membuat array baru tanpa memutasi array state sebelumnya.
      this.tasks = id ? this.tasks.map((task) => task.id === id ? new TaskItem({ ...task, ...values }) : task)
        : [...this.tasks, new TaskItem(values)];
      this.saveTasks(); this.render(); this.resetForm();
      $('list-status').textContent = id ? 'Perubahan tugas disimpan.' : 'Tugas baru berhasil ditambahkan.';
    }
    editTask(id) {
      const task = this.tasks.find((item) => item.id === id);
      if (!task) return;
      $('task-id').value = task.id;
      ['title', 'course', 'due', 'priority', 'note'].forEach((key) => { $(`task-${key}`).value = task[key]; });
      ['title', 'course', 'due'].forEach((key) => {
        $(`${key}-error`).textContent = ''; $(`task-${key}`).removeAttribute('aria-invalid');
      });
      $('form-title').textContent = 'Edit tugas'; $('save-task').textContent = 'Simpan perubahan';
      $('cancel-edit').hidden = false; $('task-title').focus();
    }
    resetForm() {
      $('task-form').reset(); $('task-id').value = '';
      ['title', 'course', 'due'].forEach((key) => {
        $(`${key}-error`).textContent = ''; $(`task-${key}`).removeAttribute('aria-invalid');
      });
      $('form-title').textContent = 'Tambah tugas'; $('save-task').textContent = '+ Simpan tugas';
      $('cancel-edit').hidden = true;
    }
    deleteTask(id) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      if ($('task-id').value === id) this.resetForm();
      this.saveTasks(); this.render(); $('list-status').textContent = 'Tugas dihapus.';
    }
    toggleTask(id) {
      this.tasks = this.tasks.map((task) => task.id === id ? new TaskItem({ ...task, done: !task.done }) : task);
      this.saveTasks(); this.render(); $('list-status').textContent = 'Status tugas diperbarui.';
    }
    render() {
      const search = $('search').value.trim().toLocaleLowerCase('id');
      const status = $('status-filter').value;
      const visible = this.tasks.filter(({ title, course, done }) => `${title} ${course}`.toLocaleLowerCase('id').includes(search)
        && (status === 'all' || (status === 'done' ? done : !done)))
        .sort((a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due));
      // Template literals merender kartu; semua teks pengguna di-escape.
      $('task-list').innerHTML = visible.length ? visible.map(({ id, title, course, due, priority, note, done }) => `
        <article class="task-card ${done ? 'done' : ''}">
          <input class="task-check" type="checkbox" data-toggle="${escapeHTML(id)}" ${done ? 'checked' : ''} aria-label="Tandai ${escapeHTML(title)} ${done ? 'belum selesai' : 'selesai'}">
          <div class="task-main"><h3>${escapeHTML(title)}</h3>${note ? `<p>${escapeHTML(note)}</p>` : ''}
            <div class="task-meta"><span class="tag">${escapeHTML(course)}</span><time datetime="${due}">${dateLabel(due)}</time>
              <span class="tag ${priority === 'high' ? 'high' : ''}">${{ normal: 'Normal', high: 'Prioritas tinggi', low: 'Rendah' }[priority]}</span>
              ${!done && due < localDate() ? '<span class="tag overdue">Lewat tenggat</span>' : ''}
              ${done ? '<span class="tag">Selesai</span>' : ''}</div></div>
          <div class="task-actions"><button type="button" class="btn text" data-action="edit" data-id="${escapeHTML(id)}" aria-label="Edit ${escapeHTML(title)}">Edit</button>
          <button type="button" class="btn text" data-action="delete" data-id="${escapeHTML(id)}" aria-label="Hapus ${escapeHTML(title)}">Hapus</button></div>
        </article>`).join('') : `<div class="empty"><strong>${this.tasks.length ? 'Tidak ada tugas yang cocok' : 'Mulai dari satu tugas'}</strong>${this.tasks.length ? 'Ubah kata pencarian atau filter status.' : 'Tambahkan rencana belajarmu melalui form.'}</div>`;
      let completed = 0;
      this.tasks.forEach(({ done }) => { if (done) completed += 1; });
      const percent = this.tasks.length ? Math.round(completed / this.tasks.length * 100) : 0;
      $('stat-total').textContent = this.tasks.length;
      $('stat-pending').textContent = this.tasks.length - completed;
      $('stat-progress').textContent = `${percent}%`; $('progress').value = percent;
    }
    async fetchQuote() {
      const button = $('refresh-quote');
      button.disabled = true; $('quote-status').textContent = 'Mengambil kutipan…';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      try {
        const response = await fetch('https://dummyjson.com/quotes/random', { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { quote, author } = await response.json();
        if (typeof quote !== 'string' || typeof author !== 'string' || !quote.trim()) throw new Error('Data kutipan tidak valid');
        $('quote-text').textContent = quote; $('quote-author').textContent = `— ${author}`;
        $('quote-status').textContent = 'Sumber: DummyJSON Quotes';
      } catch {
        // CRUD tetap dapat dipakai saat koneksi gagal; tidak ada data tugas yang hilang.
        $('quote-status').textContent = 'Kutipan daring belum tersedia. Pengingat terakhir tetap ditampilkan; coba lagi nanti.';
      } finally {
        clearTimeout(timeoutId); button.disabled = false;
      }
    }
  }
  new DashboardApp();
})();
