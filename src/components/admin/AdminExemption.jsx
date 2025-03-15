import { useState, useEffect } from 'react';
import axios from 'axios';
import Admin from './Admin';
import './AdminExemption.css';

function AdminExemption() {
  const [exemptions, setExemptions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExemptions();
  }, []);

  const fetchExemptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exemptions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setExemptions(response.data);
    } catch (err) {
      console.error('Error fetching exemptions:', err);
    }
  };

  const handleExemption = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/exemptions/${id}`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setMessage(`Exemption ${status}`);
      fetchExemptions();
    } catch (err) {
      setMessage('Error updating exemption');
    }
  };

  return (
    <div>
      <Admin />
      <div className="table-container-excemption-request-view">
        <h2 className='exemption-request'>Exemption Requests</h2>
        {message && <div className={`status-message ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>{message}</div>}
        <table className='excemption-request-table'>
          <thead>
            <tr>
              <th className='th-studenta'>Student</th>
              <th className='th-coursesa'>Completed Courses</th>
              <th className='th-electivea'>Elective Course</th>
              <th className='th-statusa'>Status</th>
              <th className='th-actionsa'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exemptions.map((exemption) => (
              <tr key={exemption._id}>
                <td className='td-studenta'>{exemption.student.username}</td>
                <td className='td-coursesa'>{exemption.completedCourses.map(c => c.name).join(', ')}</td>
                <td className='td-electivea'>{exemption.electiveCourse}</td>
                <td className='td-statusa'>{exemption.status}</td>
                <td className='td-actionsa'>
                  {exemption.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleExemption(exemption._id, 'approved')}
                        className="btnapprove"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleExemption(exemption._id, 'rejected')}
                        className="btn reject"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminExemption;
