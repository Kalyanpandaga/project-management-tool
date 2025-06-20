import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitial = (name) => name?.charAt(0).toUpperCase();

  return (
    <nav className="bg-white shadow-md px-8 py-8 flex items-center justify-between">
      <div className="flex items-center space-x-10">
        <h1 className="text-2xl font-bold text-blue-600">Project Management</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full">
            {getInitial(user.name)}
          </div>
          <span className="text-gray-800 font-medium">{user.name}</span>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
