// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import PrivateRoute from "./components/Common/PrivateRoute";
import Login from "./pages/Auth/Login";
import AdminDashboardPage from "./pages/Admin/AdminDashboard";
import EmployeeDashboardPage from "./pages/Employee/EmployeeDashboard";
import NotFound from "./pages/NotFound";
import CourseForm from "./components/Admin/CourseForm";
import LearningPathForm from "./components/Admin/LearningPathForm";
import EmployeeManagement from "./components/Admin/EmployeeManagement";
import AssignCoursePage from "./pages/Admin/AssignCoursePage"; // New Import
import AssignLearningPathPage from "./pages/Admin/AssignLearningPathPage"; // New Import
import Sidebar from "./components/Common/Sidebar"; // New Import

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <div style={{ display: "flex", marginTop: "20px" }}>
        <Sidebar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roles={["ADMIN"]}>
                  <AdminDashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/course-form"
              element={
                <PrivateRoute roles={["ADMIN"]}>
                  <CourseForm onSuccess={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/learning-path-form"
              element={
                <PrivateRoute roles={["ADMIN"]}>
                  <LearningPathForm onSuccess={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/employee-management"
              element={
                <PrivateRoute roles={["ADMIN"]}>
                  <EmployeeManagement />
                </PrivateRoute>
              }
            />

            {/* New Assignment Routes */}
            <Route
              path="/admin/assign-course"
              element={
                <PrivateRoute roles={["ADMIN"]}>
                  <AssignCoursePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/assign-learning-path"
              element={
                <PrivateRoute roles={["ADMIN"]}>
                  <AssignLearningPathPage />
                </PrivateRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <PrivateRoute roles={["EMPLOYEE"]}>
                  <EmployeeDashboardPage />
                </PrivateRoute>
              }
            />

            {/* Home and Fallback Routes */}
            <Route
              path="/"
              element={<div>Welcome to the Course Optimization App</div>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
