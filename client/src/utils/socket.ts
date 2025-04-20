import { io } from "socket.io-client";

const socket = io("https://live-poll-qsi9.onrender.com"); // or your backend URL

export default socket;
