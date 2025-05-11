const Job = require("../models/Job");
const fetchJobs = require("../utils/fetchJobs");
const recommendJobs = require("../utils/recommendJobs");

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching jobs" });
    }
};

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

exports.fetchAndStoreJobs = async (req, res) => {
    try {
        const jobs = await fetchJobs();
        await Job.insertMany(jobs, { ordered: false });
        res.json({ message: "Jobs fetched and stored successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error fetching/storing jobs" });
    }
};

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
