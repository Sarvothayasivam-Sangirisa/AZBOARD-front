import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faCheckCircle, faClock, faUserTie, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import door1 from '../../Image/door.webp';
import window from '../../Image/window.webp';

const AdminHeroSection = () => {
  return (
    <section id="home" className="hero-section full-screen d-flex flex-column justify-content-center align-items-center text-center">
      <Container fluid>
        <Row className="align-items-center justify-content-center">
          <Col md={3} className="hero-image d-none d-md-block">
            <img src={door1} alt="Worker fixing a door" className="img-fluid rounded same-size" />
          </Col>
          <Col md={6} className="hero-content text-center">
            <p className="subheading">Maintenances - Repairs - Improvements</p>
            <h1 className="display-5">Need property management or repair your home?<br/> We can help!</h1>
            <ul className="benefits-list list-unstyled">
              <li>Free Quotes</li>
              <li>100% Commitment-Free</li>
            </ul>
            <Button variant="light" className="call-us-button mt-3">
              <FontAwesomeIcon icon={faPhone} className="fa-phone" /> Call Us Now
            </Button>
          </Col>
          <Col md={3} className="hero-image d-none d-md-block">
            <img src={window} alt="Window cleaning" className="img-fluid rounded same-size" />
          </Col>
        </Row>
        <div className="benefits-icons benefits-background text-white py-4 mt-5">
  <Row className="text-center">
    <Col xs={6} md={3} className="icon-item">
      <FontAwesomeIcon icon={faCheckCircle} className="icon mb-2" />
      <p>Satisfaction Guarantee</p>
    </Col>
    <Col xs={6} md={3} className="icon-item">
      <FontAwesomeIcon icon={faClock} className="icon mb-2" />
      <p>24H Availability</p>
    </Col>
    <Col xs={6} md={3} className="icon-item">
      <FontAwesomeIcon icon={faUserTie} className="icon mb-2" />
      <p>Local US Professional</p>
    </Col>
    <Col xs={6} md={3} className="icon-item">
      <FontAwesomeIcon icon={faCalendarAlt} className="icon mb-2" />
      <p>Flexible Appointments</p>
    </Col>
  </Row>
</div>

      </Container>
    </section>
  );
};

export default AdminHeroSection;
