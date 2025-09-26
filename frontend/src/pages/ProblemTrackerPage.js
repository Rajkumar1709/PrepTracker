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
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddTaskIcon from '@mui/icons-material/AddTask';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ProgressContext } from '../context/ProgressContext';

// Helper function for styling difficulty chips
const getDifficultyChip = (level) => {
    switch (level) {
        case 'Easy': return <Chip label="Easy" color="success" size="small" />;
        case 'Medium': return <Chip label="Medium" color="warning" size="small" />;
        case 'Hard': return <Chip label="Hard" color="error" size="small" />;
        default: return <Chip label={level} size="small" />;
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
                platform: 'Varies',
                link: problem.link,
                difficulty: problem.level,
                status: 'Not Attempted'
            };
            const { data: newProblem } = await axios.post('/api/problems', problemData, config);
            addProblemToState(newProblem); // Instantly update the global state
            alert(`'${problem.name}' has been added to your tracked list!`);
        } catch (err) {
            alert('Failed to track problem. You may already be tracking it.');
            console.error(err);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Problem Browser
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
                                    <Card key={problem._id} variant="outlined">
                                        <CardContent>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h6" component="div">
                                                    {problem.name}
                                                </Typography>
                                                {getDifficultyChip(problem.level)}
                                            </Stack>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
                                            <Button
                                                variant="text"
                                                component={Link}
                                                href={problem.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Problem
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
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
        </Container>
    );
};

export default ProblemTrackerPage;