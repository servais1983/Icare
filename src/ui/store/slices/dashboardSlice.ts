import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';

// Define the shape of the dashboard data
export interface DashboardData {
  system_status: string;
  active_threats: number;
  analyzed_packets: number;
  quantum_vault_status: string;
}

// Define the state for this slice
interface DashboardState {
  data: DashboardData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: DashboardState = {
  data: null,
  status: 'idle',
  error: null,
};

// Async thunk to fetch dashboard data from the backend
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    const response = await fetch('/api/dashboard');
    if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
    }
    const data: DashboardData = await response.json();
    return data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<DashboardState>) => {
    builder
      .addCase(fetchDashboardData.pending, (state: DashboardState) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardData.fulfilled, (state: DashboardState, action: PayloadAction<DashboardData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state: DashboardState, action: { error: { message: string } }) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer; 