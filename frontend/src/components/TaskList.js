import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    deadline: "",
    projectId: "",
    assignedTo: "",
  });
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    api
      .get("/projects")
      .then((res) => setProjects(res.data.projects || res.data));
  }, []);

  const fetchTasks = () => {
    api.get("/tasks").then((res) => setTasks(res.data.tasks));
  };

  useEffect(() => {
    if (form.projectId) {
      api.get(`/projects/${form.projectId}`).then((res) => {
        setTeamMembers(res.data.project.Users || []);
      });
    } else {
      setTeamMembers([]);
    }
  }, [form.projectId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/tasks", form);
    setForm({
      title: "",
      description: "",
      status: "To Do",
      deadline: "",
      projectId: "",
      assignedTo: "",
    });
    setShowForm(false);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    }
  };

  const filteredTasks = filter
    ? tasks.filter((t) => t.status === filter)
    : tasks;

  const statusBadge = (status) => {
    if (status === "Done")
      return (
        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
          Done
        </span>
      );
    if (status === "In Progress")
      return (
        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
          In Progress
        </span>
      );
    return (
      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
        To Do
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {(user.role === "Admin" || user.role === "Manager") && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus /> {showForm ? "Cancel" : "New Task"}
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="font-medium">Filter by status:</label>
        <select
          className="border px-3 py-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 space-y-4 max-w-2xl bg-gray-50 p-6 rounded-lg shadow"
        >
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="border px-3 py-2 rounded w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <select
            className="border px-3 py-2 rounded w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            required
          />
          <select
            className="border px-3 py-2 rounded w-full"
            value={form.projectId}
            onChange={(e) =>
              setForm({ ...form, projectId: e.target.value, assignedTo: "" })
            }
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            className="border px-3 py-2 rounded w-full"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            required
            disabled={!form.projectId || teamMembers.length === 0}
          >
            <option value="">Select User</option>
            {teamMembers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="text-left bg-gray-100 border-b">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Project</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Deadline</th>
              {(user.role === "Admin" || user.role === "Manager") && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-gray-50 border-b cursor-pointer"
                onClick={() => navigate(`/tasks/${t.id}`)}
              >
                <td className="p-3 font-medium text-gray-800">{t.title}</td>
                <td className="p-3">{statusBadge(t.status)}</td>
                <td className="p-3">{t.project?.name}</td>
                <td className="p-3">{t.assignedTo?.name}</td>
                <td className="p-3">
                  {new Date(t.deadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                {(user.role === "Admin" || user.role === "Manager") && (
                  <td>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.id);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
