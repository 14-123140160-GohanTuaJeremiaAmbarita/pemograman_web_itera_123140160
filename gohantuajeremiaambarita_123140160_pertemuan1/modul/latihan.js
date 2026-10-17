const form = document.getElementById('budget-form');
const budget = document.getElementById('budget');
const spending = document.getElementById('spending');
const result = document.getElementById('result');
const key = 'gohan:latihan-anggaran:v1';
try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && Number.isFinite(saved.budget) && Number.isFinite(saved.spending)) {
    budget.value = saved.budget; spending.value = saved.spending;
  }
} catch { result.textContent = 'Data tersimpan belum tersedia atau tidak dapat dibaca.'; }
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = { budget: Number(budget.value), spending: Number(spending.value) };
  if (!budget.value || !spending.value || !Object.values(values).every((value) => Number.isFinite(value) && value >= 0)) {
    result.textContent = 'Anggaran dan pengeluaran wajib berupa angka nonnegatif.'; return;
  }
  const saldo = values.budget - values.spending;
  result.textContent = `Saldo: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(saldo)}`;
  try { localStorage.setItem(key, JSON.stringify(values)); }
  catch { result.textContent += ' (Penyimpanan browser tidak tersedia.)'; }
});
