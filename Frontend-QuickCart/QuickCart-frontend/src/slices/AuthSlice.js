// store/slices/authSlice.js - User session state

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../service/Api';
import toast from 'react-hot-toast';

// ---- Async Thunks ----

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authAPI.register(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// ---- Helpers ----
const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch { return null; }
};

// ---- Slice ----
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    loadUserFromStorage(),
    token:   localStorage.getItem('token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user    = payload;
        s.token   = payload.token;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload));
        toast.success(`Welcome, ${payload.fullName}!`);
      })
      .addCase(registerUser.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
        toast.error(payload);
      });

    // Login
    builder
      .addCase(loginUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.user    = payload;
        s.token   = payload.token;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload));
        toast.success(`Welcome back, ${payload.fullName}!`);
      })
      .addCase(loginUser.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
        toast.error(payload);
      });
  },
});

export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectUser       = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => !!state.auth.token;
export const selectIsAdmin    = (state) => state.auth.user?.role === 'ADMIN';
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;