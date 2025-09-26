import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    CircularProgress,
    LinearProgress,
    Divider
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token, user } = useContext(AuthContext);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get('/api/analytics', config);
                    setAnalytics(data);
                } catch (error) {
                    console.error("Failed to fetch analytics", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchAnalytics();
    }, [token]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }
    
    if (!analytics) {
        return <Typography sx={{ textAlign: 'center', mt: 4 }}>Could not load analytics data.</Typography>;
    }

    const { solvedStats, totalStats, categoryStats } = analytics;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {`Welcome, ${user?.name || 'User'}`}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Problems Solved</Typography>
                        <Box sx={{ position: 'relative', height: 200, width: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            {/* Background Tracks */}
                            <CircularProgress variant="determinate" value={100} size={200} thickness={2.5} sx={{ color: 'divider', position: 'absolute' }} />
                            <CircularProgress variant="determinate" value={100} size={160} thickness={2.5} sx={{ color: 'divider', position: 'absolute' }} />
                            <CircularProgress variant="determinate" value={100} size={120} thickness={2.5} sx={{ color: 'divider', position: 'absolute' }} />
                            
                            {/* Progress (Using direct HEX color codes to force the change) */}
                            <CircularProgress variant="determinate" value={totalStats.Easy > 0 ? (solvedStats.easy / totalStats.Easy) * 100 : 0} size={200} thickness={2.5} sx={{ color: '#2e7d32', position: 'absolute' }} />
                            <CircularProgress variant="determinate" value={totalStats.Medium > 0 ? (solvedStats.medium / totalStats.Medium) * 100 : 0} size={160} thickness={2.5} sx={{ color: '#ed6c02', position: 'absolute' }} />
                            <CircularProgress variant="determinate" value={totalStats.Hard > 0 ? (solvedStats.hard / totalStats.Hard) * 100 : 0} size={120} thickness={2.5} sx={{ color: '#d32f2f', position: 'absolute' }} />
                        </Box>
                        <Box sx={{ width: '100%', textAlign: 'left' }}>
                            <Typography>Easy: {solvedStats.easy} / {totalStats.easy}</Typography>
                            <Typography>Medium: {solvedStats.medium} / {totalStats.medium}</Typography>
                            <Typography>Hard: {solvedStats.hard} / {totalStats.hard}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                     <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Solved by Topic</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                            {Object.keys(categoryStats).length > 0 ? (
                                <Grid container spacing={2}>
                                    {Object.entries(categoryStats).map(([category, count]) => (
                                        <Grid item xs={12} sm={6} key={category}>
                                            <Box>
                                                <Typography variant="body1">{category}</Typography>
                                                <LinearProgress variant="determinate" value={(count / 5) * 100} sx={{ height: 8, borderRadius: 5 }}/>
                                                <Typography variant="caption" color="text.secondary">{`${count} solved`}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography sx={{ pt: 4, textAlign: 'center', color: 'text.secondary' }}>
                                    Your solved topics will appear here!
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;