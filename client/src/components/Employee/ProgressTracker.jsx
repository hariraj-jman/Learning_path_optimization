import React, { useState, useEffect } from "react";
import { Alert, Card, Row, Col } from "react-bootstrap";
import api from "../../services/api";

const ProgressTracker = () => {
  const [progressData, setProgressData] = useState([]);
  const [error, setError] = useState("");

  const fetchProgressData = async () => {
    try {
      const response = await api.get("/progress");
      setProgressData(response.data);
    } catch (err) {
      setError("Failed to fetch progress data.");
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  // Calculate averages
  const totalCourses = progressData.length;
  const totalProgress = progressData.reduce(
    (acc, progress) => acc + progress.progress,
    0
  );
  const totalScore = progressData.reduce(
    (acc, progress) => acc + (progress.score || 0),
    0
  );
  const averageProgress =
    totalCourses > 0 ? (totalProgress / totalCourses).toFixed(2) : 0;
  const averageScore =
    totalCourses > 0 ? (totalScore / totalCourses).toFixed(2) : 0;

  // Count completed, in-progress, and not-started courses
  const completedCourses = progressData.filter(
    (progress) => progress.progress === 100
  ).length;
  const inProgressCourses = progressData.filter(
    (progress) => progress.progress > 0 && progress.progress < 100
  ).length;
  const notStartedCourses = progressData.filter(
    (progress) => progress.progress === 0
  ).length;

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {totalCourses}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Completed Courses</Card.Title>
              <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {completedCourses}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>In-Progress Courses</Card.Title>
              <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {inProgressCourses}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Not Started Courses</Card.Title>
              <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {notStartedCourses}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Average Progress</Card.Title>
              <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {averageProgress}%
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Average Score</Card.Title>
              <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {averageScore}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProgressTracker;
