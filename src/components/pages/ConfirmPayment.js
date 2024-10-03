import React, { useState, useEffect } from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import '../style/login.css'; // Ensure consistent styling

const ConfirmPayment = () => {
  const [serviceLocation, setServiceLocation] = useState(''); // State for service location
  const [hours, setHours] = useState(1); // Default to 1 hour
  const [serviceName, setServiceName] = useState('');
  const [serviceAmountPerHour, setServiceAmountPerHour] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState({ success: null, message: '' });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // Extract service details from the URL
  const query = new URLSearchParams(location.search);
  const planId = query.get('plan');
  const name = query.get('name'); // Service name
  const amount = query.get('amount'); // Service cost per hour

  // Retrieve username and email from localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    const loggedInEmail = localStorage.getItem('email');
    if (loggedInUser) setUsername(loggedInUser);
    if (loggedInEmail) setEmail(loggedInEmail);
  }, []);

  useEffect(() => {
    if (name && amount) {
      setServiceName(name);
      setServiceAmountPerHour(parseFloat(amount)); // Convert to float for calculations
      setTotalAmount(parseFloat(amount)); // Initialize total amount
    }
  }, [name, amount]);

  useEffect(() => {
    setTotalAmount(hours * serviceAmountPerHour); // Calculate total amount
  }, [hours, serviceAmountPerHour]);

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=/confirm-payment?plan=${planId}&name=${name}&amount=${amount}`);
    }
  }, [isLoggedIn, navigate, planId, name, amount]);

  const handleSuccessPayment = async (details) => {
    try {
      // Prepare the booking data to be sent to the backend
      const bookingData = {
        planName: serviceName,
        serviceLocation: serviceLocation ,  // Use entered location or default to 'jaffna'
        hours: hours,
        totalAmount: totalAmount.toFixed(2),
        paymentId: details.id,
        user: username, 
        email: email,
      };

      console.log('Booking Data:', bookingData);  // Log the data being sent to backend

      const response = await axios.post('http://localhost:5000/api/bookingservice', bookingData);
  
      setPaymentStatus({ success: true, message: response.data.message });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({ success: false, message: 'Error processing payment. Please try again.' });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form behavior
    console.log('Form Submitted with Location:', serviceLocation); // Check location on submission
  };

  return (
    <Container className="login-container">
      <div className="login-form">
        <h2 className="text-center mb-4">Confirm Payment</h2>

        {paymentStatus.message && (
          <Alert variant={paymentStatus.success ? 'success' : 'danger'}>
            {paymentStatus.message}
          </Alert>
        )}

        <p><strong>Service:</strong> {serviceName || 'Loading...'}</p>
        <p><strong>Amount per Hour:</strong> ${serviceAmountPerHour.toFixed(2)}</p>
        <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>

        <Form onSubmit={handleFormSubmit}>
          <Form.Group>
            <Form.Label>Service Location</Form.Label>
            <Form.Control
              type="text"
              value={serviceLocation}
              onChange={(e) => {
                setServiceLocation(e.target.value); // Update state on input change
                console.log('Updated service location:', e.target.value);  // Log the value
              }}
              placeholder="Enter service location"
              required
              className="input-icon"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Hours</Form.Label>
            <Form.Control
              type="number"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              min={1}
              required
              className="input-icon"
            />
          </Form.Group>

          <h3>Payment Information</h3>

          <PayPalScriptProvider options={{ "client-id": "AT4si2YLorhpc5Nk-YiaE8za2qLz2Jo9cSp3AgoJnFZAXpum0idHZOu35dqP5bj0S9nB6qHP0h7Lk9k_" }}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: totalAmount.toFixed(2) } }]
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                handleSuccessPayment(details); // Pass payment details to handleSuccessPayment
              }}
              onError={(err) => {
                console.error('PayPal payment failed:', err);
              }}
            />
          </PayPalScriptProvider>
        </Form>
      </div>
    </Container>
  );
};

export default ConfirmPayment;
