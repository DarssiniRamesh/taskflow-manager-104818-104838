import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../services/auth";

// PUBLIC_INTERFACE
/**
 * TaskList page displays the user's tasks list, allows marking complete/delete, and routes to TaskDetail/Edit.
 */
function TaskList() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_ROOT || "http://localhost:3001"}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`Failed loading tasks (${res.status})`);
        const data = await res.json();
        setTasks(data);
      } catch (e) {
        setErr(e.message || "Error loading tasks");
      }
      setLoading(false);
    }
    fetchTasks();
  }, [token]);

  // Complete/Uncomplete handler
  const toggleComplete = async (task) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_ROOT || "http://localhost:3001"}/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: !task.completed,
          }),
        }
      );
      if (!res.ok) throw new Error("Could not update task");
      setTasks((ts) =>
        ts.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (e) {
      setErr("Could not update task: " + (e.message || ""));
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_ROOT || "http://localhost:3001"}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      setTasks((ts) => ts.filter((t) => t.id !== taskId));
    } catch (e) {
      setErr("Delete error: " + (e.message || ""));
    }
  };

  return (
    <DashboardLayout title="All Tasks">
      <div style={{maxWidth: 680, margin: "0 auto"}}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}>
          <h2 style={{margin: 0}}>Tasks</h2>
          <button
            className="btn"
            onClick={() => navigate("/tasks/new")}
            style={{ fontSize: "1rem", padding: "7px 21px" }}
          >
            + New Task
          </button>
        </div>
        {loading && <div>Loading...</div>}
        {err && <div style={{ color: "#c00", marginBottom: 10 }}>{err}</div>}
        {!loading && !err && (
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}>
            {tasks && tasks.length === 0 && (
              <div style={{color: "#999"}}>No tasks found.</div>
            )}
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  marginBottom: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.3rem",
                  boxShadow: "0 2px 7px 0 rgba(33,52,71, .04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#888" : "inherit",
                      fontWeight: 500,
                      fontSize: "1.07rem",
                      cursor: "pointer",
                      marginBottom: 3,
                    }}
                    title={"View details"}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    {task.title}
                  </span>
                  <span style={{fontSize: ".99rem", color: "#777"}}>
                    Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}
                    {" "}| Status: {task.completed ? "Completed" : "Active"}
                  </span>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "13px"}}>
                  <input
                    title="Mark complete"
                    type="checkbox"
                    checked={!!task.completed}
                    onChange={() => toggleComplete(task)}
                    style={{width: 20, height: 20}}
                  />
                  <button
                    className="btn"
                    style={{background: "#ffb300", color: "#222"}}
                    onClick={() => navigate(`/tasks/${task.id}/edit`)}
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    style={{background: "#d32f2f"}}
                    onClick={() => handleDelete(task.id)}
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TaskList;
