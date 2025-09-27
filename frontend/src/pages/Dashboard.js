import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Paper, Box, CircularProgress, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// --- Reusable Chart Components ---

// Donut chart for Status Breakdown
const StatusPieChart = ({ data }) => {
    const theme = useTheme();
    const COLORS = [theme.palette.success.main, theme.palette.warning.main, theme.palette.grey[500]];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Bar chart for Difficulty Breakdown
const DifficultyBarChart = ({ data }) => {
    const theme = useTheme();
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="tracked" fill={theme.palette.grey[500]} name="Tracked" />
                <Bar dataKey="solved" fill={theme.palette.primary.main} name="Solved" />
            </BarChart>
        </ResponsiveContainer>
    );
};


// --- Main Dashboard Component ---

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

    // Filter out zero-value entries for the pie chart to prevent overlapping labels
    const statusChartData = analytics.statusCounts.filter(entry => entry.value > 0);

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome, {user?.name || 'User'}!
            </Typography>
            <Grid container spacing={3}>
                {/* KPI Cards */}
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h6" color="text.secondary">Total Problems Tracked</Typography>
                        <Typography variant="h3" component="div">{analytics.totalTracked}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h6" color="text.secondary">Total Problems Solved</Typography>
                        <Typography variant="h3" component="div" color="primary">{analytics.totalSolved}</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} sm={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h6" color="text.secondary">Solving Rate</Typography>
                        <Typography variant="h3" component="div">{analytics.totalTracked > 0 ? `${((analytics.totalSolved / analytics.totalTracked) * 100).toFixed(1)}%` : '0.0%'}</Typography>
                    </Paper>
                </Grid>

                {/* Status and Difficulty Charts */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2, height: 350 }}>
                        <Typography variant="h6" align="center" gutterBottom>Status Breakdown</Typography>
                        <StatusPieChart data={statusChartData} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 2, height: 350 }}>
                        <Typography variant="h6" align="center" gutterBottom>Difficulty Breakdown</Typography>
                        <DifficultyBarChart data={analytics.difficultyData} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;