import React, { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({
    toDo: 0,
    inProgress: 0,
    done: 0,
  });
  const [overdue, setOverdue] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/reports/tasks").then((res) => setTaskStats(res.data));
    api
      .get("/reports/overdue")
      .then((res) => setOverdue(res.data.overdueTasks));
    api.get("/projects").then((res) => setProjects(res.data.projects));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold">To Do</h2>
          <p className="text-2xl">{taskStats.toDo}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="font-semibold">In Progress</h2>
          <p className="text-2xl">{taskStats.inProgress}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-semibold">Done</h2>
          <p className="text-2xl">{taskStats.done}</p>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold mb-2">Overdue Tasks</h2>
        {overdue.length === 0 ? (
          <p className="text-gray-500">No overdue tasks!</p>
        ) : (
          <ul className="list-disc ml-6">
            {overdue.map((task) => (
              <li key={task.id}>
                <span className="font-medium">{task.title}</span> (Deadline:{" "}
                {new Date(task.deadline).toLocaleDateString()})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="font-semibold mb-2">Project Progress</h2>
        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectProgress key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectProgress = ({ project }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    api
      .get(`/reports/projects/${project.id}/progress`)
      .then((res) => setProgress(res.data.completionPercentage));
  }, [project.id]);

  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      <span>{project.name}</span>
      <div className="w-1/2 bg-gray-200 rounded h-4 mx-4">
        <div
          className="bg-green-500 h-4 rounded"
          style={{ width: `${progress || 0}%` }}
        />
      </div>
      <span>{progress !== null ? `${progress}%` : "..."}</span>
    </div>
  );
};

export default Dashboard;
