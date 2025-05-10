import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabits = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const snapshot = await getDocs(collection(db, `users/${userId}/habits`));
      setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchHabits();
  }, []);

  const addOrUpdateHabit = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.currentUser.uid;
      const habitData = {
        name,
        streak: editId ? habits.find(h => h.id === editId).streak || 0 : 0,
        lastCompleted: null,
        createdAt: new Date(),
      };
      if (editId) {
        await updateDoc(doc(db, `users/${userId}/habits`, editId), habitData);
        setHabits(habits.map(h => (h.id === editId ? { id: editId, ...habitData } : h)));
        setEditId(null);
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, `users/${userId}/habits`, id), habitData);
        setHabits([...habits, { id, ...habitData }]);
      }
      setName("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteHabit = async (id) => {
    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, `users/${userId}/habits`, id));
      setHabits(habits.filter(h => h.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const editHabit = (habit) => {
    setName(habit.name);
    setEditId(habit.id);
  };

  const markHabitDone = async (id) => {
    try {
      const userId = auth.currentUser.uid;
      const habit = habits.find(h => h.id === id);
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isSameDay = lastCompleted && lastCompleted.setHours(0, 0, 0, 0) === today.getTime();
      if (!isSameDay) {
        await updateDoc(doc(db, `users/${userId}/habits`, id), {
          streak: (habit.streak || 0) + 1,
          lastCompleted: today,
        });
        setHabits(habits.map(h => (h.id === id ? { ...h, streak: (h.streak || 0) + 1, lastCompleted: today } : h)));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>{editId ? "Edit Habit" : "Manage Habits"}</h2>
        <form onSubmit={addOrUpdateHabit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Habit Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter habit name"
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitButton}>
            {editId ? "Update Habit" : "Add Habit"}
          </button>
        </form>
        <ul style={styles.list}>
          {habits.map(habit => (
            <li key={habit.id} style={styles.listItem}>
              <span>{habit.name} (Streak: {habit.streak || 0})</span>
              <div>
                <button onClick={() => markHabitDone(habit.id)} style={styles.actionButton}>
                  Mark Done
                </button>
                <button onClick={() => editHabit(habit)} style={styles.actionButton}>
                  Edit
                </button>
                <button onClick={() => deleteHabit(habit.id)} style={styles.deleteButton}>
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
    backgroundColor: "#f9f9f9",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    flex: 1,
    padding: "24px",
    maxWidth: "720px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#2D3748",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "32px",
  },
  formGroup: {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #CBD5E0",
    fontSize: "16px",
    transition: "border-color 0.2s",
  },
  error: {
    color: "#E53E3E",
    fontSize: "14px",
    margin: "8px 0",
  },
  submitButton: {
    padding: "10px 16px",
    backgroundColor: "#38A169",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #E2E8F0",
    backgroundColor: "#F7FAFC",
    borderRadius: "6px",
    marginBottom: "12px",
  },
  actionButton: {
    padding: "8px 12px",
    backgroundColor: "#4299E1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "8px",
    transition: "background-color 0.2s",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#E53E3E",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "8px",
    transition: "background-color 0.2s",
  },
};
export default Habits;