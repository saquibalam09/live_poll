import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vote } from "lucide-react";
import socket from "../utils/socket";
import Layout from "./Layout";

function CreateRoom() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!name.trim()) return alert("Please enter your name.");
    socket.emit("create_room", { name });

    socket.on(
      "room_created",
      (data: { roomCode: string; socketId: string }) => {
        localStorage.setItem("username", name);
        localStorage.setItem("socketId", data.socketId);
        navigate(`/poll/${data.roomCode}`);
      }
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-600 flex items-center justify-center gap-2">
          <Vote size={24} />
          Create Poll Room
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleCreateRoom}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          Create Room
        </button>
      </div>
    </Layout>
  );
}

export default CreateRoom;
