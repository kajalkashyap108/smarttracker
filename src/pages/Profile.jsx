import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import avatar from "../assets/avatar.jpg";

const Profile = () => {
  const [userData, setUserData] = useState({ displayName: "", email: "", photoURL: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Track screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = () => {
      const user = auth.currentUser;
      if (user) {
        setUserData({
          displayName: user.displayName || "Anonymous",
          email: user.email || "No email",
          photoURL: user.photoURL || {avatar},
        });
        setIsLoading(false);
      } else {
        setError("Please log in to view your profile.");
        setIsLoading(false);
        navigate("/");
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        setError("Please log in to view your profile.");
        setIsLoading(false);
        navigate("/");
      }
    });

    fetchUserData();

    return () => unsubscribe();
  }, [navigate]);

  const styles = {
    page: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      boxSizing: "border-box",
    },
    main: {
      display: "flex",
      flex: 1,
      paddingLeft: isMobile ? "0" : "200px",
      paddingTop: "64px",
    },
    container: {
      flex: 1,
      padding: "16px",
      maxWidth: "600px",
      margin: "0 auto",
      boxSizing: "border-box",
    },
    heading: {
      textAlign: "center",
      marginBottom: "24px",
      fontSize: isMobile ? "24px" : "28px",
    },
    profileCard: {
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      backgroundColor: "white",
      textAlign: "center",
      width: "100%",
      maxWidth: isMobile ? "90%" : "500px",
      margin: "0 auto",
    },
    profilePicture: {
      width: isMobile ? "100px" : "150px",
      height: isMobile ? "100px" : "150px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "16px",
    },
    profileName: {
      margin: "0 0 8px",
      fontSize: isMobile ? "20px" : "24px",
    },
    profileEmail: {
      margin: 0,
      color: "#4a5568",
      fontSize: isMobile ? "16px" : "18px",
    },
    loading: {
      textAlign: "center",
      padding: "20px",
      fontSize: isMobile ? "16px" : "18px",
    },
    error: {
      textAlign: "center",
      padding: "20px",
      color: "red",
      fontSize: isMobile ? "16px" : "18px",
    },
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.container}>
          <h2 style={styles.heading}>Your Profile</h2>
          {isLoading ? (
            <div style={styles.loading}>Loading profile, please wait...</div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : (
            <div style={styles.profileCard}>
              <img
                src={userData.photoURL}
                alt="Profile"
                style={styles.profilePicture}
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
              <h3 style={styles.profileName}>{userData.displayName}</h3>
              <p style={styles.profileEmail}>{userData.email}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
