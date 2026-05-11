import axios from "axios";
import { logout } from "@/lib/auth";

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
        if (status === 401) {
            logout();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    },
);