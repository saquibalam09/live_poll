// Stores all the active rooms and their details
const rooms = {};

// Helper function to generate a random room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createPollRoom({ name, durationInSeconds = 60 }) {
  const roomCode = generateRoomCode();

  rooms[roomCode] = {
    roomCode,
    question: "Cats vs Dogs",
    votes: { cats: 0, dogs: 0 },
    users: [],
    hasEnded: false,
    endsAt: Date.now() + durationInSeconds * 1000,
    createdBy: name, // or any user identifier like username or userId
  };

  return roomCode;
}

// Handle a user joining a poll room
function joinPollRoom(io, roomCode, name, socket) {
  const room = rooms[roomCode];
  if (room?.hasEnded) {
    socket.emit("poll_ended", { message: "Poll has ended" });
  }
  if (room && !room.hasEnded) {
    room.users.push(name);
    socket.join(roomCode);
    // io.to(roomCode).emit("user_joined", { name, users: room.users });
    return room;
  }
  return null;
}

// Handle voting for an option
function handleVote(io, roomCode, option) {
  const room = rooms[roomCode];
  if (room && !room.hasEnded) {
    if (option === "cats" || option === "dogs") {
      room.votes[option] += 1;

      io.to(roomCode).emit("vote_cast", room.votes);
    }
  }
}

// End the poll and stop accepting votes
function endPoll(io, roomCode) {
  const room = rooms[roomCode];
  if (room) {
    delete rooms[roomCode];
    io.to(roomCode).emit("poll_ended");
  }
}

export { createPollRoom, joinPollRoom, handleVote, endPoll };
