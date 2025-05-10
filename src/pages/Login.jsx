import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully!");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      console.log("User registered successfully!");
      setIsModalOpen(false); // Close the modal
      setRegisterEmail(""); // Clear modal inputs
      setRegisterPassword("");
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Store Google user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
        lastLogin: new Date()
      }, { merge: true });
      
      console.log("User logged in with Google successfully!");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
      

        {/* Right Section with Login Form */}
        <div style={styles.formSection}>
          <div style={styles.formContainer}>
            <h2 style={styles.heading}>Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
              <div abortion
                style={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.loginButton}>Login</button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  style={styles.registerButton}
                >
                  Register
                </button>
              </div>
            </form>
            <div style={styles.googleButtonContainer}>
              <button onClick={handleGoogleLogin} style={styles.googleButton}>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>Register</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              style={styles.closeButton}
            >
              ×
            </button>
            <form onSubmit={handleRegister} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label htmlFor="registerEmail">Email:</label>
                <input
                  type="email"
                  id="registerEmail"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="Enter your email"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="registerPassword">Password:</label>
                <input
                  type="password"
                  id="registerPassword"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="Enter your password"
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.modalButtonGroup}>
                <button type="submit" style={styles.submitButton}>Submit</button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

// Inline CSS styles
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
  imageSection: {
    flex: 1,
    display: "none",
    '@media (min-width: 768px)': {
      display: "block",
    },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  formSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: "16px",
    '@media (max-width: 767px)': {
      flex: "none",
    },
  },
  formContainer: {
    width: "90%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    textDecoration: "underline",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  error: {
    color: "red",
    margin: "8px 0",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
  },
  loginButton: {
    padding: "10px 20px",
    backgroundColor: "pink",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  registerButton: {
    padding: "10px 20px",
    backgroundColor: "#38A169",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  googleButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px",
  },
  googleButton: {
    padding: "10px 20px",
    backgroundColor: "#3182CE",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
    position: "relative",
  },
  modalHeader: {
    margin: "0 0 20px 0",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
  },
  modalButtonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#3182CE",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#E53E3E",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Login;