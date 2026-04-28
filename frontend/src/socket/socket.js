import { io } from "socket.io-client";
const URL = import.meta.env.VITE_API_SOCKET_URL;
export const socket = io(URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    autoConnect: false,
});

export const connectSocket = (userId) => {
    if (!socket.connected) {
        if (userId) socket.auth = { userId };
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};