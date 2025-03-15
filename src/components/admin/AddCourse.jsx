import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Admin from './Admin';
import './AddCourse.css';

function AddCourse() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/courses/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Course added successfully');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setMessage('Error adding course');
    }
  };

  return(
    <div>
      <Admin />
      <div className="form-scontainer">
        <h2 className='add-new-course'>Add <span className='newnew'>New</span> Course</h2>
        {message && <div className="status-message success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-Course-name">
          <label className='Course-name-addcourse'>Course Name&nbsp;&nbsp;:&nbsp;
          &nbsp;</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='textboxlarge'
            />
          </div>
          <div className="form-group-Course-description">
            <label className='Course-name-description'>Description&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className='textboxlargedescription'
            />
          </div>
          <div className="form-group-Course-image">
            <label className='Course-name-image'>Course Image &nbsp;&nbsp;:&nbsp;&nbsp;</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="file-input-image"
              required
              
            />
          </div>
          <button type="submit" className="btnaddcourse">Add Course</button>
        </form>
      </div>
    </div>
  );
}
export default AddCourse;