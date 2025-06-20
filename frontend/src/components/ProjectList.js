// Enhanced ProjectList.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaPlus, FaTrash } from "react-icons/fa";

const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    api
      .get("/projects")
      .then((res) => setProjects(res.data.projects || res.data));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/projects", form);
    setForm({ name: "", description: "" });
    setShowForm(false);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        {(user.role === "Admin" || user.role === "Manager") && (
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus /> {showForm ? "Cancel" : "New Project"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 bg-white p-4 rounded shadow space-y-4 max-w-xl"
        >
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            className="border px-3 py-2 rounded w-full"
            placeholder="Project Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
            Create Project
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow p-5 transition hover:shadow-lg border cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold text-indigo-700">
                {project.name}
              </h2>
              {(user.role === "Admin" || user.role === "Manager") && (
                <FaTrash
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                />
              )}
            </div>
            <p className="text-gray-600 mb-3 line-clamp-3">
              {project.description}
            </p>
            <div className="flex items-center flex-wrap gap-2">
              <FaUsers className="text-gray-400" />
              {project.Users?.slice(0, 3).map((u) => (
                <span
                  key={u.id}
                  className="bg-gray-100 text-xs px-2 py-1 rounded"
                >
                  {u.name} ({u.role})
                </span>
              ))}
              {project.Users?.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{project.Users.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
