import React, { useContext } from 'react';
import { Container, Typography, Grid, Paper, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ProgressContext } from '../context/ProgressContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']; // Colors for the Pie chart

const Dashboard = () => {
    const { analyticsData, loading, trackedProblems } = useContext(ProgressContext);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }

    // Prepare data for charts
    const difficultyData = [
        { name: 'Easy', count: analyticsData.difficultyCounts.Easy },
        { name: 'Medium', count: analyticsData.difficultyCounts.Medium },
        { name: 'Hard', count: analyticsData.difficultyCounts.Hard },
    ];

    const statusData = [
        { name: 'Solved', value: analyticsData.statusCounts.Solved },
        { name: 'Attempted', value: analyticsData.statusCounts.Attempted },
        { name: 'Not Attempted', value: analyticsData.statusCounts['Not Attempted'] },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Total Tracked</Typography>
                        <Typography variant="h4">{trackedProblems.length}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                     <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Problems Solved</Typography>
                        <Typography variant="h4">{analyticsData.statusCounts.Solved}</Typography>
                    </Paper>
                </Grid>

                {/* Difficulty Chart */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: 300 }}>
                        <Typography variant="h6">Problems by Difficulty</Typography>
                        <ResponsiveContainer>
                            <BarChart data={difficultyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Status Chart */}
                <Grid item xs={12} md={4}>
                     <Paper sx={{ p: 2, height: 300 }}>
                        <Typography variant="h6">Problem Status</Typography>
                         <ResponsiveContainer>
                            <PieChart>
                                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;