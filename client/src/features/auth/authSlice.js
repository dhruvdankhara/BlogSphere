import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  data: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.data = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.data = {};
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
