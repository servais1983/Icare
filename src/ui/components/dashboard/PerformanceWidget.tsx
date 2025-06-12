import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';

interface PerformanceMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
}

interface PerformanceWidgetProps {
  metrics: PerformanceMetric[];
}

const PerformanceWidget: React.FC<PerformanceWidgetProps> = ({ metrics }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Performances du Système
      </Typography>
      <Box sx={{ mt: 2 }}>
        {metrics.map((metric) => (
          <Box key={metric.name} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {metric.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metric.value} / {metric.max} {metric.unit}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(metric.value / metric.max) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PerformanceWidget; 