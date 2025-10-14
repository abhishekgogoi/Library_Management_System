import { describe, it, expect, beforeEach } from "vitest";
import booksReducer, {
  updateBookAvailability,
  setSearchQuery,
  fetchBooks,
} from "../../store/slices/booksSlice";

describe("booksSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const initialState = {
    books: [],
    loading: false,
    error: null,
    searchQuery: "",
  };

  it("should return initial state", () => {
    const state = booksReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("should handle setSearchQuery", () => {
    const state = booksReducer(initialState, setSearchQuery("test query"));
    expect(state.searchQuery).toBe("test query");
  });

  it("should handle updateBookAvailability", () => {
    const stateWithBooks = {
      ...initialState,
      books: [
        { id: 1, title: "Book 1", available: true },
        { id: 2, title: "Book 2", available: true },
      ],
    };

    const state = booksReducer(
      stateWithBooks,
      updateBookAvailability({ bookId: 1, available: false })
    );

    expect(state.books[0].available).toBe(false);
    expect(state.books[1].available).toBe(true);
  });

  it("should set loading to true when fetchBooks is pending", () => {
    const state = booksReducer(initialState, {
      type: fetchBooks.pending.type,
    });
    expect(state.loading).toBe(true);
  });

  it("should set books and loading to false when fetchBooks is fulfilled", () => {
    const books = [
      { id: 1, title: "Book 1", author: "Author 1", available: true },
      { id: 2, title: "Book 2", author: "Author 2", available: true },
    ];

    const state = booksReducer(initialState, {
      type: fetchBooks.fulfilled.type,
      payload: books,
    });

    expect(state.loading).toBe(false);
    expect(state.books).toEqual(books);
    expect(state.error).toBeNull();
  });

  it("should set error when fetchBooks is rejected", () => {
    const error = { message: "Failed to fetch books" };
    const state = booksReducer(initialState, {
      type: fetchBooks.rejected.type,
      error,
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Failed to fetch books");
  });
});
