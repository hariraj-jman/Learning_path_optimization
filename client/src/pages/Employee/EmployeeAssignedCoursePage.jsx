// src/pages/Employee/EmployeeAssignedCoursePage.jsx

import React, { useState, useEffect, useContext } from "react";
import { Card, Col, Row, Alert, Button, Modal, Form } from "react-bootstrap";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const EmployeeAssignedCoursePage = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [selectedProgress, setSelectedProgress] = useState(null); // To hold the selected course progress for updating

  const [formData, setFormData] = useState({
    progress: "",
    score: "",
    timeInvested: "",
    completionStatus: "",
    certificateUrl: "",
    quizScore: "",
    assignmentScore: "",
    participationCount: "",
    timeSpentOnQuizzes: "",
  });

  const fetchAssignedCourses = async () => {
    try {
      const response = await api.get(`/assignments/employee/${user.id}`);
      setAssignedCourses(response.data);
    } catch (err) {
      setError("Failed to fetch assigned courses.");
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
      const hasCompleted = courseProgress.some(
        (progress) => progress.completionStatus === "COMPLETED"
      );

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
      const response = await api.post("/progress", {
        userId: user.id,
        courseId,
        assignmentId: id,
        progress: 0,
        timeInvested: 0,
        completionStatus: "IN_PROGRESS",
        // Start with 0% progress
      });
      alert("Course started successfully!");
      fetchAssignedCourses(); // Refresh the course list
    } catch (error) {
      console.error(error);
      alert("Failed to start course.");
    }
  };

  const handleUpdateClick = (course) => {
    setSelectedCourse(course);
    setFormData({
      progress: course.progress,
      score: course.score || "",
      timeInvested: "",
      completionStatus: course.completionStatus,
      certificateUrl: course.certificateUrl || "",
      quizScore: "",
      assignmentScore: "",
      participationCount: "",
      timeSpentOnQuizzes: "",
    });
    setShowModal(true);
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    try {
      if (formData.progress === 100) {
        formData.completionStatus = "COMPLETED";
      }
      //   console.log(formData);
      await api.put(`/progress/${selectedCourse.id}`, formData);
      alert("Course progress updated successfully!");
      handleModalClose();
      fetchAssignedCourses(); // Refresh the course list
    } catch (error) {
      console.error(error);
      alert("Failed to update course progress.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCertificateUploadClick = (courseProgress) => {
    setSelectedProgress(courseProgress); // Set the selected progress
    setCertificateUrl(courseProgress.certificateUrl || ""); // Pre-fill if there’s already a URL
    setShowCertificateModal(true); // Show the modal
  };

  const handleUploadCertificate = async () => {
    if (certificateUrl) {
      try {
        await api.put(`/progress/${selectedProgress.id}`, {
          certificateUrl,
          completionStatus: "COMPLETED", // Ensure completion status is set to COMPLETED
        });

        alert("Certificate URL uploaded successfully!");
        setShowCertificateModal(false); // Close the modal
        fetchAssignedCourses(); // Refresh the course list to reflect changes
      } catch (error) {
        console.error(error);
        alert("Failed to upload the certificate URL.");
      }
    } else {
      alert("Certificate URL cannot be empty.");
    }
  };

  const handleModalClose = () => setShowModal(false);

  return (
    <div>
      <h2>Assigned Courses</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {Object.keys(coursesByStatus).map((status) => (
          <Col md={12} key={status}>
            <h3>{status.replace("_", " ")}</h3>
            <Row>
              {coursesByStatus[status].map((assignment) => (
                <Col md={4} key={assignment.course.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{assignment.course.title}</Card.Title>
                      <Card.Text>
                        <strong>Duration:</strong> {assignment.course.duration}{" "}
                        minutes
                      </Card.Text>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {status === "NOT_STARTED" && (
                          <Button
                            variant="primary"
                            onClick={() => handleStartCourse(assignment)}
                          >
                            Start Course
                          </Button>
                        )}
                        {status === "IN_PROGRESS" && (
                          <Button
                            variant="warning"
                            onClick={() =>
                              handleUpdateClick(assignment.courseProgress[0])
                            }
                          >
                            Update Course
                          </Button>
                        )}
                        {status === "COMPLETED" && (
                          <>
                            <Button
                              variant="warning"
                              onClick={() =>
                                handleUpdateClick(assignment.courseProgress[0])
                              }
                            >
                              Update Course
                            </Button>
                            {assignment.courseProgress[0].certificateUrl ? (
                              <Button
                                variant="link"
                                href={assignment.certificateUrl}
                                target="_blank"
                              >
                                View Certificate
                              </Button>
                            ) : (
                              <span>
                                <Button
                                  variant="warning"
                                  onClick={() =>
                                    handleCertificateUploadClick(
                                      assignment.courseProgress[0]
                                    )
                                  }
                                >
                                  Certificate URL
                                </Button>
                              </span>
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
      {/* Modal for updating course progress */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Update Course Progress for {selectedCourse?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProgress}>
            <Form.Group controlId="formProgress">
              <Form.Label>Progress (%)</Form.Label>
              <Form.Control
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formScore">
              <Form.Label>Score</Form.Label>
              <Form.Control
                type="number"
                name="score"
                min={0}
                max={100}
                value={formData.score}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formTimeInvested">
              <Form.Label>Time Invested (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="timeInvested"
                value={formData.timeInvested}
                onChange={handleChange}
              />
            </Form.Group>
            {/* Conditionally render Certificate URL field */}
            {formData.progress === 100 && (
              <Form.Group controlId="formCertificateUrl">
                <Form.Label>Certificate URL</Form.Label>
                <Form.Control
                  type="url"
                  name="certificateUrl"
                  value={formData.certificateUrl}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            <Form.Group controlId="formQuizScore">
              <Form.Label>Quiz Score</Form.Label>
              <Form.Control
                type="number"
                name="quizScore"
                value={formData.quizScore}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formAssignmentScore">
              <Form.Label>Assignment Score</Form.Label>
              <Form.Control
                type="number"
                name="assignmentScore"
                value={formData.assignmentScore}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formParticipationCount">
              <Form.Label>Modules Count</Form.Label>
              <Form.Control
                type="number"
                name="participationCount"
                value={formData.participationCount}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formTimeSpentOnQuizzes">
              <Form.Label>Time Spent on Quizzes (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="timeSpentOnQuizzes"
                value={formData.timeSpentOnQuizzes}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Progress
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showCertificateModal}
        onHide={() => setShowCertificateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Certificate URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCertificateUrl">
              <Form.Label>Certificate URL</Form.Label>
              <Form.Control
                type="url"
                value={certificateUrl}
                onChange={(e) => setCertificateUrl(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCertificateModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUploadCertificate}>
            Upload Certificate
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeAssignedCoursePage;
