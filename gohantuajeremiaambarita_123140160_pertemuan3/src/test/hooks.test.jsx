import { act, renderHook, waitFor } from "@testing-library/react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useBookStats } from "../hooks/useBookStats";
it("statistik koleksi kosong tidak menghasilkan NaN atau Infinity", () => {
  const { result } = renderHook(() => useBookStats([]));
  expect(result.current).toEqual({
    total: 0,
    counts: { milik: 0, baca: 0, beli: 0 },
    readingPercent: 0,
    uniqueAuthors: 0,
  });
});
it("statistik menghitung setiap status dan nama penulis secara konsisten", () => {
  const { result } = renderHook(() =>
    useBookStats([
      { status: "milik", author: " Gohan " },
      { status: "baca", author: "gohan" },
      { status: "beli", author: "Adriel" },
    ]),
  );
  expect(result.current.counts).toEqual({ milik: 1, baca: 1, beli: 1 });
  expect(result.current.uniqueAuthors).toBe(2);
  expect(result.current.readingPercent).toBe(33);
});
it("useLocalStorage melaporkan kegagalan simpan sambil mempertahankan state aktif", async () => {
  const { result } = renderHook(() => useLocalStorage("test:key", []));
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Quota exceeded", "QuotaExceededError");
  });
  act(() => result.current.setValue(["tetap ada"]));
  await waitFor(() =>
    expect(result.current.storageError).toContain(
      "Penyimpanan browser tidak tersedia",
    ),
  );
  expect(result.current.value).toEqual(["tetap ada"]);
});
it("useLocalStorage mendukung functional updater dan serialisasi JSON", async () => {
  const { result } = renderHook(() => useLocalStorage("test:key", []));
  act(() => result.current.setValue((previous) => [...previous, "baru"]));
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem("test:key"))).toEqual(["baru"]),
  );
});
