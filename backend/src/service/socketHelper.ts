import { Server, Socket } from "socket.io";

let io;
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

    io = io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
}