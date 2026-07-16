import { createSlice } from "@reduxjs/toolkit";

// Restore session from localStorage if available
const saved = JSON.parse(localStorage.getItem("poker_session") || "null");

const initialState = saved
  ? { username: saved.username, role: saved.role, loginStatus: true }
  : { username: "", role: "", loginStatus: false };

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProp: (state, action) => {
      state[action.payload.prop] = action.payload.value;
    },
    loginUser: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.loginStatus = true;
      localStorage.setItem("poker_session", JSON.stringify({ username: action.payload.username, role: action.payload.role }));
    },
    logoutUser: (state) => {
      state.username = "";
      state.role = "";
      state.loginStatus = false;
      localStorage.removeItem("poker_session");
    },
  },
});

export const { setUserProp, loginUser, logoutUser } = UserSlice.actions;
export default UserSlice.reducer;