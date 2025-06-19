import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/projects" className="hover:underline">
          Projects
        </Link>
        {(user.role === "Admin" || user.role === "Manager") && (
          <Link to="/generate-user-stories" className="hover:underline">
            AI Stories
          </Link>
        )}
        <Link to="/tasks" className="hover:underline">
          Tasks
        </Link>
        {user.role === "Admin" && (
          <Link to="/register-user" className="hover:underline">
            Register User
          </Link>
        )}
      </div>
      <button onClick={logout} className="hover:underline">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
