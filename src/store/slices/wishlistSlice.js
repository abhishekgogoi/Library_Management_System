import { createSlice } from "@reduxjs/toolkit";

const loadWishlistState = (userId) => {
  try {
    if (!userId) return { wishlist: [], currentUserId: null };
    const serializedState = localStorage.getItem(`wishlistState_${userId}`);
    if (serializedState === null) {
      return { wishlist: [], currentUserId: userId };
    }
    return { ...JSON.parse(serializedState), currentUserId: userId };
  } catch (err) {
    return { wishlist: [], currentUserId: userId };
  }
};

const saveWishlistState = (state, userId) => {
  try {
    if (!userId) return;
    const dataToSave = { wishlist: state.wishlist };
    const serializedState = JSON.stringify(dataToSave);
    localStorage.setItem(`wishlistState_${userId}`, serializedState);
  } catch (err) {}
};

const initialState = { wishlist: [], currentUserId: null };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    loadUserWishlist: (state, action) => {
      const userId = action.payload;
      const userData = loadWishlistState(userId);
      state.wishlist = userData.wishlist;
      state.currentUserId = userId;
    },
    addToWishlist: (state, action) => {
      const bookId = action.payload;
      if (!state.wishlist.includes(bookId)) {
        state.wishlist.push(bookId);
        saveWishlistState(state, state.currentUserId);
      }
    },
    removeFromWishlist: (state, action) => {
      const bookId = action.payload;
      state.wishlist = state.wishlist.filter((id) => id !== bookId);
      saveWishlistState(state, state.currentUserId);
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      state.currentUserId = null;
    },
  },
});

export const {
  loadUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
