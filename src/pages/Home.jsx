import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Home = () => {
  const [taskStats, setTaskStats] = useState({ completed: 0, pending: 0 });
  const [habitStats, setHabitStats] = useState([]);
  const [expenseStats, setExpenseStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async (userId) => {
    console.log("fetchData called with userId:", userId);
    setIsLoading(true);
    setError(null);
    try {
      // Clear previous state
      setTaskStats({ completed: 0, pending: 0 });
      setHabitStats([]);
      setExpenseStats({});

      // Fetch tasks (limit to 100 documents)
      console.log("Fetching tasks...");
      const tasksQuery = query(collection(db, `users/${userId}/tasks`), limit(100));
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = tasksSnapshot.docs.map((doc) => doc.data());
      console.log("Tasks fetched:", tasks);
      const taskCounts = tasks.reduce(
        (acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        { completed: 0, pending: 0 }
      );
      setTaskStats(taskCounts);

      // Fetch habits (limit to 100 documents)
      console.log("Fetching habits...");
      const habitsQuery = query(collection(db, `users/${userId}/habits`), limit(100));
      const habitsSnapshot = await getDocs(habitsQuery);
      const habits = habitsSnapshot.docs.map((doc) => doc.data());
      console.log("Habits fetched:", habits);
      setHabitStats(habits.map((habit) => ({ name: habit.name || "Unknown", streak: habit.streak || 0 })));

      // Fetch expenses (limit to 100 documents)
      console.log("Fetching expenses...");
      const expensesQuery = query(collection(db, `users/${userId}/expenses`), limit(100));
      const expensesSnapshot = await getDocs(expensesQuery);
      const expenses = expensesSnapshot.docs.map((doc) => doc.data());
      console.log("Expenses fetched:", expenses);
      const expenseTotals = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + (exp.amount || 0);
        return acc;
      }, {});
      setExpenseStats(expenseTotals);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to load data: ${error.message}.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("useEffect running...");
    let retryCount = 0;
    const maxRetries = 2;

    const tryFetchData = () => {
      const user = auth.currentUser;
      if (user) {
        console.log("User authenticated:", user.uid);
        fetchData(user.uid);
      } else if (retryCount < maxRetries) {
        console.log("User not yet authenticated, retrying...", retryCount + 1);
        retryCount++;
        setTimeout(tryFetchData, 1000); // Retry after 1 second
      } else {
        console.warn("No user authenticated after retries");
        setIsLoading(false);
        setError("Please log in to view the dashboard.");
        navigate("/");
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Auth state changed, user:", user.uid);
        fetchData(user.uid);
      } else if (retryCount < maxRetries) {
        console.log("Auth state not ready, scheduling retry...");
        tryFetchData();
      }
    });

    // Initial attempt
    tryFetchData();

    return () => unsubscribe();
  }, [fetchData, navigate]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  const taskChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [taskStats.completed || 0, taskStats.pending || 0],
        backgroundColor: ["#38A169", "#E53E3E"],
      },
    ],
  };

  const habitChartData = {
    labels: habitStats.length ? habitStats.map((h) => h.name || "Unknown") : ["No Data"],
    datasets: [
      {
        label: "Streaks",
        data: habitStats.length ? habitStats.map((h) => h.streak || 0) : [0],
        backgroundColor: habitStats.length ? "#3182CE" : "#CCCCCC",
      },
    ],
  };

  const expenseChartData = {
    labels: Object.keys(expenseStats).length ? Object.keys(expenseStats) : ["No Data"],
    datasets: [
      {
        data: Object.values(expenseStats).length ? Object.values(expenseStats) : [1],
        backgroundColor: Object.keys(expenseStats).length
          ? ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]
          : ["#CCCCCC"],
      },
    ],
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>SmartTracker Dashboard</h2>
        {isLoading ? (
          <div style={styles.loading}>Loading data, please wait...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <div style={styles.charts}>
            <div style={styles.chartContainer}>
              <h3>Task Progress</h3>
              <div style={styles.chartWrapper}>
                <Pie data={taskChartData} options={chartOptions} />
              </div>
            </div>
            <div style={styles.chartContainer}>
              <h3>Habit Streaks</h3>
              <div style={styles.chartWrapper}>
                <Bar data={habitChartData} options={chartOptions} />
              </div>
            </div>
            <div style={styles.chartContainer}>
              <h3>Expense Breakdown</h3>
              <div style={styles.chartWrapper}>
                <Doughnut data={expenseChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  container: {
    flex: 1,
    padding: "16px",
    maxWidth: "1200px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  heading: {
    textAlign: "center",
    marginBottom: "24px",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  card: {
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    textAlign: "center",
  },
  cardButton: {
    padding: "8px 16px",
    backgroundColor: "#3182CE",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  charts: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },
  chartContainer: {
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    textAlign: "center",
    maxHeight: "400px",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  chartWrapper: {
    position: "relative",
    height: "250px",
    width: "100%",
    maxWidth: "350px",
    margin: "0 auto",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    color: "red",
    fontSize: "18px",
  },
};

export default Home;