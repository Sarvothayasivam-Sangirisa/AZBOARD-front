import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    planType: '',
    planDescription: '',
    planAmount: ''
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 2; // Display 2 plans per page

  // Fetch all service plans on component mount
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPlanId) {
      // Update plan
      await axios.put(`http://localhost:5000/api/service-plans/${editingPlanId}`, formData);
    } else {
      // Create new plan
      await axios.post('http://localhost:5000/api/service-plans', formData);
    }
    setFormData({ planType: '', planDescription: '', planAmount: '' });
    setEditingPlanId(null);
    fetchPlans();
  };

  const handleEdit = (plan) => {
    setEditingPlanId(plan._id);
    setFormData({
      planType: plan.planType,
      planDescription: plan.planDescription,
      planAmount: plan.planAmount
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/service-plans/${id}`);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  // Pagination logic
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(plans.length / plansPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section id="plans" className="admin-service-plans section bg-light">
      <Container fluid>
        <h2 className="text-center mb-4">Manage Service Plans</h2>

        {/* Form for adding or editing service plans */}
        <Row>
          <Col md={6} className="mx-auto">
            <Card className="p-4 shadow-lg mb-4">
              <h4>{editingPlanId ? 'Edit Plan' : 'Add New Plan'}</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Plan Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="planType"
                    value={formData.planType}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Plan Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="planDescription"
                    value={formData.planDescription}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Plan Amount ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="planAmount"
                    value={formData.planAmount}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className='cs-button'>
                  {editingPlanId ? 'Update Plan' : 'Add Plan'}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Table to display all service plans */}
        <Row>
          <Col>
            <Table striped bordered hover responsive style={{ width: '80%', margin: '0 auto' }}>
              <thead className="table-dark">
                <tr>
                  <th>Plan Type</th>
                  <th>Description</th>
                  <th>Amount ($)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPlans.map((plan) => (
                  <tr key={plan._id}>
                    <td>{plan.planType}</td>
                    <td>{plan.planDescription}</td>
                    <td>{plan.planAmount}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="mr-2"
                        onClick={() => handleEdit(plan)}
                      >
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(plan._id)}>
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

export default AdminPlans;
