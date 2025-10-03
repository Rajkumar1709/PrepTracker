import React, { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

// Create a context for the theme
export const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    const theme = useMemo(() => {
        // Define a custom palette for the light theme
        const lightThemeOptions = {
            palette: {
                mode: 'light',
                primary: {
                    main: '#1976d2', // Default blue
                },
                secondary: {
                    main: '#dc004e', // A contrasting pink/red
                },
                background: {
                    default: '#f4f6f8', // A slightly grey background
                    paper: '#ffffff',   // White for cards and surfaces
                },
            },
        };

        // Define options for the dark theme (can be customized too)
        const darkThemeOptions = {
            palette: {
                mode: 'dark',
                primary: {
                    main: '#90caf9', // Lighter blue for dark mode
                },
                secondary: {
                    main: '#f48fb1', // Lighter pink for dark mode
                },
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                },
            },
        };

        // Create the theme based on the current mode
        return createTheme(mode === 'light' ? lightThemeOptions : darkThemeOptions);
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};