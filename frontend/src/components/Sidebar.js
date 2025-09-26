// frontend/src/components/Sidebar.js
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt'; // Import a new icon

// ... inside your Sidebar component's return
<List>
  <ListItem button component={Link} to="/dashboard">
    <ListItemIcon><DashboardIcon /></ListItemIcon>
    <ListItemText primary="Dashboard" />
  </ListItem>

  {/* ADD THIS LIST ITEM */}
  <ListItem button component={Link} to="/tracker">
    <ListItemIcon><ListAltIcon /></ListItemIcon>
    <ListItemText primary="Problem Tracker" />
  </ListItem>

  {/* ... any other list items */}
</List>