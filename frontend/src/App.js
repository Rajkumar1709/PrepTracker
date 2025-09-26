// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Import Pages
import Dashboard from './pages/Dashboard';
import ProblemTrackerPage from './pages/ProblemTrackerPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Add a default route, maybe redirects to login or a landing page */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<ProblemTrackerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;