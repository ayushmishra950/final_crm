import api from "../axios/axios";


export const getDashboardData = async () => {
    try {
        const response = await api.get("/user-dashboard/dashboard");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getBookingHistory = async (status?: string) => {
    try {
        const response = await api.get("/user-dashboard/bookings", { params: { status } });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getPaymentHistory = async () => {
    try {
        const response = await api.get("/user-dashboard/payments");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getFavorites = async () => {
    try {
        const response = await api.get("/user-dashboard/favorites");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const toggleFavorite = async (vendorId: string) => {
    try {
        const response = await api.post("/user-dashboard/favorites/toggle", { vendorId });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getNotifications = async () => {
    try {
        const response = await api.get("/user-dashboard/notifications");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const markNotificationRead = async (id: string) => {
    try {
        const response = await api.patch(`/user-dashboard/notifications/${id}/read`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const updateNotificationPreferences = async (prefs: { email: boolean, push: boolean, sms: boolean }) => {
    try {
        const response = await api.patch("/user-dashboard/notifications/preferences", prefs);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const changePassword = async (passwords: any) => {
    try {
        const response = await api.post("/user-dashboard/change-password", passwords);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getHomeData = async () => {
    try {
        const response = await api.get("/user-dashboard/home");
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getExploreProviders = async (params: any) => {
    try {
        const response = await api.get("/user-dashboard/explore", { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
