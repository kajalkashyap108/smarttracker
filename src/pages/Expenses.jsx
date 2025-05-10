import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const snapshot = await getDocs(collection(db, `users/${userId}/expenses`));
      setExpenses(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate ? data.date.toDate() : new Date(data.date), // Convert Timestamp to Date
          };
        })
      );
    };
    fetchExpenses();
  }, []);

  const addOrUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.currentUser.uid;
      const expenseData = {
        amount: parseFloat(amount),
        category,
        date: new Date(date), // Ensure date is stored as a Date object
        createdAt: new Date(),
      };
      if (editId) {
        await updateDoc(doc(db, `users/${userId}/expenses`, editId), expenseData);
        setExpenses(expenses.map((e) => (e.id === editId ? { id: editId, ...expenseData } : e)));
        setEditId(null);
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, `users/${userId}/expenses`, id), expenseData);
        setExpenses([...expenses, { id, ...expenseData }]);
      }
      setAmount("");
      setCategory("Food");
      setDate("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, `users/${userId}/expenses`, id));
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const editExpense = (expense) => {
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    // Ensure the date is formatted correctly for the input field
    setDate(expense.date instanceof Date ? expense.date.toISOString().split("T")[0] : "");
    setEditId(expense.id);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>{editId ? "Edit Expense" : "Manage Expenses"}</h2>
        <form onSubmit={addOrUpdateExpense} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter amount"
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
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="date">Date:</label>

            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitButton}>
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
        <ul style={styles.list}>
          {expenses.map((expense) => (
            <li key={expense.id} style={styles.listItem}>
              <span>
                ${expense.amount.toFixed(2)} - {expense.category} (
                {expense.date instanceof Date && !isNaN(expense.date)
                  ? expense.date.toLocaleDateString()
                  : "Invalid Date"}
                )
              </span>
              <div>
                <button onClick={() => editExpense(expense)} style={styles.actionButton}>
                  Edit
                </button>
                <button onClick={() => deleteExpense(expense.id)} style={styles.deleteButton}>
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
    backgroundColor: "#f9fafb",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    flex: 1,
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "32px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#2d3748",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "32px",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  error: {
    color: "#e53e3e",
    fontSize: "14px",
    marginTop: "-8px",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#38a169",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
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
    padding: "12px",
    backgroundColor: "#edf2f7",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  actionButton: {
    padding: "8px 14px",
    backgroundColor: "#3182ce",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
  deleteButton: {
    padding: "8px 14px",
    backgroundColor: "#e53e3e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "8px",
    transition: "background-color 0.2s",
  },
};

export default Expenses;