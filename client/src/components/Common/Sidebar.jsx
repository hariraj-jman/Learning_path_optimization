// src/components/Common/Sidebar.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if(!user) {
    return (<></>)
  }

  return (
        <div className="sidebar" style={{ width: '250px', padding: '20px', backgroundColor: '#f8f9fa' }}>
        <h3>{user ? user.name : 'Guest'}</h3>
        <Nav defaultActiveKey="/home" className="flex-column">
            {user && user.role === 'ADMIN' && (
            <>
                <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/employee-management">Manage Employees</Nav.Link>
                <Nav.Link as={Link} to="/admin/course-form">Manage Course</Nav.Link>
                <Nav.Link as={Link} to="/admin/learning-path-form">Manage Learning Path</Nav.Link>
                <Nav.Link as={Link} to="/admin/assign-course">Assign Course</Nav.Link>
                <Nav.Link as={Link} to="/admin/assign-learning-path">Assign Learning Path</Nav.Link>
            </>
            )}
            {user && user.role === 'EMPLOYEE' && (
            <>
                <Nav.Link as={Link} to="/employee/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/employee/assigned-courses">Assigned Courses</Nav.Link>
                <Nav.Link as={Link} to="/employee/progress-tracker">Progress Tracker</Nav.Link>
                <Nav.Link as={Link} to="/employee/skills-profile">Skills Profile</Nav.Link>
                <Nav.Link as={Link} to="/employee/suggested-learning">Suggested Learning</Nav.Link>
            </>
            )}
        </Nav>
        </div>
  );
};

export default Sidebar;
