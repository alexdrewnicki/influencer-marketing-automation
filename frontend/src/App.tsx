import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InfluencerList from './components/InfluencerList';
import ContentReview from './components/ContentReview';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/influencers" element={<InfluencerList />} />
            <Route path="/review" element={<ContentReview />} />
            <Route path="/analytics" element={<div>Analytics Coming Soon</div>} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import { AppProvider } from './context/AppContext';
import Notifications from './components/Notifications';

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Notifications />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/influencers" element={<InfluencerList />} />
              <Route path="/review" element={<ContentReview />} />
              <Route path="/analytics" element={<div>Analytics Coming Soon</div>} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Notifications />
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/influencers" element={<InfluencerList />} />
                        <Route path="/review" element={<ContentReview />} />
                        <Route path="/analytics" element={<div>Analytics Coming Soon</div>} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              {/* ... rest of your routes ... */}
            </Router>
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
