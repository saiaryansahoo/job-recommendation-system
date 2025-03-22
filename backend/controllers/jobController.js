const Job = require("../models/Job");
const fetchJobs = require("../utils/fetchJobs");
const recommendJobs = require("../utils/recommendJobs");

/**
 * @desc Fetch all jobs from MongoDB
 * @route GET /api/jobs
 */
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching jobs" });
    }
};

/**
 * @desc Add a new job manually (for testing)
 * @route POST /api/jobs
 */
exports.addJob = async (req, res) => {
    try {
        const { title, company, description, skillsRequired, location, url } = req.body;
        const newJob = new Job({ title, company, description, skillsRequired, location, url });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ error: "Error adding job" });
    }
};

/**
 * @desc Fetch jobs from API and store in DB
 * @route GET /api/jobs/fetch
 */
exports.fetchAndStoreJobs = async (req, res) => {
    try {
        const jobs = await fetchJobs();
        await Job.insertMany(jobs, { ordered: false });
        res.json({ message: "Jobs fetched and stored successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error fetching/storing jobs" });
    }
};

/**
 * @desc Recommend jobs based on user's skills
 * @route GET /api/jobs/recommend
 */
exports.recommendJobs = async (req, res) => {
    try {
        const { skills } = req.user; // Extract user skills from token
        const jobs = await Job.find();
        const recommended = recommendJobs(skills, jobs);
        res.json(recommended);
    } catch (error) {
        res.status(500).json({ error: "Error recommending jobs" });
    }
};
