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
    ListItemText,
    Divider
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code'; // Import new icon
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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

    // Add the new Compiler link to this array
    const navLinks = [
        { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        { text: 'Problem Browser', path: '/tracker', icon: <ListAltIcon /> },
        { text: 'My Problems', path: '/my-problems', icon: <AccountCircleIcon /> },
        { text: 'Compiler', path: '/compiler', icon: <CodeIcon /> }, // New link
        { text: 'Jobs', path: '/jobs', icon: <WorkIcon /> }
    ];

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to={token ? "/dashboard" : "/"} sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    PrepTracker
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
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
                                            {navLinks.map((link) => (
                                                <ListItemButton key={link.text} component={Link} to={link.path} onClick={() => setDrawerOpen(false)}>
                                                    <ListItemIcon>{link.icon}</ListItemIcon>
                                                    <ListItemText primary={link.text} />
                                                </ListItemButton>
                                            ))}
                                            <Divider />
                                            <ListItemButton onClick={() => { setDrawerOpen(false); handleLogout(); }}>
                                                <ListItemText primary="Logout" sx={{ textAlign: 'center' }}/>
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                </Drawer>
                            </>
                        ) : (
                            <Box>
                                {navLinks.map((link) => (
                                    <Button key={link.text} color="inherit" component={Link} to={link.path}>
                                        {link.text}
                                    </Button>
                                ))}
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