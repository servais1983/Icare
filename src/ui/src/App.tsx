import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App; 