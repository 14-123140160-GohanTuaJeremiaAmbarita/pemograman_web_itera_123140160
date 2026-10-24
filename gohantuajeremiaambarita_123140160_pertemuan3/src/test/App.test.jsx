import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { BookProvider } from "../context/BookContext";
import { STORAGE_KEY } from "../utils/books";
const book = (id, title, author, status = "milik") => ({
  id,
  title,
  author,
  status,
  createdAt: "2026-10-17T08:00:00.000Z",
});
const mount = (route = "/") =>
  render(
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <BookProvider>
        <App />
      </BookProvider>
    </MemoryRouter>,
  );
const fill = async (user, title, author, status = "milik") => {
  await user.clear(screen.getByLabelText("Judul buku"));
  await user.type(screen.getByLabelText("Judul buku"), title);
  await user.clear(screen.getByLabelText("Penulis"));
  await user.type(screen.getByLabelText("Penulis"), author);
  await user.selectOptions(screen.getByLabelText("Status buku"), status);
};
it("menolak judul dan penulis kosong dengan feedback visual", async () => {
  const user = userEvent.setup();
  mount();
  await user.click(screen.getByRole("button", { name: "+ Simpan buku" }));
  expect(screen.getByText("Judul buku wajib diisi.")).toBeVisible();
  expect(screen.getByText("Nama penulis wajib diisi.")).toBeVisible();
  expect(screen.getByLabelText("Judul buku")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
});
it("menambah buku, mereset form, dan menyimpan JSON", async () => {
  const user = userEvent.setup();
  mount();
  await fill(user, "Filosofi Teras", "Henry Manampiring", "baca");
  await user.click(screen.getByRole("button", { name: "+ Simpan buku" }));
  expect(screen.getByRole("heading", { name: "Filosofi Teras" })).toBeVisible();
  expect(screen.getByLabelText("Judul buku")).toHaveValue("");
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([
      expect.objectContaining({
        title: "Filosofi Teras",
        author: "Henry Manampiring",
        status: "baca",
      }),
    ]),
  );
});
it("mengedit buku dan mempertahankan ID serta tanggal pencatatan", async () => {
  const original = book("one", "Buku Lama", "Penulis Lama");
  localStorage.setItem(STORAGE_KEY, JSON.stringify([original]));
  const user = userEvent.setup();
  mount();
  await user.click(screen.getByRole("button", { name: "Edit Buku Lama" }));
  await fill(user, "Buku Baru", "Penulis Baru", "beli");
  await user.click(screen.getByRole("button", { name: "Simpan perubahan" }));
  expect(
    screen.queryByRole("heading", { name: "Buku Lama" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Buku Baru" })).toBeVisible();
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))[0]).toEqual({
      ...original,
      title: "Buku Baru",
      author: "Penulis Baru",
      status: "beli",
    }),
  );
});
it("membatalkan edit tanpa mengubah koleksi", async () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([book("one", "Buku Awal", "Penulis")]),
  );
  const user = userEvent.setup();
  mount();
  await user.click(screen.getByRole("button", { name: "Edit Buku Awal" }));
  await user.clear(screen.getByLabelText("Judul buku"));
  await user.type(screen.getByLabelText("Judul buku"), "Tidak Disimpan");
  await user.click(screen.getByRole("button", { name: "Batal mengedit" }));
  expect(screen.getByRole("heading", { name: "Buku Awal" })).toBeVisible();
  expect(screen.getByLabelText("Judul buku")).toHaveValue("");
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY))[0].title).toBe(
    "Buku Awal",
  );
});
it("menghapus buku sampai koleksi kosong dan menyimpan array kosong", async () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([book("one", "Buku Hapus", "Penulis")]),
  );
  const user = userEvent.setup();
  mount();
  await user.click(screen.getByRole("button", { name: "Hapus Buku Hapus" }));
  expect(
    screen.queryByRole("heading", { name: "Buku Hapus" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Rakmu menunggu cerita pertama" }),
  ).toBeVisible();
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]),
  );
});
it("menggabungkan pencarian penulis case-insensitive dan filter status", async () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      book("1", "Laut Bercerita", "Leila S. Chudori", "baca"),
      book("2", "Pulang", "Leila S. Chudori", "milik"),
      book("3", "Bumi", "Tere Liye", "baca"),
    ]),
  );
  const user = userEvent.setup();
  mount();
  await user.type(screen.getByLabelText("Cari judul atau penulis"), "LEILA");
  await user.selectOptions(screen.getByLabelText("Filter status buku"), "baca");
  expect(screen.getByRole("heading", { name: "Laut Bercerita" })).toBeVisible();
  expect(
    screen.queryByRole("heading", { name: "Pulang" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Bumi" }),
  ).not.toBeInTheDocument();
});
it("menampilkan feedback saat pencarian tidak menemukan buku", async () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([book("1", "Bumi", "Tere Liye")]),
  );
  const user = userEvent.setup();
  mount();
  await user.type(
    screen.getByLabelText("Cari judul atau penulis"),
    "Tidak Ada",
  );
  expect(
    screen.getByRole("heading", { name: "Buku belum ditemukan" }),
  ).toBeVisible();
});
it("memuat kembali buku tersimpan setelah komponen dipasang ulang", () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([book("1", "Buku Persisten", "Penulis")]),
  );
  const first = mount();
  first.unmount();
  mount();
  expect(screen.getByRole("heading", { name: "Buku Persisten" })).toBeVisible();
});
it("menangani JSON rusak dan skema data yang tidak sesuai tanpa crash", () => {
  localStorage.setItem(STORAGE_KEY, "{rusak");
  const first = mount();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Data buku tersimpan tidak dapat dibaca",
  );
  first.unmount();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([{ title: "Tidak Lengkap" }]),
  );
  mount();
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.getByRole("button", { name: "+ Simpan buku" })).toBeEnabled();
});
it("menavigasi ke halaman statistik dan kembali tanpa kehilangan koleksi", async () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      book("1", "Buku A", "Penulis Satu", "baca"),
      book("2", "Buku B", "Penulis Dua", "beli"),
    ]),
  );
  const user = userEvent.setup();
  mount();
  await user.click(screen.getByRole("link", { name: /Statistik/ }));
  expect(
    screen.getByRole("heading", { name: "Setiap rak punya pola." }),
  ).toBeVisible();
  expect(screen.getByText("50%")).toBeVisible();
  expect(
    screen.getByRole("progressbar", { name: "Sedang dibaca" }),
  ).toHaveAttribute("value", "1");
  await user.click(screen.getByRole("link", { name: /Kembali ke koleksi/ }));
  expect(screen.getByRole("heading", { name: "Buku A" })).toBeVisible();
});
it("menampilkan halaman fallback untuk rute tak dikenal", () => {
  mount("/tidak-ada");
  expect(
    screen.getByRole("heading", { name: "Halaman belum ada di rak." }),
  ).toBeVisible();
});
it("merender judul yang menyerupai HTML sebagai teks aman", () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([book("1", "<img src=x onerror=alert(1)>", "Penulis")]),
  );
  mount();
  expect(
    screen.getByRole("heading", { name: "<img src=x onerror=alert(1)>" }),
  ).toBeVisible();
  expect(document.querySelector("img")).toBeNull();
});
