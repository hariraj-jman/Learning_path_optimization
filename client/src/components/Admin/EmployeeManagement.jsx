import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Alert, Modal, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import api from "../../services/api";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/users");
      setEmployees(response.data);
      setOriginalEmployees(response.data);
    } catch (err) {
      setError("Failed to fetch employees.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, { ...form });
      } else {
        await api.post("/users", { ...form });
      }
      fetchEmployees();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save employee.");
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      email: employee.email,
      password: "",
      role: employee.role,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchEmployees();
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete employee.");
      }
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "EMPLOYEE" });
    setEditingId(null);
    setError("");
    setShowModal(false);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setEmployees(originalEmployees);
    } else {
      setEmployees(
        originalEmployees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(searchValue) ||
            emp.email.toLowerCase().includes(searchValue)
        )
      );
    }
  };

  const handleCreateNewEmployee = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div>
      <Row className="align-items-center mb-3">
        <Col className="d-flex">
          <h2>Employee Management</h2>
          <Button
            variant="primary"
            className="ms-auto"
            onClick={handleCreateNewEmployee}
          >
            Create Employee
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Employee" : "Create Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
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

            <Form.Group controlId="employeeRole" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="employeePassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder={
                  editingId
                    ? "Enter new password (leave blank if not changing)"
                    : "Password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {editingId ? "Update" : "Create"} Employee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <DataTable
        columns={[
          { name: "ID", selector: (row) => row.id, sortable: true },
          { name: "Name", selector: (row) => row.name, sortable: true },
          { name: "Email", selector: (row) => row.email, sortable: true },
          { name: "Role", selector: (row) => row.role, sortable: true },
          {
            name: "Actions",
            cell: (row) => (
              <>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        data={employees}
        pagination
        paginationPerPage={10}
        highlightOnHover
        persistTableHead
        subHeader
        subHeaderComponent={
          <div className="d-flex justify-content-end">
            <Form.Control
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              style={{ width: "200px" }}
            />
          </div>
        }
        customStyles={{
          table: {
            style: {
              padding: "10px",
              border: "1px solid #dee2e6",
              backgroundColor: "#f8f9fa",
            },
          },
          headCells: {
            style: {
              backgroundColor: "#343a40",
              color: "white",
              fontSize: "16px",
            },
          },
        }}
      />
    </div>
  );
};

export default EmployeeManagement;
