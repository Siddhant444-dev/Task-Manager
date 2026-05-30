import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStage,
} from "../api/taskApi";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    stage: "TODO",
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTasks(token);
      setTasks(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchTasks();
  }, [token, navigate]);

  const grouped = useMemo(() => {
    return {
      TODO: tasks?.filter((task) => task.stage === "TODO") || [],
      IN_PROGRESS: tasks?.filter((task) => task.stage === "IN_PROGRESS") || [],
      DONE: tasks?.filter((task) => task.stage === "COMPLETED") || [],
    };
  }, [tasks]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleChange = (e) => {
    setTaskForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      stage: "TODO",
    });
    setEditingTaskId(null);
  };

  const handleToggleForm = () => {
    if (showForm) {
      resetForm();
    }
    setShowForm(!showForm);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      if (editingTaskId) {
        await updateTask(token, editingTaskId, taskForm);
      } else {
        await createTask(token, taskForm);
      }

      resetForm();
      setShowForm(false);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (task) => {
    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      stage: task.stage || "TODO",
    });
    setEditingTaskId(task.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (taskId) => {
    try {
      setError("");
      await deleteTask(token, taskId);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleStageChange = async (task) => {
    const nextStageMap = {
      TODO: "IN_PROGRESS",
      IN_PROGRESS: "COMPLETED",
      COMPLETED: "TODO",
    };

    const nextStage = nextStageMap[task.stage] || "TODO";

    try {
      setError("");
      await updateTaskStage(token, task.id, { stage: nextStage });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task stage");
    }
  };

  if (loading) {
    return (
      <div style={styles.centerState}>
        <h2 style={styles.stateTitle}>Loading dashboard...</h2>
        <p style={styles.stateText}>Fetching your tasks.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>Task Manager</h1>
          <p style={styles.subheading}>Welcome, {username || "User"}</p>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.addBtn} onClick={handleToggleForm}>
            {showForm ? "Close Form" : "Add Task"}
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {showForm && (
        <section style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingTaskId ? "Edit Task" : "Create New Task"}
          </h2>

          <form onSubmit={handleCreateTask} style={styles.form}>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={taskForm.title}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <textarea
              name="description"
              placeholder="Task description"
              value={taskForm.description}
              onChange={handleChange}
              rows="4"
              style={styles.textarea}
            />

            <select
              name="stage"
              value={taskForm.stage}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Done</option>
            </select>

            <button type="submit" style={styles.primaryBtn} disabled={creating}>
              {creating
                ? "Saving..."
                : editingTaskId
                ? "Update Task"
                : "Create Task"}
            </button>
          </form>
        </section>
      )}

      <section style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Tasks</p>
          <h2 style={styles.statValue}>{tasks.length}</h2>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Todo</p>
          <h2 style={styles.statValue}>{grouped.TODO.length}</h2>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>In Progress</p>
          <h2 style={styles.statValue}>{grouped.IN_PROGRESS.length}</h2>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Done</p>
          <h2 style={styles.statValue}>{grouped.DONE.length}</h2>
        </div>
      </section>

      <section style={styles.board}>
        <TaskColumn
          title="Todo"
          tasks={grouped.TODO}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMove={handleStageChange}
        />
        <TaskColumn
          title="In Progress"
          tasks={grouped.IN_PROGRESS}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMove={handleStageChange}
        />
        <TaskColumn
          title="Done"
          tasks={grouped.DONE}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMove={handleStageChange}
        />
      </section>
    </div>
  );
}

function TaskColumn({ title, tasks = [], onEdit, onDelete, onMove }) {
  return (
    <div style={styles.column}>
      <div style={styles.columnHeader}>
        <h3 style={styles.columnTitle}>{title}</h3>
        <span style={styles.countBadge}>{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <div style={styles.emptyCard}>
          <p style={styles.emptyText}>No tasks here yet.</p>
        </div>
      ) : (
        <div style={styles.cardList}>
          {tasks.map((task) => (
            <div key={task.id} style={styles.taskCard}>
              <h4 style={styles.taskTitle}>{task.title}</h4>
              <p style={styles.taskDesc}>
                {task.description || "No description provided."}
              </p>
              <span style={styles.stageBadge}>{task.stage}</span>

              <div style={styles.cardActions}>
                <button style={styles.editBtn} onClick={() => onEdit(task)}>
                  Edit
                </button>
                <button style={styles.moveBtn} onClick={() => onMove(task)}>
                  Move
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "24px",
  },
  header: {
    maxWidth: "1200px",
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  heading: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },
  subheading: {
    margin: "6px 0 0",
    color: "#6b7280",
  },
  addBtn: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
  },
  logoutBtn: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    background: "#111827",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
  },
  formCard: {
    maxWidth: "1200px",
    margin: "0 auto 24px",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  formTitle: {
    marginTop: 0,
    marginBottom: "16px",
    color: "#111827",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
  },
  primaryBtn: {
    border: "none",
    borderRadius: "10px",
    padding: "12px 16px",
    background: "#111827",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  errorBox: {
    maxWidth: "1200px",
    margin: "0 auto 16px",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    padding: "12px 16px",
    borderRadius: "12px",
  },
  errorText: {
    margin: 0,
    color: "#b91c1c",
  },
  statsRow: {
    maxWidth: "1200px",
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  statLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
  statValue: {
    margin: "8px 0 0",
    fontSize: "30px",
    color: "#111827",
  },
  board: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    alignItems: "start",
  },
  column: {
    background: "#e9eef7",
    borderRadius: "18px",
    padding: "16px",
    minHeight: "420px",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  columnTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#111827",
  },
  countBadge: {
    minWidth: "30px",
    height: "30px",
    borderRadius: "999px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 600,
    padding: "0 10px",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },
  taskTitle: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "17px",
    color: "#111827",
  },
  taskDesc: {
    margin: 0,
    marginBottom: "12px",
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  stageBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#3730a3",
    fontSize: "12px",
    fontWeight: 600,
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  editBtn: {
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    background: "#111827",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  moveBtn: {
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    background: "#dc2626",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  emptyCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    border: "1px dashed #cbd5e1",
  },
  emptyText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
  centerState: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "24px",
  },
  stateTitle: {
    margin: 0,
    marginBottom: "8px",
    color: "#111827",
  },
  stateText: {
    margin: 0,
    color: "#6b7280",
  },
};

export default DashboardPage;