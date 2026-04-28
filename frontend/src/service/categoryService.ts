import api from '../axios/axios';

export const getCategories = async () => {
    try {
        const response = await api.get('/category');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const createCategory = async (categoryData: any) => {
    try {
        const response = await api.post('/category', categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const updateCategory = async (id: string, categoryData: any) => {
    try {
        const response = await api.put(`/category/${id}`, categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await api.delete(`/category/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
