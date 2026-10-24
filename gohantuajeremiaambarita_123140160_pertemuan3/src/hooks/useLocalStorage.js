import { useCallback, useEffect, useRef, useState } from "react";
// Pembacaan sekali melalui lazy initializer; penulisan hanya setelah perubahan.
export function useLocalStorage(key, initialValue, isValid = () => true) {
  const [loaded] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return { value: initialValue, error: "" };
      const parsed = JSON.parse(raw);
      if (!isValid(parsed)) throw new Error("Struktur data tidak valid");
      return { value: parsed, error: "" };
    } catch {
      return {
        value: initialValue,
        error:
          "Data buku tersimpan tidak dapat dibaca. Tambahkan buku untuk menyimpan data baru.",
      };
    }
  });
  const [value, setValue] = useState(loaded.value);
  const [storageError, setStorageError] = useState(loaded.error);
  const dirty = useRef(false);
  const updateValue = useCallback((nextValue) => {
    dirty.current = true;
    setValue(nextValue);
  }, []);
  useEffect(() => {
    if (!dirty.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError("");
    } catch {
      setStorageError(
        "Penyimpanan browser tidak tersedia. Perubahan hanya bertahan selama halaman terbuka.",
      );
    }
    dirty.current = false;
  }, [key, value]);
  return { value, setValue: updateValue, storageError };
}
