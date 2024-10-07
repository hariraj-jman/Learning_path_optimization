import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, Container, Modal, Row, Col } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { assignLearningPathToEmployee, getAssignments } from '../../services/assignService';
import { getAllEmployees } from '../../services/userService';
import { getAllLearningPaths } from '../../services/learningPathService';

const AssignLearningPath = () => {
  const [employees, setEmployees] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedLearningPath, setSelectedLearningPath] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await getAllEmployees();
        setEmployees(empData);
        const lpData = await getAllLearningPaths();
        setLearningPaths(lpData);
        const assignmentsData = await getAssignments();
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    try {
      await assignLearningPathToEmployee(selectedEmployee, selectedLearningPath);
      setMessage('Learning Path assigned successfully!');
      setSelectedEmployee('');
      setSelectedLearningPath('');
      setShowModal(false);

      const updatedAssignments = await getAssignments();
      setAssignments(updatedAssignments);
    } catch (error) {
      setMessage(`Error: ${error.message || 'Assignment failed.'}`);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="align-items-center mb-3">
        <Col className="d-flex">
          <h2>Assign Learning Path to Employee</h2>
          <Button variant="primary" className="ms-auto" onClick={() => setShowModal(true)}>
            Assign Learning Path
          </Button>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.startsWith('Error') ? 'danger' : 'success'} className="mt-3">
          {message}
        </Alert>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Learning Path to Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectEmployee" className="mb-3">
              <Form.Label>Employee</Form.Label>
              <Form.Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="selectLearningPath" className="mb-3">
              <Form.Label>Learning Path</Form.Label>
              <Form.Select
                value={selectedLearningPath}
                onChange={(e) => setSelectedLearningPath(e.target.value)}
                required
              >
                <option value="">Select Learning Path</option>
                {learningPaths.map((lp) => (
                  <option key={lp.id} value={lp.id}>
                    {lp.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" onClick={handleAssign} disabled={!selectedEmployee || !selectedLearningPath}>
              Assign Learning Path
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* <h3 className="mt-5">Assigned Learning Paths</h3> */}
      <DataTable
        columns={[
          {
            name: 'Employee',
            selector: row => `${row.user?.name} (${row.user?.email})`,
            sortable: true,
          },
          {
            name: 'Learning Path',
            selector: row => row.learningPath?.title,
            sortable: true,
          },
          {
            name: 'Assigned At',
            selector: row => new Date(row.assignedAt).toLocaleString(),
            sortable: true,
          },
        ]}
        data={assignments.filter((assignment) => assignment.learningPathId && !assignment.courseId)}
        pagination
        paginationPerPage={10}
        highlightOnHover
        persistTableHead
        customStyles={{
          table: {
            style: {
              padding: '10px',
              border: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa',
            },
          },
          headCells: {
            style: {
              backgroundColor: '#343a40',
              color: 'white',
              fontSize: '16px',
            },
          },
        }}
      />
    </Container>
  );
};

export default AssignLearningPath;
