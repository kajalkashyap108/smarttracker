// src/components/Stopwatch.js
import React, { useState, useRef, useEffect } from "react";

const Stopwatch = ({ name, initialTime = 0, onRemove, onTimeChange, onStop }) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          onTimeChange(newTime); // Notify parent to update local state
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTimeChange]);

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div
      style={{
        backgroundColor: "#f7fafc",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
        minWidth: "300px", // Ensure cards don't shrink too much
        maxWidth: "400px",
        width: "100%",
        boxSizing: "border-box",
        margin: "8px", // Space between cards
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#2d3748",
            margin: "0",
          }}
        >
          {name}
        </h3>
        <button
          onClick={onRemove}
          style={{
            backgroundColor: "#e53e3e",
            color: "#ffffff",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#c53030")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#e53e3e")}
        >
          Remove
        </button>
      </div>
      <div
        style={{
          fontSize: "24px",
          fontFamily: "'Courier New', Courier, monospace",
          color: "#1a202c",
          margin: "8px 0",
          textAlign: "center",
        }}
      >
        {formatTime(time)}
      </div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
          style={{
            backgroundColor: isRunning ? "#a0aec0" : "#38a169",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            !isRunning && (e.target.style.backgroundColor = "#2f855a")
          }
          onMouseOut={(e) =>
            !isRunning && (e.target.style.backgroundColor = "#38a169")
          }
        >
          Start
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            onStop(time); // Notify parent to update Firestore
          }}
          disabled={!isRunning}
          style={{
            backgroundColor: !isRunning ? "#a0aec0" : "#d69e2e",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: !isRunning ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            isRunning && (e.target.style.backgroundColor = "#b7791f")
          }
          onMouseOut={(e) =>
            isRunning && (e.target.style.backgroundColor = "#d69e2e")
          }
        >
          Stop
        </button>
        <button
          onClick={() => {
            setTime(0);
            setIsRunning(false);
            onTimeChange(0); // Update local state
            onStop(0); // Update Firestore with reset time
          }}
          style={{
            backgroundColor: "#3182ce",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3182ce")}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;