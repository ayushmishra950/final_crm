import api from "../axios/axios";

export const getCurrentUser = async () => {
    const res = await api.get("/auth/me");
    return res;
};

export const registerUser = async (obj: any) => {
    const res = await api.post("/auth/register/user", obj);
    return res;
};

export const loginUser = async (obj: any) => {
    const res = await api.post("/auth/login/user", obj);
    return res;
};

export const registerVendor = async (obj: any) => {
    const res = await api.post("/auth/register/vendor", obj);
    return res;
};

export const loginVendor = async (obj: any) => {
    const res = await api.post("/auth/login/vendor", obj);
    return res;
};

export const logout = async () => {
    const res = await api.post("/auth/logout");
    return res;
};

export const updateProfile = async (obj: any) => {
    const res = await api.post("/auth/update-profile", obj);
    return res;
};