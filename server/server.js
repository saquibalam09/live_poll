import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import dotenv from "dotenv";

import socketController from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const __dirname = path.resolve();

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // or your frontend URL
  },
});

// Set up routes for your server (if any)
// app.get('/', (req, res) => {
//   res.send('Poll App Backend');
// });

// Initialize the socketController with the io object
socketController(io);
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
