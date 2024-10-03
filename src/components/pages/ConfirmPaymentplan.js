import React, { useState, useEffect } from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import '../style/login.css';

const ConfirmPaymentplan = () => {
  const [serviceLocation, setServiceLocation] = useState('jaffna');
  const [serviceName, setServiceName] = useState('');
  const [serviceAmount, setServiceAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [duration, setDuration] = useState('1'); // Default to 1 month
  const [username, setUsername] = useState(''); // Define username state
  const [email, setEmail] = useState(''); // Define email state
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting query parameters
  const query = new URLSearchParams(location.search);
  const plan = query.get('plan');
  const service = query.get('service');
  const amount = query.get('amount');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    const loggedInEmail = localStorage.getItem('email'); 
    if (loggedInUser) {
      setUsername(loggedInUser); 
    }
    if (loggedInEmail) {
      setEmail(loggedInEmail); 
    }
  }, []);

  // Set service details from URL parameters
  useEffect(() => {
    if (service && amount) {
      setServiceName(service);
      setServiceAmount(parseFloat(amount)); // Total service amount
    }
  }, [service, amount]);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=/confirm-payment?plan=${plan}`);
    }
  }, [isLoggedIn, navigate, plan]);

  // Calculate total amount based on duration
  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const totalAmount = serviceAmount * duration; // Calculate total based on duration

  // Validate input before proceeding with payment
  const validateForm = () => {
    if (!serviceLocation.trim()) {
      setValidationError('Service location is required.');
      return false;
    }
    return true;
  };

  const handleSuccessPayment = async (details) => {
    try {
      const bookingData = {
        planName: serviceName,
        planserviceLocation: serviceLocation,
        planpaymentId: details.id,
        planuser: username, 
        planemail: email,
        planduration: duration, // Save the selected duration
        plantotalAmount: totalAmount // Send total amount to the database
      };

      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
      setPaymentStatus({ success: true, message: response.data.message });

      // Optionally redirect after success
      // navigate('/success');
    } catch (error) {
      console.error('Error processing payment:', error.response ? error.response.data : error.message);
      setPaymentStatus({ success: false, message: 'Error processing payment. Please try again.' });
    }
  };

  return (
    <Container className="login-container">
      <div className="login-form">
        <h2 className="text-center mb-4">Confirm Payment</h2>
        
        <p><strong>Plan:</strong> {serviceName || 'Loading...'}</p>
        <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2) || 'Loading...'}</p>

        <Form>
          <Form.Group>
            <Form.Label>Service Location</Form.Label>
            <Form.Control
              type="text"
              value={serviceLocation}
              onChange={(e) => setServiceLocation(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Duration</Form.Label>
            <Form.Control as="select" value={duration} onChange={handleDurationChange}>
              <option value="1">1 Month</option>
              <option value="6">6 Months</option>
              <option value="12">1 Year</option>
            </Form.Control>
          </Form.Group>

          <h3>Payment Information</h3>
          <PayPalScriptProvider options={{ "client-id": "AT4si2YLorhpc5Nk-YiaE8za2qLz2Jo9cSp3AgoJnFZAXpum0idHZOu35dqP5bj0S9nB6qHP0h7Lk9k_" }}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: totalAmount.toFixed(2) // Total amount to be charged
                    }
                  }]
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                handleSuccessPayment(details);
              }}
              onError={(err) => {
                setPaymentStatus({ success: false, message: 'Payment failed. Please try again.' });
              }}
            />
          </PayPalScriptProvider>
        </Form>

        {paymentStatus && (
          <Alert variant={paymentStatus.success ? 'success' : 'danger'} className="mt-3">
            {paymentStatus.message}
          </Alert>
        )}
      </div>
    </Container>
  );
};

export default ConfirmPaymentplan;
