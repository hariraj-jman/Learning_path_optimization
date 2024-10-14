// src/pages/EmployeeDashboard.jsx

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AssignedCourses from "../../components/Employee/AssignedCourses";
import ProgressTracker from "../../components/Employee/ProgressTracker";
import SkillsProfile from "../../components/Employee/SkillsProfile";
import SuggestedLearning from "../../components/Employee/SuggestedLearning";

const EmployeeDashboardPage = () => {
  return (
    <Container className="mt-4">
      <h2>Employee Dashboard</h2>
      <Row className="mt-4">
        <Col md={6}>
          <AssignedCourses />
        </Col>
        <Col md={6}>
          <ProgressTracker />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <SkillsProfile />
        </Col>
        <Col md={6}>
          <SuggestedLearning />
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeDashboardPage;
