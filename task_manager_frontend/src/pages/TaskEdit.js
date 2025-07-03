import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../services/auth";

// PUBLIC_INTERFACE
/**
 * TaskEdit enables create OR edit for a task, depending on URL params. Handles loading, errors, and form validation.
 */
function TaskEdit() {
  const { id } = useParams(); // If `id` is present, we edit, else we create new
  const isEdit = !!id;
  const { token } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(isEdit); // loading true if editing
  const [err, setErr] = useState(null);

  // Fetch task ONLY if editing
  useEffect(() => {
    if (!isEdit) return;
    async function fetchTask() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_ROOT || "http://localhost:3001"}/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Task not found");
        const data = await res.json();
        setForm({
          title: data.title || "",
          description: data.description || "",
          due_date: data.due_date ? data.due_date.substring(0,10) : "",
        });
        setCompleted(!!data.completed);
      } catch (e) {
        setErr(e.message || "Error loading task");
      }
      setLoading(false);
    }
    fetchTask();
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Frontend validation
    if (!form.title || form.title.trim().length === 0) {
      setErr("Title cannot be empty");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const url =
        `${process.env.REACT_APP_API_ROOT || "http://localhost:3001"}/tasks` +
        (isEdit ? `/${id}` : "");
      const method = isEdit ? "PATCH" : "POST";
      const bodyData = {
        ...form,
        completed: completed || false,
      };
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to save");
      }
      // On success, go to task detail or task list
      if (isEdit) {
        navigate(`/tasks/${id}`);
      } else {
        navigate("/tasks");
      }
    } catch (e) {
      setErr(e.message || "Save error");
    }
    setLoading(false);
  };

  return (
    <DashboardLayout title={isEdit ? "Edit Task" : "Create Task"}>
      <div style={{maxWidth:440, margin:"0 auto"}}>
        <form className="auth-form" onSubmit={handleSubmit} style={{marginTop: 15}}>
          <h2 className="auth-title" style={{margin: 0, marginBottom: 18}}>
            {isEdit ? "Edit Task" : "Create New Task"}
          </h2>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              style={{
                minHeight: 70,
                padding: "0.6rem",
                borderRadius: "7px",
                border: "1px solid #dadce0",
                marginTop: ".35rem",
                fontSize: "1rem",
              }}
              placeholder="Add an optional description..."
            />
          </label>
          <label>
            Due Date
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              disabled={loading}
            />
          </label>
          {isEdit && (
            <label style={{display: "flex", alignItems: "center",fontWeight: 400}}>
              <input
                type="checkbox"
                checked={completed}
                onChange={() => setCompleted((v) => !v)}
                style={{marginRight: 7}}
                disabled={loading}
              />
              Mark as completed
            </label>
          )}
          {err && <div style={{color:"#c00",marginBottom:6,fontSize:"0.98rem"}}>{err}</div>}
          <button className="btn btn-block" type="submit" disabled={loading}>
            {loading ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Task")}
          </button>
          <button
            className="btn btn-block"
            type="button"
            style={{
              background:"#888",
              color:"#fff",
              marginTop:5
            }}
            onClick={() => (isEdit ? navigate(`/tasks/${id}`) : navigate("/tasks"))}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default TaskEdit;
