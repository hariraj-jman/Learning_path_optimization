// src/components/Employee/SuggestedLearning.jsx

import React, { useState, useEffect, useContext } from "react";
import { ListGroup, Button, Alert } from "react-bootstrap";
import api from "../../services/api";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const SuggestedLearning = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.post("http://localhost:8000/recommend", {
        user_id: user.id,
      });
      console.log(response.data);
      setSuggestions(response.data);
    } catch (err) {
      setError("Failed to fetch suggestions.");
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleAssign = async (id, type) => {
    try {
      await api.post("/assignments", { targetId: id, type });
      fetchSuggestions();
    } catch (err) {
      setError("Failed to assign learning path/course.");
    }
  };

  return (
    <div>
      <h2>Suggested Learning</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {suggestions && suggestions?.recommendations === 0 ? (
        <p>No suggestions available.</p>
      ) : (
        <ListGroup>
          {suggestions?.recommendations &&
            suggestions?.recommendations?.map((suggestion) => (
              <ListGroup.Item
                key={suggestion.id}
                className="d-flex justify-content-between align-items-center"
              >
                {suggestion.type === "COURSE"
                  ? `Course: ${suggestion.title}`
                  : `Learning Path: ${suggestion.title}`}
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAssign(suggestion.id, suggestion.type)}
                >
                  Assign
                </Button>
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}
    </div>
  );
};

export default SuggestedLearning;
