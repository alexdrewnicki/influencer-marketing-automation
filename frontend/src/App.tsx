import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import pages (we'll create these next)
const Dashboard = () => <div>Dashboard</div>;  // Placeholder
const InfluencerList = () => <div>Influencers</div>;  // Placeholder
const ContentReview = () => <div>Content Review</div>;  // Placeholder

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/influencers" element={<InfluencerList />} />
          <Route path="/review" element={<ContentReview />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
