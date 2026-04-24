import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from "./config/db";
import { initSocket } from "./service/socketHelper";
import { Server } from "socket.io";
import http from "http";
import passport from 'passport';
import session from 'express-session';
import "./service/google";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET as string,
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



connectDB();

app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/user-auth` }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

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