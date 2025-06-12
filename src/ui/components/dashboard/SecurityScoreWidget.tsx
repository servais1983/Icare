import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

interface SecurityScoreWidgetProps {
  score: number;
  lastUpdate: string;
  recommendations: string[];
}

const SecurityScoreWidget: React.FC<SecurityScoreWidgetProps> = ({ score, lastUpdate, recommendations }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Score de Sécurité
      </Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
        <CircularProgress
          variant="determinate"
          value={score}
          size={120}
          thickness={4}
          color={getScoreColor(score) as any}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" component="div" color="text.secondary">
            {score}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Dernière mise à jour: {new Date(lastUpdate).toLocaleString()}
      </Typography>
      {recommendations.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recommandations:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {recommendations.map((rec, index) => (
              <li key={index}>
                <Typography variant="body2" color="text.secondary">
                  {rec}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Paper>
  );
};

export default SecurityScoreWidget; 