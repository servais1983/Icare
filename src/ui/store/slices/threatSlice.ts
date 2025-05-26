import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Threat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  source: string;
  target: string;
  timestamp: string;
  status: 'active' | 'mitigated' | 'investigating' | 'resolved';
  description: string;
  details: Record<string, any>;
  confidence: number;
}

interface ThreatState {
  threats: Threat[];
  activeThreats: number;
  loading: boolean;
  error: string | null;
  selectedThreat: Threat | null;
  threatsByCategory: Record<string, number>;
  threatsBySeverity: Record<string, number>;
  threatsByStatus: Record<string, number>;
  threatMap: {
    nodes: any[];
    links: any[];
    loading: boolean;
  };
}

const initialState: ThreatState = {
  threats: [],
  activeThreats: 0,
  loading: false,
  error: null,
  selectedThreat: null,
  threatsByCategory: {},
  threatsBySeverity: {},
  threatsByStatus: {},
  threatMap: {
    nodes: [],
    links: [],
    loading: false,
  },
};

const threatSlice = createSlice({
  name: 'threat',
  initialState,
  reducers: {
    fetchThreatsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchThreatsSuccess: (state, action: PayloadAction<Threat[]>) => {
      state.threats = action.payload;
      state.loading = false;
      state.activeThreats = action.payload.filter(
        (threat) => threat.status === 'active'
      ).length;
      
      // Calculate threat statistics
      const byCategory: Record<string, number> = {};
      const bySeverity: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      
      action.payload.forEach((threat) => {
        // By category
        if (byCategory[threat.type]) {
          byCategory[threat.type]++;
        } else {
          byCategory[threat.type] = 1;
        }
        
        // By severity
        if (bySeverity[threat.severity]) {
          bySeverity[threat.severity]++;
        } else {
          bySeverity[threat.severity] = 1;
        }
        
        // By status
        if (byStatus[threat.status]) {
          byStatus[threat.status]++;
        } else {
          byStatus[threat.status] = 1;
        }
      });
      
      state.threatsByCategory = byCategory;
      state.threatsBySeverity = bySeverity;
      state.threatsByStatus = byStatus;
    },
    fetchThreatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectThreat: (state, action: PayloadAction<string>) => {
      state.selectedThreat = state.threats.find(
        (threat) => threat.id === action.payload
      ) || null;
    },
    clearSelectedThreat: (state) => {
      state.selectedThreat = null;
    },
    updateThreatStatus: (state, action: PayloadAction<{ id: string; status: Threat['status'] }>) => {
      const threatIndex = state.threats.findIndex(
        (threat) => threat.id === action.payload.id
      );
      
      if (threatIndex !== -1) {
        state.threats[threatIndex].status = action.payload.status;
        
        // Update active threats count
        state.activeThreats = state.threats.filter(
          (threat) => threat.status === 'active'
        ).length;
        
        // Update threat status statistics
        const byStatus: Record<string, number> = {};
        state.threats.forEach((threat) => {
          if (byStatus[threat.status]) {
            byStatus[threat.status]++;
          } else {
            byStatus[threat.status] = 1;
          }
        });
        state.threatsByStatus = byStatus;
        
        // Update selected threat if it's the one being modified
        if (state.selectedThreat && state.selectedThreat.id === action.payload.id) {
          state.selectedThreat.status = action.payload.status;
        }
      }
    },
    fetchThreatMapStart: (state) => {
      state.threatMap.loading = true;
    },
    fetchThreatMapSuccess: (state, action: PayloadAction<{ nodes: any[]; links: any[] }>) => {
      state.threatMap.nodes = action.payload.nodes;
      state.threatMap.links = action.payload.links;
      state.threatMap.loading = false;
    },
    fetchThreatMapFailure: (state) => {
      state.threatMap.loading = false;
    },
    addNewThreat: (state, action: PayloadAction<Threat>) => {
      state.threats.unshift(action.payload);
      
      // Update active threats count if the new threat is active
      if (action.payload.status === 'active') {
        state.activeThreats++;
      }
      
      // Update statistics
      // By category
      if (state.threatsByCategory[action.payload.type]) {
        state.threatsByCategory[action.payload.type]++;
      } else {
        state.threatsByCategory[action.payload.type] = 1;
      }
      
      // By severity
      if (state.threatsBySeverity[action.payload.severity]) {
        state.threatsBySeverity[action.payload.severity]++;
      } else {
        state.threatsBySeverity[action.payload.severity] = 1;
      }
      
      // By status
      if (state.threatsByStatus[action.payload.status]) {
        state.threatsByStatus[action.payload.status]++;
      } else {
        state.threatsByStatus[action.payload.status] = 1;
      }
    },
  },
});

export const {
  fetchThreatsStart,
  fetchThreatsSuccess,
  fetchThreatsFailure,
  selectThreat,
  clearSelectedThreat,
  updateThreatStatus,
  fetchThreatMapStart,
  fetchThreatMapSuccess,
  fetchThreatMapFailure,
  addNewThreat,
} = threatSlice.actions;

export default threatSlice.reducer;
