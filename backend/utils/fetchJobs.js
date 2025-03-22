const axios = require("axios");

module.exports = async () => {
    const { data } = await axios.get("https://remotive.io/api/remote-jobs");
    return data.jobs.map(job => ({
        title: job.title,
        company: job.company_name,
        skillsRequired: job.tags,
        url: job.url
    }));
};
