// components/pages/Card.js
import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Alert } from 'react-bootstrap';

const Card = () => {
  const [serviceBookings, setServiceBookings] = useState([]);
  const [planBookings, setPlanBookings] = useState([]);
  const [serviceError, setServiceError] = useState('');
  const [planError, setPlanError] = useState('');
  const userEmail = localStorage.getItem('email'); // Assuming the email is stored in localStorage

  useEffect(() => {
    const fetchServiceBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookingservice');
        if (!response.ok) {
          throw new Error('Failed to fetch service bookings');
        }
        const data = await response.json();
        // Filter service bookings by user email
        const userServiceBookings = data.filter(booking => booking.email === userEmail);
        setServiceBookings(userServiceBookings);
      } catch (error) {
        console.error(error);
        setServiceError('Could not fetch service bookings. Please try again later.');
      }
    };

    const fetchPlanBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch plan bookings');
        }
        const data = await response.json();
        // Filter plan bookings by user email
        const userPlanBookings = data.filter(booking => booking.planemail === userEmail);
        setPlanBookings(userPlanBookings);
      } catch (error) {
        console.error(error);
        setPlanError('Could not fetch plan bookings. Please try again later.');
      }
    };

    fetchServiceBookings();
    fetchPlanBookings();
  }, [userEmail]); // Dependency array includes userEmail

  return (
    <section id="card" className="services">
      <Container>
        <h1>Your Service Bookings Details</h1>
        {serviceError && <Alert variant="danger">{serviceError}</Alert>}
        {serviceBookings.length === 0 ? (
          <p>No service bookings found for your email.</p>
        ) : (
          <ListGroup>
            {serviceBookings.map(booking => (
              <ListGroup.Item key={booking._id}>
                <h5>Service: {booking.planName}</h5>
                <p>Service Location: {booking.serviceLocation}</p>
                <p>Hours: {booking.hours}</p>
                <p>Total Amount: ${booking.totalAmount ? booking.totalAmount.toFixed(2) : 'N/A'}</p>
                <p>Booked On: {new Date(booking.createdAt).toLocaleString()}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>

      <Container>
        <h1>Your Plan Bookings Details</h1>
        {planError && <Alert variant="danger">{planError}</Alert>}
        {planBookings.length === 0 ? (
          <p>No plan bookings found for your email.</p>
        ) : (
          <ListGroup>
            {planBookings.map(booking => (
              <ListGroup.Item key={booking._id}>
                <h5>Plan: {booking.planName}</h5>
                <p>Service Location: {booking.planserviceLocation}</p>
                <p>Duration: {booking.planduration} month(s)</p>
                <p>Total Amount: ${booking.plantotalAmount ? booking.plantotalAmount.toFixed(2) : 'N/A'}</p>
                <p>Booked On: {new Date(booking.createdAt).toLocaleString()}</p> {/* Ensure using the correct date property */}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
    </section>
  );
};

export default Card;
