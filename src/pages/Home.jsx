// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, query, limit, addDoc, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Stopwatch from "../component/Stopwatch";
import LoadingSpinner from "../component/LoadingSpinner";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Home = () => {
  const [taskStats, setTaskStats] = useState({ completed: 0, pending: 0 });
  const [habitStats, setHabitStats] = useState([]);
  const [expenseStats, setExpenseStats] = useState({});
  const [stopwatches, setStopwatches] = useState([]);
  const [newStopwatchName, setNewStopwatchName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({ email: "", displayName: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [chartData, setChartData] = useState({ stopwatches: [], date: "" });
  const navigate = useNavigate();

  const fetchData = useCallback(async (userId) => {
    console.log("fetchData called with userId:", userId);
    setIsLoading(true);
    setError(null);
    try {
      setTaskStats({ completed: 0, pending: 0 });
      setHabitStats([]);
      setExpenseStats({});

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

      console.log("Fetching habits...");
      const habitsQuery = query(collection(db, `users/${userId}/habits`), limit(100));
      const habitsSnapshot = await getDocs(habitsQuery);
      const habits = habitsSnapshot.docs.map((doc) => doc.data());
      console.log("Habits fetched:", habits);
      setHabitStats(habits.map((habit) => ({ name: habit.name || "Unknown", streak: habit.streak || 0 })));

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

      const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const dayDocRef = doc(db, `users/${userId}/days`, currentDate);
      const dayDoc = await getDoc(dayDocRef);
      if (!dayDoc.exists()) {
        console.log("Fetching stopwatches for current date...");
        const stopwatchesQuery = query(collection(db, `users/${userId}/days/${currentDate}/stopwatches`));
        const stopwatchesSnapshot = await getDocs(stopwatchesQuery);
        const fetchedStopwatches = stopwatchesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          time: doc.data().time * 60, // Convert minutes back to seconds for UI
        }));
        console.log("Stopwatches fetched:", fetchedStopwatches);
        setStopwatches(fetchedStopwatches);
      } else {
        console.log("Day is closed, no stopwatches fetched.");
        setStopwatches([]);
      }

      const dayData = dayDoc.exists() ? dayDoc.data() : { stopwatches: [] };
      setChartData({
        stopwatches: dayData.stopwatches || [],
        date: currentDate,
      });
      setSelectedDate(currentDate);
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
        setUserInfo({
          email: user.email || "User",
          displayName: user.displayName || "",
        });
        fetchData(user.uid);
      } else if (retryCount < maxRetries) {
        console.log("User not yet authenticated, retrying...", retryCount + 1);
        retryCount++;
        setTimeout(tryFetchData, 1000);
      } else {
        console.warn("No user authenticated after retries");
        setIsLoading(false);
        setError("Please log in to view the dashboard.");
        navigate("/");
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Auth state changed, user:", user.uid);
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

    tryFetchData();

    return () => unsubscribe();
  }, [fetchData, navigate]);

  const addStopwatch = async () => {
    if (!newStopwatchName.trim()) {
      alert("Please enter a name for the stopwatch.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add a stopwatch.");
      return;
    }

    try {
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const stopwatchData = {
        name: newStopwatchName,
        time: 0,
        timestamp: Date.now(),
      };
      const stopwatchRef = await addDoc(
        collection(db, `users/${user.uid}/days/${date}/stopwatches`),
        stopwatchData
      );
      setStopwatches([
        ...stopwatches,
        { id: stopwatchRef.id, name: newStopwatchName, time: 0 },
      ]);
      setNewStopwatchName("");
    } catch (error) {
      console.error("Error adding stopwatch to Firestore:", error);
      alert("Failed to add stopwatch: " + error.message);
    }
  };

  const removeStopwatch = async (id) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to remove a stopwatch.");
      return;
    }
  
    try {
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const stopwatchRef = doc(db, `users/${user.uid}/days/${date}/stopwatches`, id);
      await deleteDoc(stopwatchRef);
      console.log(`Stopwatch ${id} deleted from Firestore`);
      setStopwatches(stopwatches.filter((sw) => sw.id !== id));
    } catch (error) {
      console.error("Error removing stopwatch from Firestore:", error);
      alert("Failed to remove stopwatch: " + error.message);
    }
  };

  const updateLocalStopwatchTime = (id, time) => {
    setStopwatches(
      stopwatches.map((sw) => (sw.id === id ? { ...sw, time } : sw))
    );
  };

  const updateStopwatchTime = async (id, time) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const stopwatchRef = doc(db, `users/${user.uid}/days/${date}/stopwatches`, id);
      await setDoc(
        stopwatchRef,
        { time: Math.floor(time / 60), timestamp: Date.now() },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating stopwatch time in Firestore:", error);
      alert("Failed to update stopwatch time: " + error.message);
    }
  };

  const closeDay = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to save data.");
      return;
    }
    if (stopwatches.length === 0) {
      alert("No stopwatches to save.");
      return;
    }

    try {
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const dayData = {
        date,
        stopwatches: stopwatches.map(({ id, name, time }) => ({
          name,
          time: Math.floor(time / 60),
        })),
        timestamp: Date.now(),
      };
      await setDoc(doc(db, `users/${user.uid}/days`, date), dayData);
      alert("Day closed and data saved!");
      setStopwatches([]);
    } catch (error) {
      console.error("Error saving day data to Firestore:", error);
      alert("Failed to save day data: " + error.message);
    }
  };

  const fetchChartData = async (date) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const dayDocRef = doc(db, `users/${user.uid}/days`, date);
      const dayDoc = await getDoc(dayDocRef);
      if (dayDoc.exists()) {
        setChartData({
          stopwatches: dayDoc.data().stopwatches || [],
          date,
        });
      } else {
        setChartData({
          stopwatches: [],
          date,
        });
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      alert("Failed to fetch chart data: " + error.message);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchChartData(date);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow charts to fill container height
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Hours",
        },
        beginAtZero: true,
      },
      x: {
        title: {
          display: true,
          text: "",
        },
      },
    },
  };

  const taskChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [taskStats.completed || 0, taskStats.pending || 0],
        backgroundColor: ["#38a169", "#e53e3e"],
      },
    ],
  };

  const habitChartData = {
    labels: habitStats.length ? habitStats.map((h) => h.name || "Unknown") : ["No Data"],
    datasets: [
      {
        label: "Streaks",
        data: habitStats.length ? habitStats.map((h) => h.streak || 0) : [0],
        backgroundColor: habitStats.length ? "#3182ce" : "#cccccc",
      },
    ],
  };

  const expenseChartData = {
    labels: Object.keys(expenseStats).length ? Object.keys(expenseStats) : ["No Data"],
    datasets: [
      {
        data: Object.values(expenseStats).length ? Object.values(expenseStats) : [1],
        backgroundColor: Object.keys(expenseStats).length
          ? ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"]
          : ["#cccccc"],
      },
    ],
  };

  const stopwatchChartData = {
    labels: chartData.stopwatches.length
      ? chartData.stopwatches.map((sw) => sw.name || "Unknown")
      : ["No Data"],
    datasets: [
      {
        label: "Time Spent (Hours)",
        data: chartData.stopwatches.length
          ? chartData.stopwatches.map((sw) => (sw.time || 0) / 60)
          : [0],
        backgroundColor: chartData.stopwatches.length ? "#10b981" : "#cccccc",
      },
    ],
  };

  return (
    <div>
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Navbar />
      {isLoading && <LoadingSpinner />}
      <div style={{ padding: "20px 0", marginTop:"40px", marginLeft: window.innerWidth > 768 ? "50px" : "0"}}>
        <div style={{ fontSize: "16px", color: "#4a5568", textAlign: "center", marginBottom: "24px" }}>
          Welcome, {userInfo.displayName ? userInfo.displayName : userInfo.email}!
        </div>
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <input
              type="text"
              value={newStopwatchName}
              onChange={(e) => setNewStopwatchName(e.target.value)}
              placeholder="Enter stopwatch name"
              style={{
                padding: "8px",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                flexGrow: 1,
                fontSize: "14px",
              }}
            />
            <button
              onClick={addStopwatch}
              style={{
                backgroundColor: "#3182ce",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3182ce")}
            >
              Add Stopwatch
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {stopwatches.map((sw) => (
              <Stopwatch
                key={sw.id}
                name={sw.name}
                initialTime={sw.time}
                onRemove={() => removeStopwatch(sw.id)}
                onTimeChange={(time) => updateLocalStopwatchTime(sw.id, time)}
                onStop={(time) => updateStopwatchTime(sw.id, time)}
              />
            ))}
          </div>
          {stopwatches.length > 0 && (
            <button
              onClick={closeDay}
              style={{
                backgroundColor: "#805ad5",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                marginTop: "16px",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#6b46c1")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#805ad5")}
            >
              Close Day
            </button>
          )}
        </div>
        {isLoading ? (
          <div style={{ textAlign: "center", color: "#4a5568", fontSize: "16px" }}>
            Loading data, please wait...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "#e53e3e", fontSize: "16px" }}>
            {error}
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center" }}>
            <div
              style={{
                width: "350px", // Fixed width for all chart cards
                minHeight: "250px", // Fixed minimum height for all chart cards
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#2d3748", marginBottom: "8px", textAlign: "center" }}>
                Task Progress
              </h3>
              <div style={{ height: "200px" }}> {/* Fixed height for chart canvas */}
                <Pie data={taskChartData} options={chartOptions} />
              </div>
            </div>
            <div
              style={{
                width: "350px",
                minHeight: "250px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#2d3748", marginBottom: "8px", textAlign: "center" }}>
                Expense Breakdown
              </h3>
              <div style={{ height: "200px" }}>
                <Doughnut data={expenseChartData} options={chartOptions} />
              </div>
            </div>
            <div
              style={{
                width: "350px",
                minHeight: "250px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#2d3748", marginBottom: "8px", textAlign: "center" }}>
                Habit Streaks
              </h3>
              <div style={{ height: "200px" }}>
                <Bar data={habitChartData} options={chartOptions} />
              </div>
            </div>
            <div
              style={{
                width: "350px",
                minHeight: "250px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#2d3748", marginBottom: "8px", textAlign: "center" }}>
                Stopwatch Time (Hours)
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4a5568", marginBottom: "4px" }}>
                  Select Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  style={{
                    padding: "8px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "4px",
                    fontSize: "14px",
                    width: "100%",
                  }}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div style={{ height: "200px" }}>
                <Bar data={stopwatchChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
     
    </div>
    <Footer/>
    </div>
  );
};

export default Home;