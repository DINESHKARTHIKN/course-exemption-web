import express from 'express';
import multer from 'multer';
import path from 'path';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';
import fs from 'fs';
import xlsx from 'xlsx';

const router = express.Router();

// Ensure uploads and excel directories exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('excel')) {
  fs.mkdirSync('excel');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(null, false);
  }
});

// Function to create or update an Excel file for a course
const updateCourseExcel = async (courseName, students) => {
  const courseFilePath = `excel/${courseName}.xlsx`;

  // Create or update the Excel file for the course
  const worksheetData = students.map((student, index) => ({
    SNo: index + 1,
    Username: student.username,
    Email: student.email
  }));

  const worksheet = xlsx.utils.json_to_sheet(worksheetData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, courseName);

  xlsx.writeFile(workbook, courseFilePath);
};

// Function to add a student to an existing course Excel file
const addStudentToCourseExcel = async (courseName, newStudent) => {
  const courseFilePath = `excel/${courseName}.xlsx`;

  let worksheetData = [];

  // Read existing data if the file exists
  if (fs.existsSync(courseFilePath)) {
    const workbook = xlsx.readFile(courseFilePath);
    const worksheet = workbook.Sheets[courseName];
    worksheetData = worksheet ? xlsx.utils.sheet_to_json(worksheet) : [];
  }

  // Add the new student to the data
  worksheetData.push({
    SNo: worksheetData.length + 1,
    Username: newStudent.username,
    Email: newStudent.email
  });

  // Write the updated data back to the file
  const worksheet = xlsx.utils.json_to_sheet(worksheetData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, courseName);

  xlsx.writeFile(workbook, courseFilePath);
};

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find();
    const user = await User.findById(req.user.userId);

    const coursesWithStatus = courses.map(course => ({
      ...course.toObject(),
      isRegistered: user.registeredCourses.includes(course._id)
    }));

    res.json(coursesWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get registered courses for current student
router.get('/registered', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const courses = await Course.find({
      '_id': { $in: user.registeredCourses }
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new course (admin only)
router.post('/add', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const { name, description } = req.body;
    const course = new Course({
      name,
      description,
      image: req.file.path
    });
    await course.save();

    // Create a new Excel file for the course
    await updateCourseExcel(course.name, []);

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error adding course' });
  }
});

// Get course registrations (admin only)
router.get('/registrations', adminAuth, async (req, res) => {
  try {
    const courses = await Course.find().populate('registeredStudents', 'username');
    const formattedRegistrations = courses.map(course => ({
      _id: course._id,
      name: course.name,
      students: course.registeredStudents
    }));
    res.json(formattedRegistrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for a course
router.post('/:id/register', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user.userId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (user.registeredCourses.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }

    user.registeredCourses.push(course._id);
    await user.save();

    course.registeredStudents.push(user._id);
    await course.save();

    // Update the respective Excel file for the course
    await addStudentToCourseExcel(course.name, {
      username: user.username,
      email: user.email
    });

    res.json({ message: 'Successfully registered for course' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering for course' });
  }
});

export default router;
