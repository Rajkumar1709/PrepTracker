import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
// Correctly import both providers from the context file
import { CustomThemeProvider, ThemeContext } from './context/ThemeContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ProgressProvider } from './context/ProgressContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

// This small component is needed to access the theme from our context
const AppWrapper = () => {
    const { theme } = React.useContext(ThemeContext);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
};

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
        <ProgressProvider> {/* Add the ProgressProvider here */}
          <AppWrapper />
        </ProgressProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);