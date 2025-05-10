import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tasks from "./pages/Tasks"
import Habits from './pages/Habits'
import Expenses from "./pages/Expenses"
import Profile from "./pages/Profile";

function App() {

  return (
    <>


<Router>
     <Routes>
     <Route path="/home" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/profile" element={<Profile />} />
    
     
     
     </Routes>
     
  </Router>
    </>
  )
}

export default App
