// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import ProjectList from "./components/ProjectList";
import TaskList from "./components/TaskList";
import ProjectDetail from "./pages/ProjectDetail";
import TaskDetail from "./pages/TaskDetail";
import UserStoryForm from "./components/UserStoryForm";
import UserRegistration from "./components/UserRegistration";
import Unauthorized from "./pages/Unauthorized";
import Navbar from "./components/Navbar";
import SidebarLayout from "./components/SidebarLayout";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            element={
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route
              path="/generate-user-stories"
              element={
                <ProtectedRoute roles={["Admin", "Manager"]}>
                  <UserStoryForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-user"
              element={
                <ProtectedRoute roles={["Admin"]}>
                  <UserRegistration />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
