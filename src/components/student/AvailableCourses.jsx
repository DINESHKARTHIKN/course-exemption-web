import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import './AvailableCourses.css';

function AvailableCourses() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleRegister = async (courseId) => {
    try {
      await axios.post(`http://localhost:5000/api/courses/${courseId}/register`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Successfully registered for the course');
      fetchCourses();
    } catch (err) {
      setMessage('Error registering for course');
    }
  };

  return (
    <div>
      <StudentDashboard />
      {message && <div className="status-message success">{message}</div>}
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <img src={`http://localhost:5000/${course.image}`} alt={course.name} className="course-image" />
            <h3 className="course-name">{course.name}</h3>
            <p className="course-description">{course.description}</p>
            <button 
              onClick={() => handleRegister(course._id)}
              className="btn register-btn"
              disabled={course.isRegistered}
            >
              {course.isRegistered ? 'Registered' : 'Register'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableCourses;
