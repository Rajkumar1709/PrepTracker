import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from './AuthContext';

export const ProgressContext = createContext();

// Helper function
const getPlatformFromUrl = (url) => {
    try {
        const hostname = new URL(url).hostname;
        if (hostname.includes('leetcode')) return 'LeetCode';
        if (hostname.includes('geeksforgeeks')) return 'GeeksforGeeks';
        if (hostname.includes('hackerrank')) return 'HackerRank';
        if (hostname.includes('interviewbit')) return 'InterviewBit';
        return hostname;
    } catch (e) {
        return 'Unknown';
    }
};

export const ProgressProvider = ({ children }) => {
    const [trackedProblems, setTrackedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchTrackedProblems = async () => {
            if (token) {
                setLoading(true);
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await api.get('/api/problems', config);
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
    
    const trackProblem = async (problem, token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const problemData = {
                title: problem.name,
                platform: getPlatformFromUrl(problem.link),
                link: problem.link,
                category: problem.category,
                difficulty: problem.level,
                status: 'Not Attempted'
            };
            const { data: newProblem } = await api.post('/api/problems', problemData, config);
            addProblemToState(newProblem);
            return { success: true, message: `'${problem.name}' was added to your list!` };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to track problem.';
            console.error(err);
            return { success: false, message: errorMessage };
        }
    };

    // --- THIS IS THE CORRECTED PART ---
    const analyticsData = useMemo(() => {
        const statusCountObject = { 'Solved': 0, 'Attempted': 0, 'Not Attempted': 0 };
        const difficultyCounts = { 'Easy': 0, 'Medium': 0, 'Hard': 0 };

        for (const problem of trackedProblems) {
            if (problem.status) statusCountObject[problem.status]++;
            if (problem.status === 'Solved') {
                if (problem.difficulty) difficultyCounts[problem.difficulty]++;
            }
        }
        
        return {
            // Convert the status count object into an array
            statusCounts: [
                { name: 'Solved', value: statusCountObject.Solved },
                { name: 'Attempted', value: statusCountObject.Attempted },
                { name: 'Not Attempted', value: statusCountObject['Not Attempted'] },
            ],
            difficultyCounts,
            totalTracked: trackedProblems.length,
            totalSolved: statusCountObject.Solved,
        };
    }, [trackedProblems]);

    const value = {
        trackedProblems,
        analyticsData,
        loading,
        addProblemToState,
        updateProblemStatus,
        trackProblem,
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};