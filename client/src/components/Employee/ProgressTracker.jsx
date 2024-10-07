// src/components/Employee/ProgressTracker.jsx

import React, { useState, useEffect } from 'react';
import { Table, Alert, ProgressBar } from 'react-bootstrap';
import api from '../../services/api';

const ProgressTracker = () => {
  const [progressData, setProgressData] = useState([]);
  const [error, setError] = useState('');

  const fetchProgressData = async () => {
    try {
      const response = await api.get('/progress');
      setProgressData(response.data);
    } catch (err) {
      setError('Failed to fetch progress data.');
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  return (
    <div>
      <h2>Progress Tracker</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Progress</th>
            <th>Score</th>
            <th>Time Invested (mins)</th>
            <th>Completion Status</th>
          </tr>
        </thead>
        <tbody>
          {progressData.map((progress) => (
            <tr key={progress.id}>
              <td>{progress.course.title}</td>
              <td>
                <ProgressBar now={progress.progress} label={`${progress.progress}%`} />
              </td>
              <td>{progress.score || 0}</td>
              <td>{progress.timeInvested}</td>
              <td>{progress.completionStatus}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProgressTracker;
