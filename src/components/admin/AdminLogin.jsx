import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';
import { Link } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin/login', {
        username,
        password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (<>
  <h2 className='one-Credit-Course-Exemption-System-for-login-admin'>ONE CREDIT COURSE EXEMPTION SYSTEM</h2>
    <div className="login-container-adminlogin">
      <h2 className="AdminLogin">Admin Login</h2>
      {error && <div className="status-message error-adminlogin">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group-adminlogin">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group-adminlogin">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btnadminlogin">Login</button>
      </form>
      <div className="login-link-admin">
        <a href="/admin/register" className="login-link">Register here</a>
        <Link to="/student/login" className="login-link-admin-forstudent">Student page</Link>
      </div>
    </div></>
  );
}

export default AdminLogin;
