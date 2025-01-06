import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// Parse incoming cookies
app.use(cookieParser());

// Define the port to listen on
const PORT = process.env.PORT || 5001;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    // Connect to MongoDB
    connectDB();
});