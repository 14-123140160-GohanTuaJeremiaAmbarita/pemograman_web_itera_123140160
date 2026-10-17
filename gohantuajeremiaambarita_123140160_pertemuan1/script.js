/* Pertemuan 1 — validasi form, kalkulator, dan keranjang persisten. */
(() => {
  'use strict';
  const STORAGE_KEY = 'gohan:mini-pos:v1';
  const $ = (id) => document.getElementById(id);
  const rupiah = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 2,
  }).format(value);
  const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
  const form = $('item-form');
  const fields = { name: $('item-name'), price: $('item-price'), qty: $('item-qty') };
  const notice = (message) => {
    $('storage-warning').textContent = message;
    $('storage-warning').hidden = false;
  };
  let cart = [];
  const isValidItem = (item) => item && typeof item.id === 'string'
    && typeof item.name === 'string' && item.name.trim().length >= 3 && item.name.length <= 100
    && Number.isFinite(item.price) && item.price >= 500 && item.price <= 1_000_000_000
    && Number.isSafeInteger(item.qty) && item.qty >= 1 && item.qty <= 100_000;
  // JSON rusak/struktur tak sesuai tidak boleh membuat aplikasi berhenti.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.every(isValidItem)
        || new Set(parsed.map((item) => item.id)).size !== parsed.length
        || parsed.reduce((sum, item) => sum + item.price * item.qty, 0) > 1_000_000_000_000) {
        throw new Error('Format keranjang tidak valid');
      }
      cart = parsed;
    }
  } catch {
    notice('Keranjang tersimpan tidak dapat dibaca. Mulai transaksi baru atau tambahkan barang untuk menyimpan ulang.');
  }
  const saveCart = () => {
    try {
      // Hanya key aplikasi ini yang dibersihkan, data aplikasi lain tetap aman.
      if (cart.length === 0) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      $('storage-warning').hidden = true;
    } catch {
      notice('Browser tidak dapat menyimpan keranjang. Data saat ini hanya bertahan sampai halaman ditutup.');
    }
  };
  const totals = () => {
    const total = roundMoney(cart.reduce((sum, item) => sum + roundMoney(item.price * item.qty), 0));
    const discount = total >= 50_000 ? roundMoney(total * 0.1) : 0;
    return { total, discount, final: roundMoney(total - discount) };
  };
  const setError = (field, message) => {
    $(`${field}-error`).textContent = message;
    fields[field].setAttribute('aria-invalid', String(Boolean(message)));
  };
  const validate = () => {
    const values = { name: fields.name.value.trim(), price: Number(fields.price.value), qty: Number(fields.qty.value) };
    const errors = {
      name: values.name.length < 3 ? 'Nama barang wajib diisi, minimal 3 karakter.' : values.name.length > 100 ? 'Nama maksimal 100 karakter.' : '',
      price: fields.price.value.trim() === '' || !Number.isFinite(values.price) || values.price < 500
        ? 'Harga wajib berupa angka minimal Rp500.' : values.price > 1_000_000_000 ? 'Harga maksimal Rp1.000.000.000.' : '',
      qty: fields.qty.value.trim() === '' || !Number.isSafeInteger(values.qty) || values.qty < 1
        ? 'Jumlah harus bilangan bulat minimal 1.' : values.qty > 100_000 ? 'Jumlah maksimal 100.000.' : '',
    };
    Object.entries(errors).forEach(([key, message]) => setError(key, message));
    const firstInvalid = Object.keys(errors).find((key) => errors[key]);
    if (firstInvalid) fields[firstInvalid].focus();
    return { values, valid: !firstInvalid };
  };
  const renderPayment = () => {
    const input = $('payment');
    const amount = Number(input.value);
    const final = totals().final;
    const invalid = input.value !== '' && (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000_000);
    $('payment-error').textContent = invalid ? 'Uang bayar harus angka 0 sampai Rp1.000.000.000.000.' : '';
    input.setAttribute('aria-invalid', String(invalid));
    $('change-box').classList.remove('insufficient');
    if (!cart.length || input.value === '' || invalid) {
      $('payment-status').textContent = cart.length ? 'Masukkan uang bayar' : 'Tambahkan barang terlebih dahulu';
      $('change').textContent = '—';
      return;
    }
    const change = roundMoney(amount - final);
    $('change-box').classList.toggle('insufficient', change < 0);
    $('payment-status').textContent = change < 0 ? 'Uang belum mencukupi. Kurang' : 'Kembalian';
    $('change').textContent = rupiah(Math.abs(change));
  };
  const renderCart = () => {
    const body = $('cart-body');
    body.replaceChildren();
    cart.forEach((item, index) => {
      const row = document.createElement('tr');
      const cells = [index + 1, item.name, rupiah(item.price), item.qty, rupiah(roundMoney(item.price * item.qty))];
      cells.forEach((value, position) => {
        const cell = document.createElement('td');
        // textContent mencegah nama barang ditafsirkan sebagai HTML.
        cell.textContent = value;
        cell.className = position === 1 ? 'name' : position >= 2 ? 'num' : '';
        row.append(cell);
      });
      const action = document.createElement('td');
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'cart-delete';
      button.textContent = 'Hapus'; button.dataset.id = item.id;
      button.setAttribute('aria-label', `Hapus ${item.name}`);
      action.append(button); row.append(action); body.append(row);
    });
    const result = totals();
    $('total').textContent = rupiah(result.total);
    $('discount').textContent = `− ${rupiah(result.discount)}`;
    $('discount-label').textContent = result.discount > 0 ? '(10%)' : '(belum aktif)';
    $('grand-total').textContent = rupiah(result.final);
    $('cart-count').textContent = `${cart.length} barang · ${cart.reduce((sum, item) => sum + item.qty, 0)} unit`;
    $('cart-empty').hidden = cart.length > 0;
    $('cart-table-wrap').hidden = cart.length === 0;
    renderPayment();
  };
  const updatePreview = () => {
    const price = Number(fields.price.value), qty = Number(fields.qty.value);
    const valid = Number.isFinite(price) && price >= 500 && price <= 1_000_000_000
      && Number.isSafeInteger(qty) && qty >= 1 && qty <= 100_000;
    $('item-preview').textContent = rupiah(valid ? roundMoney(price * qty) : 0);
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { values, valid } = validate();
    if (!valid) { $('form-status').textContent = ''; return; }
    if (totals().total + values.price * values.qty > 1_000_000_000_000) {
      setError('price', 'Total transaksi maksimal Rp1.000.000.000.000.'); return;
    }
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cart = [...cart, { id, ...values }];
    saveCart(); renderCart(); form.reset(); updatePreview();
    $('form-status').textContent = `${values.name} ditambahkan ke keranjang.`;
    fields.name.focus();
  });
  Object.entries(fields).forEach(([key, input]) => input.addEventListener('input', () => {
    setError(key, ''); $('form-status').textContent = ''; updatePreview();
  }));
  $('cart-body').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;
    cart = cart.filter((item) => item.id !== button.dataset.id);
    saveCart(); renderCart(); $('form-status').textContent = 'Barang dihapus dari keranjang.';
  });
  $('payment').addEventListener('input', renderPayment);
  $('new-transaction').addEventListener('click', () => {
    cart = []; saveCart(); form.reset(); $('payment').value = '';
    Object.keys(fields).forEach((key) => setError(key, ''));
    renderCart(); updatePreview(); $('form-status').textContent = 'Transaksi baru siap digunakan.';
    fields.name.focus();
  });
  renderCart(); updatePreview();
})();
