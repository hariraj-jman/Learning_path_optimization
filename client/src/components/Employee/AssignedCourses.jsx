import React, { useState, useEffect, useContext } from "react";
import { Alert } from "react-bootstrap";
import Chart from "react-apexcharts";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const AssignedCourses = () => {
  const [courseData, setCourseData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Not Started", "In Progress", "Completed"],
      colors: ["#ff4560", "#feb019", "#00e396"], // Modern color palette
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      legend: {
        position: "right",
        fontSize: "14px",
      },
    },
  });
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const fetchAssignedCourses = async () => {
    try {
      const response = await api.get(`/assignments/employee/${user.id}`);
      const onlyCourses = response.data.filter(
        (assignment) => assignment.courseId !== null
      );

      // Create a count for each status
      const courseCounts = {
        "Not Started": 0,
        "In Progress": 0,
        Completed: 0,
      };

      onlyCourses.forEach((assignment) => {
        if (assignment.courseProgress.length > 0) {
          const progress = assignment.courseProgress[0];
          if (progress.progress === 100) {
            courseCounts["Completed"] += 1;
          } else if (progress.progress === 0) {
            courseCounts["Not Started"] += 1;
          } else {
            courseCounts["In Progress"] += 1;
          }
        } else {
          courseCounts["Not Started"] += 1; // No progress means not started
        }
      });

      setCourseData((prevState) => ({
        ...prevState,
        series: [
          courseCounts["Not Started"],
          courseCounts["In Progress"],
          courseCounts["Completed"],
        ],
      }));
    } catch (err) {
      setError("Failed to fetch assigned courses.");
    }
  };

  useEffect(() => {
    fetchAssignedCourses();
  }, [user.id]);

  return (
    <div>
      <h2>Course Completion</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Chart
        options={courseData.options}
        series={courseData.series}
        type="donut"
        width="500"
      />
    </div>
  );
};

export default AssignedCourses;
