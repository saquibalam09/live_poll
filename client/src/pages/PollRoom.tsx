import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Cat, Dog, Timer, RotateCw, Check } from "lucide-react";
import socket from "../utils/socket";
import { JoinSuccessPayload, VoteCount } from "../interfaces/vote.interface.ts";

function PollRoom() {
  const { roomCode } = useParams();
  const name = localStorage.getItem("username") || "";

  const [inRoom, setInRoom] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("Cats vs Dogs");
  const [votes, setVotes] = useState<VoteCount>(() => {
    const storedVotes = localStorage.getItem("votesKey");
    return storedVotes ? JSON.parse(storedVotes) : { cats: 0, dogs: 0 };
  });

  const [votedFor, setVotedFor] = useState<"cats" | "dogs" | null>(() => {
    const stored = localStorage.getItem(`votedFor-${roomCode}`);
    return stored === "cats" || stored === "dogs" ? stored : null;
  });

  const [hasVoted, setHasVoted] = useState<boolean>(
    localStorage.getItem("hasVoted") === "true" || false
  );
  const [hasEnded, setHasEnded] = useState<boolean>(
    localStorage.getItem(`hasEnded-${roomCode}`) === "true" || false
  );
  const [timer, setTimer] = useState<number>(60);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // const handleVote = (option: "cats" | "dogs") => {
  //   if (!hasVoted && !hasEnded) {
  //     socket.emit("vote", { option, roomCode });
  //     setHasVoted(true);
  //     localStorage.setItem(`voted-${roomCode}`, "true");
  //   }
  // };

  const handleVote = (option: "cats" | "dogs") => {
    if (!hasVoted && !hasEnded) {
      socket.emit("vote", { option, roomCode });
      setHasVoted(true);
      setVotedFor(option);
      localStorage.setItem(`voted-${roomCode}`, "true");
      localStorage.setItem(`votedFor-${roomCode}`, option);

      localStorage.setItem("hasVoted", "true");
    }
  };

  const handleResetPoll = () => {
    if (roomCode) {
      socket.emit("end_poll", { roomCode });
      setHasEnded(true);
      localStorage.setItem(`hasEnded-${roomCode}`, "true");
    }
  };

  useEffect(() => {
    if (roomCode && name) {
      socket.emit("join_room", { name, roomCode });
      console.log("Joining room:", roomCode, "with name:", name);

      socket.on("join_success", (data: JoinSuccessPayload) => {
        console.log("Join success:", data);
        localStorage.setItem("votesKey", JSON.stringify(data.votes));
        setVotes(data.votes);
        setInRoom(true);
        setQuestion(data.question);

        const storedEnded = localStorage.getItem(`hasEnded-${roomCode}`);
        if (storedEnded === "true" || data.hasEnded) {
          setHasEnded(true);
          setTimer(0);
        } else {
          const timeLeft = Math.floor((data.endsAt - Date.now()) / 1000);
          setTimer(timeLeft > 0 ? timeLeft - 1 : 0);
        }

        if (data.createdBy === name) {
          setIsAdmin(true);
        }

        const storedVote = localStorage.getItem(`voted-${roomCode}`);
        if (storedVote) setHasVoted(true);
      });

      socket.on("join_failed", () => {
        alert("Failed to join room.");
      });

      socket.on("vote_cast", (updatedVotes: VoteCount) => {
        localStorage.setItem("votesKey", JSON.stringify(updatedVotes));
        setVotes(updatedVotes);
      });

      socket.on("poll_ended", () => {
        setHasEnded(true);
        setTimer(0);
        localStorage.setItem(`hasEnded-${roomCode}`, "true");
      });
    }

    const storedOption = localStorage.getItem(`votedFor-${roomCode}`);
    if (storedOption === "cats" || storedOption === "dogs") {
      setVotedFor(storedOption);
    }

    const storedEnded = localStorage.getItem(`hasEnded-${roomCode}`);
    if (storedEnded === "true") {
      setHasEnded(true);
      setTimer(0);
    }

    return () => {
      socket.off("join_success");
      socket.off("join_failed");
      socket.off("vote_cast");
      socket.off("poll_ended");
      localStorage.removeItem(`votedFor-${roomCode}`);
      localStorage.removeItem(`hasEnded-${roomCode}`);
      localStorage.removeItem(`voted-${roomCode}`);
      localStorage.removeItem("votesKey");
      localStorage.removeItem("hasVoted");
      // localStorage.removeItem("username");
      // localStorage.removeItem("socketId");
    };
  }, [roomCode, name]);

  useEffect(() => {
    if (inRoom && !hasEnded) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev < 1) {
            clearInterval(interval);
            if (isAdmin) socket.emit("end_poll", { roomCode });
            setHasEnded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [inRoom, hasEnded]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-purple-200 px-4 py-10">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-xl w-full text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {question}
        </h2>
        <p className="text-sm text-gray-500 mb-6">Room Code: {roomCode}</p>

        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => handleVote("cats")}
            disabled={hasVoted || hasEnded}
            className="group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-3"
          >
            <Cat
              size={24}
              className="transition-transform group-hover:scale-110"
            />
            <span className="font-medium">Cats</span>
            {votedFor === "cats" && (
              <Check size={20} className="text-green-300" />
            )}
          </button>

          <button
            onClick={() => handleVote("dogs")}
            disabled={hasVoted || hasEnded}
            className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-4 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-3"
          >
            <Dog
              size={24}
              className="transition-transform group-hover:scale-110"
            />
            <span className="font-medium">Dogs</span>
            {votedFor === "dogs" && (
              <Check size={20} className="text-green-300" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg transition-all hover:shadow-md">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Cat size={20} className="text-purple-600" />
              <span className="text-purple-600 font-medium">Cats</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{votes.cats}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg transition-all hover:shadow-md">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Dog size={20} className="text-yellow-600" />
              <span className="text-yellow-600 font-medium">Dogs</span>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{votes.dogs}</p>
          </div>
        </div>

        <div className="text-lg mb-6">
          {hasEnded ? (
            <div className="flex items-center justify-center gap-2 text-red-500">
              <Timer size={20} />
              <span>Voting has ended!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Timer size={20} className="animate-pulse" />
              <span>Time left: {timer}s</span>
            </div>
          )}

          {hasVoted && !hasEnded && (
            <div className="flex items-center justify-center gap-2 text-green-500 mt-3">
              <Check size={20} />
              <span>Vote recorded!</span>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6 mb-6">
          {isAdmin && !hasEnded && (
            <button
              onClick={handleResetPoll}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <RotateCw size={20} />
              <span>Stop Poll</span>
            </button>
          )}

          <Link
            to="/"
            className="bg-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PollRoom;
