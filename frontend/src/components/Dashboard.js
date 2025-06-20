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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-6 shadow mb-8">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-lg mt-2">
          Manage your <strong>projects</strong>, <strong>tasks</strong>, and
          team efficiently.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          label="To Do Tasks"
          count={taskStats.toDo}
          color="bg-blue-100"
        />
        <StatCard
          label="In Progress Tasks"
          count={taskStats.inProgress}
          color="bg-yellow-100"
        />
        <StatCard
          label="Completed Tasks"
          count={taskStats.done}
          color="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">
            Overdue Tasks
          </h2>
          {overdue.length === 0 ? (
            <p className="text-gray-500">No overdue tasks!</p>
          ) : (
            <ul className="space-y-2">
              {overdue.map((task) => (
                <li key={task.id} className="text-gray-700">
                  <span className="font-medium">{task.title}</span> — Due by{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">
            Project Progress
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectProgress key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, count, color }) => (
  <div className={`${color} p-6 rounded-lg shadow text-center`}>
    <h3 className="text-xl font-semibold text-gray-700">{label}</h3>
    <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
  </div>
);

const ProjectProgress = ({ project }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    api
      .get(`/reports/projects/${project.id}/progress`)
      .then((res) => setProgress(res.data.completionPercentage));
  }, [project.id]);

  return (
    <div className="flex items-center">
      <span className="w-1/3 text-gray-800">{project.name}</span>
      <div className="w-2/3 ml-4">
        <div className="w-full bg-gray-200 rounded h-4">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 text-right mt-1">
          {progress !== null ? `${progress}% completed` : "..."}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
