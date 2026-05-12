import axios from "axios";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

export const api = axios.create({
    // baseURL: "/api",
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            logout();
            toast.error("Session expired. Please login again.");
            
            if (typeof window !== "undefined") {
                window.location.replace("/login");
            }
        }
        return Promise.reject(error);
    },
);