import api from "../axios/axios";


export const getCurrentUser = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};


export const registerUser = async (obj:any) => {
    const res = await api.post("/auth/register", obj);
    return res;
}