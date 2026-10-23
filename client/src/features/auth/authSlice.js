import { createSlice } from '@reduxjs/toolkit';
import { initialUsers } from '../../data/initialData';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  users: initialUsers,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.role === 'admin';
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export const { loginSuccess, logout, setError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectUserId = (state) => state.auth.user?.id || null;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectAllUsers = (state) => state.auth.users;

export default authSlice.reducer;