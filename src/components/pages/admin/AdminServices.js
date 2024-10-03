import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceDescription: '',
    serviceAmountPerHour: ''
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 2; // Display 2 services per page

  // Fetch all services on component mount
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingServiceId) {
      // Update service
      await axios.put(`http://localhost:5000/api/services/${editingServiceId}`, formData);
    } else {
      // Create new service
      await axios.post('http://localhost:5000/api/services', formData);
    }
    setFormData({ serviceName: '', serviceDescription: '', serviceAmountPerHour: '' });
    setEditingServiceId(null);
    fetchServices();
  };

  const handleEdit = (service) => {
    setEditingServiceId(service._id);
    setFormData({
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription,
      serviceAmountPerHour: service.serviceAmountPerHour
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(services.length / servicesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section id="services" className="admin-services section bg-light">
      <Container fluid>
        <h2 className="text-center mb-4">Manage Services</h2>

        {/* Form for adding or editing services */}
        <Row>
          <Col md={6} className="mx-auto">
            <Card className="p-4 shadow-lg mb-4">
              <h4>{editingServiceId ? 'Edit Service' : 'Add New Service'}</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Service Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Service Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Amount Per Hour ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="serviceAmountPerHour"
                    value={formData.serviceAmountPerHour}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className='cs-button'>
                  {editingServiceId ? 'Update Service' : 'Add Service'}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Table to display all services */}
        <Row>
          <Col>
            <Table striped bordered hover responsive style={{ width: '80%', margin: '0 auto' }}>
              <thead className="table-dark">
                <tr>
                  <th>Service Name</th>
                  <th>Description</th>
                  <th>Amount Per Hour ($)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentServices.map((service) => (
                  <tr key={service._id}>
                    <td>{service.serviceName}</td>
                    <td>{service.serviceDescription}</td>
                    <td>{service.serviceAmountPerHour}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="mr-2"
                        onClick={() => handleEdit(service)}
                      >
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(service._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination className="justify-content-center custom-pagination">
                {[...Array(totalPages).keys()].map((number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => handlePageChange(number + 1)}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminServices;
