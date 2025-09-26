import React, { useState, useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Switch,
    Stack,
    useTheme,
    useMediaQuery,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = () => {
    const { token, logout } = useContext(AuthContext);
    const { mode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to={token ? "/dashboard" : "/"} sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    PrepTrack
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                    {/* Theme Toggle Switch */}
                    <Brightness7Icon />
                    <Switch checked={mode === 'dark'} onChange={toggleTheme} color="default" />
                    <Brightness4Icon />

                    {token ? (
                        isMobile ? (
                            <>
                                <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                                    <MenuIcon />
                                </IconButton>
                                <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                                    <Box sx={{ width: 250 }} role="presentation">
                                        <List>
                                            <ListItemButton component={Link} to="/dashboard" onClick={() => setDrawerOpen(false)}>
                                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                                <ListItemText primary="Dashboard" />
                                            </ListItemButton>
                                            <ListItemButton component={Link} to="/tracker" onClick={() => setDrawerOpen(false)}>
                                                <ListItemIcon><ListAltIcon /></ListItemIcon>
                                                <ListItemText primary="Problem Tracker" />
                                            </ListItemButton>
                                            <ListItemButton onClick={() => { setDrawerOpen(false); handleLogout(); }}>
                                                <ListItemText primary="Logout" sx={{ textAlign: 'center' }}/>
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </Drawer>
                            </>
                        ) : (
                            <Box>
                                <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                                <Button color="inherit" component={Link} to="/tracker">Problem Tracker</Button>
                                <Button color="inherit" component={Link} to="/my-problems">My Problems</Button>
                                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                            </Box>
                        )
                    ) : (
                        <Box>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/signup">Signup</Button>
                        </Box>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;