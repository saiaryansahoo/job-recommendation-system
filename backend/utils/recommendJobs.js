const natural = require("natural");

module.exports = (userSkills, jobs) => {
    return jobs.map(job => {
        const jobSkills = job.skillsRequired.join(" ");
        const similarity = natural.JaroWinklerDistance(userSkills.join(" "), jobSkills);
        return { ...job.toObject(), similarity };
    }).sort((a, b) => b.similarity - a.similarity);
};
