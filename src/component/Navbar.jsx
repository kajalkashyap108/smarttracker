// Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHelpCircle } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: 'rgba(27, 184, 246, 0.78)',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 8px rgba(65, 217, 228, 0.85)',
    }}>
      {/* Logo Section */}
      <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
       SmartTracker
      </div>

      {/* Navigation Links */}
      <ul style={{
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        gap: '2rem'
      }}>
        
      </ul>

      {/* Help Icon */}
      <div>
        <FiHelpCircle size={24} color="white" style={{ cursor: 'pointer' }} />
      </div>
    </nav>
  );
};

export default Navbar;
