import { describe, it, expect, beforeEach } from "vitest";
import profileReducer, {
  loadUserProfile,
  updateProfileImage,
  clearProfile,
} from "../../store/slices/profileSlice";

describe("profileSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const initialState = {
    profileImage: null,
    currentUserId: null,
  };

  it("should return initial state", () => {
    const state = profileReducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("should handle loadUserProfile", () => {
    const state = profileReducer(initialState, loadUserProfile(1));
    expect(state.currentUserId).toBe(1);
  });

  it("should handle updateProfileImage", () => {
    const stateWithUser = { ...initialState, currentUserId: 1 };
    const imageData = "data:image/png;base64,test123";

    const state = profileReducer(stateWithUser, updateProfileImage(imageData));

    expect(state.profileImage).toBe(imageData);
  });

  it("should handle clearProfile", () => {
    const stateWithImage = {
      profileImage: "data:image/png;base64,test123",
      currentUserId: 1,
    };

    const state = profileReducer(stateWithImage, clearProfile());

    expect(state.profileImage).toBeNull();
    expect(state.currentUserId).toBeNull();
  });

  it("should update profile image multiple times", () => {
    let state = { ...initialState, currentUserId: 1 };

    state = profileReducer(state, updateProfileImage("image1"));
    expect(state.profileImage).toBe("image1");

    state = profileReducer(state, updateProfileImage("image2"));
    expect(state.profileImage).toBe("image2");
  });
});
