import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// Signup route
export const signup = async (req, res) => {
    // Destructure request body
    const { fullname, email, password } = req.body;

    try {
        // Validate inputs
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All field are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        // Validate data
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword
        });

        // Check if user created successfully
        if (newUser) {
            // Generate JWT token
            generateToken(newUser._id, res);

            // Save user to database
            await newUser.save();

            // Send Success response
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                avatar: newUser.avatar,
                message: "User created successfully"
            });
        }
        return res.status(400).json({ message: "Invalid user data" });
    } catch (error) {
        console.error("Error in signup controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// Login route
export const login = async (req, res) => {
    // Destructure request body
    const { email, password } = req.body;
    try {
        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: "All field are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        generateToken(user._id, res);

        // Send Success response
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            avatar: user.avatar,
            message: "Logged in successfully"
        });


    } catch (error) {
        console.error("Error in login controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// Logout route
export const logout = (req, res) => {
    try {
        // Clear JWT token from cookie
        res.cookie('jwt', "", { maxAge: 0, });
        // Send Success response
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// Update user profile route
export const updateProfile = async (req, res) => {
    try {
        const { avatar } = req.body;
        const userId = req.user._id;

        // Check if Profile image is provided
        if (!avatar) {
            return res.status(400).json({ message: "Profile image is required" });
        }

        // Upload profile image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(avatar)

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(userId, { avatar: uploadResponse.secure_url }, { new: true });

        // Send Success response
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error in updateProfile controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// Check user authentication route
export const checkAuth = (req, res) => {
    try {
        // Send User information
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};