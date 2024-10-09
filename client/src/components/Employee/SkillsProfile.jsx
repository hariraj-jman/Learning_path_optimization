// src/components/Employee/SkillsProfile.jsx

import React, { useState, useEffect } from "react";
import { Form, Button, Table, Alert } from "react-bootstrap";
import api from "../../services/api";

const SkillsProfile = () => {
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [proficiency, setProficiency] = useState("BEGINNER");
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills");
      setSkills(response.data);
    } catch (err) {
      setError("Failed to fetch skills.");
    }
  };

  const fetchAllSkills = async () => {
    try {
      const response = await api.get("/skills");
      setAllSkills(response.data);
    } catch (err) {
      setError("Failed to fetch all skills.");
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchAllSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkill) return;
    try {
      await api.post("/api/skills", {
        skillId: Number(selectedSkill),
        proficiencyLevel: proficiency,
      });
      fetchSkills();
      setSelectedSkill("");
      setProficiency("BEGINNER");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add skill.");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/users/skills/${skillId}`);
      fetchSkills();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete skill.");
    }
  };

  return (
    <div>
      <h2>Skills Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleAddSkill}>
        <Form.Group controlId="skillSelect" className="mb-3">
          <Form.Label>Select Skill</Form.Label>
          <Form.Select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            required
          >
            <option value="">Choose...</option>
            {allSkills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="proficiencySelect" className="mb-3">
          <Form.Label>Proficiency Level</Form.Label>
          <Form.Select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            required
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Skill
        </Button>
      </Form>

      <h3 className="mt-5">Current Skills</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Skill</th>
            <th>Proficiency Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id}>
              <td>{skill.skill.name}</td>
              <td>{skill.proficiencyLevel}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteSkill(skill.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SkillsProfile;
