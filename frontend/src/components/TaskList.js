import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {(user.role === "Admin" || user.role === "Manager") && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "New Task"}
          </button>
        )}
      </div>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="mr-2">Filter by status:</label>
        <select
          className="border px-2 py-1 rounded"
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
        <form onSubmit={handleCreate} className="mb-4 space-y-2 max-w-lg">
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="border px-2 py-1 rounded w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <select
            className="border px-2 py-1 rounded w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <input
            type="date"
            className="border px-2 py-1 rounded w-full"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            required
          />
          <select
            className="border px-2 py-1 rounded w-full"
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
            className="border px-2 py-1 rounded w-full"
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
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Title</th>
              <th>Status</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/tasks/${t.id}`)}
              >
                <td className="p-2">{t.title}</td>
                <td>{statusBadge(t.status)}</td>
                <td>{t.project?.name}</td>
                <td>{t.assignedTo?.name}</td>
                <td>{t.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
