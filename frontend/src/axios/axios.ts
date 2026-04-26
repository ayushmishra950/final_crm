/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Access token and refresh token are managed via httpOnly cookies from backend


// 🔁 Refresh Token API call
const refreshToken = async () => {
    try {
        const res = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
        );

        return res.data.accessToken;
    } catch (err) {
        throw err;
    }
};

// 📤 Request Interceptor (withCredentials automatically sends cookies)
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// 📥 Response Interceptor (401 handle + refresh token logic)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // agar access token expire ho gaya
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshToken();

                // Token refreshed in cookies, retry request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // refresh fail -> logout
                window.location.href = "/user-auth";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;