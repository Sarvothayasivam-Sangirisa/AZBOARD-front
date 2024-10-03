import React, { useState } from 'react';
import '../style/login.css'; // Ensure to import your CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from query parameters
  const query = new URLSearchParams(location.search);
  const redirectTo = query.get('redirect');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role); // Store user role
        localStorage.setItem('email', data.user.email); // Store user email
        onLogin(data.user.firstName);
  
        toast.success('Login successful! Redirecting...');
  
        // Redirect based on user role
        setTimeout(() => {
          navigate(redirectTo || (data.user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'));
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(`Login failed: ${errorData.message || response.statusText}`);
        toast.error(errorData.message || 'Login failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again later.');
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-image">
        <img src="https://i0.wp.com/shedblog.co.uk/wp-content/uploads/2014/10/FAIL_blc.gif?resize=500%2C384&ssl=1" alt="Login" />
      </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In to AZBOARD</h2>
          <div className="input-icon">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-icon">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button cs-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
          <div className="login-footer">
            <p>Don't have an account? <a href="/signup" className="signup-link c-text">Sign up</a></p>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
