import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, Modal, Row, Col } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import api from '../../services/api';
import $ from 'jquery';

const CourseForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('EASY');
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const selectDifficultyRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
        setOriginalCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update course
        await api.put(`/courses/${editCourseId}`, {
          title,
          duration: Number(duration),
          difficultyLevel,
        });
      } else {
        // Create new course
        await api.post('/courses', { title, duration: Number(duration), difficultyLevel });
      }
      
      onSuccess();
      setTitle('');
      setDuration('');
      setDifficultyLevel('EASY');
      setError('');
      setShowModal(false);
      setIsEditing(false);
      setEditCourseId(null);

      const response = await api.get('/courses');
      setCourses(response.data);
      setOriginalCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save course.');
    }
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setEditCourseId(course.id);
    setTitle(course.title);
    setDuration(course.duration.toString());
    setDifficultyLevel(course.difficultyLevel);
    setShowModal(true);

    // Set the selected value in Select2
    $(selectDifficultyRef.current).val(course.difficultyLevel).trigger('change');
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue === '') {
      setCourses(originalCourses);
    } else {
      setCourses(originalCourses.filter(course =>
        course.title.toLowerCase().includes(searchValue)
      ));
    }
  };

  return (
    <div>
      <Row className="align-items-center mb-3">
        <Col className="d-flex">
          <h2>Course Management</h2>
          <Button variant="primary" className="ms-auto" onClick={() => setShowModal(true)}>
            Create New Course
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Course' : 'Create Course'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="courseTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="courseDuration" className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="courseDifficulty" className="mb-3">
              <Form.Label>Difficulty Level</Form.Label>
              <Form.Select
                ref={selectDifficultyRef}
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                required
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              {isEditing ? 'Update Course' : 'Create Course'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <DataTable
        columns={[
          {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
          },
          {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
          },
          {
            name: 'Duration (minutes)',
            selector: row => row.duration,
            sortable: true,
          },
          {
            name: 'Difficulty Level',
            selector: row => row.difficultyLevel,
            sortable: true,
          },
          {
            name: 'Created At',
            selector: row => new Date(row.createdAt).toLocaleString(),
            sortable: true,
          },
          {
            name: 'Actions',
            cell: (row) => (
              <Button variant="warning" size="sm" onClick={() => handleEdit(row)}>
                Edit
              </Button>
            ),
          },
        ]}
        data={courses}
        pagination
        paginationPerPage={10}
        highlightOnHover
        persistTableHead
        subHeader
        subHeaderComponent={
          <div className="d-flex justify-content-end">
            <Form.Control
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              style={{ width: '200px' }}
            />
          </div>
        }
        customStyles={{
          table: {
            style: {
              padding: '10px',
              border: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa',
            },
          },
          headCells: {
            style: {
              backgroundColor: '#343a40',
              color: 'white',
              fontSize: '16px',
            },
          },
        }}
      />
    </div>
  );
};

export default CourseForm;
