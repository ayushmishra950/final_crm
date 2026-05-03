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
    // Join user-specific room
    if (userId) {
        socket.emit("join_room", userId);
    }
};

export const connectAdminSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
    // Join admin room for real-time notifications
    socket.emit("join_admin_room");
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};