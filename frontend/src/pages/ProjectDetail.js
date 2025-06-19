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
    api.get(`/projects/${id}`).then((res) => {
      const projectData = res.data.project;
      setProject(projectData);

      setForm({ name: projectData.name, description: projectData.description });
      setAssigned(projectData.Users?.map((u) => u.id) || []);
    });
    if (user.role === "Admin" || user.role === "Manager") {
      api.get("/users").then((res) => setUsers(res.data.users));
    }
  }, [id, user.role]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await api.put(`/projects/${id}`, form);
    setEdit(false);
    api.get(`/projects/${id}`).then((res) => setProject(res.data.project));
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    await api.post(`/projects/${id}/assign`, { userIds: assigned });
    setShowAssign(false);
    api.get(`/projects/${id}`).then((res) => setProject(res.data.project));
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this project?")) {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {(user.role === "Admin" || user.role === "Manager") && (
          <div className="flex gap-2">
            <button
              className="text-green-600 underline"
              onClick={() => setEdit(!edit)}
            >
              {edit ? "Cancel" : "Edit"}
            </button>
            <button
              className="text-blue-600 underline"
              onClick={() => setShowAssign(!showAssign)}
            >
              {showAssign ? "Cancel Assign" : "Assign Team"}
            </button>
            <button className="text-red-600 underline" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
      {edit ? (
        <form onSubmit={handleUpdate} className="mb-4 space-y-2">
          <input
            className="border px-2 py-1 rounded w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            className="border px-2 py-1 rounded w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </form>
      ) : (
        <p className="mb-4 text-gray-600">{project.description}</p>
      )}
      {showAssign && (user.role === "Admin" || user.role === "Manager") && (
        <form onSubmit={handleAssign} className="mb-4">
          <h3 className="font-semibold mb-2">Assign Team Members</h3>
          <select
            multiple
            className="border px-2 py-1 rounded w-full"
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
            Assign
          </button>
        </form>
      )}
      <div className="mb-4">
        <span className="font-semibold">Team Members:</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.Users?.length === 0 && (
            <span className="text-gray-400">No team members assigned.</span>
          )}
          {project.Users?.map((u) => (
            <span key={u.id} className="bg-gray-200 text-xs px-2 py-1 rounded">
              {u.name} ({u.role})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
