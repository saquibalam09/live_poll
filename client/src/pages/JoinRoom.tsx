import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import socket from "../utils/socket";
import Layout from "./Layout";
import { JoinSuccessPayload } from "../interfaces/vote.interface.ts";

function JoinRoom() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!name.trim() || !roomCode.trim())
      return alert("Please enter all fields.");

    socket.emit("join_room", { name, roomCode });

    socket.on("join_success", (data: JoinSuccessPayload) => {
      localStorage.setItem("username", name);

      navigate(`/poll/${roomCode}`);
    });

    socket.on("join_failed", () => {
      alert("Invalid room code or name.");
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 flex items-center justify-center gap-2">
          <Users size={24} />
          Join Poll Room
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter room code"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button
          onClick={handleJoinRoom}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          Join Room
        </button>
      </div>
    </Layout>
  );
}

export default JoinRoom;
