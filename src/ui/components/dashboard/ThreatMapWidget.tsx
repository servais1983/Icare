import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface ThreatLocation {
  id: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high';
  type: string;
}

interface ThreatMapWidgetProps {
  threats: ThreatLocation[];
}

const ThreatMapWidget: React.FC<ThreatMapWidgetProps> = ({ threats }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Carte des Menaces
      </Typography>
      <Box sx={{ 
        height: 300, 
        bgcolor: 'grey.200', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 1
      }}>
        <Typography variant="body1" color="text.secondary">
          Carte interactive à implémenter
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {threats.length} menaces détectées
        </Typography>
      </Box>
    </Paper>
  );
};

export default ThreatMapWidget; 