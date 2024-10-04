// src/components/Common/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Course Optimization
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && user.role === 'ADMIN' && (
              <NavDropdown title="Admin" id="admin-nav-dropdown">
                <NavDropdown.Item as={Link} to="/admin/dashboard">
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/employee-management">
                  Manage Employees
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/course-form">
                  Manage Course
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/learning-path-form">
                  Manage Learning Path
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/admin/assign-course">
                  Assign Course
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/assign-learning-path">
                  Assign Learning Path
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {user && user.role === 'EMPLOYEE' && (
              <>
                <Nav.Link as={Link} to="/employee/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/employee/assigned-courses">
                  Assigned Courses
                </Nav.Link>
                <Nav.Link as={Link} to="/employee/progress-tracker">
                  Progress Tracker
                </Nav.Link>
                <Nav.Link as={Link} to="/employee/skills-profile">
                  Skills Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/employee/suggested-learning">
                  Suggested Learning
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button as={Link} to="/login" variant="outline-light">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
