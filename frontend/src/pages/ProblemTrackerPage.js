import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Grid,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Link,
    Stack,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider,
    Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddTaskIcon from '@mui/icons-material/AddTask';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ProgressContext } from '../context/ProgressContext';

// Helper for difficulty chips
const getDifficultyChip = (level) => {
    switch (level) {
        case 'Easy': return <Chip label="Easy" color="success" size="small" />;
        case 'Medium': return <Chip label="Medium" color="warning" size="small" />;
        case 'Hard': return <Chip label="Hard" color="error" size="small" />;
        default: return <Chip label={level} size="small" />;
    }
};

// Helper to get the platform name from a URL
const getPlatformFromUrl = (url) => {
    try {
        const hostname = new URL(url).hostname;
        if (hostname.includes('leetcode')) return 'LeetCode';
        if (hostname.includes('geeksforgeeks')) return 'GeeksforGeeks';
        if (hostname.includes('hackerrank')) return 'HackerRank';
        if (hostname.includes('interviewbit')) return 'InterviewBit';
        return hostname;
    } catch (e) {
        return 'Unknown';
    }
};

const ProblemTrackerPage = () => {
    const [categories, setCategories] = useState([]);
    const [masterProblems, setMasterProblems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useContext(AuthContext);
    const { addProblemToState } = useContext(ProgressContext);

    const [difficultyFilter, setDifficultyFilter] = useState({
        Easy: true,
        Medium: true,
        Hard: true,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/master-problems/categories');
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategory(data[0]);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setError('Failed to load problem categories.');
                setLoading(false);
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchMasterProblems = async () => {
            if (!selectedCategory) return;
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/master-problems?category=${selectedCategory}`);
                setMasterProblems(data);
                setError('');
            } catch (err) {
                setError('Failed to fetch problems.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMasterProblems();
    }, [selectedCategory]);

    const filteredProblems = useMemo(() =>
        masterProblems
            .filter(problem => difficultyFilter[problem.level])
            .filter(problem => problem.name.toLowerCase().includes(searchTerm.toLowerCase()))
        , [masterProblems, searchTerm, difficultyFilter]);

    const handleDifficultyChange = (event) => {
        setDifficultyFilter({
            ...difficultyFilter,
            [event.target.name]: event.target.checked,
        });
    };

    const handleTrackProblem = async (problem) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const problemData = {
                title: problem.name,
                platform: getPlatformFromUrl(problem.link),
                link: problem.link,
                category: problem.category,
                difficulty: problem.level,
                status: 'Not Attempted'
            };
            const { data: newProblem } = await axios.post('/api/problems', problemData, config);
            addProblemToState(newProblem);
            setSnackbar({ open: true, message: `'${problem.name}' was added to your list!`, severity: 'success' });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to track problem.';
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            console.error(err);
        }
    };
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                DSA Problems for Placement Preparation
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 2, position: 'sticky', top: '80px' }}>
                        <TextField
                            fullWidth
                            label="Search Problems"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                            }}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>Difficulty</Typography>
                        <FormGroup sx={{ mb: 2 }}>
                            <FormControlLabel control={<Checkbox checked={difficultyFilter.Easy} onChange={handleDifficultyChange} name="Easy" />} label="Easy" />
                            <FormControlLabel control={<Checkbox checked={difficultyFilter.Medium} onChange={handleDifficultyChange} name="Medium" />} label="Medium" />
                            <FormControlLabel control={<Checkbox checked={difficultyFilter.Hard} onChange={handleDifficultyChange} name="Hard" />} label="Hard" />
                        </FormGroup>
                        <Divider sx={{ mb: 2 }}/>
                        <Typography variant="h6" gutterBottom>Topics</Typography>
                        <List component="nav" sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
                            {categories.map(category => (
                                <ListItemButton
                                    key={category}
                                    selected={selectedCategory === category}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    <ListItemText primary={category} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress size={60} /></Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <Stack spacing={2}>
                            {filteredProblems.length > 0 ? (
                                filteredProblems.map(problem => (
                                    <Card 
                                        key={problem._id} 
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 3,
                                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ pb: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {getPlatformFromUrl(problem.link)}
                                                    </Typography>
                                                    <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                                                        {problem.name}
                                                    </Typography>
                                                </Box>
                                                {getDifficultyChip(problem.level)}
                                            </Stack>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                                            <Button
                                                variant="text"
                                                component={Link}
                                                href={problem.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<OpenInNewIcon />}
                                            >
                                                View Problem
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddTaskIcon />}
                                                onClick={() => handleTrackProblem(problem)}
                                            >
                                                Track
                                            </Button>
                                        </CardActions>
                                    </Card>
                                ))
                            ) : (
                                <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                                    No problems found for the selected filters.
                                </Typography>
                            )}
                        </Stack>
                    )}
                </Grid>
            </Grid>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProblemTrackerPage;