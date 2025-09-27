// frontend/src/components/ProblemFormModal.js
// (This is also a new component for your project)

import React, { useState, useEffect, useContext } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const ProblemFormModal = ({ open, onClose, onSubmitSuccess, problemToEdit }) => {
    const { token } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '', platform: 'LeetCode', link: '', difficulty: 'Easy', status: 'Not Attempted',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (problemToEdit) {
            setFormData(problemToEdit);
        } else {
            setFormData({ title: '', platform: 'LeetCode', link: '', difficulty: 'Easy', status: 'Not Attempted' });
        }
    }, [problemToEdit, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

        try {
            if (problemToEdit) {
                await api.put(`/api/problems/${problemToEdit._id}`, formData, config);
            } else {
                await api.post('/api/problems', formData, config);
            }
            onSubmitSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{problemToEdit ? 'Edit Problem' : 'Add New Problem'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <TextField autoFocus margin="dense" name="title" label="Problem Title" type="text" fullWidth required value={formData.title} onChange={handleChange}/>
                    <TextField margin="dense" name="platform" label="Platform" type="text" fullWidth required value={formData.platform} onChange={handleChange}/>
                    <TextField margin="dense" name="link" label="Problem Link" type="url" fullWidth required value={formData.link} onChange={handleChange}/>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Difficulty</InputLabel>
                        <Select name="difficulty" value={formData.difficulty} label="Difficulty" onChange={handleChange}>
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select name="status" value={formData.status} label="Status" onChange={handleChange}>
                            <MenuItem value="Not Attempted">Not Attempted</MenuItem>
                            <MenuItem value="Attempted">Attempted</MenuItem>
                            <MenuItem value="Solved">Solved</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{problemToEdit ? 'Save Changes' : 'Add Problem'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProblemFormModal;