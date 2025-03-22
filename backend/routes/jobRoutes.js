const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", jobController.getJobs);
router.post("/", authMiddleware, jobController.addJob);
router.get("/fetch", jobController.fetchAndStoreJobs);
router.get("/recommend", authMiddleware, jobController.recommendJobs);

module.exports = router;
