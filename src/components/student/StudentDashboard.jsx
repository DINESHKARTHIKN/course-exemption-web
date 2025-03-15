import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';// Corrected import
import './StudentDashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Decode the token if it exists
  let username = '';
  if (token) {
    const decodedToken = jwt_decode(token);
    username = decodedToken.username;  // Extract the username from the decoded token
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/student/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className='student-dashboard'>Student Dash<span className='boards'>board</span></h1>
        
        {/* Display username if it exists */}
        {/* {username && <h2>Welcome, {username}!</h2>} */}
        
        <nav className="nav-menu">
          <Link to="/student/courses" className="nav-link1">Available Courses</Link>
          <Link to="/student/exemption" className="nav-link2">Apply for Exemption</Link>
          <button onClick={handleLogout} className="btnstudentlogout">Logout</button>
        </nav>
      </div>
    </div>
  );
}

export default StudentDashboard;
