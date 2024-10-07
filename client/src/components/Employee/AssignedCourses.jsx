import React, { useState, useEffect, useContext } from 'react';
import { Table, Alert, Button } from 'react-bootstrap';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const AssignedCourses = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const fetchAssignedCourses = async () => {
    try {
      // Fetch assignments for the logged-in employee using the API
      const response = await api.get(`/assignments/employee/${user.id}`);
      
      // Filter out assignments that have courseId (i.e., only course assignments, not learning paths)
      const onlyCourses = response.data.filter(assignment => assignment.courseId !== null);

      // Extract relevant course progress data if available
      const coursesWithProgress = onlyCourses.map(assignment => ({
        id: assignment.id,
        title: assignment.course.title,
        progress: assignment.courseProgress.length > 0 ? assignment.courseProgress[0].progress : 'Not Started',
        completionStatus: assignment.courseProgress.length > 0 ? assignment.courseProgress[0].completionStatus : 'Not Completed',
        certificateUrl: assignment.courseProgress.length > 0 ? assignment.courseProgress[0].certificateUrl : null ,
      }));

      setAssignedCourses(coursesWithProgress);
    } catch (err) {
      setError('Failed to fetch assigned courses.');
    }
  };

  useEffect(() => {
    fetchAssignedCourses();
  }, [user.id]);

  return (
    <div>
      <h2>Assigned Courses</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Progress (%)</th>
            <th>Completion Status</th>
            <th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {assignedCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.progress}</td>
              <td>{course.completionStatus}</td>
              <td>
                {course.certificateUrl ? (
                  <Button variant="link" href={course.certificateUrl} target="_blank">
                    View Certificate
                  </Button>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AssignedCourses;
