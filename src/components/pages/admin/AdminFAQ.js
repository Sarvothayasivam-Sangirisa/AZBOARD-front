import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const AdminFAQ = () => {
  return (
    <section id="faq" className="faq-section section full-screen bg-light">
      <Container>
        <h2 className="text-center mb-4">Frequently Asked Questions</h2>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>What is AIZBOARD?</Accordion.Header>
            <Accordion.Body>
              AIZBOARD is a trusted platform for home repairs and property management.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Are service providers reliable?</Accordion.Header>
            <Accordion.Body>
              Yes, all providers are licensed and fully qualified.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </section>
  );
};

export default AdminFAQ;
