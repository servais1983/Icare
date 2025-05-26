import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, useTheme, Tab, Tabs, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';

// Actions
import {
  setTimeRange,
  fetchThreatTrendsStart,
  fetchThreatTrendsSuccess,
  fetchDetectionStatsStart,
  fetchDetectionStatsSuccess,
} from '../store/slices/analyticsSlice';

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

const Analytics: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { timeRange, threatTrends, detectionStats } = useAppSelector(state => state.analytics);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Fetch analytics data based on selected time range
    dispatch(fetchThreatTrendsStart());
    dispatch(fetchDetectionStatsStart());
    
    // Simulate API calls
    setTimeout(() => {
      const mockThreatTrendsData = generateMockThreatTrendsData();
      dispatch(fetchThreatTrendsSuccess(mockThreatTrendsData));
      
      const mockDetectionStats = generateMockDetectionStats();
      dispatch(fetchDetectionStatsSuccess(mockDetectionStats));
    }, 1000);
  }, [dispatch, timeRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (range: '1h' | '24h' | '7d' | '30d') => {
    dispatch(setTimeRange(range));
  };

  // Generate mock data for threat trends
  const generateMockThreatTrendsData = () => {
    const labels = [];
    const criticalData = [];
    const highData = [];
    const mediumData = [];
    const lowData = [];
    
    // Generate time labels based on selected time range
    let points = 0;
    let format = '';
    
    switch (timeRange) {
      case '1h':
        points = 12;
        format = 'HH:mm';
        for (let i = 0; i < points; i++) {
          const minute = i * 5;
          labels.push(`${Math.floor(minute / 60)}:${(minute % 60).toString().padStart(2, '0')}`);
        }
        break;
      case '24h':
        points = 24;
        format = 'HH:mm';
        for (let i = 0; i < points; i++) {
          labels.push(`${i}:00`);
        }
        break;
      case '7d':
        points = 7;
        format = 'ddd';
        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        for (let i = 0; i < points; i++) {
          labels.push(days[i]);
        }
        break;
      case '30d':
      default:
        points = 30;
        format = 'DD/MM';
        for (let i = 1; i <= points; i++) {
          labels.push(`${i}/${new Date().getMonth() + 1}`);
        }
        break;
    }
    
    // Generate random data for each severity level
    for (let i = 0; i < points; i++) {
      criticalData.push(Math.floor(Math.random() * 5));
      highData.push(Math.floor(Math.random() * 10) + 2);
      mediumData.push(Math.floor(Math.random() * 15) + 5);
      lowData.push(Math.floor(Math.random() * 20) + 10);
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Critique',
          data: criticalData,
          backgroundColor: theme.palette.threat.critical,
          borderColor: theme.palette.threat.critical,
        },
        {
          label: 'Élevé',
          data: highData,
          backgroundColor: theme.palette.threat.high,
          borderColor: theme.palette.threat.high,
        },
        {
          label: 'Moyen',
          data: mediumData,
          backgroundColor: theme.palette.threat.medium,
          borderColor: theme.palette.threat.medium,
        },
        {
          label: 'Faible',
          data: lowData,
          backgroundColor: theme.palette.threat.low,
          borderColor: theme.palette.threat.low,
        },
      ],
    };
  };

  // Generate mock data for detection stats
  const generateMockDetectionStats = () => {
    const totalDetections = Math.floor(Math.random() * 1000) + 500;
    const truePositives = Math.floor(totalDetections * (0.85 + Math.random() * 0.1));
    const falsePositives = totalDetections - truePositives;
    const accuracy = (truePositives / totalDetections) * 100;
    
    return {
      totalDetections,
      truePositives,
      falsePositives,
      accuracy,
    };
  };

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

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
        beginAtZero: true,
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
    },
  };

  // Prepare detection stats chart data
  const detectionChartData = {
    labels: ['Vrais Positifs', 'Faux Positifs'],
    datasets: [
      {
        data: [detectionStats.truePositives, detectionStats.falsePositives],
        backgroundColor: [theme.palette.success.main, theme.palette.error.main],
        borderColor: [theme.palette.success.dark, theme.palette.error.dark],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Analytique
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Analyse détaillée des menaces et performances du système
            </Typography>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Tendances des Menaces" />
              <Tab label="Statistiques de Détection" />
              <Tab label="Performance du Système" />
            </Tabs>
            
            <Box>
              <Button
                variant={timeRange === '1h' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleTimeRangeChange('1h')}
                sx={{ mr: 1 }}
              >
                1h
              </Button>
              <Button
                variant={timeRange === '24h' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleTimeRangeChange('24h')}
                sx={{ mr: 1 }}
              >
                24h
              </Button>
              <Button
                variant={timeRange === '7d' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleTimeRangeChange('7d')}
                sx={{ mr: 1 }}
              >
                7j
              </Button>
              <Button
                variant={timeRange === '30d' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleTimeRangeChange('30d')}
              >
                30j
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {/* Threat Trends Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <StyledPaper sx={{ height: 400 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Tendances des Menaces par Sévérité
                    </Typography>
                    {threatTrends.loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography>Chargement des données...</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ height: 'calc(100% - 40px)' }}>
                        <Line options={lineChartOptions} data={threatTrends.data} />
                      </Box>
                    )}
                  </StyledPaper>
                </motion.div>
              </Grid>
            </Grid>
          )}

          {/* Detection Stats Tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <StyledPaper sx={{ height: 400 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Précision de Détection
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 40px)' }}>
                      <Box sx={{ width: '60%', height: '100%' }}>
                        <Doughnut options={doughnutChartOptions} data={detectionChartData} />
                      </Box>
                    </Box>
                  </StyledPaper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <StyledPaper sx={{ height: 400 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Statistiques de Détection
                    </Typography>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Détections Totales
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {detectionStats.totalDetections}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Vrais Positifs
                        </Typography>
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          {detectionStats.truePositives}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Faux Positifs
                        </Typography>
                        <Typography variant="h5" color="error.main" fontWeight="bold">
                          {detectionStats.falsePositives}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Précision
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {detectionStats.accuracy.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                  </StyledPaper>
                </motion.div>
              </Grid>
            </Grid>
          )}

          {/* System Performance Tab */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <StyledPaper sx={{ height: 400 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Performance du Système
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', mt: 10 }}>
                      Données de performance en cours de chargement...
                    </Typography>
                  </StyledPaper>
                </motion.div>
              </Grid>
            </Grid>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default Analytics;
