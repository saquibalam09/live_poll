import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import socketController from "./socket.js";

const app = express();
const server = http.createServer(app);

const __dirname = path.resolve();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // or your frontend URL
  },
});

// Set up routes for your server (if any)
// app.get('/', (req, res) => {
//   res.send('Poll App Backend');
// });

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Initialize the socketController with the io object
socketController(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
