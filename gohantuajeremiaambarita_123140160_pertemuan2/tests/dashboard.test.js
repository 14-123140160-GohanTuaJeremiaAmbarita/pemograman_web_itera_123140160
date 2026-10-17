import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mount, key } from './helpers.js';
const add = (app, title = 'Laporan React', course = 'Pemrograman Web') => {
  app.input('task-title', title); app.input('task-course', course); app.input('task-due', '2026-12-20'); app.submit('task-form');
};
test('form tidak valid ditolak dan menampilkan error per field', async () => {
  const app = mount(); app.submit('task-form');
  for (const id of ['title-error', 'course-error', 'due-error']) assert.ok(app.$(id).textContent);
  assert.equal(app.$('stat-total').textContent, '0'); await app.close();
});
test('menambah, mengedit, dan menghapus tugas memperbarui localStorage', async () => {
  const app = mount(); add(app); assert.equal(app.$('stat-total').textContent, '1');
  app.$('task-list').querySelector('button[data-action=edit]').click();
  app.input('task-title', 'Laporan Selesai'); app.submit('task-form');
  assert.equal(JSON.parse(app.dom.window.localStorage.getItem(key))[0].title, 'Laporan Selesai');
  app.$('task-list').querySelector('button[data-action=delete]').click();
  assert.deepEqual(JSON.parse(app.dom.window.localStorage.getItem(key)), []); await app.close();
});
test('status selesai, filter, pencarian, dan statistik saling sinkron', async () => {
  const app = mount(); add(app); add(app, 'Tugas Basis Data', 'Basis Data');
  const checkbox = app.$('task-list').querySelector('input'); checkbox.checked = true;
  checkbox.dispatchEvent(new app.dom.window.Event('change', { bubbles: true }));
  assert.equal(app.$('stat-progress').textContent, '50%'); assert.equal(app.$('stat-pending').textContent, '1');
  app.$('status-filter').value = 'done'; app.$('status-filter').dispatchEvent(new app.dom.window.Event('change'));
  assert.equal(app.$('task-list').querySelectorAll('article').length, 1);
  app.input('search', 'BASIS'); assert.equal(app.$('task-list').querySelectorAll('article').length, 0); await app.close();
});
test('data persisten dipulihkan dan JSON rusak tidak menghentikan aplikasi', async () => {
  const app = mount(); add(app); const saved = app.dom.window.localStorage.getItem(key); await app.close();
  const next = mount(saved); assert.equal(next.$('stat-total').textContent, '1'); await next.close();
  const corrupt = mount('{rusak'); assert.equal(corrupt.$('storage-warning').hidden, false); add(corrupt);
  assert.equal(corrupt.$('stat-total').textContent, '1'); await corrupt.close();
});
test('async fetch sukses menampilkan quote dan author', async () => {
  const app = mount(); await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(app.$('quote-text').textContent, 'Stay curious.');
  assert.equal(app.$('quote-author').textContent, '— Test'); assert.equal(app.$('refresh-quote').disabled, false); await app.close();
});
test('fetch gagal menyediakan feedback dan CRUD tetap berfungsi', async () => {
  const app = mount(undefined, async () => { throw new Error('offline'); });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.match(app.$('quote-status').textContent, /belum tersedia/); add(app);
  assert.equal(app.$('stat-total').textContent, '1'); assert.equal(app.$('refresh-quote').disabled, false); await app.close();
});
test('template literal meng-escape input agar nama tugas tidak menjadi HTML', async () => {
  const app = mount(); add(app, '<img src=x onerror=alert(1)>');
  assert.equal(app.$('task-list').querySelector('img'), null);
  assert.match(app.$('task-list').querySelector('h3').textContent, /<img/); await app.close();
});
