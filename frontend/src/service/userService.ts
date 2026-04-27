import axios from "axios";

const API_URL = "http://localhost:5001/api/user-dashboard";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getDashboardData = async () => {
    try {
        const response = await api.get("/dashboard");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getBookingHistory = async (status?: string) => {
    try {
        const response = await api.get("/bookings", { params: { status } });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getPaymentHistory = async () => {
    try {
        const response = await api.get("/payments");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getFavorites = async () => {
    try {
        const response = await api.get("/favorites");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const toggleFavorite = async (vendorId: string) => {
    try {
        const response = await api.post("/favorites/toggle", { vendorId });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getNotifications = async () => {
    try {
        const response = await api.get("/notifications");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const markNotificationRead = async (id: string) => {
    try {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const updateNotificationPreferences = async (prefs: { email: boolean, push: boolean, sms: boolean }) => {
    try {
        const response = await api.patch("/notifications/preferences", prefs);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const changePassword = async (passwords: any) => {
    try {
        const response = await api.post("/change-password", passwords);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getHomeData = async () => {
    try {
        const response = await api.get("/home");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getExploreProviders = async (params: any) => {
    try {
        const response = await api.get("/explore", { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
