import { describe, it, expect, beforeEach } from "vitest";
import rentalsReducer, {
  loadUserRentals,
  addRental,
  returnBook,
  clearRentals,
} from "../../store/slices/rentalsSlice";

describe("rentalsSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const initialState = {
    rentals: [],
    currentUserId: null,
  };

  it("should return initial state", () => {
    const state = rentalsReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("should handle loadUserRentals", () => {
    const state = rentalsReducer(initialState, loadUserRentals(1));
    expect(state.currentUserId).toBe(1);
  });

  it("should handle addRental", () => {
    const stateWithUser = { ...initialState, currentUserId: 1 };
    const rental = {
      bookId: 1,
      bookTitle: "Test Book",
      userId: 1,
    };

    const state = rentalsReducer(stateWithUser, addRental(rental));

    expect(state.rentals).toHaveLength(1);
    expect(state.rentals[0]).toMatchObject({
      bookId: 1,
      bookTitle: "Test Book",
      userId: 1,
      returned: false,
    });
    expect(state.rentals[0]).toHaveProperty("id");
    expect(state.rentals[0]).toHaveProperty("rentalStartTime");
    expect(state.rentals[0]).toHaveProperty("dueDate");
  });

  it("should handle returnBook", () => {
    const stateWithRental = {
      rentals: [
        {
          id: "rental-123",
          bookId: 1,
          bookTitle: "Test Book",
          userId: 1,
          returned: false,
        },
      ],
      currentUserId: 1,
    };

    const state = rentalsReducer(stateWithRental, returnBook("rental-123"));

    expect(state.rentals[0].returned).toBe(true);
    expect(state.rentals[0]).toHaveProperty("returnTime");
  });

  it("should handle clearRentals", () => {
    const stateWithRentals = {
      rentals: [{ id: "rental-123" }],
      currentUserId: 1,
    };

    const state = rentalsReducer(stateWithRentals, clearRentals());

    expect(state.rentals).toEqual([]);
    expect(state.currentUserId).toBeNull();
  });

  it("should calculate due date 24 hours from rental time", () => {
    const stateWithUser = { ...initialState, currentUserId: 1 };
    const rental = {
      bookId: 1,
      bookTitle: "Test Book",
      userId: 1,
    };

    const beforeRental = Date.now();
    const state = rentalsReducer(stateWithUser, addRental(rental));
    const afterRental = Date.now();

    const dueDate = new Date(state.rentals[0].dueDate).getTime();
    const rentalTime = new Date(state.rentals[0].rentalStartTime).getTime();

    expect(dueDate - rentalTime).toBe(24 * 60 * 60 * 1000);
    expect(rentalTime).toBeGreaterThanOrEqual(beforeRental);
    expect(rentalTime).toBeLessThanOrEqual(afterRental);
  });
});
