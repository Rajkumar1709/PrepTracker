import React from 'react';
import Lottie from 'lottie-react';
import { Box, Typography } from '@mui/material';
import animationData from '../assets/animation.json'; // Import your animation file

const LoadingScreen = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default', // Uses your theme's background color
                zIndex: 9999, // Ensures it's on top of everything
            }}
        >
            <Lottie 
                animationData={animationData} 
                style={{ width: 250, height: 250 }} // Adjust size as needed
            />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                Loading Your Prep...
            </Typography>
        </Box>
    );
};

export default LoadingScreen;