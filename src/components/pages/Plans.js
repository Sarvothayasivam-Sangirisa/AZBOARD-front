import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/service-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleChoosePlan = (planId, planType, planAmount) => {
    const token = localStorage.getItem('token');
    const queryParams = `plan=${planId}&service=${encodeURIComponent(planType)}&amount=${planAmount}`;

    if (token) {
      // User is logged in, navigate to payment page
      navigate(`/confirm-payment1?${queryParams}`);
    } else {
      // User is not logged in, navigate to login page
      navigate(`/login?redirect=/confirm-payment1?${queryParams}`);
    }
  };

  return (
    <section id="plans" className="service-plans section bg-light full-screen">
      <Container>
        <h2 className="text-center mb-4">Our Service Plans</h2>
        <Row>
          {plans.map(plan => (
            <Col md={4} key={plan._id}>
              <Card className="text-center p-4 shadow-lg">
                <h3>{plan.planType} Plan</h3>
                <h4>${plan.planAmount.toFixed(2)}</h4>
                <p>{plan.planDescription}</p>
                <Button 
                  variant="primary" className='cs-button'
                  onClick={() => handleChoosePlan(plan._id, plan.planType, plan.planAmount)}>
                  Choose Plan
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Plans;
