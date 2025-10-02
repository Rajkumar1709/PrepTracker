import React, { useContext } from 'react'; // Import useContext
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Contexts to check their loading status
import { AuthContext } from './context/AuthContext';
import { ProgressContext } from './context/ProgressContext';

// Import Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoadingScreen from './components/LoadingScreen'; // Import the new component

// Import Pages
import Dashboard from './pages/Dashboard';
import ProblemTrackerPage from './pages/ProblemTrackerPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyProblemsPage from './pages/MyProblemsPage';
import JobSearchPage from './pages/JobSearchPage';
import CompilerPage from './pages/CompilerPage';

function App() {
  // Get the loading status from your main contexts
  const { loading: authLoading } = useContext(AuthContext);
  const { loading: progressLoading } = useContext(ProgressContext);

  // The app is considered loading if either context is still loading data
  const isAppLoading = authLoading || progressLoading;

  // Show the loading screen until the app is ready
  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracker" element={<ProblemTrackerPage />} />
          <Route path="/my-problems" element={<MyProblemsPage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/compiler" element={<CompilerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;