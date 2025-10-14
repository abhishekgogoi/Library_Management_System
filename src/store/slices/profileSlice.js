import { createSlice } from "@reduxjs/toolkit";

// Load user-specific profile data
const loadProfileState = (userId) => {
  try {
    if (!userId) return { profileImage: null, currentUserId: null };
    const serializedState = localStorage.getItem(`profileState_${userId}`);
    if (serializedState === null) {
      return { profileImage: null, currentUserId: userId };
    }
    return { ...JSON.parse(serializedState), currentUserId: userId };
  } catch (err) {
    return { profileImage: null, currentUserId: userId };
  }
};

const saveProfileState = (state, userId) => {
  try {
    if (!userId) return;
    const dataToSave = { profileImage: state.profileImage };
    const serializedState = JSON.stringify(dataToSave);
    localStorage.setItem(`profileState_${userId}`, serializedState);
  } catch (err) {}
};

const initialState = { profileImage: null, currentUserId: null };

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loadUserProfile: (state, action) => {
      const userId = action.payload;
      const userData = loadProfileState(userId);
      state.profileImage = userData.profileImage;
      state.currentUserId = userId;
    },
    updateProfileImage: (state, action) => {
      state.profileImage = action.payload;
      saveProfileState(state, state.currentUserId);
    },
    clearProfile: (state) => {
      state.profileImage = null;
      state.currentUserId = null;
    },
  },
});

export const { loadUserProfile, updateProfileImage, clearProfile } =
  profileSlice.actions;
export default profileSlice.reducer;
