import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../services/auth";
import { getTask, updateTask, deleteTask } from "../services/api";

// PUBLIC_INTERFACE
/**
 * TaskDetail shows full details for a single task, with controls for mark complete, edit, or delete.
 */
function TaskDetail() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    getTask(id, token)
      .then(({ task, error }) => {
        if (error) setErr(error);
        else setTask(task);
      })
      .catch((e) => setErr(typeof e === "string" ? e : "Unknown error"))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleCompleteToggle = async () => {
    if (!task) return;
    setLoading(true);
    setErr(null);
    const { error, task: updatedTask } = await updateTask(id, { completed: !task.completed }, token);
    if (error) {
      setErr("Could not update: " + error);
    } else {
      setTask({ ...task, completed: updatedTask.completed });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setLoading(true);
    setErr(null);
    const { error } = await deleteTask(id, token);
    if (error) {
      setErr("Delete error: " + error);
    } else {
      navigate("/tasks");
    }
    setLoading(false);
  };

  return (
    <DashboardLayout title="Task Detail">
      <div style={{maxWidth: 570, margin: "0 auto"}}>
        {loading ? (
          <div>Loading...</div>
        ) : err ? (
          <div style={{color:"#c00"}}>{err}</div>
        ) : !task ? (
          <div>Task not found.</div>
        ) : (
          <div>
            <h2 style={{marginBottom:4}}>
              <span style={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#888" : "inherit"
              }}>{task.title}</span>
            </h2>
            <div style={{color: "#777", marginBottom: 14, fontSize: "1.1rem"}}>
              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}
            </div>
            <div style={{marginBottom: 13}}>
              Status: <strong style={{color: task.completed ? "#388e3c" : "#d32f2f"}}>
                {task.completed ? "Completed" : "Active"}
              </strong>
            </div>
            <div style={{marginBottom: 20, minHeight:50}}>
              <h4 style={{margin: "10px 0 6px 0"}}>Description:</h4>
              {task.description ? <p>{task.description}</p> : <em>No description.</em>}
            </div>
            <div style={{display:"flex",gap:17}}>
              <button
                className="btn"
                style={{
                  background: task.completed ? "#ffb300" : "#388e3c",
                  color: "#222"
                }}
                onClick={handleCompleteToggle}
              >
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button
                className="btn"
                style={{background: "#1976d2", color: "#fff"}}
                onClick={() => navigate(`/tasks/${id}/edit`)}
              >
                Edit
              </button>
              <button
                className="btn"
                style={{background: "#d32f2f", color: "#fff"}}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TaskDetail;
