import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./Navbar.css";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const isLoginPage = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close sidebar on outside click (only on mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMobile = window.innerWidth <= 768;
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <div className="navbar-top">
        {!isLoginPage && (
          <button className="navbar-menu-button" onClick={toggleSidebar}>
            ☰
          </button>
        )}
        <h1 className="navbar-brand">SmartTracker</h1>
      </div>

      {!isLoginPage && (
        <div
          ref={sidebarRef}
          className={`navbar-sidebar ${isSidebarOpen ? "open" : ""}`}
        >
          <div className="sidebar-header">
            <h2>SmartTracker</h2>
          </div>

          <ul className="navbar-menu">
            <li>
            <button onClick={() => navigate("/home")}>Home</button>
            </li>
            <li>
              <button onClick={() => navigate("/tasks")}>Tasks</button>
            </li>
            <li>
              <button onClick={() => navigate("/habits")}>Habits</button>
            </li>
            <li>
              <button onClick={() => navigate("/expenses")}>Expenses</button>
            </li>
          </ul>

          <div className="sidebar-footer">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
