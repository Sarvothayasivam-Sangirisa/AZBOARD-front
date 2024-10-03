import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';

const AdminCard = () => {
  const [serviceBookings, setServiceBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5; // Display 5 bookings per page

  // Fetch all service bookings on component mount
  useEffect(() => {
    fetchServiceBookings();
  }, []);

  const fetchServiceBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      console.log('Fetched Service Bookings:', response.data); // Log the fetched data
      setServiceBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = serviceBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(serviceBookings.length / bookingsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      fetchServiceBookings(); // Refresh the bookings after deletion
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <section id="bookings" className="full-screen d-flex flex-column justify-content-center align-items-center text-center">
      <Container fluid>
        <h2 className="text-center mb-4">Manage Plans Bookings</h2>

        {/* Table to display all service bookings */}
        <Row>
          <Col>
            <Table striped bordered hover responsive style={{ width: '80%', margin: '0 auto' }}>
              <thead className="table-dark">
                <tr>
                  <th>Plan Name</th>
                  <th>Service Location</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Duration (months)</th>
                  <th>Total Amount ($)</th>
                  <th>Booked On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.planName}</td>
                    <td>{booking.planserviceLocation}</td>
                    <td>{booking.planuser}</td>
                    <td>{booking.planemail}</td>
                    <td>{booking.planduration}</td>
                    <td>${booking.plantotalAmount !== undefined ? booking.plantotalAmount.toFixed(2) : 'N/A'}</td>
                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDeleteBooking(booking._id)}>
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

export default AdminCard;
