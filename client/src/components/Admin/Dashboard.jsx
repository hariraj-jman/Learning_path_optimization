import React, { useState, useEffect } from "react";
import { Card, Row, Col, Alert, ListGroup } from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Chart from "react-apexcharts";
import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLearningPaths: 0,
    totalEmployees: 0,
    overallCompletionRate: 0,
    topEmployees: [],
    bottomEmployees: [],
    topCourses: [],
    learningPathCourseCounts: [],
    completionStatusCounts: {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    },
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

      // Calculate top 5 and bottom 5 employees based on course completion
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

      const bottomEmployees = Object.entries(employeeProgress)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 5)
        .map(([userId, completedCourses]) => {
          const user = usersRes.data.find((u) => u.id === parseInt(userId));
          return {
            name: user ? user.name : "Unknown",
            completedCourses,
          };
        });

      // Calculate completion status counts
      const completionStatusCounts = {
        completed: progressRes.data.filter(
          (p) => p.completionStatus === "COMPLETED"
        ).length,
        inProgress: progressRes.data.filter(
          (p) => p.completionStatus === "IN_PROGRESS"
        ).length,
        notStarted: progressRes.data.filter(
          (p) => p.completionStatus === "NOT_STARTED"
        ).length,
      };

      // Calculate number of courses assigned to each learning path
      const learningPathCourseCounts = pathsRes.data.map((path) => ({
        name: path.name,
        courseCount: assignmentsRes.data.filter(
          (a) => a.learningPathId === path.id
        ).length,
      }));

      // Calculate top 5 completed courses
      const courseCompletionCounts = progressRes.data.reduce((acc, p) => {
        if (p.completionStatus === "COMPLETED") {
          acc[p.courseId] = (acc[p.courseId] || 0) + 1;
        }
        return acc;
      }, {});

      const topCourses = Object.entries(courseCompletionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([courseId, completions]) => {
          const course = coursesRes.data.find(
            (c) => c.id === parseInt(courseId)
          );
          return {
            name: course ? course.name : "Unknown",
            completions,
          };
        });

      const overallCompletionRate = totalCourses
        ? (
            (completionStatusCounts.completed / progressRes.data.length) *
            100
          ).toFixed(2)
        : 0;

      setStats({
        totalCourses,
        totalLearningPaths,
        totalEmployees,
        overallCompletionRate,
        topEmployees,
        bottomEmployees,
        topCourses,
        learningPathCourseCounts,
        completionStatusCounts,
      });
    } catch (err) {
      setError("Failed to fetch dashboard statistics.");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const donutChartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Completed", "In Progress", "Not Started"],
    colors: ["#28a745", "#ffc107", "#dc3545"],
  };

  const donutChartData = [
    stats.completionStatusCounts.completed,
    stats.completionStatusCounts.inProgress,
    stats.completionStatusCounts.notStarted,
  ];

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
      <Row className="mt-4 justify-content-center">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Top 5 Employees</Card.Title>
              <ListGroup>
                {stats.topEmployees.map((employee, index) => (
                  <ListGroup.Item key={index}>
                    {employee.name} - {employee.completedCourses} completed
                    courses
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Bottom 5 Performers</Card.Title>
              <ListGroup>
                {stats.bottomEmployees.map((employee, index) => (
                  <ListGroup.Item key={index}>
                    {employee.name} - {employee.completedCourses} completed
                    courses
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Completion Status</Card.Title>
              <Chart
                options={donutChartOptions}
                series={donutChartData}
                type="donut"
                height={300}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
