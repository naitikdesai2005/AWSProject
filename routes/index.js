
const express = require('express');
const router = express.Router();
// const passport = require('passport');
// const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;

const Admin = require('../models/adminmodel');
const Student = require('../models/studentmodel');
const Complaint = require('../models/complaintmodel');
const Food = require('../models/foodmodel');
const Notice = require('../models/noticemodel');
const Leave = require('../models/leavemodel');



router.get('/',(req,res)=>{
  res.render('index');
});


router.get('/register-admin', async (req, res) => {
  try {
      const existingAdmin = await Admin.findOne();
      if (existingAdmin) {
          return res.send('Admin already registered.');
      }


      const adminData = {
          username: 'ADMIN123',
          password : 'ADMIN123',
          fullName: 'ADMIN ADMIN ADMIN',
          email: 'admin@example.com'
      };

      // Create the admin
      const admin = new Admin(adminData);
      await admin.setPassword("ADMIN123");
      await admin.save();

      res.send('Admin registered successfully.');
  } catch (error) {
      console.error('Error registering admin:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.get('/defaultfood', async (req, res) => {
  const defaultFoodMenu = [
    { day: 'Monday', breakfast: 'Poa Batata', lunch: 'Batata saak', dinner: 'Veg Biryani' },
    { day: 'Tuesday', breakfast: 'Aloo Parotha', lunch: 'Mag saak', dinner: 'Chinese' },
    { day: 'Wednesday', breakfast: 'Masala Puri', lunch: 'Suki Bhaji', dinner: 'Pani Puri' },
    { day: 'Thursday', breakfast: 'Bhakhari', lunch: 'Bhinda saak', dinner: 'Paneer & Parotha' },
    { day: 'Friday', breakfast: 'Idli', lunch: 'Rajma', dinner: 'Sandwitch' },
    { day: 'Saturday', breakfast: 'Thepala', lunch: 'Tuver saak', dinner: 'Bhakhari & Sev Tomato' },
    { day: 'Sunday', breakfast: 'Samosa', lunch: 'Corn Capsicum', dinner: 'South Indian' }
  ];

  try {
      const existingFoodMenu = await Food.find();
      if (existingFoodMenu.length === 0) {
          await Food.insertMany(defaultFoodMenu.map(item => ({ ...item, createdBy: 'admin' })));
          console.log('Default food menu data saved successfully.');
          res.send('Default food menu data saved successfully.');
      } else {
          console.log('Default food menu data already exists in the database.');
          res.send('Default food menu data already exists in the database.'); 
      }
  } catch (error) {
      console.error('Error saving default food menu data:', error);
      res.status(500).send('Error saving default food menu data.'); 
  }
});


router.get('/admin/login', (req, res) => {
    res.render('adminLogin');
});

router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findByUsername(username);
        if (!admin) {
            return res.status(400).send('Invalid username or password');
        }
        admin.authenticate(password, (err, result) => {
            if (err || !result) {
                return res.status(400).send('Invalid username or password');
            }
            req.session.admin = admin;
            res.redirect('/admin/dashboard');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Render the student login page
router.get('/student/login', (req, res) => {
  res.render('studentLogin');
});

// Handle student login
router.post('/student/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const student = await Student.findByUsername(username);
      if (!student) {
          return res.status(400).send('Invalid username or password');
      }
      student.authenticate(password, (err, result) => {
          if (err || !result) {
              return res.status(400).send('Invalid username or password');
          }
          const sessionId = uuidv4();
          req.session[sessionId] = { student };
          res.redirect(`/student/dashboard/${sessionId}`);
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


router.get('/student/dashboard/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;
  const sessionData = req.session[sessionId];
  if (!sessionData || !sessionData.student) {
      return res.status(401).send('Unauthorized');
  }
  const studentId = sessionData.student._id;
  try {
      const student = await Student.findById(studentId);
      if (!student) {
          return res.status(404).send('Student not found');
      }
      res.render('studentDashboard', { student, sessionId }); 
  } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).send('Internal Server Error');
  }
});


// Handle student logout
router.get('/student/logout/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  delete req.session[sessionId];
  res.redirect('/student/login');
});

router.get('/admin/add-student', (req, res) => {
  res.render('addStudent');
});

router.get('/admin/students-data', async (req, res) => {
  try {
      const students = await Student.find();
      res.render('adminStudents', { students }); 
  } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/admin/students/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const student = await Student.findById(id);
      res.render('updateStudent', { student });
  } catch (error) {
      console.error('Error fetching student data for update:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.post('/admin/students/update/:id', async (req, res) => {
  const { id } = req.params;
  const updatedStudentData = req.body;
  try {
      const updatedStudent = await Student.findByIdAndUpdate(id, updatedStudentData, { new: true });
      res.redirect('/admin/students-data'); 
  } catch (error) {
      console.error('Error updating student data:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.get('/admin/dashboard', (req, res) => {
  res.render('adminDashboard'); 
});

router.get('/admin/add-student', (req, res) => {
  res.render('addStudent'); 
});

router.get('/admin/update-food-menu', (req, res) => {
  res.render('foodMenu-admin');
});



//--------------------------------------------------------------------------------------------------------------------



router.get('/student/food-menu', async (req, res) => {
  try {
      const foodMenu = await Food.find();
      res.render('foodMenu-students', { foodMenu });
  } catch (error) {
      console.error('Error fetching food menu:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/admin/food-menu', async (req, res) => {
  try {
      const foodMenu = await Food.find();
      res.render('foodMenu-admin', { foodMenu });
  } catch (error) {
      console.error('Error fetching food menu:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/admin/food-menu/update', async (req, res) => {
  try {
      const foodMenu = await Food.find();
      res.render('foodMenu-update', { foodMenu }); 
  } catch (error) {
      console.error('Error fetching food menu:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/admin/food-menu/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const foodItem = await Food.findById(id);
      res.render('food-day', { foodItem });
  } catch (error) {
      console.error('Error fetching food item:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.post('/admin/food-menu/update/:id', async (req, res) => {
  const { id } = req.params;
  const updatedFoodItem = req.body;
  try {
    const foodItem = await Food.findByIdAndUpdate(id, updatedFoodItem, { new: true });
    res.redirect('/admin/food-menu');
  } catch (error) {
    console.error('Error updating food menu item:', error);
    res.status(500).send('Internal Server Error');
  }
});

//--------------------------------------------------------------------------------------------------------------------
// Handle add student form submission
router.post('/admin/add-student', async (req, res) => {
  const { username, password, fullName, email, phone, address, roomNo, collegeID, collegeCourse, year, guardianName, guardianPhone, guardianEmail } = req.body;
  try {
      const student = new Student({
          username,
          password,
          fullName,
          email,
          phone,
          address,
          roomNo,
          collegeID,
          collegeCourse,
          year,
          guardianName,
          guardianPhone,
          guardianEmail
      });
      await student.setPassword(req.body.password); 
      await student.save();

      res.redirect('/admin/dashboard');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


//--------------------------------------------------------------------------------------------------------------------
router.get('/admin/add-notice', (req, res) => {
  res.render('addNotice');
});

router.post('/admin/add-notice', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNotice = await Notice.create({ title, content });
    res.redirect('/admin/notices');
  } catch (error) {
    console.error('Error adding notice:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/admin/delete-notice/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Notice.findByIdAndDelete(id);
    res.redirect('/admin/notices');
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/admin/notices', async (req, res) => {
  try {
    const notices = await Notice.find();
    res.render('notices', { notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/student/notice-board', async (req, res) => {
  try {
    const notices = await Notice.find();
    res.render('studentNotices', { notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).send('Internal Server Error');
  }
});

//--------------------------------------------------------------------------------------------------------------






//--------------------------------------------------------------------------------------------------------------
router.get('/student/add-complaint/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  res.render('complaintForm', { sessionId });
});


router.post('/student/complaints/:sessionId', async (req, res) => {
    const { type, description } = req.body;
    const sessionId = req.params.sessionId;
    
    if (!req.session[sessionId] || !req.session[sessionId].student) {
        return res.status(401).send('Unauthorized');
    }

    const studentId = req.session[sessionId].student._id;
    
    try {
        const complaint = await Complaint.create({ studentId, type, description });
        res.redirect(`/student/dashboard/${sessionId}`);
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/admin/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();

    const populatedComplaints = [];

    for (const complaint of complaints) {

      const student = await Student.findById(complaint.studentId);

      
      if (student) {
        populatedComplaints.push({
          ...complaint.toObject(),
          student: {
            name: student.fullName,
            roomNo: student.roomNo
          }
        });
      } else {
        populatedComplaints.push({
          ...complaint.toObject(),
          student: {
            name: 'Unknown',
            roomNo: 'N/A'
          }
        });
      }
    }

    res.render('adminComplaints', { complaints: populatedComplaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/admin/complaints/:id/update', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    res.redirect('/admin/complaints');
    await Complaint.findByIdAndDelete(id);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/student/add-complaint', (req, res) => {
  res.render('complaintForm');
  });
  
//------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------------------------

router.post('/student/submit-leave/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;
  const sessionData = req.session[sessionId];
  if (!sessionData || !sessionData.student) {
      return res.status(401).send('Unauthorized');
  }
  const studentId = sessionData.student._id;
  const { startDate, endDate, reason, place } = req.body;

  try {
      const leave = await Leave.create({ studentId, startDate, endDate, reason, place });
      res.redirect(`/student/dashboard/${sessionId}`);
  } catch (error) {
      console.error('Error submitting leave:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/student/leave/:sessionId', (req, res) => {
  res.render('leaveForm', { sessionId: req.params.sessionId });
});


router.get('/admin/leave-requests', async (req, res) => {
  try {

    const leaves = await Leave.find();
    const populatedleaves = [];
    for (const leave of leaves) {
      const student = await Student.findById(leave.studentId);
      if (student) {
        populatedleaves.push({
          ...leave.toObject(),
          student: {
            _id: student._id,
            name: student.fullName,
            roomNo: student.roomNo,
            startDate: student.startDate,
            endDate: student.endDate,
            reason: student.reason,
            place: student.place,
          }
        });
      } else {
        populatedleaves.push({
          ...leave.toObject(),
          student: {
            name: "unknown",
            roomNo: "unknown",
            startDate: "unknown",
            endDate: "unknown",
            reason: "unknown",
            place: "unknown",
          }
        });
      }
    }

    res.render('adminLeave', { leaves: populatedleaves });
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/admin/leave-requests/:id/approve', async (req, res) => {
  const leaveId = req.params.id;
  try {
    await Leave.findByIdAndUpdate(leaveId, { status: 'approved' });
    await Leave.findByIdAndDelete(leaveId);
    res.redirect('/admin/leave-requests');
  } catch (error) {
    console.error('Error approving leave:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/admin/leave-requests/:id/reject', async (req, res) => {
  const leaveId = req.params.id;
  try {
    await Leave.findByIdAndUpdate(leaveId, { status: 'rejected' });
    await Leave.findByIdAndDelete(leaveId);
    res.redirect('/admin/leave-requests');
  } catch (error) {
    console.error('Error rejecting leave:', error);
    res.status(500).send('Internal Server Error');
  }
});


//----------------------------------------------------------------------------------------------------------------




module.exports = router;
