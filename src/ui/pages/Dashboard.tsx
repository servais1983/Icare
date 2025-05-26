import React from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Components
import ThreatSummaryWidget from '../components/dashboard/ThreatSummaryWidget';
import SystemStatusWidget from '../components/dashboard/SystemStatusWidget';
import RecentEventsWidget from '../components/dashboard/RecentEventsWidget';
import ThreatMapWidget from '../components/dashboard/ThreatMapWidget';
import PerformanceWidget from '../components/dashboard/PerformanceWidget';
import SecurityScoreWidget from '../components/dashboard/SecurityScoreWidget';

// Hooks
import { useAppSelector } from '../hooks/reduxHooks';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.5,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
}));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { activeThreats } = useAppSelector(state => state.threat);
  const { dashboard } = useAppSelector(state => state.settings);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Tableau de bord ICARUS
            </Typography>
            <Box sx={{ 
              px: 2, 
              py: 1, 
              borderRadius: 2, 
              bgcolor: activeThreats > 0 ? 'threat.critical' : 'success.main',
              color: activeThreats > 0 ? 'white' : 'background.default'
            }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {activeThreats > 0 
                  ? `${activeThreats} menace${activeThreats > 1 ? 's' : ''} active${activeThreats > 1 ? 's' : ''}`
                  : 'Aucune menace active'}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Threat Summary Widget */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <StyledPaper>
                <ThreatSummaryWidget />
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* System Status Widget */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <StyledPaper>
                <SystemStatusWidget />
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Security Score Widget */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <StyledPaper>
                <SecurityScoreWidget />
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Threat Map Widget */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <StyledPaper sx={{ height: 500 }}>
                <ThreatMapWidget />
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Recent Events Widget */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <StyledPaper sx={{ height: 500 }}>
                <RecentEventsWidget />
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Performance Widget */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <StyledPaper>
                <PerformanceWidget />
              </StyledPaper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
