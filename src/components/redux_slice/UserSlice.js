import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  role: "",        // "admin" or "user"
  loginStatus: false,
};

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
    },
    logoutUser: (state) => {
      state.username = "";
      state.role = "";
      state.loginStatus = false;
    },
  },
});

export const { setUserProp, loginUser, logoutUser } = UserSlice.actions;
export default UserSlice.reducer;