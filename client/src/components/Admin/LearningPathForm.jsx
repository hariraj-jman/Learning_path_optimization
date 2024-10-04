import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import $ from 'jquery';
import api from '../../services/api';

import 'select2/dist/css/select2.min.css';
import 'select2';

const LearningPathForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [error, setError] = useState('');
  const [learningPaths, setLearningPaths] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editPathId, setEditPathId] = useState(null);
  const selectCoursesRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses.');
      }
    };

    const fetchLearningPaths = async () => {
      try {
        const response = await api.get('/learning-paths');
        setLearningPaths(response.data);
      } catch (err) {
        setError('Failed to fetch learning paths.');
      }
    };

    fetchCourses();
    fetchLearningPaths();
  }, []);

  useEffect(() => {
    if (selectCoursesRef.current) {
      $(selectCoursesRef.current).select2({
        width: '100%',
        placeholder: 'Select courses',
      });

      $(selectCoursesRef.current).on('change', (e) => {
        const selected = $(e.target).val().map(Number);
        setSelectedCourses(selected);
      });
    }
  }, [courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourses.length === 0) {
      setError('Please select at least one course.');
      return;
    }
    try {
      if (isEditing) {
        // Update learning path
        await api.put(`/learning-paths/${editPathId}`, {
          title,
          description,
          courseIds: selectedCourses,
        });
      } else {
        // Create new learning path
        await api.post('/learning-paths', {
          title,
          description,
          courseIds: selectedCourses,
        });
      }

      onSuccess();
      setTitle('');
      setDescription('');
      setSelectedCourses([]);
      setError('');
      setIsEditing(false);
      setEditPathId(null);

      // Refresh learning paths
      const response = await api.get('/learning-paths');
      setLearningPaths(response.data);

      // Reset Select2 selection
      $(selectCoursesRef.current).val(null).trigger('change');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save learning path.');
    }
  };

  const handleEdit = (path) => {
    setIsEditing(true);
    setEditPathId(path.id);
    setTitle(path.title);
    setDescription(path.description);
    setSelectedCourses(path.learningPathCourses.map((lpCourse) => lpCourse.courseId));
    
    // Set the selected options in Select2
    $(selectCoursesRef.current).val(path.learningPathCourses.map((lpCourse) => lpCourse.courseId)).trigger('change');
  };

  return (
    <div>
      <h2>Learning Path Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="pathTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter learning path title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="pathDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="pathCourses" className="mb-3">
          <Form.Label>Select Courses</Form.Label>
          <Form.Control
            as="select"
            ref={selectCoursesRef}
            multiple
            required
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          {isEditing ? 'Update Learning Path' : 'Create Learning Path'}
        </Button>
      </Form>

      <h2 className="mt-5">Existing Learning Paths</h2>
      <DataTable
        columns={[
          {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
          },
          {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
          },
          {
            name: 'Description',
            selector: (row) => row.description,
            sortable: true,
          },
          {
            name: 'Courses',
            selector: (row) => row.learningPathCourses.map((lpCourse) => lpCourse.course.title).join(', '),
            sortable: false,
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
        data={learningPaths}
        pagination
        paginationPerPage={10}
        highlightOnHover
        persistTableHead
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

export default LearningPathForm;
