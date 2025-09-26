import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const [trackedProblems, setTrackedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    // Fetch all of the user's tracked problems when they log in
    useEffect(() => {
        const fetchTrackedProblems = async () => {
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get('/api/problems', config);
                    setTrackedProblems(data);
                } catch (error) {
                    console.error("Failed to fetch tracked problems", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // If there's no token, clear problems and stop loading
                setTrackedProblems([]);
                setLoading(false);
            }
        };
        fetchTrackedProblems();
    }, [token]);

    // This function adds a new problem to our global state instantly
    const addProblemToState = (newProblem) => {
        setTrackedProblems(prevProblems => [...prevProblems, newProblem]);
    };

    // Calculate analytics data. useMemo ensures this only runs when problems change.
    const analyticsData = useMemo(() => {
        const statusCounts = { 'Solved': 0, 'Attempted': 0, 'Not Attempted': 0 };
        const difficultyCounts = { 'Easy': 0, 'Medium': 0, 'Hard': 0 };

        for (const problem of trackedProblems) {
            if (problem.status) statusCounts[problem.status]++;
            if (problem.difficulty) difficultyCounts[problem.difficulty]++;
        }
        
        return { statusCounts, difficultyCounts };
    }, [trackedProblems]);


    const value = {
        trackedProblems,
        analyticsData,
        loading,
        addProblemToState,
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};