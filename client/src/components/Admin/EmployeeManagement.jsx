import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import api from '../../services/api';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/users');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees.');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { ...form });
      fetchEmployees();
      resetForm();
      setShowModal(false); // Close modal after creating
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employee.');
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({ name: employee.name, email: employee.email, password: '', role: employee.role }); // Reset password for editing
    setShowModal(true); // Open modal for editing
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editingId}`, { ...form });
      fetchEmployees();
      resetForm();
      setShowModal(false); // Close modal after updating
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchEmployees();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete employee.');
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'EMPLOYEE' });
    setEditingId(null);
    setError('');
  };

  return (
    <div>
      <h2>Employee Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Button to open modal for creating an employee */}
      <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
        Create Employee
      </Button>

      {/* Modal for Create/Edit Employee */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Employee' : 'Create Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editingId ? handleUpdate : handleCreate}>
            <Form.Group controlId="employeeName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="employeeEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter employee email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
              
            {/* Role selection field */}
            <Form.Group controlId="employeeRole" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
              </Form.Control>
            </Form.Group>

            {/* Password field for editing */}
            <Form.Group controlId="employeePassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder={editingId ? "Enter new password (leave blank if not changing)" : "Password"}
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </Form.Group>


            <Button variant="primary" type="submit">
              {editingId ? 'Update' : 'Create'} Employee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <h3 className="mt-5">Employees List</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(emp)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(emp.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployeeManagement;
