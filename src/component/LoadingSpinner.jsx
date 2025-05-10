// src/components/LoadingSpinner.js
import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height to center vertically
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent overlay
        zIndex: 2000, // Above navbar (z-index: 1000)
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #e2e8f0", // Light gray border
          borderTop: "4px solid #3182ce", // Matches navbar color
          borderRadius: "50%",
          animation: "spin 1s linear infinite", // CSS animation
        }}
      ></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;