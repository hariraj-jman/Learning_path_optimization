// src/components/Admin/AssignLearningPath.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { assignLearningPathToEmployee } from '../../services/assignService';
import { getAllEmployees } from '../../services/userService';
import { getAllLearningPaths } from '../../services/learningPathService';

const AssignLearningPath = () => {
  const [employees, setEmployees] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedLearningPath, setSelectedLearningPath] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await getAllEmployees();
        setEmployees(empData);
        const lpData = await getAllLearningPaths();
        setLearningPaths(lpData);
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
      // Optionally reset selections
      setSelectedEmployee('');
      setSelectedLearningPath('');
    } catch (error) {
      setMessage(`Error: ${error.message || 'Assignment failed.'}`);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Assign Learning Path to Employee</h2>
      {message && (
        <Alert variant={message.startsWith('Error') ? 'danger' : 'success'} className="mt-3">
          {message}
        </Alert>
      )}
      <Form className="mt-4">
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

        <Button
          variant="primary"
          onClick={handleAssign}
          disabled={!selectedEmployee || !selectedLearningPath}
        >
          Assign Learning Path
        </Button>
      </Form>
    </Container>
  );
};

export default AssignLearningPath;
