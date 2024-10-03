import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleBookNow = (service) => {
    const { _id, serviceName, serviceAmountPerHour } = service;
    // Redirect to payment confirmation with the service ID, name, and amount
    window.location.href = `/confirm-payment?plan=${_id}&name=${encodeURIComponent(serviceName)}&amount=${serviceAmountPerHour}`;
  };

  return (
    <section id="services" className="services section full-screen">
      <Container>
        <h2 className="text-center mb-4">Our Services</h2>
        <Row className="no-gutters">
          {services.map(service => (
            <Col md={3} key={service._id} className="mb-4">
              <Card className="text-center p-4 shadow-lg service-card">
                <h5>{service.serviceName}</h5>
                <p>{service.serviceDescription}</p>
                <p><strong>${service.serviceAmountPerHour} / hour</strong></p>
                <Button variant="primary" className="mt-3 cs-button" onClick={() => handleBookNow(service)}>
                  Book Now
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Services;
