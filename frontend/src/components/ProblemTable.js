import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Link, Chip, Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';

const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case 'Easy': return 'success';
        case 'Medium': return 'warning';
        case 'Hard': return 'error';
        default: return 'default';
    }
};

const ProblemTable = ({ problems, onEdit, onDelete, onTrackProblem, isMasterList = false }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="problem table">
                <TableHead>
                    <TableRow>
                        <TableCell>{isMasterList ? 'Name' : 'Title'}</TableCell>
                        <TableCell>{isMasterList ? 'Link' : 'Platform'}</TableCell>
                        <TableCell>Difficulty</TableCell>
                        {!isMasterList && <TableCell>Status</TableCell>}
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow key={problem._id || problem.name} hover>
                            <TableCell>{isMasterList ? problem.name : problem.title}</TableCell>
                            <TableCell>
                                <Link href={problem.link} target="_blank" rel="noopener noreferrer" underline="hover">
                                    {isMasterList ? 'View Problem' : problem.platform}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Chip label={isMasterList ? problem.level : problem.difficulty} color={getDifficultyColor(isMasterList ? problem.level : problem.difficulty)} size="small" />
                            </TableCell>
                            {!isMasterList && <TableCell>{problem.status}</TableCell>}
                            <TableCell>
                                {isMasterList ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddTaskIcon />}
                                        onClick={() => onTrackProblem(problem)}
                                    >
                                        Track
                                    </Button>
                                ) : (
                                    <Box>
                                        <IconButton onClick={() => onEdit(problem)} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => onDelete(problem._id)} color="error"><DeleteIcon /></IconButton>
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProblemTable;