import React from 'react'
import { Card } from "@chakra-ui/react"
import { Flex } from "@chakra-ui/react"
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'

import Imageoftracker from "../assets/SmartTracker.png"
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from '@chakra-ui/react'

export default function Login() {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully!");
      // Redirect or update state as needed
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
       <div>
      <Navbar />
      <Flex>
        <div>
        <img src={Imageoftracker} alt="photo" />
        </div>

        
        <Card.Root width="400px" height="300px" margin="80px" bg='skyblue' marginRight="60px" >
      <h2 style={{textAlign:'center'}}><u>Login</u></h2>
      
      <form onSubmit={handleLogin}>
        <div style={{padding:'35px'}}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

       </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Flex justifyContent="flex-end" padding='10px' margin='10px'>
  <Button type="submit" bg="pink">Login</Button>
</Flex>

        </div>
      </form>
      </Card.Root>
      </Flex>
      <Footer />
    </div>
    </div>
  )
}
