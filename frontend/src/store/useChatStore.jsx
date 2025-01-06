import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error("Error fetching users");
            set({ isUserLoading: false });
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/users/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error("Error fetching messages");
            set({ isMessagesLoading: false });
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    // Todo: Optimize this function for better performance
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));