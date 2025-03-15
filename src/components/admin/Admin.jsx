import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './admin.css';

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className='Admin-Dashboard'>Admin Dash<span className='board'>board</span></h2>
        <nav className="nav-menu-admin">
          <Link to="/admin/add-course" className="nav-linka">Add Course</Link>
          <Link to="/admin/registrations" className="nav-linb">Course Registrations</Link>
          <Link to="/admin/exemptions" className="nav-linkc">Exemption Requests</Link>
          <button onClick={handleLogout} className="adminlogout">Logout</button>
        </nav>
      </div>
    </div>
  );
}
export default Admin;