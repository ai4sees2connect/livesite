const express = require('express');
const Student = require('../schema/studentSchema');
const Recruiter= require('../schema/recruiterSchema.js')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {jwtDecode} = require('jwt-decode');
const Skill = require('../schema/skillsSchema.js');
const File = require('../schema/fileSchema.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Otp =require('../schema/otpSchema.js');
const Internship = require('../schema/internshipSchema.js');
// const getUserIdFromToken = require('../auth/auth');
// const { default: getUserIdFromToken } = require('../../client/src/components/student/auth/authUtils');


dotenv.config();
const router= express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const student=await Student.findOne({email:email});
    if(student){
      return res.status(404).json({ message:"student already exists" });
    }
    // Step 1: Generate a random OTP and set expiration time (10 minutes)
    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

    // Step 2: Save OTP to the database
    await Otp.create({ email, otp, expiresAt: new Date(expiresAt) });

    // Step 3: Configure nodemailer to send the OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    // console.log('Email User:', process.env.EMAIL_USER);
    // console.log('Email Pass:', process.env.EMAIL_PASS);

    transporter.verify((error, success) => {
      if (error) {
        console.error('Transporter verification failed:', error);
      } else {
        console.log('Server is ready to send messages');
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    // console.log(mailOptions);
    // Step 4: Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP email' });
      }
      return res.status(200).json({ message: 'OTP sent successfully' });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Find the OTP entry in the database
    const otpEntry = await Otp.findOne({ email, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if the OTP is expired
    if (otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP is valid, proceed to the next step (e.g., complete signup)

    return res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/forget-pass/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Find the OTP entry in the database
    const otpEntry = await Otp.findOne({ email, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if the OTP is expired
    if (otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP is valid, proceed to the next step (e.g., complete signup)

    return res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/forget-pass/send-otp', async (req, res) => {
  const { email } = req.body;
  
  const student=await Student.findOne({email:email});
  if(!student){
    return res.status(404).json({message: 'This email does not exist'});
  }
  // console.log('founddd');

  try {
    // Step 1: Generate a random OTP and set expiration time (10 minutes)
    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

    // Step 2: Save OTP to the database
    await Otp.create({ email, otp, expiresAt: new Date(expiresAt) });

    // Step 3: Configure nodemailer to send the OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    // console.log('Email User:', process.env.EMAIL_USER);
    // console.log('Email Pass:', process.env.EMAIL_PASS);

    transporter.verify((error, success) => {
      if (error) {
        console.error('Transporter verification failed:', error);
      } else {
        console.log('Server is ready to send messages');
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    // console.log(mailOptions);
    // Step 4: Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP email' });
      }
      return res.status(200).json({ message: 'OTP sent successfully' });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the student by email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Set the new password (will be hashed automatically)
    student.password = password;

    // Save the student with the new password
    await student.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/signup', async (req, res) => {
  const { firstname,lastname,email, password } = req.body;
  console.log('running signup')

  try {
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // user = new User({ email, password });
    // await user.save();

    const newStudent = await Student.create({
      firstname,
      lastname,
      email,
      password,
      gender: "",
    })
    
    const token = jwt.sign({ id: newStudent._id, userType: 'Student' }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
    res.status(201).json({ message: 'Student created successfully',token });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup/googleauth', async (req, res) => {
  const { email, firstname, lastname } = req.body;

  try {
    // Check if the user already exists
    let student = await Student.findOne({ email });

    if (!student) {
      // If user doesn't exist, create a new one
      student = new Student({
        firstname,
        lastname,
        email,
        gender: "",
        // Password can be omitted or a default value if using Google Auth
      });
      await student.save();
    }
     
      const token = jwt.sign({ id: student._id,userType: 'Student' }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
      res.json({ success: true, student, token });
    } 
      
   catch (error) {
    console.error('Error handling Google sign-in on the server:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async(req,res)=>{
  const {email, password}=req.body;
  try {
    // Find the user by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

  const isMatch = await student.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: student._id,userType: 'Student' }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
  res.status(200).json({ message: 'Login successful', token });
}
catch(error){
    res.status(500).json({ message: 'Server error', error: error.message });
  
}
})

router.post('/login/googleauth', async (req, res) => {
  const { email,firstname,lastname } = req.body;

  try {
    // Check if the user already exists
    let student = await Student.findOne({ email });

    if (!student) {
      student = new Student({
        firstname,
        lastname,
        email,})
         await student.save();

    } 
    const token=jwt.sign({id:student._id,userType: 'Student'},process.env.JWT_SECRET_KEY,{expiresIn:'10d'});
    res.json({success:true,token,student});
    
  } catch (error) {
    console.error('Error handling Google login on the server:', error);
    res.json({ success: false, message: 'Server error' });
  }
});


router.post('/upload-resume/:id', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
        // Find the student by ID and update their document with the resume file
        const student = await Student.findById(req.params.id);
        if (!student) {
          return res.status(404).send('Student not found.');
        }
        // const createdAt = new Date();
        // const day = String(createdAt.getDate()).padStart(2, '0');
        
        // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // const month = months[createdAt.getMonth()];
        
        student.resume = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname,
          createdAt: new Date(), 
        };
        await student.save();
    
        res.send('Resume uploaded and saved successfully.');
    
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).send('Error saving resume.');
  }
});

router.delete('/:userId/resume-delete', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the student by userId
    const student = await Student.findById(userId);

    // Check if the student exists
    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the student has a resume
    if (!student.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Remove the resume
    student.resume = null; // Or you can use delete student.resume;

    // Save the updated student document
    await student.save();

    // Send a success response
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/details', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from 'Bearer TOKEN'

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  try {
    // Decode the token
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id; // Ensure that the token contains an `id` field

    // Find the user in the database
    const student = await Student.findById(userId);
    
    if (!student) return res.status(200).json({success:false}); // Not found if user does not exist
    // console.log(student);

    // Send user data as response
    res.status(200).json({
      success: true,
      student: {
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        gender: student.gender,
        education:student.education,
        workExperience:student.workExperience,
        certificates:student.certificates,
        homeLocation:student.homeLocation,
        yearsOfExp:student.yearsOfExp,
        personalProjects:student.personalProjects,
        skills:student.skills,
        portfolioLink:student.portfolioLink,
        resume:student.resume.data,
        appliedInternships:student.appliedInternships

      }
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.sendStatus(500); // Internal server error
  }
});

router.post(
  "/upload-picture/:studentId",
  upload.single("profPicture"),
  async (req, res) => {
    try {
      // Find the student by ID and update their document with the resume file
      const student = await Student.findById(req.params.studentId);
      if (!student) {
        return res.status(404).send("student not found.");
      }
    

      student.profilePic = {
        data: req.file.buffer, // The actual logo data
        contentType: req.file.mimetype, // The content type (e.g., image/jpeg, image/png)
        filename: req.file.originalname, // The original filename
      };
      await student.save();

      res.send("profilePic uploaded and saved successfully.");
    } catch (error) {
      console.error("Error saving profilePic:", error);
      res.status(500).send("Error saving profilePic.");
    }
  }
);

router.get("/get-picture/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student || !student.profilePic || !student.profilePic.data) {
      return res.status(404).json({ message: "profilePic not found." });
    }

    res.set("Content-Type", student.profilePic.contentType);
    res.status(200).send(student.profilePic.data);
    // reres.status(200).send('success');
  } catch (error) {
    console.error("Error fetching profilePic:", error);
    res.status(500).send("Error fetching profilePic.");
  }
});

router.delete("/delete-picture/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student)
      return res.status(404).json({ message: "Student not found" });
    await Student.updateOne(
      { _id: req.params.studentId },
      { $unset: { profilePic: "" } } // This removes the companyLogo field entirely
    );
    return res.status(200).json({ message: "Picture deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("server error", error);
  }
});

router.put('/api/:studentId/save-location',async(req,res)=>{
  const {studentId}=req.params;
  const {homeLocation}=req.body;
  try {
    const student =await Student.findById(studentId);
    if(!student){
      return res.status(404).json({success:false, message:'Student not found.'})
    }
    student.homeLocation =homeLocation;
    // student.yearsOfExp =yearsOfExp;
    await student.save();
    return res.status(200).json({ success: true, message: 'Location updated successfully.', student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
})
router.put('/api/:studentId/save-exp',async(req,res)=>{
  const {studentId}=req.params;
  const {yearsOfExp}=req.body;
  try {
    const student =await Student.findById(studentId);
    if(!student){
      return res.status(404).json({success:false, message:'Student not found.'})
    }
    student.yearsOfExp =yearsOfExp;
    await student.save();
    return res.status(200).json({ success: true, message: 'yearsOfExp updated successfully.', student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
})

router.put('/api/:studentId/save-gender',async(req,res)=>{
  const {studentId}=req.params;
  const {genderData}=req.body;
  try {
    const student =await Student.findById(studentId);
    if(!student){
      return res.status(404).json({success:false, message:'Student not found.'})
    }
    student.gender =genderData;
    await student.save();
    return res.status(200).json({ success: true, message: 'gender updated successfully.', student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
})


router.get('/resume/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student || !student.resume) {
      return res.status(404).send('Resume not found.');
    }
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Resume-Created-At');
    res.setHeader('Content-Type', student.resume.contentType);
    res.setHeader('Content-Disposition', `inline; filename="${student.resume.filename}"`);
    res.setHeader('Resume-Created-At', student.resume.createdAt.toISOString());
    res.send(student.resume.data);
    


  } catch (error) {
    console.error('Error retrieving resume:', error);
    res.status(500).send('Error retrieving resume.');
  }
});

router.post("/batch-get-logos", async (req, res) => {
  try {
    const { recruiterIds } = req.body;

    if (!recruiterIds || !Array.isArray(recruiterIds)) {
      return res.status(400).json({ error: "Invalid recruiter IDs format" });
    }

    const recruiters = await Recruiter.find(
      { _id: { $in: recruiterIds } },
      "_id companyLogo"
    );

    const logos = recruiters.reduce((acc, recruiter) => {
      const logoData = recruiter.companyLogo?.data;
      const contentType = recruiter.companyLogo?.contentType;

      acc[recruiter._id] = logoData
        ? `data:${contentType};base64,${logoData.toString("base64")}`
        : null; // Convert binary to Base64 for direct frontend use
      return acc;
    }, {});

    res.status(200).json({ logos });
  } catch (error) {
    console.error("Error fetching logos:", error);
    res.status(500).json({ error: "Failed to fetch recruiter logos" });
  }
});

router.get('/internships', async (req, res) => {
  try {
    const { page = 1, workType, jobProfile, country, state, city, stipend } = req.query;
    const limit = 9; // Number of internships per page
    const skip = (parseInt(page) - 1) * limit; // Calculate skip value for pagination

    const filters = { status: 'Active', recruiter: { $ne: null } };

    // Apply filters based on query parameters
    if (workType && workType !== 'All Internships') {
      filters.internshipType = workType;
    }

    if (jobProfile) {
      const jobProfileArray = jobProfile.split(',').map((job) => job.trim());
      if (jobProfileArray.length > 0) {
        filters.jobProfile = { $in: jobProfileArray };
      }
    }

    if (country || state || city) {
      if (country) filters['internLocation.country'] = country;
      if (state) filters['internLocation.state'] = state;
      if (city) filters['internLocation.city'] = city;
    }

    if (stipend && parseInt(stipend) > 0) {
      filters.stipend = { $gte: parseInt(stipend) };
    }

    // console.log('Filters:', filters);

    // Fetch internships with recruiters in one query
    const internships = await Internship.find(filters)
      .populate({
        path: 'recruiter',
        select: 'firstname lastname email phone companyName',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get a list of internship IDs
    const internshipIds = internships.map((internship) => internship._id);

    // Fetch student counts for all internships in a single query
    const studentCounts = await Student.aggregate([
      { $unwind: '$appliedInternships' },
      { $match: { 'appliedInternships.internship': { $in: internshipIds } } },
      {
        $group: {
          _id: '$appliedInternships.internship',
          count: { $sum: 1 },
        },
      },
    ]);

    // Map student counts to internships
    const studentCountMap = studentCounts.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    // Add student counts to each internship
    const internshipsWithCounts = internships.map((internship) => ({
      ...internship.toObject(),
      studentCount: studentCountMap[internship._id] || 0, // Default to 0 if no students
    }));

    // Total internships for pagination
    const totalInternships = await Internship.countDocuments(filters);
    const totalPages = Math.ceil(totalInternships / limit);

    // Send response
    res.status(200).json({
      internships: internshipsWithCounts,
      totalPages,
      numOfInternships: totalInternships,
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/:userId/internships', async (req, res) => {
  try {
    const { page = 1, workType, jobProfile, country, state, city, stipend } = req.query;
    const userId = req.params.userId;
    const limit = 9; // Number of internships per page
    const skip = (parseInt(page) - 1) * limit; // Calculate skip value for pagination

    const filters = { status: 'Active', recruiter: { $ne: null } };

    // Apply filters based on query parameters
    if (workType && workType !== 'All Internships') {
      filters.internshipType = workType;
    }

    if (jobProfile) {
      const jobProfileArray = jobProfile.split(',').map((job) => job.trim());
      if (jobProfileArray.length > 0) {
        filters.jobProfile = { $in: jobProfileArray };
      }
    }

    if (country || state || city) {
      if (country) filters['internLocation.country'] = country;
      if (state) filters['internLocation.state'] = state;
      if (city) filters['internLocation.city'] = city;
    }

    if (stipend && parseInt(stipend) > 0) {
      filters.stipend = { $gte: parseInt(stipend) };
    }

    // Fetch the student and their applied internship IDs
    const student = await Student.findById(userId).select('appliedInternships');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const appliedInternshipIds = student.appliedInternships.map((app) => app.internship);
    filters._id = { $nin: appliedInternshipIds }; // Exclude applied internships

    // Fetch internships with recruiters in one query
    const internships = await Internship.find(filters)
      .populate({
        path: 'recruiter',
        select: 'firstname lastname email phone companyName',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get a list of internship IDs
    const internshipIds = internships.map((internship) => internship._id);

    // Fetch student counts for all internships in a single query
    const studentCounts = await Student.aggregate([
      { $unwind: '$appliedInternships' },
      { $match: { 'appliedInternships.internship': { $in: internshipIds } } },
      {
        $group: {
          _id: '$appliedInternships.internship',
          count: { $sum: 1 },
        },
      },
    ]);

    // Map student counts to internships
    const studentCountMap = studentCounts.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    // Add student counts to each internship
    const internshipsWithCounts = internships.map((internship) => ({
      ...internship.toObject(),
      studentCount: studentCountMap[internship._id] || 0, // Default to 0 if no students
    }));

    // Total internships for pagination
    const totalInternships = await Internship.countDocuments(filters);
    const totalPages = Math.ceil(totalInternships / limit);

    // Send response
    res.status(200).json({
      internships: internshipsWithCounts,
      totalPages,
      numOfInternships: totalInternships,
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/internships/top-15', async (req, res) => {
  try {
    // Step 1: Find all active internships, with the recruiter info populated.
    const internships = await Internship.find({ status: 'Active' })
      .populate({
        path: 'recruiter',
        select: 'firstname lastname email phone companyName', // Populating only necessary recruiter fields
      })
      .sort({ createdAt: -1 })
      .limit(8); // Fetch top 15 internships

    // Step 2: For all internships, fetch the student count in a single query.
    const internshipIds = internships.map(internship => internship._id);

    const studentCounts = await Student.aggregate([
      { $match: { 'appliedInternships.internship': { $in: internshipIds } } },
      {
        $group: {
          _id: '$appliedInternships.internship', // Group by internship ID
          count: { $sum: 1 }, // Count the number of students for each internship
        },
      },
    ]);

    // Step 3: Add the student count to each internship object
    internships.forEach(internship => {
      const studentCount = studentCounts.find(
        count => count._id.toString() === internship._id.toString()
      );
      internship.studentCount = studentCount ? studentCount.count : 0;
    });

    // Step 4: Send the response with the internships data
    res.status(200).json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/api/get-skills',async(req,res)=>{
  try {
    const skills=await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.post('/file-to-url', upload.single('file'),async(req,res)=>{
  try {
    const { originalname, mimetype, buffer } = req.file;

    // Create a new file document
    const newFile = new File({
      fileName: originalname,
      contentType: mimetype,
      data: buffer,
    });

    // Save the file to MongoDB
    await newFile.save();

    // Send back the URL (you can generate a URL based on your application's routing)
    const fileUrl = `http://localhost:4000/files/${newFile._id}`;
    res.json({ fileUrl, fileId:newFile._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'File upload failed' });
  }
})

router.get('/get-file/:id', async (req, res) => {
  try {
    const {id} = req.params;

    // Find the file in MongoDB by its ID
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    // console.log('File data size:', file.data.length);

    // Set the correct content type for the file
    res.set({
      'Content-Type': file.contentType, // Set the MIME type to the original file's type
      'Content-Disposition': `attachment; filename="${file.fileName}"`, // Optional: force download
      'Content-Length': file.data.length,
      'Access-Control-Expose-Headers':'Content-Disposition'
    });
    // res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    // Send the file data (buffer)
    res.send(file.data);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
});


module.exports = router;