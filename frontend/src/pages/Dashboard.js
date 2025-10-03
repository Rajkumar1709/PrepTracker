import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Paper, Box, CircularProgress, useTheme, Card, CardContent, CardActions, Button, Chip, Link, Stack } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ProgressContext } from '../context/ProgressContext';

// --- Reusable Chart Components (No Changes) ---
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

const DifficultyBarChart = ({ data }) => {
    const theme = useTheme();
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="tracked" fill={theme.palette.text.secondary} name="Tracked" />
                <Bar dataKey="solved" fill={theme.palette.primary.main} name="Solved" />
            </BarChart>
        </ResponsiveContainer>
    );
};

// --- Helper for difficulty chips (No Changes) ---
const getDifficultyChip = (level) => {
    switch (level) {
        case 'Easy': return <Chip label="Easy" color="success" size="small" />;
        case 'Medium': return <Chip label="Medium" color="warning" size="small" />;
        case 'Hard': return <Chip label="Hard" color="error" size="small" />;
        default: return <Chip label={level} size="small" />;
    }
};

// --- Main Dashboard Component ---

const Dashboard = () => {
    const { token, user } = useContext(AuthContext);
    // SIMPLIFIED: Get all necessary data and loading state directly from the ProgressContext
    const { analyticsData, loading: progressLoading, trackProblem, trackedProblems } = useContext(ProgressContext);

    // This state is only for the daily challenge, which is fetched separately
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [challengeLoading, setChallengeLoading] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await api.get('/api/daily-challenge', config);
                    setDailyChallenge(data);
                } catch (error) {
                    console.error("Failed to fetch daily challenge", error);
                } finally {
                    setChallengeLoading(false);
                }
            } else {
                setChallengeLoading(false);
            }
        };
        fetchChallenge();
    }, [token]);

    // SIMPLIFIED: The main loading state now correctly depends on both fetches
    if (progressLoading || challengeLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }
    
    // The '!analyticsData' check is now more robust
    if (!analyticsData || !analyticsData.statusCounts || !analyticsData.difficultyData) {
        return <Typography sx={{ textAlign: 'center', mt: 4 }}>Could not load analytics data.</Typography>;
    }
    
    const statusChartData = analyticsData.statusCounts.filter(entry => entry.value > 0);
    const isChallengeTracked = dailyChallenge && trackedProblems.some(p => p.title === dailyChallenge.name);

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>Welcome, {user?.name || 'User'}!</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, borderColor: 'primary.main', borderWidth: 1, borderStyle: 'dashed' }}>
                        <Typography variant="h6">Today's Challenge</Typography>
                        {dailyChallenge ? (
                            <Card elevation={0} sx={{ mt: 1 }}>
                                <CardContent>
                                     <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h5" component="div">{dailyChallenge.name}</Typography>
                                        {getDifficultyChip(dailyChallenge.level)}
                                     </Stack>
                                    <Typography color="text.secondary">{dailyChallenge.category}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" component={Link} href={dailyChallenge.link} target="_blank">View Problem</Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={async () => {
                                            const result = await trackProblem(dailyChallenge, token);
                                            alert(result.message);
                                        }}
                                        disabled={isChallengeTracked}
                                        sx={isChallengeTracked ? { backgroundColor: 'info.light' } : {}}
                                    >
                                        {isChallengeTracked ? 'Tracked' : 'Track'}
                                    </Button>
                                </CardActions>
                            </Card>
                        ) : <Typography sx={{ mt: 2 }}>No challenge available today. Check back tomorrow!</Typography>}
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h6" color="text.secondary">Total Problems Tracked</Typography>
                        <Typography variant="h3" component="div">{analyticsData.totalTracked}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h6" color="text.secondary">Total Problems Solved</Typography>
                        <Typography variant="h3" component="div" color="primary">{analyticsData.totalSolved}</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} sm={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                        <Typography variant="h6" color="text.secondary">Solving Rate</Typography>
                        <Typography variant="h3" component="div">{analyticsData.totalTracked > 0 ? `${((analyticsData.totalSolved / analyticsData.totalTracked) * 100).toFixed(1)}%` : '0.0%'}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2, height: 350 }}>
                        <Typography variant="h6" align="center" gutterBottom>Status Breakdown</Typography>
                        <StatusPieChart data={statusChartData} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 2, height: 350 }}>
                        <Typography variant="h6" align="center" gutterBottom>Difficulty Breakdown</Typography>
                        <DifficultyBarChart data={analyticsData.difficultyData} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;