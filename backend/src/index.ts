// import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from "./config/db";
import { initSocket } from "./service/socketHelper";
import { Server } from "socket.io";
import http from "http";
import passport from 'passport';
import session from 'express-session';
import "./service/google";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = process.env.PORT;


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);



// Google login
app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/user-auth`,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);


connectDB();

app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  },
});

initSocket(io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});