import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, IconButton, InputAdornment } from '@mui/material';
import api from '../api/axiosConfig'; // Use the configured api object
import { AuthContext } from '../context/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/users/register', formData);
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign Up</Typography>
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        id="name" 
                        label="Name" 
                        name="name" 
                        autoComplete="name" 
                        autoFocus 
                        onChange={handleChange} 
                    />
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        id="email" 
                        label="Email Address" 
                        name="email" 
                        autoComplete="email" 
                        onChange={handleChange} 
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
                    <Link to="/login" variant="body2">
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default SignupPage;