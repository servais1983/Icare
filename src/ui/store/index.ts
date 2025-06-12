import { configureStore, Middleware } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';
import alertReducer from './slices/alertSlice';
import threatReducer from './slices/threatSlice';
import settingsReducer from './slices/settingsSlice';
import analyticsReducer from './slices/analyticsSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alerts: alertReducer,
    threats: threatReducer,
    analytics: analyticsReducer,
    settings: settingsReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware: () => Middleware[]) =>
    getDefaultMiddleware().concat([]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
