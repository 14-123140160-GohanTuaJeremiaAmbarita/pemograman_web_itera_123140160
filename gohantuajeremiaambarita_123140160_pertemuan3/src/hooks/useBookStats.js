import { useMemo } from "react";
export function useBookStats(books) {
  return useMemo(() => {
    const counts = { milik: 0, baca: 0, beli: 0 };
    books.forEach(({ status }) => {
      if (status in counts) counts[status] += 1;
    });
    return {
      total: books.length,
      counts,
      readingPercent: books.length
        ? Math.round((counts.baca / books.length) * 100)
        : 0,
      uniqueAuthors: new Set(
        books.map(({ author }) => author.trim().toLocaleLowerCase("id")),
      ).size,
    };
  }, [books]);
}
