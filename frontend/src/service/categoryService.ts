import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/category');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const createCategory = async (categoryData: any) => {
    try {
        const response = await axiosInstance.post('/category', categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const updateCategory = async (id: string, categoryData: any) => {
    try {
        const response = await axiosInstance.put(`/category/${id}`, categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/category/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
