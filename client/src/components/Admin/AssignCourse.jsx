import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import { assignCourseToEmployee } from '../../services/assignService';
import { getAllEmployees } from '../../services/userService';
import { getAllCourses } from '../../services/courseService';
import { getAssignments } from '../../services/assignService'; // New service function

const AssignCourse = () => {
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]); // State to store assignments
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await getAllEmployees();
        setEmployees(empData);
        const courseData = await getAllCourses();
        setCourses(courseData);
        const assignmentsData = await getAssignments(); // Fetch assignments
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    try {
      await assignCourseToEmployee(selectedEmployee, selectedCourse);

      setMessage('Course assigned successfully!');
      setSelectedEmployee('');
      setSelectedCourse('');

      // Refresh assignments after assignment
      const updatedAssignments = await getAssignments();
      setAssignments(updatedAssignments);
    } catch (error) {
      setMessage(`Error: ${error.message || 'Assignment failed.'}`);
    }
  };

  return (
    <div className="assign-course-container">
      <h2>Assign Course to Employee</h2>
      {message && <Alert variant={message.includes('Error') ? 'danger' : 'success'}>{message}</Alert>}
      <Form>
        <Form.Group controlId="selectEmployee" className="mb-3">
          <Form.Label>Employee</Form.Label>
          <Form.Control
            as="select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="selectCourse" className="mb-3">
          <Form.Label>Course</Form.Label>
          <Form.Control
            as="select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button
          variant="primary"
          onClick={handleAssign}
          disabled={!selectedEmployee || !selectedCourse}
        >
          Assign Course
        </Button>
      </Form>

      <h3 className="mt-5">Assigned Courses</h3>
<Table striped bordered hover>
  <thead>
    <tr>
      <th>Employee</th>
      <th>Course</th>
      <th>Assigned At</th>
    </tr>
  </thead>
  <tbody>
    {assignments
      .filter((assignment) => assignment.courseId && !assignment.learningPathId)
      .map((assignment) => (
        <tr key={assignment.id}>
          <td>
            {assignment.user?.name} ({assignment.user?.email})
          </td>
          <td>{assignment.course?.title}</td>
          <td>{assignment?.assignedAt}</td>
        </tr>
      ))}
  </tbody>
</Table>

    </div>
  );
};

export default AssignCourse;
