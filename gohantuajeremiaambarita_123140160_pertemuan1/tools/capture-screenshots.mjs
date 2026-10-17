/** Mengambil screenshot asli dari aplikasi lokal menggunakan Playwright.
 * Jalankan: npm ci; npx playwright install chromium; npm run screenshots
 * Script ini menulis ke docs/screenshots dan memakai data contoh pada context
 * browser sementara; localStorage browser harian Anda tidak disentuh.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const meeting = 1;
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
if (meeting === 3) {
  const build = spawnSync(npm, ['run', 'build'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
  if (build.status !== 0) throw new Error('Build gagal. Jalankan npm ci terlebih dahulu.');
}
const publicRoot = meeting === 3 ? path.join(root, 'dist') : root;
const output = path.join(root, 'docs', 'screenshots');
await mkdir(output, { recursive: true });
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(publicRoot, `.${name === '/' ? '/index.html' : name}`);
    if (!target.startsWith(publicRoot + path.sep)) { res.writeHead(403); res.end(); return; }
    const bytes = await readFile(target);
    res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' }); res.end(bytes);
  } catch { res.writeHead(404); res.end('Tidak ditemukan'); }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const shot = async (name) => {
    await page.screenshot({ path: path.join(output, name), fullPage: true });
    console.log(`Dibuat: docs/screenshots/${name}`);
  };
  if (meeting === 1) {
    await shot('01-form.png');
    await page.getByRole('button', { name: '+ Tambah ke keranjang' }).click();
    await shot('02-validasi.png');
    const add = async (name, price, qty) => {
      await page.locator('#item-name').fill(name); await page.locator('#item-price').fill(price);
      await page.locator('#item-qty').fill(qty); await page.getByRole('button', { name: '+ Tambah ke keranjang' }).click();
    };
    await add('Buku Tulis', '10000', '5'); await add('Air Mineral', '5000', '2');
    await page.locator('#payment').fill('100000'); await shot('03-perhitungan.png');
  } else if (meeting === 2) {
    await page.locator('#refresh-quote').waitFor({ state: 'visible' });
    await page.waitForFunction(() => !document.getElementById('refresh-quote').disabled, null, { timeout: 10000 });
    const add = async (title, course, priority, note) => {
      const date = new Date(); date.setDate(date.getDate() + 7);
      const due = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
      await page.locator('#task-title').fill(title); await page.locator('#task-course').fill(course);
      await page.locator('#task-due').fill(due); await page.locator('#task-priority').selectOption(priority);
      await page.locator('#task-note').fill(note); await page.getByRole('button', { name: '+ Simpan tugas' }).click();
    };
    await add('Selesaikan Mini POS', 'Pemrograman Web', 'high', 'Periksa validasi dan perhitungan diskon.');
    await add('Baca materi Context API', 'Pemrograman Web', 'normal', 'Catat alur data melalui Provider.');
    await add('Rapikan laporan praktikum', 'Basis Data', 'normal', 'Lengkapi analisis dan lampiran.');
    await page.locator('.task-check').first().check(); await shot('01-dashboard.png');
    await page.locator('button[data-action=edit]').nth(1).click(); await shot('02-edit-tugas.png');
    await page.locator('#cancel-edit').click(); await page.setViewportSize({ width: 390, height: 844 });
    await shot('03-mobile.png');
  } else {
    await shot('01-form-buku.png');
    await page.getByRole('button', { name: '+ Simpan buku' }).click(); await shot('02-validasi.png');
    const add = async (title, author, status) => {
      await page.getByLabel('Judul buku', { exact: true }).fill(title); await page.getByLabel('Penulis', { exact: true }).fill(author);
      await page.getByLabel('Status buku', { exact: true }).selectOption(status);
      await page.getByRole('button', { name: '+ Simpan buku' }).click();
    };
    await add('Filosofi Teras', 'Henry Manampiring', 'baca'); await add('Laut Bercerita', 'Leila S. Chudori', 'milik');
    await add('Atomic Habits', 'James Clear', 'beli'); await add('Clean Code', 'Robert C. Martin', 'beli');
    await shot('03-koleksi.png'); await page.getByRole('link', { name: /Statistik/ }).click(); await shot('04-statistik.png');
    // Bukti berupa screenshot panel yang menampilkan output npm test sebenarnya.
    const test = spawnSync(npm, ['test', '--', '--reporter=verbose'], { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' });
    if (test.status !== 0) throw new Error('Unit test gagal. Periksa npm test.');
    const escape = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const log = `${test.stdout}\n${test.stderr}`.replace(/\x1b\[[0-9;]*m/g, '');
    await page.setContent(`<html><body style="background:#111b27;color:#e1e9f2;margin:0;padding:36px;font:16px/1.8 monospace"><h2 style="color:#b6dfa9">$ npm test -- --reporter=verbose</h2><pre style="white-space:pre-wrap">${escape(log)}</pre></body></html>`);
    await shot('05-unit-test.png');
  }
  const names = meeting === 1 ? ['01-form.png', '02-validasi.png', '03-perhitungan.png'] : meeting === 2 ? ['01-dashboard.png', '02-edit-tugas.png', '03-mobile.png'] : ['01-form-buku.png', '02-validasi.png', '03-koleksi.png', '04-statistik.png', '05-unit-test.png'];
  await writeFile(path.join(output, 'GALLERY.md'), '# Screenshot aplikasi\n\n' + names.map((name) => `![${name}](${name})`).join('\n\n') + '\n');
  const readmePath = path.join(root, 'README.md');
  const readme = await readFile(readmePath, 'utf8');
  if (!readme.includes('<!-- AUTO-SCREENSHOTS -->')) {
    await writeFile(readmePath, readme + '\n<!-- AUTO-SCREENSHOTS -->\n## Screenshot hasil capture lokal\n\n' + names.map((name) => `![${name}](docs/screenshots/${name})`).join('\n\n') + '\n');
  }
  console.log('Selesai. Gambar disimpan di docs/screenshots dan ditambahkan ke README.');
} finally {
  await browser?.close(); await new Promise((resolve) => server.close(resolve));
}
