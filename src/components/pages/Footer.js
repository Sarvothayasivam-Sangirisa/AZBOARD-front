import React from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
// Import your CSS file

const Footer = () => {
  return (
    <footer id="contact" className="footer section bg-custom text-white text-center">
      <Container>
        <Row>
          <Col md={4}>
            <h5>AZBOARD</h5>
            <p>AZBOARD is your trusted partner in home management and repairs.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="#home" className="text-white">Home</Nav.Link>
              <Nav.Link href="#services" className="text-white">Services</Nav.Link>
              <Nav.Link href="#plans" className="text-white">Plans</Nav.Link>
              <Nav.Link href="#faq" className="text-white">FAQ</Nav.Link>
              <Nav.Link href="#contact" className="text-white">Contact</Nav.Link>
            </Nav>
          </Col>
          <Col md={4}>
            <h5>Subscribe to Our Newsletter</h5>
            <form className="d-flex flex-column">
              <input type="email" placeholder="Enter your email" className="mb-2" />
              <Button variant="light" type="submit" className="cs-button">Subscribe</Button>
            </form>
          </Col>
        </Row>
        <Row className="mt-4">
        <Col>
            <p>&copy; 2024 AZBOARD. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
