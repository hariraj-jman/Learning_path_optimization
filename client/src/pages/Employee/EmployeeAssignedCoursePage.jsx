// src/pages/Employee/EmployeeAssignedCoursePage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Card, Col, Row, Alert, Button } from 'react-bootstrap';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const EmployeeAssignedCoursePage = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const fetchAssignedCourses = async () => {
    try {
      const response = await api.get(`/assignments/employee/${user.id}`);
      setAssignedCourses(response.data);
    } catch (err) {
      setError('Failed to fetch assigned courses.');
    }
  };

  useEffect(() => {
    fetchAssignedCourses();
  }, [user.id]);

  // Organize courses by completion status
  const coursesByStatus = {
    NOT_STARTED: [],
    IN_PROGRESS: [],
    COMPLETED: [],
  };

  assignedCourses.forEach((assignment) => {
    const courseProgress = assignment.courseProgress;
  
    if (courseProgress && courseProgress.length > 0) {
      // Check for any COMPLETED status
      const hasCompleted = courseProgress.some(progress => progress.completionStatus === "COMPLETED");
  
      if (hasCompleted) {
        coursesByStatus.COMPLETED.push(assignment);
      } else {
        coursesByStatus.IN_PROGRESS.push(assignment);
      }
    } else {
      coursesByStatus.NOT_STARTED.push(assignment);
    }
  });

  const handleStartCourse = async (assignment) => {
    const { courseId, id } = assignment;

    try {
      const response = await api.post('/progress', {
        userId: user.id,
        courseId,
        assignmentId: id,
        progress: 0,
        timeInvested: 0,
        completionStatus: 'IN_PROGRESS',
         // Start with 0% progress
      });
      alert('Course started successfully!');
      fetchAssignedCourses(); // Refresh the course list
    } catch (error) {
      console.error(error);
      alert('Failed to start course.');
    }
  };

  const handleUpdateCourse = async (assignment) => {
    const { id } = assignment;

    try {
      const newProgress = prompt('Enter new progress percentage:');
      const response = await api.put(`/course-progress/${id}`, {
        progress: newProgress,
      });
      alert('Course progress updated successfully!');
      fetchAssignedCourses(); // Refresh the course list
    } catch (error) {
      console.error(error);
      alert('Failed to update course progress.');
    }
  };

  return (
    <div>
      <h2>Assigned Courses</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {Object.keys(coursesByStatus).map((status) => (
          <Col md={12} key={status}>
            <h3>{status.replace('_', ' ')}</h3>
            <Row>
              {coursesByStatus[status].map((assignment) => (
                <Col md={4} key={assignment.course.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{assignment.course.title}</Card.Title>
                      <Card.Text>
                        <strong>Duration:</strong> {assignment.course.duration} minutes
                      </Card.Text>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {status === 'NOT_STARTED' && (
                          <Button
                            variant="primary"
                            onClick={() => handleStartCourse(assignment)}
                          >
                            Start Course
                          </Button>
                        )}
                        {status === 'IN_PROGRESS' && (
                          <Button
                            variant="warning"
                            onClick={() => handleUpdateCourse(assignment)}
                          >
                            Update Course
                          </Button>
                        )}
                        {status === 'COMPLETED' && (
                          <>
                            {assignment.certificateUrl ? (
                              <Button
                                variant="link"
                                href={assignment.certificateUrl}
                                target="_blank"
                              >
                                View Certificate
                              </Button>
                            ) : (
                              <span>No Certificate Available</span>
                            )}
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EmployeeAssignedCoursePage;
