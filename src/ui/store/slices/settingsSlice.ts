import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    criticalOnly: boolean;
  };
  dashboard: {
    refreshInterval: number;
    defaultView: string;
    widgets: string[];
    compactMode: boolean;
  };
  security: {
    mfaEnabled: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
  };
  display: {
    animationsEnabled: boolean;
    highContrastMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    threatColorMode: 'standard' | 'colorblind' | 'monochrome';
  };
}

const initialState: SettingsState = {
  theme: 'dark',
  language: 'fr',
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    criticalOnly: false,
  },
  dashboard: {
    refreshInterval: 30,
    defaultView: 'overview',
    widgets: ['threatSummary', 'recentEvents', 'systemStatus', 'threatMap'],
    compactMode: false,
  },
  security: {
    mfaEnabled: false,
    sessionTimeout: 30,
    ipWhitelist: [],
  },
  display: {
    animationsEnabled: true,
    highContrastMode: false,
    fontSize: 'medium',
    threatColorMode: 'standard',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<SettingsState['theme']>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateDashboardSettings: (state, action: PayloadAction<Partial<SettingsState['dashboard']>>) => {
      state.dashboard = { ...state.dashboard, ...action.payload };
    },
    updateSecuritySettings: (state, action: PayloadAction<Partial<SettingsState['security']>>) => {
      state.security = { ...state.security, ...action.payload };
    },
    updateDisplaySettings: (state, action: PayloadAction<Partial<SettingsState['display']>>) => {
      state.display = { ...state.display, ...action.payload };
    },
    resetSettings: () => initialState,
  },
});

export const {
  setTheme,
  setLanguage,
  updateNotificationSettings,
  updateDashboardSettings,
  updateSecuritySettings,
  updateDisplaySettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
