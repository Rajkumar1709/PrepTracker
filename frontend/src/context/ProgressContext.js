import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const [trackedProblems, setTrackedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchTrackedProblems = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get('/api/problems', config);
                    setTrackedProblems(data);
                } catch (error) {
                    console.error("Failed to fetch tracked problems", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setTrackedProblems([]);
                setLoading(false);
            }
        };
        fetchTrackedProblems();
    }, [token]);

    const addProblemToState = (newProblem) => {
        setTrackedProblems(prevProblems => [...prevProblems, newProblem]);
    };

    const updateProblemStatus = (problemId, newStatus) => {
        setTrackedProblems(prevProblems =>
            prevProblems.map(p =>
                p._id === problemId ? { ...p, status: newStatus } : p
            )
        );
    };

    const analyticsData = useMemo(() => {
        const statusCounts = { 'Solved': 0, 'Attempted': 0, 'Not Attempted': 0 };
        const difficultyCounts = { 'Easy': 0, 'Medium': 0, 'Hard': 0 };

        for (const problem of trackedProblems) {
            if (problem.status) statusCounts[problem.status]++;

            // Only count difficulty if the problem is SOLVED
            if (problem.status === 'Solved') {
                if (problem.difficulty) difficultyCounts[problem.difficulty]++;
            }
        }
        
        return { statusCounts, difficultyCounts };
    }, [trackedProblems]);

    const value = {
        trackedProblems,
        analyticsData,
        loading,
        addProblemToState,
        updateProblemStatus,
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};