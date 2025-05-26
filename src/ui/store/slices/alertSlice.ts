import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const initialState: AlertState = {
  open: false,
  message: '',
  type: 'info',
  duration: 6000,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<Omit<AlertState, 'open'>>) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.duration = action.payload.duration || 6000;
    },
    hideAlert: (state) => {
      state.open = false;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;

export default alertSlice.reducer;
