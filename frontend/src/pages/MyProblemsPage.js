import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Link, Chip, Grid, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProgressContext } from '../context/ProgressContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';

// Helper function for styling difficulty chips
const getDifficultyChip = (difficulty) => {
    switch (difficulty) {
        case 'Easy': return <Chip label="Easy" color="success" size="small" />;
        case 'Medium': return <Chip label="Medium" color="warning" size="small" />;
        case 'Hard': return <Chip label="Hard" color="error" size="small" />;
        default: return <Chip label={difficulty} size="small" />;
    }
};

// Helper function for styling status chips
const getStatusChip = (status) => {
    switch (status) {
        case 'Solved': return <Chip label="Solved" color="success" variant="outlined" size="small" />;
        case 'Attempted': return <Chip label="Attempted" color="warning" variant="outlined" size="small" />;
        default: return <Chip label="Not Attempted" color="default" variant="outlined" size="small" />;
    }
};

const MyProblemsPage = () => {
    const { trackedProblems, updateProblemStatus, removeProblemFromState } = useContext(ProgressContext);
    const { token } = useContext(AuthContext);

    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [allCategories, setAllCategories] = useState(['All']);

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const { data } = await api.get('/api/master-problems/categories');
                setAllCategories(['All', ...data.sort()]);
            } catch (error) {
                console.error("Failed to fetch all categories", error);
            }
        };
        fetchAllCategories();
    }, []);

    const filteredProblems = useMemo(() => {
        return trackedProblems
            .filter(p => statusFilter === 'All' || p.status === statusFilter)
            .filter(p => difficultyFilter === 'All' || p.difficulty === difficultyFilter)
            .filter(p => categoryFilter === 'All' || p.category === categoryFilter);
    }, [trackedProblems, statusFilter, difficultyFilter, categoryFilter]);

    const handleCheckboxChange = async (problem, isChecked) => {
        const newStatus = isChecked ? 'Solved' : 'Not Attempted';
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put(`/api/problems/${problem._id}`, { status: newStatus }, config);
            updateProblemStatus(problem._id, newStatus);
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Could not update status.');
        }
    };

    const handleUntrack = async (problemId) => {
        if (window.confirm('Are you sure you want to untrack this problem?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await api.delete(`/api/problems/${problemId}`, config);
                removeProblemFromState(problemId);
            } catch (error) {
                console.error('Failed to untrack problem', error);
                alert('Could not untrack problem.');
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>My Tracked Problems</Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Difficulty</InputLabel>
                            <Select value={difficultyFilter} label="Difficulty" onChange={(e) => setDifficultyFilter(e.target.value)}>
                                <MenuItem value="All">All Difficulties</MenuItem>
                                <MenuItem value="Easy">Easy</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Hard">Hard</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                                {allCategories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                                <MenuItem value="All">All Statuses</MenuItem>
                                <MenuItem value="Solved">Solved</MenuItem>
                                <MenuItem value="Attempted">Attempted</MenuItem>
                                <MenuItem value="Not Attempted">Not Attempted</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '5%' }}>Done</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Link</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProblems.map((problem) => (
                            <TableRow key={problem._id} hover>
                                <TableCell>
                                    <Checkbox checked={problem.status === 'Solved'} onChange={(e) => handleCheckboxChange(problem, e.target.checked)} color="success"/>
                                </TableCell>
                                <TableCell>{problem.title}</TableCell>
                                <TableCell>{problem.category}</TableCell>
                                <TableCell>{getDifficultyChip(problem.difficulty)}</TableCell>
                                <TableCell>{getStatusChip(problem.status)}</TableCell>
                                <TableCell>
                                    <Link href={problem.link} target="_blank" rel="noopener noreferrer">View</Link>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleUntrack(problem._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default MyProblemsPage;