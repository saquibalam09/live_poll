import { Routes, Route, Navigate } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import PollRoom from "./pages/PollRoom";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create" />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/poll/:roomCode" element={<PollRoom />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
