import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Stopwatch from "../component/Stopwatch";
import './Home.css';


ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Home = () => {
  const [taskStats, setTaskStats] = useState({ completed: 0, pending: 0 });
  const [habitStats, setHabitStats] = useState([]);
  const [expenseStats, setExpenseStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({ email: "", displayName: "" }); // New state for user info
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
        // Set user info (email and displayName)
        setUserInfo({
          email: user.email || "User",
          displayName: user.displayName || "",
        });
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
        // Update user info on auth state change
        setUserInfo({
          email: user.email || "User",
          displayName: user.displayName || "",
        });
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
    <div className="page">
      <Navbar />
      <div className="container">
        <h2 className="heading">SmartTracker Dashboard</h2>
        <div className="welcomeMessage">
  Welcome, {userInfo.displayName ? userInfo.displayName : userInfo.email}!
</div>
         <div className="stopwatchWrapper">
              <Stopwatch />
            </div>
        {isLoading ? (
          <div className="loading">Loading data, please wait...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="charts">
           
            <div className="chartContainer">
              <h3>Task Progress</h3>
              <div className="chartWrapper">
                <Pie data={taskChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chartContainer">
              <h3>Expense Breakdown</h3>
              <div className="chartWrapper">
                <Doughnut data={expenseChartData} options={chartOptions} />
              </div>
            </div>
            <div className="chartContainer">
              <h3>Habit Streaks</h3>
              <div className="chartWrapper">
                <Bar data={habitChartData} options={chartOptions} />
              </div>
            </div>


          </div>
        )}
      </div>
      <Footer />
    </div>

  );
};


export default Home;