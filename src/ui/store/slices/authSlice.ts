import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  lastLogin: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitializing: true,
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isInitializing = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    initializeAuth: (state) => {
      state.isInitializing = true;
    },
    initializeAuthSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    initializeAuthFailure: (state) => {
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.user = null;
      state.token = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  initializeAuth,
  initializeAuthSuccess,
  initializeAuthFailure,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
