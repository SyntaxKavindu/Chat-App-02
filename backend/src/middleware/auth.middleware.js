import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from request headers
        const token = req.cookies.jwt;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        else {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                return res.status(401).json({ message: "Unauthorized - Invalid token" });
            }

            // Get user from database
            const user = await User.findById(decoded.userId).select('-password');

            // Check if user exists
            if (!user) {
                return res.status(401).json({ message: "Unauthorized - Invalid token" });
            }

            // Set user to request object
            req.user = user;
            next();
        }
    } catch (error) {
        console.error("Error in Protect Route Middleware", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};