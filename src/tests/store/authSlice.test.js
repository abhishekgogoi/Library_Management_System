import { describe, it, expect, beforeEach, vi } from "vitest";
import authReducer, { login, logout } from "../../store/slices/authSlice";

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return initial state", () => {
    const state = authReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      user: null,
      isAuthenticated: false,
    });
  });

  it("should handle login", () => {
    const user = {
      id: 1,
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
    };

    const state = authReducer(undefined, login(user));

    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "authState",
      expect.any(String)
    );
  });

  it("should handle logout", () => {
    const initialState = {
      user: { id: 1, name: "Test User" },
      isAuthenticated: true,
    };

    const state = authReducer(initialState, logout());

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith("authState");
  });

  it("should persist auth state to localStorage on login", () => {
    const user = { id: 1, name: "Test User", email: "test@example.com" };
    authReducer(undefined, login(user));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "authState",
      expect.stringContaining("Test User")
    );
  });
});
