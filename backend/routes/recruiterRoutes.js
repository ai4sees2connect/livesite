const express = require("express");
// const Student = require('../schema/studentSchema');
const Recruiter = require("../schema/recruiterSchema");
const Skill = require("../schema/skillsSchema");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const { jwtDecode } = require("jwt-decode");
const Student = require("../schema/studentSchema");
const ChatRoom = require("../schema/chatRoomSchema");
const Otp = require("../schema/otpSchema");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};



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
  
  const recruiter=await Recruiter.findOne({email:email});
  if(!recruiter){
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

    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS);

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

    console.log(mailOptions);
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
    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return res.status(404).json({ message: 'recruiter not found' });
    }

    // Set the new password (will be hashed automatically)
    recruiter.password = password;

    // Save the student with the new password
    await recruiter.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/signup", async (req, res) => {
  const { firstname, lastname, email, phone, countryCode, password } = req.body;

  try {
    let recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      return res.status(400).json({ message: "Recruiter already exists" });
    }
    const currentDate = new Date();
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    recruiter = await Recruiter.create({
      firstname,
      lastname,
      email,
      phone,
      countryCode,
      password,
      subscription: { // Initialize the subscription field
        planType: 'free', // You can set a default plan type
        activationDate: currentDate,
        expirationDate: oneMonthLater,
        status: 'inactive', // Default status
      }
    });

    const token = jwt.sign({ id: recruiter._id, userType: 'Recruiter' }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10d",
    });
    res.status(201).json({ message: "recruiter created successfully", token });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signup/googleauth", async (req, res) => {
  const { email, firstname, lastname } = req.body;

  try {
    // Check if the user already exists
    let recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      // If user doesn't exist, create a new one
      recruiter = new Recruiter({
        firstname,
        lastname,
        email,
        // Password can be omitted or a default value if using Google Auth
      });
      await recruiter.save();
    }

    const token = jwt.sign({ id: recruiter._id, userType: 'Recruiter' }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10d",
    });
    res.json({ success: true, recruiter, token });
  } catch (error) {
    console.error("Error handling Google sign-in on the server:", error);
    res.json({ success: false, message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await recruiter.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: recruiter._id, userType: 'Recruiter' }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10d",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login/googleauth", async (req, res) => {
  const { email, firstname, lastname } = req.body;

  try {
    // Check if the user already exists
    let recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      recruiter = new Recruiter({
        firstname,
        lastname,
        email,
      });
      await recruiter.save();
    }
    const token = jwt.sign({ id: recruiter._id, userType: 'Recruiter' }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10d",
    });
    res.json({ success: true, token, recruiter });
  } catch (error) {
    console.error("Error handling Google login on the server:", error);
    res.json({ success: false, message: "Server error" });
  }
});


const refreshPostsForNewMonth = async (recruiter) => {
  const currentDate = new Date();
  const activationDate = new Date(recruiter.subscription.activationDate);
  const currentMonth = currentDate.getMonth();
  const activationMonth = activationDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const activationYear = activationDate.getFullYear();

  // Check if a new month has started since activation
  if (currentMonth !== activationMonth || currentYear !== activationYear) {
    // Refresh the postsRemaining based on the plan type
    if (recruiter.subscription.planType === 'free') {
      recruiter.subscription.postsRemaining = 1; // Free version gets 1 post per month
    } else if (recruiter.subscription.planType === '1-month') {
      recruiter.subscription.postsRemaining = 3; // Reset to 3 for 1-month plan
    } else if (recruiter.subscription.planType === '3-month') {
      recruiter.subscription.postsRemaining = 4; // Reset to 4 for 3-month plan
    } else if (recruiter.subscription.planType === '1-year') {
      recruiter.subscription.postsRemaining = 10; // Reset to 10 for 1-year plan
    }

    // Update activation date to the current month
    recruiter.subscription.activationDate = new Date(currentYear, currentMonth, 1);
    await recruiter.save(); // Save the recruiter with the updated subscription details
  }
};


router.get("/details", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token from 'Bearer TOKEN'

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  try {
    // Decode the token
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id; // Ensure that the token contains an `id` field

    // Find the user in the database
    const recruiter = await Recruiter.findById(userId);

    if (!recruiter) return res.json({ success: false });

    await refreshPostsForNewMonth(recruiter);
    // Send user data as response
    console.log(recruiter);
    res.status(200).json({
      success: true,
      recruiter: {
        firstname: recruiter.firstname,
        lastname: recruiter.lastname,
        email: recruiter.email,
        phone: recruiter.phone,
        designation:recruiter.designation,
        industryType:recruiter.industryType,
        numOfEmployees:recruiter.numOfEmployees,
        orgDescription:recruiter.orgDescription,
        independentRec:recruiter.independentRec,
        industryType:recruiter.industryType,
        numOfEmployees:recruiter.numOfEmployees,
        countryCode:recruiter.countryCode,
        companyCity:recruiter.companyCity,
        companyLogo: recruiter.companyLogo,
        subscription:recruiter.subscription,
        companyName: recruiter.companyName,
        ...(recruiter.companyWebsite?.link && {
          companyWebsite: recruiter.companyWebsite,
        }),
        ...(recruiter.companyCertificate?.data && {
          companyCertificate: recruiter.companyCertificate,
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.sendStatus(500); // Internal server error
  }
});

router.put('/update-details/:recruiterId', async (req, res) => {
  const { phone, countryCode,firstname,lastname, designation} = req.body;
  const recruiterId= req.params.recruiterId; // Assuming the user ID is stored in req.user

  try {
    // Update the user contact information in the database
    const recruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      { phone, countryCode,firstname,lastname,designation },
      { new: true } // returns the updated document
    );

    if (!recruiter) {
      return res.status(404).json({ message: 'recruiter not found' });
    }

    res.json({ message: 'details updated successfully', user: recruiter });
  } catch (error) {
    console.error('Error updating details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
router.put('/update-details-2/:recruiterId', async (req, res) => {
  const { companyName, independentRec,orgDescription,companyCity, industryType, numOfEmployees} = req.body;
  const recruiterId= req.params.recruiterId; // Assuming the user ID is stored in req.user

  try {
    // Update the user contact information in the database
    const recruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      { companyName, independentRec,orgDescription,companyCity, industryType,numOfEmployees},
      { new: true } // returns the updated document
    );

    if (!recruiter) {
      return res.status(404).json({ message: 'recruiter not found' });
    }

    res.json({ message: 'details updated successfully', user: recruiter });
  } catch (error) {
    console.error('Error updating details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post(
  "/upload-logo/:recruiterId",
  upload.single("logo"),
  async (req, res) => {
    try {
      // Find the student by ID and update their document with the resume file
      const recruiter = await Recruiter.findById(req.params.recruiterId);
      if (!recruiter) {
        return res.status(404).send("recruiter not found.");
      }
    

      recruiter.companyLogo = {
        data: req.file.buffer, // The actual logo data
        contentType: req.file.mimetype, // The content type (e.g., image/jpeg, image/png)
        filename: req.file.originalname, // The original filename
      };
      await recruiter.save();

      res.send("logo uploaded and saved successfully.");
    } catch (error) {
      console.error("Error saving logo:", error);
      res.status(500).send("Error saving logo.");
    }
  }
);

router.get("/get-logo/:recruiterId", async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.recruiterId);
    if (!recruiter || !recruiter.companyLogo || !recruiter.companyLogo.data) {
      return res.status(404).json({ message: "Logo not found." });
    }

    res.set("Content-Type", recruiter.companyLogo.contentType);
    res.status(200).send(recruiter.companyLogo.data);
    // reres.status(200).send('success');
  } catch (error) {
    console.error("Error fetching logo:", error);
    res.status(500).send("Error fetching logo.");
  }
});

router.delete("/delete-logo/:recruiterId", async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.recruiterId);
    if (!recruiter)
      return res.status(404).json({ message: "Recruiter not found" });
    await Recruiter.updateOne(
      { _id: req.params.recruiterId },
      { $unset: { companyLogo: "" } } // This removes the companyLogo field entirely
    );
    return res.status(200).json({ message: "Logo deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("server error", error);
  }
});

router.put("/api/:recruiterId/add-company", async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.recruiterId);
    if (!recruiter)
      return res.status(404).json({ message: "recruiter not found" });
    recruiter.companyName = req.body.companyName;
    await recruiter.save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/api/get-skills", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:recruiterId/fetch-all-shortlisted", async (req, res) => {
  const { recruiterId } = req.params;

  try {
    // Find the recruiter and populate the internships they posted
    const recruiter = await Recruiter.findById(recruiterId).populate(
      "internships"
    );

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // Get the list of internship IDs posted by the recruiter
    const internshipIds = recruiter.internships.map(
      (internship) => internship._id
    );

    // Find students who applied for these internships and have been shortlisted
    const shortlistedStudents = await Student.find({
      "appliedInternships.internship": { $in: internshipIds },
      "appliedInternships.internshipStatus.status": "Shortlisted",
    }).populate({
      path: "appliedInternships.internship", // Path to the field you want to populate
      select: "internshipName", // Fields to select from the Internship schema
    });

    const chatRooms = await ChatRoom.find({
      recruiter: recruiterId,
      internship: { $in: internshipIds },
      student: { $in: shortlistedStudents.map((student) => student._id) },
    }).select("student internship importantForRecruiter studentStatus");

    // console.log(shortlistedStudents[0].appliedInternships);

    const formattedStudents = shortlistedStudents.map((student) => {
      // console.log('type of Internship ID 1:', internshipIds[0]);
      // console.log('Applied Internships:', student.appliedInternships);

      const shortlistedInternships = student.appliedInternships.filter(
        (appliedInternship) =>
          internshipIds.some((id) =>
            id.equals(appliedInternship.internship._id)
          ) && appliedInternship.internshipStatus.status === "Shortlisted"
      );
      // console.log(shortlistedInternships);

      return {
        _id: student._id,
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        shortlistedInternships: shortlistedInternships.map(
          (shortlistedInternship) => {
            const chatRoom = chatRooms.find(
              (room) =>
                room.student.equals(student._id) &&
                room.internship.equals(shortlistedInternship.internship._id)
            );

            return {
              internshipId: shortlistedInternship.internship._id,
              internshipName: shortlistedInternship.internship.internshipName,
              statusUpdatedAt:
                shortlistedInternship.internshipStatus.statusUpdatedAt,
              importantForRecruiter: chatRoom
                ? chatRoom.importantForRecruiter
                : false,
              studentStatus: chatRoom.studentStatus, // Default to false if no chatRoom is found
            };
          }
        ),
      };
    });

    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error("Error fetching shortlisted students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/blocked-chats", async (req, res) => {
  try {
    const blockedChats = await ChatRoom.find({
      blockedByRecruiter: true,
    }).select("student recruiter internship");

    res.json(blockedChats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/:recruiterId/upload-details",
  upload.single("companyCertificate"),
  async (req, res) => {
    try {
      const { recruiterId } = req.params;
      const { companyWebsite } = req.body; // Retrieve the company URL from the request body

      let updateData = {};
      let responseData = {};

      // If a company URL is provided, update the URL
      if (companyWebsite) {
        updateData.companyWebsite = {
          link: companyWebsite,
          uploadedDate: new Date(), // Track the date of the URL submission
        };
        responseData.companyWebsite = updateData.companyWebsite;
        updateData.companyCertificate = null;
      }

      // If a file (company certificate) is uploaded, process the file
      if (req.file) {
        updateData.companyCertificate = {
          data: req.file.buffer, // Store the file as a binary buffer
          contentType: req.file.mimetype,
          filename: req.file.originalname,
          fileSize: req.file.size,
          uploadedDate: new Date(), // Track the date of the file upload
        };
        responseData.companyCertificate = {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          fileSize: req.file.size,
          uploadedDate: updateData.companyCertificate.uploadedDate,
        }; // Add only necessary file details to response

        updateData.companyWebsite = null;
      }

      // Update recruiter with company details (either URL or certificate)
      const recruiter = await Recruiter.findByIdAndUpdate(
        recruiterId,
        { $set: updateData },
        { new: true }
      );

      if (!recruiter) {
        return res.status(404).json({ message: "Recruiter not found" });
      }

      return res
        .status(200)
        .json({ message: "Details updated successfully", ...responseData  });
    } catch (error) {
      console.error("Error uploading company details:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
console.log('running')
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

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

    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS);

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

    console.log(mailOptions);
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

module.exports = router;
