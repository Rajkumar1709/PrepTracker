import axios from 'axios';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const runCode = async (req, res) => {
    const { source_code, language_id, stdin } = req.body;

    if (!source_code || !language_id) {
        return res.status(400).json({ message: 'Source code and language are required.' });
    }

    const submissionOptions = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'false', fields: '*' },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            language_id: language_id,
            source_code: source_code,
            stdin: stdin
        }
    };

    try {
        const submissionResponse = await axios.request(submissionOptions);
        const { token } = submissionResponse.data;

        let resultResponse;
        let statusId;
        
        // NEW: Add a timeout mechanism
        let retries = 0;
        const MAX_RETRIES = 20; // 20 retries * 500ms = 10 seconds timeout

        while (retries < MAX_RETRIES) {
            const resultOptions = {
                method: 'GET',
                url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
                params: { base64_encoded: 'false', fields: '*' },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            };
            
            resultResponse = await axios.request(resultOptions);
            statusId = resultResponse.data.status.id;

            if (statusId === 1 || statusId === 2) {
                await sleep(500); // UPDATED: Wait for a shorter time (0.5 seconds)
                retries++;
            } else {
                break; 
            }
        }

        // If the loop finished due to a timeout
        if (statusId === 1 || statusId === 2) {
            return res.status(200).json({ status: { description: 'Execution Timed Out' }, stderr: 'Your code took too long to execute and was terminated.' });
        }
        
        res.status(200).json(resultResponse.data);

    } catch (error) {
        console.error("Failed to run code", error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to run code' });
    }
};