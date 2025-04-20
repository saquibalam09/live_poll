import {
  createPollRoom,
  joinPollRoom,
  handleVote,
  endPoll,
} from "./pollRoom.js";

function socketController(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle room creation
    socket.on("create_room", ({ name }) => {
      const roomCode = createPollRoom({ name });
      socket.emit("room_created", { roomCode, socketId: socket.id });
    });

    // Handle joining a room
    socket.on("join_room", ({ name, roomCode }) => {
      const success = joinPollRoom(io, roomCode, name, socket);
      if (success) {
        io.to(roomCode).emit("join_success", success);
      }
    });

    // Handle voting
    socket.on("vote", ({ option, roomCode }) => {
      handleVote(io, roomCode, option);
    });

    // End poll and stop voting
    socket.on("end_poll", ({ roomCode }) => {
      endPoll(io, roomCode);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

export default socketController;
