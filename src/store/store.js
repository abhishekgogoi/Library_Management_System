import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import rentalsReducer from './slices/rentalsSlice';
import profileReducer from './slices/profileSlice';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    rentals: rentalsReducer,
    profile: profileReducer,
    wishlist: wishlistReducer,
  },
});