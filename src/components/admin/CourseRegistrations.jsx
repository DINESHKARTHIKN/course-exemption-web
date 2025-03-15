import { useState, useEffect } from 'react';
import axios from 'axios';
import Admin from './Admin';
import './CourseRegistration.css';

function CourseRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [courseFilter, setCourseFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses/registrations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const flattenedRegistrations = response.data.flatMap((course) =>
        course.students.map((student) => ({
          courseName: course.name,
          studentName: student.username,
        }))
      );

      const sortedRegistrations = flattenedRegistrations.reverse();
      setRegistrations(sortedRegistrations);
      setFilteredRegistrations(sortedRegistrations);
    } catch (err) {
      setError('Error fetching registrations');
      console.error('Error:', err);
    }
  };

  const handleFilterChange = (e) => {
    const selectedCourse = e.target.value;
    setCourseFilter(selectedCourse);

    if (selectedCourse === '') {
      setFilteredRegistrations(registrations);
    } else {
      setFilteredRegistrations(
        registrations.filter((reg) => reg.courseName === selectedCourse)
      );
    }
  };

  return (
    <div>
      <Admin />
      <div className="table-container-courseregisterview">
        <h2 className="viewcourseregister">Course Registrations</h2>
        {error && <div className="status-message error">{error}</div>}

        <div className="filter-container">
          <label htmlFor="courseFilter">Filter by Course&nbsp;:&nbsp;&nbsp;</label>
          <select
            id="courseFilter"
            value={courseFilter}
            onChange={handleFilterChange}
            className="filter-dropdown"
          >
            <option value="">All Courses</option>
            {[...new Set(registrations.map((reg) => reg.courseName))].map(
              (courseName, index) => (
                <option key={index} value={courseName}>
                  {courseName}
                </option>
              )
            )}
          </select>
        </div>

        <div className="table-wrapper">
          <table className="course-registrations-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Student Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg, index) => (
                <tr key={index}>
                  <td>{reg.courseName}</td>
                  <td>{reg.studentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CourseRegistrations;
