import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import LoadingSpinner from "../component/LoadingSpinner";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, `users/${userId}/tasks`));
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addOrUpdateTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const taskData = {
        title,
        category,
        status: "pending",
        createdAt: new Date(),
      };
      if (editId) {
        await updateDoc(doc(db, `users/${userId}/tasks`, editId), taskData);
        setTasks(tasks.map(t => (t.id === editId ? { id: editId, ...taskData } : t)));
        setEditId(null);
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, `users/${userId}/tasks`, id), taskData);
        setTasks([...tasks, { id, ...taskData }]);
      }
      setTitle("");
      setCategory("Work");
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, `users/${userId}/tasks`, id));
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setCategory(task.category);
    setEditId(task.id);
  };

  const toggleStatus = async (id, currentStatus) => {
    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await updateDoc(doc(db, `users/${userId}/tasks`, id), { status: newStatus });
      setTasks(tasks.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      {isLoading && <LoadingSpinner />}
      <div style={styles.container}>
        {isLoading ? null : (
          <>
            <h2 style={styles.heading}>{editId ? "Edit Task" : "Manage Tasks"}</h2>
            <form onSubmit={addOrUpdateTask} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="Enter task title"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={styles.input}
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Fitness">Fitness</option>
                </select>
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <button type="submit" style={styles.submitButton}>
                {editId ? "Update Task" : "Add Task"}
              </button>
            </form>
            <ul style={styles.list}>
              {tasks.map(task => (
                <li key={task.id} style={styles.listItem}>
                  <span>{task.title} ({task.category}) - {task.status}</span>
                  <div>
                    <button
                      onClick={() => toggleStatus(task.id, task.status)}
                      style={styles.actionButton}
                    >
                      {task.status === "completed" ? "Mark Pending" : "Mark Completed"}
                    </button>
                    <button onClick={() => editTask(task)} style={styles.actionButton}>
                      Edit
                    </button>
                    <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f9fafb",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    flex: 1,
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2D3748",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "32px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #CBD5E0",
    fontSize: "16px",
    outline: "none",
  },
  error: {
    color: "#E53E3E",
    fontSize: "14px",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#38A169",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "16px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    marginBottom: "10px",
    backgroundColor: "#F7FAFC",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
  },
  actionButton: {
    padding: "6px 12px",
    backgroundColor: "#3182CE",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "8px",
    transition: "background-color 0.3s",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#E53E3E",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "8px",
    transition: "background-color 0.3s",
  },
};

export default Tasks;
