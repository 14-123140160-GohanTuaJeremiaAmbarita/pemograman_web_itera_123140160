import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { bookId, isBookArray, STORAGE_KEY, validateBook } from "../utils/books";
const BookContext = createContext(null);
export function BookProvider({ children }) {
  const {
    value: books,
    setValue: setBooks,
    storageError,
  } = useLocalStorage(STORAGE_KEY, [], isBookArray);
  const cleanBook = (input) => {
    const errors = validateBook(input);
    if (Object.values(errors).some(Boolean))
      throw new Error("Data buku belum valid.");
    return {
      title: input.title.trim(),
      author: input.author.trim(),
      status: input.status,
    };
  };
  const addBook = (input) => {
    const book = {
      ...cleanBook(input),
      id: bookId(),
      createdAt: new Date().toISOString(),
    };
    setBooks((previous) => [book, ...previous]);
  };
  const updateBook = (id, input) => {
    const changes = cleanBook(input);
    setBooks((previous) =>
      previous.map((book) => (book.id === id ? { ...book, ...changes } : book)),
    );
  };
  const deleteBook = (id) =>
    setBooks((previous) => previous.filter((book) => book.id !== id));
  return (
    <BookContext.Provider
      value={{ books, addBook, updateBook, deleteBook, storageError }}
    >
      {children}
    </BookContext.Provider>
  );
}
BookProvider.propTypes = { children: PropTypes.node.isRequired };
export function useBooks() {
  const context = useContext(BookContext);
  if (!context)
    throw new Error("useBooks harus digunakan di dalam BookProvider.");
  return context;
}
