import React, { useState, useEffect } from "react";
import { Card, Row, Col, Alert } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLearningPaths: 0,
    totalEmployees: 0,
    overallCompletionRate: 0,
    topEmployees: [],
    learningPathCourseCounts: [],
  });
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const [coursesRes, pathsRes, usersRes, progressRes, assignmentsRes] =
        await Promise.all([
          api.get("/courses"),
          api.get("/learning-paths"),
          api.get("/users"),
          api.get("/progress"),
          api.get("/assignments"),
        ]);

      const totalCourses = coursesRes.data.length;
      const totalLearningPaths = pathsRes.data.length;
      const totalEmployees = usersRes.data.length;

      // Calculate top 5 employees based on course completion
      const employeeProgress = progressRes.data.reduce((acc, p) => {
        if (p.completionStatus === "COMPLETED") {
          acc[p.userId] = (acc[p.userId] || 0) + 1;
        }
        return acc;
      }, {});

      const topEmployees = Object.entries(employeeProgress)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([userId, completedCourses]) => {
          const user = usersRes.data.find((u) => u.id === parseInt(userId));
          return {
            name: user ? user.name : "Unknown",
            completedCourses,
          };
        });

      // Calculate number of courses assigned to each learning path
      const learningPathCourseCounts = pathsRes.data.map((path) => ({
        name: path.name,
        courseCount: assignmentsRes.data.filter(
          (a) => a.learningPathId === path.id
        ).length,
      }));

      const overallCompletionRate = totalCourses
        ? (
            (progressRes.data.filter((p) => p.completionStatus === "COMPLETED")
              .length /
              progressRes.data.length) *
            100
          ).toFixed(2)
        : 0;

      setStats({
        totalCourses,
        totalLearningPaths,
        totalEmployees,
        overallCompletionRate,
        topEmployees,
        learningPathCourseCounts,
      });
    } catch (err) {
      setError("Failed to fetch dashboard statistics.");
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
      <Row className="mt-4">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Top 5 Employees by Course Completion</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.topEmployees}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completedCourses" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Courses Assigned to Learning Paths</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.learningPathCourseCounts}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="courseCount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
