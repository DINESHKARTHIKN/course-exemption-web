import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import Admin from './components/admin/Admin';
import AddCourse from './components/admin/AddCourse';
import CourseRegistrations from './components/admin/CourseRegistrations';
import AdminExemption from './components/admin/AdminExemption';
import StudentLogin from './components/student/StudentLogin';
import StudentDashboard from './components/student/StudentDashboard';
import AvailableCourses from './components/student/AvailableCourses';
import StudentExemption from './components/student/StudentExemption';
import StudentRegister from './components/student/StudentRegister';
import AdminRegister from './components/admin/AdminRegister';
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-course" element={<AddCourse />} />
          <Route path="/admin/registrations" element={<CourseRegistrations />} />
          <Route path="/admin/exemptions" element={<AdminExemption />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Student Routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<AvailableCourses />} />
          <Route path="/student/exemption" element={<StudentExemption />} />
          <Route path="/student/register" element={<StudentRegister />} />
          
          {/* Default Route */}
          <Route path="/" element={<StudentLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;