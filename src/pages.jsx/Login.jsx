import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/firebase";
import { auth } from "../firebase";
import { Button, Flex, Box } from "@chakra-ui/react";
//import Footer from "@/component/Footer";
//import Navbar from "@/component/Navbar";
import { useNavigate } from "react-router-dom";
import tracker from '../assets/SmartTracker.png';
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" overflow="hidden">
      <Navbar />
      <Flex flex="1" direction={{ base: 'column', md: 'row' }}>
        {/* Left Section with Image */}
        <Box flex="1" display={{ base: 'none', md: 'block' }}>
          <img src={tracker} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>

        {/* Right Section with Login Form */}
        <Flex flex="1" justifyContent="center" alignItems="center" bg="#f0f4f8" p={{ base: 4, md: 8 }}>
          <Box width={{ base: '90%', sm: '400px' }} padding="30px" borderRadius="10px" boxShadow="0 4px 8px rgba(0,0,0,0.1)" backgroundColor="white">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}><u>Login</u></h2>
            <form onSubmit={handleLogin}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Flex justifyContent="flex-end" mt={4}>
                <Button type="submit" bg="pink" _hover={{ bg: 'hotpink' }}>Login</Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </Box>
  );
};

export default Login;
