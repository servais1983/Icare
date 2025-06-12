import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';

interface SystemStatusWidgetProps {
  status: string;
  health: number;
  lastUpdate: string;
}

const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({ status, health, lastUpdate }) => {
  const isHealthy = health >= 80;
  const getStatusColor = () => {
    if (health >= 80) return 'success';
    if (health >= 50) return 'warning';
    return 'error';
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {isHealthy ? (
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
        ) : (
          <ErrorIcon color="error" sx={{ mr: 1 }} />
        )}
        <Typography variant="h6">
          État du Système
        </Typography>
      </Box>
      
      <Typography variant="body1" gutterBottom>
        Statut: {status}
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Santé du Système
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={health} 
          color={getStatusColor() as any}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Dernière mise à jour: {new Date(lastUpdate).toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SystemStatusWidget; 