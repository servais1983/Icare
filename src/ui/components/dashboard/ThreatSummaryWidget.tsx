import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Warning as WarningIcon, Error as ErrorIcon, Info as InfoIcon } from '@mui/icons-material';

interface Threat {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

interface ThreatSummaryWidgetProps {
  threats: Threat[];
}

const ThreatSummaryWidget: React.FC<ThreatSummaryWidgetProps> = ({ threats }) => {
  const getIcon = (type: Threat['type']) => {
    switch (type) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Résumé des Menaces
      </Typography>
      <List>
        {threats.map((threat) => (
          <ListItem key={threat.id}>
            <ListItemIcon>{getIcon(threat.type)}</ListItemIcon>
            <ListItemText
              primary={threat.message}
              secondary={new Date(threat.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ThreatSummaryWidget; 