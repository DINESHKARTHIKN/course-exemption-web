import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import './StudentExemption.css'

function StudentExemption() {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [electiveCourse, setElectiveCourse] = useState('');
  const [message, setMessage] = useState('');
  const [exemptionStatus, setExemptionStatus] = useState(null);

  useEffect(() => {
    fetchRegisteredCourses();
    fetchExemptionStatus();
  }, []);

  const fetchRegisteredCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses/registered', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRegisteredCourses(response.data);
    } catch (err) {
      console.error('Error fetching registered courses:', err);
    }
  };

  const fetchExemptionStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exemptions/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setExemptionStatus(response.data);
    } catch (err) {
      console.error('Error fetching exemption status:', err);
    }
  };

  const handleCourseSelect = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else if (selectedCourses.length < 3) {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourses.length !== 3) {
      setMessage('Please select exactly 3 completed courses');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/exemptions/apply', {
        completedCourses: selectedCourses,
        electiveCourse
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Exemption request submitted successfully');
      fetchExemptionStatus();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting exemption request');
    }
  };

  if (exemptionStatus) {
    return (
      <div>
        <StudentDashboard />
        <div className="form-containerss">
          <h2 className='exempstatus'>Exemption Status</h2>
          <div className={`status-message ${exemptionStatus.status}`}>
            <p>Status: {exemptionStatus.status}</p>
            <p>Selected Courses:</p>
            <ul>
              {exemptionStatus.completedCourses.map(course => (
                <li key={course._id}>{course.name}</li>
              ))}
            </ul>
            <p>Elective Course to Exempt: {exemptionStatus.electiveCourse}</p>
          </div>
          {exemptionStatus.status === 'rejected' && (
            <p>You can submit a new request after completing more courses.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudentDashboard />
      <div className="form-container">
        <h2 className='applyforcourseexemptions'>Apply for Course Exemption</h2>
        {message && <div className="status-message">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <h3 className='selectthree'>Select 3 Registered Courses:</h3>
            <div className="course-selection">
              {registeredCourses.map(course => (
                <div key={course._id} className="course-checkbox">
                  <input
                    className='coursescompletedbox'
                    type="checkbox"
                    id={course._id}
                    checked={selectedCourses.includes(course._id)}
                    onChange={() => handleCourseSelect(course._id)}
                    disabled={selectedCourses.length >= 3 && !selectedCourses.includes(course._id)}
                  />
                  <label htmlFor={course._id}>{course.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className='electivecoursetoexempts'>Elective Course to Exempt&nbsp;&nbsp;:</label>
            <input
              type="text"
              value={electiveCourse}
              onChange={(e) => setElectiveCourse(e.target.value)}
              required
              className='electivecoursess'
            />
          </div>
          <button 
            type="submit" 
            className="btnss"
            disabled={selectedCourses.length !== 3 || !electiveCourse}
          >
            Apply for Exemption
          </button>
        </form>
      </div>
    </div>
  );
}
export default StudentExemption;