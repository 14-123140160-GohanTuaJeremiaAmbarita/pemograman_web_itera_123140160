export const STORAGE_KEY = "gohan:books:v1";
export const BOOK_STATUS = Object.freeze({
  milik: "Dimiliki",
  baca: "Sedang dibaca",
  beli: "Ingin dibeli",
});
export const bookStatusKeys = Object.keys(BOOK_STATUS);
export const validateBook = ({
  title = "",
  author = "",
  status = "",
} = {}) => ({
  title: !title.trim()
    ? "Judul buku wajib diisi."
    : title.trim().length > 150
      ? "Judul maksimal 150 karakter."
      : "",
  author: !author.trim()
    ? "Nama penulis wajib diisi."
    : author.trim().length > 100
      ? "Nama penulis maksimal 100 karakter."
      : "",
  status: !bookStatusKeys.includes(status)
    ? "Pilih status buku yang valid."
    : "",
});
export const isBookArray = (value) =>
  Array.isArray(value) &&
  value.every(
    (book) =>
      book &&
      typeof book.id === "string" &&
      typeof book.title === "string" &&
      typeof book.author === "string" &&
      bookStatusKeys.includes(book.status) &&
      typeof book.createdAt === "string" &&
      !Number.isNaN(Date.parse(book.createdAt)) &&
      !Object.values(validateBook(book)).some(Boolean),
  ) &&
  new Set(value.map(({ id }) => id)).size === value.length;
export const bookId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
