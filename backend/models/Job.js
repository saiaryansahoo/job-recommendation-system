const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: String,
    company: String,
    description: String,
    skillsRequired: [String],
    location: String,
    url: String
});

JobSchema.index({ skillsRequired: "text" }); // Indexing for faster search

module.exports = mongoose.model("Job", JobSchema);
