import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminRegister.css';
import { Link } from 'react-router-dom';

function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/admin/register', {
        username,
        password,
        role: 'admin'
      });
      navigate('/admin/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
  <>
    <h2 className='one-Credit-Course-Exemption-System-for-register-admin'>ONE CREDIT COURSE EXEMPTION SYSTEM</h2>
    <div className="login-container-adminregister">
      <h2 className='AdminRegistration'>Admin Registration</h2>
      {error && <div className="status-message error-adminregister">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group-adminregister">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group-adminregister">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btnadminregister">Register</button>
      </form>
      <Link to="/admin/login" className="login-link-admin-register">Login here</Link>
    </div></>
  );
}

export default AdminRegister;
