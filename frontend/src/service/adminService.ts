import api from "../axios/axios";

export const getAdminDashboardData = async () => {
    try {
        const res = await api.get("/admin/dashboard");
        return res.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const verifyVendorKyc = async (id: string) => {
    try {
        const res = await api.post(`/admin/verify-kyc/${id}`);
        return res.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const removeUserOrVendor = async (id: string) => {
    try {
        const res = await api.delete(`/admin/remove/${id}`);
        return res.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
