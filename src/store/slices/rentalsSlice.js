import { createSlice } from "@reduxjs/toolkit";

const loadRentalsState = (userId) => {
  try {
    if (!userId) return { rentals: [], currentUserId: null };
    const serializedState = localStorage.getItem(`rentalsState_${userId}`);
    if (serializedState === null) {
      return { rentals: [], currentUserId: userId };
    }
    return { ...JSON.parse(serializedState), currentUserId: userId };
  } catch (err) {
    return { rentals: [], currentUserId: userId };
  }
};

const saveRentalsState = (state, userId) => {
  try {
    if (!userId) return;
    const dataToSave = { rentals: state.rentals };
    const serializedState = JSON.stringify(dataToSave);
    localStorage.setItem(`rentalsState_${userId}`, serializedState);
  } catch (err) {}
};

const initialState = { rentals: [], currentUserId: null };

const rentalsSlice = createSlice({
  name: "rentals",
  initialState,
  reducers: {
    loadUserRentals: (state, action) => {
      const userId = action.payload;
      const userData = loadRentalsState(userId);
      state.rentals = userData.rentals;
      state.currentUserId = userId;
    },
    addRental: (state, action) => {
      const { bookId, bookTitle, userId } = action.payload;
      const rentalStartTime = new Date().toISOString();
      const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      state.rentals.push({
        id: `rental-${Date.now()}`,
        bookId,
        bookTitle,
        userId,
        rentalStartTime,
        dueDate,
        returned: false,
      });
      saveRentalsState(state, state.currentUserId);
    },
    returnBook: (state, action) => {
      const rentalId = action.payload;
      const rental = state.rentals.find((r) => r.id === rentalId);
      if (rental) {
        rental.returned = true;
        rental.returnTime = new Date().toISOString();
        saveRentalsState(state, state.currentUserId);
      }
    },
    clearRentals: (state) => {
      state.rentals = [];
      state.currentUserId = null;
    },
  },
});

export const { loadUserRentals, addRental, returnBook, clearRentals } =
  rentalsSlice.actions;
export default rentalsSlice.reducer;
