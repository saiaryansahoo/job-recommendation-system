const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        user = new User({ name, email, password: hashedPassword });

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const payload = { user: { id: user._id } };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        if (!token) {
            return res.status(500).json({ msg: "Token generation failed" });
        }

        res.json({ token, msg: "User registered successfully" });
    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).send("Server error");
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Generate a JWT token
        const payload = { user: { id: user._id } };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        if (!token) {
            return res.status(500).json({ msg: "Token generation failed" });
        }

        res.json({ token });
    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).send("Server error");
    }
};
