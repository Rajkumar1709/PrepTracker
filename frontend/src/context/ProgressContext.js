import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from './AuthContext';

export const ProgressContext = createContext();

// Helper function to get platform from URL
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

    // This useEffect fetches the user's tracked problems
    useEffect(() => {
        const fetchTrackedProblems = async () => {
            if (token) {
                setLoading(true); // Set loading true only at the start of the fetch
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await api.get('/api/problems', config);
                    setTrackedProblems(data);
                } catch (error) {
                    console.error("Failed to fetch tracked problems", error);
                    setTrackedProblems([]); // Set to empty array on error
                } finally {
                    setLoading(false); // ALWAYS set loading to false when done
                }
            } else {
                // If there's no token (user is logged out), stop loading
                setTrackedProblems([]);
                setLoading(false);
            }
        };
        fetchTrackedProblems();
    }, [token]); // This hook correctly depends only on the token

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

    const removeProblemFromState = (problemId) => {
        setTrackedProblems(prevProblems =>
            prevProblems.filter(p => p._id !== problemId)
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
            const errorMessage = err.response?.data?.message || 'Failed to track problem. You may already be tracking it.';
            console.error(err);
            return { success: false, message: errorMessage };
        }
    };

    const analyticsData = useMemo(() => {
        const statusCounts = { 'Solved': 0, 'Attempted': 0, 'Not Attempted': 0 };
        const difficultyCounts = { 'Easy': 0, 'Medium': 0, 'Hard': 0 };

        for (const problem of trackedProblems) {
            if (problem.status) statusCounts[problem.status]++;
            if (problem.status === 'Solved') {
                if (problem.difficulty) difficultyCounts[problem.difficulty]++;
            }
        }
        
        return {
            statusCounts: [
                { name: 'Solved', value: statusCounts.Solved },
                { name: 'Attempted', value: statusCounts.Attempted },
                { name: 'Not Attempted', value: statusCounts['Not Attempted'] },
            ],
            difficultyData: [
                { name: 'Easy', solved: difficultyCounts.Easy, tracked: trackedProblems.filter(p => p.difficulty === 'Easy').length },
                { name: 'Medium', solved: difficultyCounts.Medium, tracked: trackedProblems.filter(p => p.difficulty === 'Medium').length },
                { name: 'Hard', solved: difficultyCounts.Hard, tracked: trackedProblems.filter(p => p.difficulty === 'Hard').length },
            ],
            totalTracked: trackedProblems.length,
            totalSolved: statusCounts.Solved,
        };
    }, [trackedProblems]);

    const value = {
        trackedProblems,
        analyticsData,
        loading,
        addProblemToState,
        updateProblemStatus,
        removeProblemFromState,
        trackProblem,
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};