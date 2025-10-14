import { describe, it, expect, beforeEach } from "vitest";
import wishlistReducer, {
  loadUserWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../../store/slices/wishlistSlice";

describe("wishlistSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const initialState = {
    wishlist: [],
    currentUserId: null,
  };

  it("should return initial state", () => {
    const state = wishlistReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("should handle loadUserWishlist", () => {
    const state = wishlistReducer(initialState, loadUserWishlist(1));
    expect(state.currentUserId).toBe(1);
  });

  it("should handle addToWishlist", () => {
    const stateWithUser = { ...initialState, currentUserId: 1 };
    const state = wishlistReducer(stateWithUser, addToWishlist(5));

    expect(state.wishlist).toContain(5);
    expect(state.wishlist).toHaveLength(1);
  });

  it("should not add duplicate items to wishlist", () => {
    const stateWithItem = { wishlist: [5], currentUserId: 1 };
    const state = wishlistReducer(stateWithItem, addToWishlist(5));

    expect(state.wishlist).toHaveLength(1);
    expect(state.wishlist).toEqual([5]);
  });

  it("should handle removeFromWishlist", () => {
    const stateWithItems = { wishlist: [1, 2, 3], currentUserId: 1 };
    const state = wishlistReducer(stateWithItems, removeFromWishlist(2));

    expect(state.wishlist).not.toContain(2);
    expect(state.wishlist).toEqual([1, 3]);
  });

  it("should handle clearWishlist", () => {
    const stateWithItems = { wishlist: [1, 2, 3], currentUserId: 1 };
    const state = wishlistReducer(stateWithItems, clearWishlist());

    expect(state.wishlist).toEqual([]);
    expect(state.currentUserId).toBeNull();
  });

  it("should add multiple items to wishlist", () => {
    let state = { ...initialState, currentUserId: 1 };
    state = wishlistReducer(state, addToWishlist(1));
    state = wishlistReducer(state, addToWishlist(2));
    state = wishlistReducer(state, addToWishlist(3));

    expect(state.wishlist).toEqual([1, 2, 3]);
  });
});
