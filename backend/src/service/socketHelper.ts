import { Server, Socket } from "socket.io";

let ioInstance: Server;
export const initSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("join_room", (userId) => {
            socket.join(userId);
            console.log(`User ${socket.id} joined room ${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    ioInstance = io;
};

export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket not initialized");
    }
    return ioInstance;
};

export const emitToUser = (userId: string, event: string, data: any) => {
    if (ioInstance) {
        ioInstance.to(userId.toString()).emit(event, data);
    }
};