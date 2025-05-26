import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { ForceGraph3D } from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';

// Actions
import { fetchThreatMapStart, fetchThreatMapSuccess, fetchThreatMapFailure } from '../store/slices/threatSlice';

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

const ThreatMap: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { threatMap } = useAppSelector(state => state.threat);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const graphRef = React.useRef();

  useEffect(() => {
    dispatch(fetchThreatMapStart());
    
    // Simulate API call to fetch threat map data
    setTimeout(() => {
      const mockData = generateMockThreatMapData();
      dispatch(fetchThreatMapSuccess(mockData));
      setGraphData(mockData);
    }, 1500);
    
    // Set dimensions
    setDimensions({
      width: window.innerWidth - 64, // Accounting for padding
      height: window.innerHeight - 200, // Accounting for header and padding
    });
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth - 64,
        height: window.innerHeight - 200,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Generate mock data for the threat map
  const generateMockThreatMapData = () => {
    const nodes = [];
    const links = [];
    
    // Create nodes for protected assets
    const assetTypes = ['Server', 'Database', 'Firewall', 'Router', 'Endpoint', 'Cloud'];
    const assetCount = 15;
    
    for (let i = 0; i < assetCount; i++) {
      const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
      nodes.push({
        id: `asset-${i}`,
        name: `${type}-${i}`,
        type: 'asset',
        assetType: type,
        value: Math.random() * 20 + 10,
        color: theme.palette.info.main,
      });
    }
    
    // Create nodes for threats
    const threatTypes = ['Malware', 'DDoS', 'Phishing', 'Intrusion', 'DataLeak', 'Ransomware'];
    const threatCount = 8;
    const threatSeverities = ['critical', 'high', 'medium', 'low'];
    
    for (let i = 0; i < threatCount; i++) {
      const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const severity = threatSeverities[Math.floor(Math.random() * threatSeverities.length)];
      let color;
      
      switch (severity) {
        case 'critical':
          color = theme.palette.threat.critical;
          break;
        case 'high':
          color = theme.palette.threat.high;
          break;
        case 'medium':
          color = theme.palette.threat.medium;
          break;
        case 'low':
          color = theme.palette.threat.low;
          break;
        default:
          color = theme.palette.threat.info;
      }
      
      nodes.push({
        id: `threat-${i}`,
        name: `${type}-${i}`,
        type: 'threat',
        threatType: type,
        severity,
        value: Math.random() * 15 + 5,
        color,
      });
      
      // Connect threats to random assets
      const targetAssets = Math.floor(Math.random() * 3) + 1; // 1-3 targets per threat
      const usedTargets = new Set();
      
      for (let j = 0; j < targetAssets; j++) {
        let targetIndex;
        do {
          targetIndex = Math.floor(Math.random() * assetCount);
        } while (usedTargets.has(targetIndex));
        
        usedTargets.add(targetIndex);
        
        links.push({
          source: `threat-${i}`,
          target: `asset-${targetIndex}`,
          value: Math.random() * 5 + 1,
          color,
        });
      }
    }
    
    // Create connections between assets (network topology)
    for (let i = 0; i < assetCount - 1; i++) {
      links.push({
        source: `asset-${i}`,
        target: `asset-${(i + 1) % assetCount}`,
        value: 1,
        color: theme.palette.primary.main,
      });
      
      // Add some random connections for more realistic network
      if (Math.random() > 0.7) {
        const randomTarget = Math.floor(Math.random() * assetCount);
        if (randomTarget !== i) {
          links.push({
            source: `asset-${i}`,
            target: `asset-${randomTarget}`,
            value: 1,
            color: theme.palette.primary.main,
          });
        }
      }
    }
    
    return { nodes, links };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Carte des Menaces
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Visualisation 3D en temps réel des menaces et de leur impact sur l'infrastructure
          </Typography>
        </Box>

        <StyledPaper sx={{ height: dimensions.height }}>
          {threatMap.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h6">Chargement de la carte des menaces...</Typography>
            </Box>
          ) : (
            <ForceGraph3D
              ref={graphRef}
              graphData={graphData}
              width={dimensions.width - 48} // Account for paper padding
              height={dimensions.height - 48}
              backgroundColor={theme.palette.background.default}
              nodeLabel="name"
              nodeColor={node => node.color}
              nodeVal={node => node.value}
              linkWidth={link => link.value}
              linkColor={link => link.color}
              nodeThreeObject={node => {
                const sprite = new SpriteText(node.name);
                sprite.color = node.color;
                sprite.textHeight = 8;
                sprite.position.y = node.value / 2 + 10;
                return sprite;
              }}
              nodeThreeObjectExtend={true}
              enableNodeDrag={false}
              enableNavigationControls={true}
              showNavInfo={false}
              cameraDistance={250}
            />
          )}
        </StyledPaper>
      </motion.div>
    </Box>
  );
};

export default ThreatMap;
