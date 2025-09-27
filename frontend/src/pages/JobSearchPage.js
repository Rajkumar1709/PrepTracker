import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Box,
    CircularProgress,
    Card,
    CardHeader,
    CardContent,
    Link,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Chip,
    Stack,
    Pagination
} from '@mui/material'; // REMOVED 'Alert' from this line
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JOB_TITLES = ['All Titles', 'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist'];
const LOCATIONS = ['All Locations', 'Hyderabad, India', 'Bengaluru, India', 'Pune, India', 'Remote'];

// Helper function to format dates nicely
const formatDateAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return 'Just now';
};

const JobSearchPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    // REMOVED: The 'error' state was not being used for display.
    // const [error, setError] = useState('');
    
    const [searchQuery, setSearchQuery] = useState(JOB_TITLES[0]);
    const [location, setLocation] = useState(LOCATIONS[0]);
    const [datePosted, setDatePosted] = useState('all');
    const [page, setPage] = useState(1);

    const { token } = useContext(AuthContext);

    const fetchJobs = useCallback(async (currentPage) => {
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: { searchQuery, location, date_posted: datePosted, page: currentPage }
            };
            const { data } = await axios.get('/api/jobs', config);
            setJobs(data || []);
        } catch (err) {
            // We log the error, but don't need to set an error state for now.
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, searchQuery, location, datePosted]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1);
            fetchJobs(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery, location, datePosted, fetchJobs]);

    const handlePageChange = (event, value) => {
        setPage(value);
        fetchJobs(value);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" gutterBottom>Find Your Next Job</Typography>
                <Box>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Job Title</InputLabel>
                                <Select value={searchQuery} label="Job Title" onChange={(e) => setSearchQuery(e.target.value)}>
                                    {JOB_TITLES.map(title => <MenuItem key={title} value={title}>{title}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                             <FormControl fullWidth>
                                <InputLabel>Location</InputLabel>
                                <Select value={location} label="Location" onChange={(e) => setLocation(e.target.value)}>
                                    {LOCATIONS.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl>
                                <FormLabel>Date Posted</FormLabel>
                                <RadioGroup row value={datePosted} onChange={(e) => setDatePosted(e.target.value)}>
                                    <FormControlLabel value="all" control={<Radio />} label="All Time" />
                                    <FormControlLabel value="today" control={<Radio />} label="Today" />
                                    <FormControlLabel value="3days" control={<Radio />} label="3 Days" />
                                    <FormControlLabel value="week" control={<Radio />} label="Week" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {jobs.map((job) => (
                            <Grid item xs={12} sm={6} md={4} key={job.job_id}>
                                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardHeader
                                        avatar={<Avatar src={job.employer_logo} variant="rounded">{job.employer_name?.charAt(0)}</Avatar>}
                                        title={job.job_title}
                                        subheader={`${job.employer_name} • ${job.job_city}`}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                            {job.job_type && <Chip label={job.job_type.replace('_', ' ')} size="small" />}
                                            {job.job_category && <Chip label={job.job_category} size="small" />}
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxHeight: 80, overflow: 'hidden' }}>
                                            {job.job_description?.substring(0, 150)}...
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDateAgo(job.job_posted_at_datetime_utc)}
                                        </Typography>
                                        <Button variant="contained" component={Link} href={job.job_apply_link} target="_blank">Apply Now</Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination 
                            count={25}
                            page={page} 
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton 
                            showLastButton
                            disabled={loading}
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default JobSearchPage;