import { Server, Socket } from "socket.io";

let io;
export const initSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        // 🔹 receive message
        socket.on("send_message", (data) => {
            console.log("Message:", data);

            // 🔹 broadcast to all users
            io.emit("receive_message", data);
        });

        // 🔹 disconnect
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