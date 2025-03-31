import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './component/Navbar'
import Login from './pages.jsx/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages.jsx/Home'
import About from './About'
import LoginTracker from './pages.jsx/LoginTracker'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Navbar />
     <Login />
         */}

<Router>
     <Routes>
     <Route path="/home" element={<Home />} />
      <Route path="/" element={<Login />} />
     <Route path="/about" element={<About />} />
     {/* <Route path="/LoginTracker" element={<LoginTracker />} /> */}
    
     
     
     </Routes>
     
  </Router>
    </>
  )
}

export default App
