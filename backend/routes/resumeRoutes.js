const express = require('express');
const multer = require('multer');
const s3 = require('../config/aws');
const { extractSkills } = require('../utils/extractSkills');
const pdf = require('pdf-parse'); // For parsing PDF files

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    try {
        // Upload file to S3
        const uploadResult = await s3.upload(params).promise();

        // Extract text from the file
        let text;
        if (req.file.mimetype === 'application/pdf') {
            const data = await pdf(req.file.buffer);
            text = data.text;
        } else {
            text = req.file.buffer.toString('utf8');
        }

        // Extract skills from the text
        const skills = extractSkills(text);

        // Return the S3 URL and extracted skills
        res.json({ url: uploadResult.Location, skills });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ error: 'Error uploading resume' });
    }
});

module.exports = router;