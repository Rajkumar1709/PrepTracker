// frontend/src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = () => {
    const { token, loading } = useContext(AuthContext);

    if (loading) {
        // Show a loading spinner while checking for token
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    }

    // If done loading, check for token. If present, render the child route (Outlet).
    // Otherwise, redirect to the login page.
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;