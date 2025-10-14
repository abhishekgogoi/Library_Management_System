import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loadBooksState = () => {
  try {
    const serializedState = localStorage.getItem("booksState");
    if (serializedState === null) {
      return { books: [], loading: false, error: null, searchQuery: "" };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { books: [], loading: false, error: null, searchQuery: "" };
  }
};

const saveBooksState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("booksState", serializedState);
  } catch (err) {}
};

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data.map((post) => ({
    id: post.id,
    title: post.title,
    author: `Author ${post.userId}`,
    description: post.body,
    available: true,
  }));
});

const initialState = loadBooksState();

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    updateBookAvailability: (state, action) => {
      const { bookId, available } = action.payload;
      const book = state.books.find((b) => b.id === bookId);
      if (book) {
        book.available = available;
        saveBooksState(state);
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
        state.error = null;
        saveBooksState(state);
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateBookAvailability, setSearchQuery } = booksSlice.actions;
export default booksSlice.reducer;
