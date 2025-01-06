import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    try {
        // Generate JWT token
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set the cookie with the token
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Don't expose the token to client-side scripts (prevent XSS attacks)
            sameSite: "strict", // CSRF protection cross-site requests forgery attacks
            secure: process.env.NODE_ENV !== "development", // Only send cookie over HTTPS
        });

        // Return the token
        // return token;

    } catch (error) {
        return res.status(500).json({ message: 'Server error generating token' });
    }
}