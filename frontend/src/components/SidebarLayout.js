// src/components/SidebarLayout.js
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaUserPlus,
} from "react-icons/fa";

const SidebarLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/projects", label: "Projects", icon: <FaProjectDiagram /> },
    { to: "/tasks", label: "Tasks", icon: <FaTasks /> },
    ...(user.role === "Admin"
      ? [{ to: "/register-user", label: "Register User", icon: <FaUserPlus /> }]
      : []),
  ];

  return (
    <div className="flex">
      <aside className="w-64 bg-white border-r min-h-screen px-4 py-6 shadow-md">
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center space-x-2 p-2 rounded-md transition hover:bg-blue-100 ${
                  location.pathname === link.to
                    ? "bg-blue-50 font-semibold"
                    : ""
                }`}
              >
                <span className="text-blue-600">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
