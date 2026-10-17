import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mount, key } from './helpers.js';
const add = (app, name, price, qty = 1) => {
  app.input('item-name', name); app.input('item-price', String(price)); app.input('item-qty', String(qty)); app.submit('item-form');
};
const number = (app, id) => Number(app.$(id).textContent.replace(/[^\d,]/g, '').replace(',', '.'));
test('form kosong ditolak dengan tiga pesan error', () => {
  const app = mount(); app.input('item-qty', ''); app.submit('item-form');
  for (const id of ['name-error', 'price-error', 'qty-error']) assert.ok(app.$(id).textContent);
  assert.equal(app.$('cart-body').children.length, 0); app.close();
});
test('nama pendek, harga di bawah 500, dan qty pecahan ditolak', () => {
  const app = mount(); add(app, 'AB', 499, 1.5);
  for (const id of ['name-error', 'price-error', 'qty-error']) assert.ok(app.$(id).textContent);
  assert.equal(app.$('cart-body').children.length, 0); app.close();
});
test('batas harga Rp500 dan qty 1 diterima serta form direset', () => {
  const app = mount(); add(app, 'Air Mineral', 500);
  assert.equal(app.$('cart-body').children.length, 1); assert.equal(number(app, 'total'), 500);
  assert.equal(app.$('item-name').value, ''); assert.equal(app.$('item-qty').value, '1'); app.close();
});
test('diskon tepat di ambang 50000 dan kembalian 5000 dihitung otomatis', () => {
  const app = mount(); add(app, 'Buku Tulis', 10000, 5); app.input('payment', '50000');
  assert.equal(number(app, 'discount'), 5000); assert.equal(number(app, 'grand-total'), 45000);
  assert.equal(number(app, 'change'), 5000); assert.equal(app.$('payment-status').textContent, 'Kembalian'); app.close();
});
test('uang kurang ditandai dan diskon dihitung ulang setelah hapus', () => {
  const app = mount(); add(app, 'Buku Tulis', 20000, 2); add(app, 'Penggaris', 10000);
  app.input('payment', '40000'); assert.match(app.$('payment-status').textContent, /belum mencukupi/);
  assert.equal(number(app, 'change'), 5000);
  app.$('cart-body').querySelectorAll('button')[1].click();
  assert.equal(number(app, 'total'), 40000); assert.equal(number(app, 'discount'), 0);
  assert.equal(number(app, 'grand-total'), 40000); assert.equal(number(app, 'change'), 0); app.close();
});
test('keranjang dipulihkan dari JSON saat reload', () => {
  const app = mount(); add(app, 'Pensil', 3000, 3);
  const saved = app.dom.window.localStorage.getItem(key); app.close();
  const reloaded = mount(saved); assert.equal(reloaded.$('cart-body').children.length, 1);
  assert.equal(number(reloaded, 'total'), 9000); reloaded.close();
});
test('reset menghapus key keranjang serta tetap menjaga key aplikasi lain', () => {
  const app = mount(); add(app, 'Pensil', 3000); app.dom.window.localStorage.setItem('other-app', 'aman');
  app.$('new-transaction').click();
  assert.equal(app.dom.window.localStorage.getItem(key), null);
  assert.equal(app.dom.window.localStorage.getItem('other-app'), 'aman');
  assert.equal(app.$('cart-body').children.length, 0); assert.equal(app.$('payment').value, ''); app.close();
});
test('JSON rusak ditangani dan nama yang menyerupai HTML dirender sebagai teks', () => {
  const app = mount('{rusak'); assert.equal(app.$('storage-warning').hidden, false);
  add(app, '<img src=x onerror=alert(1)>', 5000);
  assert.equal(app.$('cart-body').querySelector('img'), null); assert.match(app.$('cart-body').textContent, /<img/); app.close();
});
