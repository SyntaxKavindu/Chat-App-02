import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            set({ authUser: null })
            console.error("Error in CheckAuth", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        try {
            set({ isSigningUp: true });
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({ authUser: res.data });
        } catch (error) {
            set({ isSigningUp: false });
            set({ authUser: null })
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    logIn: async (data) => {
        try {
            set({ isLoggingUp: true });
            const res = await axiosInstance.post("/auth/login", data);
            toast.success("Logged in successfully");
            set({ authUser: res.data });
        } catch (error) {
            set({ isLoggingUp: false });
            set({ authUser: null })
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingUp: false });
        }
    },

    logOut: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        try {
            set({ isUpdatingProfile: true });
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            set({ isUpdatingProfile: false });
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    
}));