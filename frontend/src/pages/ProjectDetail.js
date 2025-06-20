import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [users, setUsers] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
    if (user.role === "Admin" || user.role === "Manager") {
      api.get("/users").then((res) => setUsers(res.data.users));
    }
  }, [id, user.role]);

  const fetchProject = async () => {
    const res = await api.get(`/projects/${id}`);
    const p = res.data.project;
    setProject(p);
    setForm({ name: p.name, description: p.description });
    setAssigned(p.Users?.map((u) => u.id) || []);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/projects/${id}`, form);
    setEdit(false);
    fetchProject();
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    await api.post(`/projects/${id}/assign`, { userIds: assigned });
    setShowAssign(false);
    fetchProject();
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this project?")) {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    }
  };

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-700">{project.name}</h1>
        {(user.role === "Admin" || user.role === "Manager") && (
          <div className="flex gap-2">
            <button
              className="text-green-600 hover:underline"
              onClick={() => setEdit(!edit)}
            >
              {edit ? "Cancel" : "Edit"}
            </button>
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setShowAssign(!showAssign)}
            >
              {showAssign ? "Cancel Assign" : "Assign Team"}
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {edit ? (
        <form onSubmit={handleUpdate} className="space-y-4 mb-6">
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Project Name"
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            placeholder="Project Description"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <p className="mb-4 text-gray-600 whitespace-pre-line text-sm">
          {project.description}
        </p>
      )}

      {/* Assign Users */}
      {showAssign && (user.role === "Admin" || user.role === "Manager") && (
        <form onSubmit={handleAssign} className="mb-6">
          <label className="block font-semibold mb-2">
            Assign Team Members
          </label>
          <select
            multiple
            className="w-full border px-3 py-2 rounded"
            value={assigned}
            onChange={(e) =>
              setAssigned([...e.target.selectedOptions].map((o) => o.value))
            }
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-3"
          >
            Assign
          </button>
        </form>
      )}

      {/* Team Members */}
      <div>
        <span className="font-semibold">Team Members:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.Users?.length === 0 ? (
            <span className="text-gray-400">No team members assigned.</span>
          ) : (
            project.Users.map((u) => (
              <span
                key={u.id}
                className="bg-gray-200 text-xs px-2 py-1 rounded"
              >
                {u.name} ({u.role})
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
