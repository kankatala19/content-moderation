import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, Home as HomeIcon } from 'lucide-react'
import Home from './pages/Home'
import Moderation from './pages/Moderation'
import Dashboard from './pages/Dashboard'
import './index.css'

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Shield className="logo-icon" size={28} />
        <span>SafeText AI</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <HomeIcon size={18} /> Home
        </Link>
        <Link to="/moderate" className={`nav-link ${location.pathname === '/moderate' ? 'active' : ''}`}>
          <Shield size={18} /> Moderate
        </Link>
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/moderate" element={<Moderation />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
