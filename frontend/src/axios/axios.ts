/// <reference types="vite/client" />
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Access token memory me store (localStorage ya state bhi use kar sakte ho)
let accessToken: string | null = null;

// 🔹 Set Access Token
export const setAccessToken = (token: string) => {
    accessToken = token;
};

// 🔹 Get Access Token
export const getAccessToken = () => accessToken;

// 🔹 Remove Token (logout ke time)
export const clearAccessToken = () => {
    accessToken = null;
};

// 🔁 Refresh Token API call
const refreshToken = async () => {
    try {
        const res = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        return newAccessToken;
    } catch (err) {
        clearAccessToken();
        throw err;
    }
};

// 📤 Request Interceptor (har request me token bhejne ke liye)
apiClient.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
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
                const newAccessToken = await refreshToken();

                // naya token set karke retry request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // refresh bhi fail -> logout
                clearAccessToken();
                window.location.href = "/user-auth";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;