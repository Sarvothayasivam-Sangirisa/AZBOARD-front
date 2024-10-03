import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/signup.css'; // Ensure to import your CSS file

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      toast.error('You must agree to the terms and conditions.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error. Please check the console for more details.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-image">
        <img src="https://i0.wp.com/shedblog.co.uk/wp-content/uploads/2014/10/FAIL_blc.gif?resize=500%2C384&ssl=1" alt="Sign Up" />
      </div>
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSignUp}>
          <h2>Create a New Account</h2>
          <p>Quick & Simple way to Automate your payment</p>
          <div className="input-icon">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-icon">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="input-icon">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
              />
              I agree to the Terms of Service and the Privacy Policy
            </label>
          </div>

          <button type="submit" className="signup-button">
            CREATE AN ACCOUNT
          </button>
          <div className="signup-footer">
            <p>Already have an account? <Link to="/login" className="signup-link">Login here</Link></p>
          </div>

          <div className="social-buttons">
            <button className="w-100">
              <FaGoogle /> Sign up with Google
            </button>
            <button className="w-100 mt-2">
              <FaFacebook /> Sign up with Facebook
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SignUpPage;
