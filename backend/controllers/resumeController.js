const s3 = require("../config/aws");
const extractSkills = require("../utils/extractSkills");

exports.uploadResume = async (req, res) => {
    const file = req.file;
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    s3.upload(params, async (err, data) => {
        if (err) return res.status(500).json({ error: err.message });

        const skills = await extractSkills(file.buffer);
        res.json({ resumeUrl: data.Location, skills });
    });
};
