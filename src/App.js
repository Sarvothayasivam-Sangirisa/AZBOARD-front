import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import CustomNavbar from './components/pages/Navbar';
import HeroSection from './components/pages/HeroSection';
import Plans from './components/pages/Plans';
import Services from './components/pages/Services';
import FAQ from './components/pages/FAQ';
import Footer from './components/pages/Footer';
import Login from './components/pages/LoginPage';
import SignupForm from './components/pages/SignUpPage';
import UserDashboard from './components/panal/User';
import AdminDashboard from './components/panal/Admin';
import ConfirmPayment from './components/pages/ConfirmPayment';
import ConfirmPayment1 from './components/pages/ConfirmPaymentplan';
import Card from './components/pages/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('username') || null);
  const [isAdmin, setIsAdmin] = useState(() => {
    const role = localStorage.getItem('role'); // Assuming you store role in localStorage
    return role === 'admin'; // Check if the role is 'admin'
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = (username, role) => {
    setUser(username);
    setIsAdmin(role === 'admin'); // Update isAdmin based on the role
    localStorage.setItem('username', username);
    localStorage.setItem('role', role); // Save role in localStorage
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false); // Reset isAdmin on logout
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="app-container">
      <CustomNavbar user={user} onLogout={handleLogout} isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<><HeroSection /><Plans /><Services /><FAQ /></>} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/confirm-payment" element={<ConfirmPayment />} />
        <Route path="/confirm-payment1" element={<ConfirmPayment1 />} />
        <Route path="/card" element={<Card />} />
        
      </Routes>
      <Footer />
    </div>
  );
}

// Wrap App component in Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
