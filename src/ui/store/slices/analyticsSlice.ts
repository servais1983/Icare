import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsState {
  timeRange: '1h' | '24h' | '7d' | '30d' | 'custom';
  customTimeRange: {
    start: string | null;
    end: string | null;
  };
  loading: boolean;
  error: string | null;
  threatTrends: {
    data: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
      }[];
    };
    loading: boolean;
  };
  systemPerformance: {
    cpu: number;
    memory: number;
    network: number;
    storage: number;
    loading: boolean;
  };
  detectionStats: {
    totalDetections: number;
    falsePositives: number;
    truePositives: number;
    accuracy: number;
    loading: boolean;
  };
  geographicData: {
    regions: {
      id: string;
      name: string;
      count: number;
      coordinates: [number, number];
    }[];
    loading: boolean;
  };
}

const initialState: AnalyticsState = {
  timeRange: '24h',
  customTimeRange: {
    start: null,
    end: null,
  },
  loading: false,
  error: null,
  threatTrends: {
    data: {
      labels: [],
      datasets: [],
    },
    loading: false,
  },
  systemPerformance: {
    cpu: 0,
    memory: 0,
    network: 0,
    storage: 0,
    loading: false,
  },
  detectionStats: {
    totalDetections: 0,
    falsePositives: 0,
    truePositives: 0,
    accuracy: 0,
    loading: false,
  },
  geographicData: {
    regions: [],
    loading: false,
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<AnalyticsState['timeRange']>) => {
      state.timeRange = action.payload;
      if (action.payload !== 'custom') {
        state.customTimeRange = {
          start: null,
          end: null,
        };
      }
    },
    setCustomTimeRange: (state, action: PayloadAction<AnalyticsState['customTimeRange']>) => {
      state.customTimeRange = action.payload;
      state.timeRange = 'custom';
    },
    fetchThreatTrendsStart: (state) => {
      state.threatTrends.loading = true;
      state.error = null;
    },
    fetchThreatTrendsSuccess: (state, action: PayloadAction<AnalyticsState['threatTrends']['data']>) => {
      state.threatTrends.data = action.payload;
      state.threatTrends.loading = false;
    },
    fetchThreatTrendsFailure: (state, action: PayloadAction<string>) => {
      state.threatTrends.loading = false;
      state.error = action.payload;
    },
    fetchSystemPerformanceStart: (state) => {
      state.systemPerformance.loading = true;
      state.error = null;
    },
    fetchSystemPerformanceSuccess: (state, action: PayloadAction<Omit<AnalyticsState['systemPerformance'], 'loading'>>) => {
      state.systemPerformance = {
        ...action.payload,
        loading: false,
      };
    },
    fetchSystemPerformanceFailure: (state, action: PayloadAction<string>) => {
      state.systemPerformance.loading = false;
      state.error = action.payload;
    },
    fetchDetectionStatsStart: (state) => {
      state.detectionStats.loading = true;
      state.error = null;
    },
    fetchDetectionStatsSuccess: (state, action: PayloadAction<Omit<AnalyticsState['detectionStats'], 'loading'>>) => {
      state.detectionStats = {
        ...action.payload,
        loading: false,
      };
    },
    fetchDetectionStatsFailure: (state, action: PayloadAction<string>) => {
      state.detectionStats.loading = false;
      state.error = action.payload;
    },
    fetchGeographicDataStart: (state) => {
      state.geographicData.loading = true;
      state.error = null;
    },
    fetchGeographicDataSuccess: (state, action: PayloadAction<AnalyticsState['geographicData']['regions']>) => {
      state.geographicData.regions = action.payload;
      state.geographicData.loading = false;
    },
    fetchGeographicDataFailure: (state, action: PayloadAction<string>) => {
      state.geographicData.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setTimeRange,
  setCustomTimeRange,
  fetchThreatTrendsStart,
  fetchThreatTrendsSuccess,
  fetchThreatTrendsFailure,
  fetchSystemPerformanceStart,
  fetchSystemPerformanceSuccess,
  fetchSystemPerformanceFailure,
  fetchDetectionStatsStart,
  fetchDetectionStatsSuccess,
  fetchDetectionStatsFailure,
  fetchGeographicDataStart,
  fetchGeographicDataSuccess,
  fetchGeographicDataFailure,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
