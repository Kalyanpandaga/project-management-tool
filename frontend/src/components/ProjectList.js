import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        {(user.role === "Admin" || user.role === "Manager") && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "New Project"}
          </button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 space-y-2 max-w-lg">
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            className="border px-2 py-1 rounded w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6 border border-gray-100 flex flex-col justify-between"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{project.name}</h2>
            </div>
            <p className="text-gray-600 mb-2 line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.Users?.slice(0, 3).map((u) => (
                <span
                  key={u.id}
                  className="bg-gray-200 text-xs px-2 py-1 rounded"
                >
                  {u.name} ({u.role})
                </span>
              ))}
              {project.Users?.length > 3 && (
                <span className="text-xs text-gray-400">
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
