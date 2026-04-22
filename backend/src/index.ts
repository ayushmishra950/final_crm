import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from "./config/db";
import { initSocket } from "./service/socketHelper";
import { Server } from "socket.io";
import http from "http";


const app = express();
const port = process.env.PORT;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
connectDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Backend Server is Running!');
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

initSocket(io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
