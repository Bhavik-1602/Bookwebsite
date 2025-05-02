import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    role: '', // Add this
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.role = action.payload.role; // Store role
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = '';
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
