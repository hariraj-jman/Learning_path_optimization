import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUser,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaBook,
  FaTasks,
  FaLaptop,
} from "react-icons/fa";

import logoImg from "./logo.png";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation(); // Get the current path

  if (!user) {
    return <></>;
  }

  const getLinkClass = (path) => {
    // Check if the current path matches the link's path
    return location.pathname === path
      ? { ...linkStyle, backgroundColor: "#007bff", color: "#fff" } // Active link styling
      : linkStyle;
  };

  return (
    <div
      className="sidebar"
      style={{
        width: "250px",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo Section */}
      <div style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
        <img
          src={logoImg} // Replace with the actual logo path
          alt="Logo"
          style={{ width: "120px", height: "auto" }}
        />
      </div>

      {/* User Name */}
      <h3
        style={{
          fontSize: "20px",
          color: "#343a40",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        {user ? user.name : "Guest"}
      </h3>

      {/* Sidebar Navigation */}
      <Nav
        defaultActiveKey="/home"
        className="flex-column"
        style={{ width: "100%" }}
      >
        {user && user.role === "ADMIN" && (
          <>
            <Nav.Link
              as={Link}
              to="/admin/dashboard"
              style={getLinkClass("/admin/dashboard")}
            >
              <FaTachometerAlt style={iconStyle} /> Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/employee-management"
              style={getLinkClass("/admin/employee-management")}
            >
              <FaUser style={iconStyle} /> Manage Employees
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/course-form"
              style={getLinkClass("/admin/course-form")}
            >
              <FaBook style={iconStyle} /> Manage Course
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/learning-path-form"
              style={getLinkClass("/admin/learning-path-form")}
            >
              <FaChalkboardTeacher style={iconStyle} /> Manage Learning Path
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/assign-course"
              style={getLinkClass("/admin/assign-course")}
            >
              <FaTasks style={iconStyle} /> Assign Course
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/assign-learning-path"
              style={getLinkClass("/admin/assign-learning-path")}
            >
              <FaLaptop style={iconStyle} /> Assign Learning Path
            </Nav.Link>
          </>
        )}
        {user && user.role === "EMPLOYEE" && (
          <>
            <Nav.Link
              as={Link}
              to="/employee/dashboard"
              style={getLinkClass("/employee/dashboard")}
            >
              <FaTachometerAlt style={iconStyle} /> Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/employee/assigned-courses"
              style={getLinkClass("/employee/assigned-courses")}
            >
              <FaBook style={iconStyle} /> Assigned Courses
            </Nav.Link>
          </>
        )}
      </Nav>
    </div>
  );
};

// Inline styles for the sidebar links and icons
const linkStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  color: "#343a40",
  textDecoration: "none",
  borderRadius: "5px",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
};

const iconStyle = {
  marginRight: "10px",
};

export default Sidebar;
