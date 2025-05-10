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
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
        date: new Date(date),
        createdAt: new Date(),
      };
      if (editId) {
        await updateDoc(doc(db, `users/${userId}/expenses`, editId), expenseData);
        setExpenses(expenses.map(e => (e.id === editId ? { id: editId, ...expenseData } : e)));
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
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const editExpense = (expense) => {
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date.toISOString().split("T")[0]);
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
          {expenses.map(expense => (
            <li key={expense.id} style={styles.listItem}>
              <span>
                ${expense.amount.toFixed(2)} - {expense.category} ({new Date(expense.date).toLocaleDateString()})
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

export default Expenses;