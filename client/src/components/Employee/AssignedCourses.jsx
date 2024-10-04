// src/components/Employee/AssignedCourses.jsx

import React, { useState, useEffect } from 'react';
import { Table, Alert, Button } from 'react-bootstrap';
import api from '../../services/api';

const AssignedCourses = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [error, setError] = useState('');

  const fetchAssignedCourses = async () => {
    try {
      const response = await api.get('/progress');
      setAssignedCourses(response.data);
    } catch (err) {
      setError('Failed to fetch assigned courses.');
    }
  };

  useEffect(() => {
    fetchAssignedCourses();
  }, []);

  return (
    <div>
      <h2>Assigned Courses</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Progress (%)</th>
            <th>Completion Status</th>
            <th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {assignedCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.course.title}</td>
              <td>{course.progress}</td>
              <td>{course.completionStatus}</td>
              <td>
                {course.certificateUrl ? (
                  <Button variant="link" href={course.certificateUrl} target="_blank">
                    View Certificate
                  </Button>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AssignedCourses;
