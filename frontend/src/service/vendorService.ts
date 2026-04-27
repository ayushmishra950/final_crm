import api from "../axios/axios";

export const getVendorDashboard = async () => {
    const res = await api.get("/vendor/dashboard");
    return res.data;
};

export const updateVendorProfile = async (data: any) => {
    const res = await api.post("/vendor/profile/update", data);
    return res.data;
};

export const updateAvailability = async (isOnline: boolean) => {
    const res = await api.post("/vendor/availability", { isOnline });
    return res.data;
};

export const submitKyc = async (data: any) => {
    const res = await api.post("/vendor/kyc/submit", data);
    return res.data;
};

// Bookings
export const getVendorBookings = async (status?: string) => {
    const res = await api.get(`/booking/vendor${status ? `?status=${status}` : ""}`);
    return res.data;
};

export const updateBookingStatus = async (id: string, status: string) => {
    const res = await api.patch(`/booking/status/${id}`, { status });
    return res.data;
};
