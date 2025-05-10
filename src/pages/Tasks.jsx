import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const snapshot = await getDocs(collection(db, `users/${userId}/tasks`));
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTasks();
  }, []);

  const addOrUpdateTask = async (e) => {
    e.preventDefault();
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
    }
  };

  const deleteTask = async (id) => {
    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, `users/${userId}/tasks`, id));
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setCategory(task.category);
    setEditId(task.id);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const userId = auth.currentUser.uid;
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await updateDoc(doc(db, `users/${userId}/tasks`, id), { status: newStatus });
      setTasks(tasks.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
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
  },
  container: {
    flex: 1,
    padding: "16px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "24px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  error: {
    color: "red",
    margin: "8px 0",
  },
  submitButton: {
    padding: "8px 16px",
    backgroundColor: "#38A169",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #ccc",
  },
  actionButton: {
    padding: "6px 12px",
    backgroundColor: "#3182CE",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "8px",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#E53E3E",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "8px",
  },
};

export default Tasks;