import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Vote, Users } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center space-y-6">
        <h1 className="text-4xl font-extrabold text-blue text-center ">
          Quick Vote
        </h1>

        <div className="flex gap-4">
          <Link
            to="/create"
            className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Vote size={20} />
            Create Room
          </Link>
          <Link
            to="/join"
            className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Users size={20} />
            Join Room
          </Link>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
