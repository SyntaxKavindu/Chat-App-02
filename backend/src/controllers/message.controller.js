import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

// Get users for the sidebar (excluding the logged-in user)
export const getUsersForSidebar = async (req, res) => {
    try {
        // Get the logged-in user ID from the request
        const logedInUserId = req.user._id;

        // Find all users excluding the logged-in user
        const users = await User.find({ _id: { $ne: logedInUserId } });

        // Send the users to the client
        res.status(200).json(users);

    } catch (error) {
        console.error("Error in getUsersForSidebar controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// Get messages between two users
export const getMessages = async (req, res) => {
    try {
        // Get the user ID
        const { id: userToChatId } = req.params;
        // Get the sender ID
        const myId = req.user._id;

        // Find the messages between the two users
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });

        // Send the messages to the client
        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in getMessages controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// Send a new message
export const sendMessage = async (req, res) => {
    try {
        // Get data from the request
        const { text, image } = req.body;
        // Get the receiver ID
        const { id: receiverId } = req.params;
        // Get the sender ID
        const senderId = req.user._id;

        let imageUrl;
        // Check if data contains image
        if (image) {
            // Upload base64 image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        // Save the message to the database
        await newMessage.save();

        // Todo: Real Time functionality using Socket.IO

        // Send the message to the client
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};