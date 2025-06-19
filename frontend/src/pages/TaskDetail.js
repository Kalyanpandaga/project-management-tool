import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const TaskDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    deadline: "",
    assignedTo: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/tasks/${id}`).then((res) => {
      const t = res.data.task;
      setTask(t);
      setComments(t.comments || []);
      setForm({
        title: t.title || "",
        description: t.description || "",
        status: t.status || "",
        deadline: t.deadline?.slice(0, 10) || "",
        assignedTo: t.assignedTo?.id || "",
      });
    });
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    await api.post(`/tasks/${id}/comments`, { content: comment });
    setComment("");
    const res = await api.get(`/tasks/${id}`);
    const t = res.data.task;
    setComments(t.comments || []);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this task?")) {
      await api.delete(`/tasks/${id}`);
      navigate("/tasks");
    }
  };

  const canEdit =
    user.role === "Admin" ||
    user.role === "Manager" ||
    user.id === task?.assignedTo?.id;
  const canDelete = user.role === "Admin" || user.role === "Manager";

  if (!task) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{task.title || "Untitled Task"}</h1>
        <div className="flex gap-2">
          {canEdit && (
            <button
              className="text-green-600 underline"
              onClick={() => setEdit(!edit)}
            >
              {edit ? "Cancel" : "Edit"}
            </button>
          )}
          {canDelete && (
            <button className="text-red-600 underline" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
      {edit ? (
        <form
          className="mb-4 space-y-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await api.put(`/tasks/${id}`, form);
            setEdit(false);
            const res = await api.get(`/tasks/${id}`);
            const t = res.data.task || res.data;
            setTask(t);
          }}
        >
          <input
            className="border px-2 py-1 rounded w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="border px-2 py-1 rounded w-full"
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
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </form>
      ) : (
        <>
          <div className="mb-4 text-gray-600 border-b pb-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  task.status === "Done"
                    ? "bg-green-100 text-green-700"
                    : task.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">Deadline:</span>
              <span>{task.deadline?.slice(0, 10) || "-"}</span>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">Assigned To:</span>
              <span>
                {task.assignedTo?.name} ({task.assignedTo?.role})
              </span>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">Project:</span>
              <span>{task.project?.name}</span>
            </div>
          </div>
          <div className="mb-4 text-gray-700">
            <span className="font-semibold">Description:</span>
            <div className="mt-1 whitespace-pre-line">{task.description}</div>
          </div>
        </>
      )}
      <div className="mb-4 mt-6">
        <h3 className="font-semibold mb-2">Comments</h3>
        <ul className="mb-2 max-h-40 overflow-y-auto bg-gray-50 rounded p-2">
          {comments.length === 0 && (
            <li className="text-gray-400">No comments yet.</li>
          )}
          {comments.map((c, i) => (
            <li key={i} className="border-b py-1">
              <span className="font-medium">{c.user?.name || "User"}:</span>{" "}
              {c.content}
            </li>
          ))}
        </ul>
        <form onSubmit={handleComment} className="flex space-x-2">
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskDetail;
