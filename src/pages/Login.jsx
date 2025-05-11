import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { MdLogin, MdPersonAdd, MdClose } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import loginImage from "../assets/loginimage.svg";
import { color } from "chart.js/helpers";

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
      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      alert("User registered successfully!");
      setIsModalOpen(false);
      setRegisterEmail("");
      setRegisterPassword("");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
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
        {/* Image Section */}
        <div style={styles.imageSection}>
          <img 
            src={loginImage} 
            alt="Login Illustration" 
            style={styles.image}
          />
        </div>

        {/* Form Section */}
        <div style={styles.formSection}>
          <div style={styles.formContainer}>
            <h2 style={styles.heading}>Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email:</label>
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
                <label htmlFor="password" style={styles.label}>Password:</label>
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
                <button 
                  type="submit" 
                  style={styles.loginButton}
                >
                  <MdLogin style={styles.buttonIcon} /> Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  style={styles.registerButton}
                >
                  <MdPersonAdd style={styles.buttonIcon} /> Register
                </button>
              </div>
            </form>
            <div style={styles.googleButtonContainer}>
              <button 
                onClick={handleGoogleLogin}
                style={styles.googleButton}
              >
                <FcGoogle style={styles.buttonIcon} /> Sign in with Google
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
              <MdClose style={{ fontSize: '24px' }} />
            </button>
            <form onSubmit={handleRegister} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label htmlFor="registerEmail" style={styles.label}>Email:</label>
                <input
                  type="email"
                  id="registerEmail"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="registerPassword" style={styles.label}>Password:</label>
                <input
                  type="password"
                  id="registerPassword"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={styles.input}
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.modalButtonGroup}>
                <button 
                  type="submit"
                  style={styles.submitButton}
                >
                  <MdPersonAdd style={styles.buttonIcon} /> Register
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={styles.cancelButton}
                >
                  <MdClose style={styles.buttonIcon} /> Cancel
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

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f4f8',
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  imageSection: {
    display: window.innerWidth > 768 ? "flex" : "none",
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '75%',
    height: '75%',
    objectFit: 'contain'
  },
  formSection: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '32px'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '24px',
    textDecoration: 'underline'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGroup: {
    display: "flex",
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px'
  },
  error: {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px'
  },
  loginButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#f472b6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  registerButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  googleButtonContainer: {
    marginTop: '16px'
  },
  googleButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #000000',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    position: 'relative'
  },
  modalHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '16px'
  },
  closeButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  modalButtonGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px'
  },
  submitButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  cancelButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  buttonIcon: {
    fontSize: '18px'
  }
};

export default Login;