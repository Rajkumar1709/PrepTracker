import axios from 'axios';

// @desc    Search for jobs using Adzuna API
// @route   GET /api/jobs
// @access  Private
export const searchJobs = async (req, res) => {
    let { searchQuery, location, page } = req.query;

    if (!searchQuery || searchQuery.toLowerCase() === 'all titles') {
        searchQuery = 'tech';
    }
    if (!location || location.toLowerCase() === 'all locations') {
        location = 'India';
    }

    const countryCode = 'in'; 
    const URL = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${page || 1}`;

    const options = {
        method: 'GET',
        url: URL,
        params: {
            app_id: process.env.ADZUNA_APP_ID,
            app_key: process.env.ADZUNA_APP_KEY,
            results_per_page: 20,
            what: searchQuery,
            where: location,
            sort_by: 'date',
        },
    };

    try {
        const response = await axios.request(options);

        // Transform Adzuna's data to match your frontend's expected structure
        const transformedJobs = response.data.results.map(job => ({
            job_id: job.id,
            employer_logo: null, 
            employer_name: job.company.display_name,
            job_title: job.title,
            job_city: job.location.display_name,
            job_country: 'IN',
            job_description: job.description,
            job_apply_link: job.redirect_url,
            job_posted_at_datetime_utc: job.created,
            job_type: job.contract_time || null,
            job_category: job.category.label || null,
        }));

        res.status(200).json(transformedJobs);
    } catch (error) {
        console.error("Failed to fetch jobs from Adzuna API", error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
};