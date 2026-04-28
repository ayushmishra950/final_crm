import { Server, Socket } from "socket.io";

let ioInstance: Server;
export const initSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("send_message", (data) => {
            console.log("Message:", data);

            io.emit("receive_message", data);
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
}