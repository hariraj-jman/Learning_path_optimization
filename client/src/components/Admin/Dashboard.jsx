// src/components/Admin/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLearningPaths: 0,
    totalEmployees: 0,
    overallCompletionRate: 0,
  });
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const [coursesRes, pathsRes, usersRes, progressRes] = await Promise.all([
        api.get('/courses'),
        api.get('/learning-paths'),
        api.get('/users'),
        api.get('/progress'),
      ]);

      const totalCourses = coursesRes.data.length;
      const totalLearningPaths = pathsRes.data.length;
      const totalEmployees = usersRes.data.length;
      const completedCourses = progressRes.data.filter(p => p.completionStatus === 'COMPLETED').length;
      const overallCompletionRate = totalCourses ? ((completedCourses / totalCourses) * 100).toFixed(2) : 0;

      setStats({
        totalCourses,
        totalLearningPaths,
        totalEmployees,
        overallCompletionRate,
      });
    } catch (err) {
      setError('Failed to fetch dashboard statistics.');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mt-4">
        <Col md={3}>
          <Card bg="primary" text="white" className="mb-3">
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <Card.Text>{stats.totalCourses}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="success" text="white" className="mb-3">
            <Card.Body>
              <Card.Title>Total Learning Paths</Card.Title>
              <Card.Text>{stats.totalLearningPaths}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="warning" text="white" className="mb-3">
            <Card.Body>
              <Card.Title>Total Employees</Card.Title>
              <Card.Text>{stats.totalEmployees}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="info" text="white" className="mb-3">
            <Card.Body>
              <Card.Title>Overall Completion Rate</Card.Title>
              <Card.Text>{stats.overallCompletionRate}%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
