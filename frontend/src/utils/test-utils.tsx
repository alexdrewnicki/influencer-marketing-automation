import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AppProvider } from '../context/AppContext';
import { AuthProvider } from '../context/AuthContext';
import theme from '../theme';

function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return rtlRender(
    <AuthProvider>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            {ui}
          </BrowserRouter>
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  );
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
