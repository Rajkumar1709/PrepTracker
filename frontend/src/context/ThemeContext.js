import React, { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

// Create a context for the theme
export const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
    // State to hold the current theme mode ('light' or 'dark')
    // It reads the saved preference from localStorage or defaults to 'light'
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    // Function to toggle the theme
    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode); // Save preference
    };

    // Create the MUI theme object based on the current mode
    // useMemo ensures the theme is only recalculated when the mode changes
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};