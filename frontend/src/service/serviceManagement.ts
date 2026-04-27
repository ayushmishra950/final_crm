import api from "../axios/axios";

export const createService = async (data: any) => {
    const res = await api.post("/service/create", data);
    return res.data;
};

export const getMyServices = async () => {
    const res = await api.get("/service/my-services");
    return res.data;
};

export const updateService = async (id: string, data: any) => {
    const res = await api.put(`/service/update/${id}`, data);
    return res.data;
};

export const deleteService = async (id: string) => {
    const res = await api.delete(`/service/delete/${id}`);
    return res.data;
};
