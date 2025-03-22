const pdf = require("pdf-parse");

module.exports = async (fileBuffer) => {
    const text = (await pdf(fileBuffer)).text.toLowerCase();
    const skills = ["javascript", "python", "aws", "docker", "kubernetes"];
    return skills.filter(skill => text.includes(skill));
};
