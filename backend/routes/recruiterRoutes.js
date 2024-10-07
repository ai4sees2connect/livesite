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

dotenv.config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/signup", async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  try {
    let recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      return res.status(400).json({ message: "Recruiter already exists" });
    }

    recruiter = await Recruiter.create({
      firstname,
      lastname,
      email,
      phone,
      password,
    });

    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET_KEY, {
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

    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET_KEY, {
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

    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET_KEY, {
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
    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10d",
    });
    res.json({ success: true, token, recruiter });
  } catch (error) {
    console.error("Error handling Google login on the server:", error);
    res.json({ success: false, message: "Server error" });
  }
});

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

    // Send user data as response
    res.status(200).json({
      success: true,
      recruiter: {
        firstname: recruiter.firstname,
        lastname: recruiter.lastname,
        email: recruiter.email,
        phone: recruiter.phone,
        companyLogo: recruiter.companyLogo,
        companyName: recruiter.companyName,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.sendStatus(500); // Internal server error
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
      // const createdAt = new Date();
      // const day = String(createdAt.getDate()).padStart(2, '0');

      // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      // const month = months[createdAt.getMonth()];

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
          internshipIds.some((id) => id.equals(appliedInternship.internship._id)) &&
          appliedInternship.internshipStatus.status === "Shortlisted"
      );
      // console.log(shortlistedInternships);

      return {
        _id: student._id,
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
        shortlistedInternships: shortlistedInternships.map((shortlistedInternship) => {

          const chatRoom = chatRooms.find(
            (room) =>
              room.student.equals(student._id) &&
              room.internship.equals(shortlistedInternship.internship._id)
          );

          return {
            internshipId: shortlistedInternship.internship._id,
            internshipName: shortlistedInternship.internship.internshipName,
            statusUpdatedAt: shortlistedInternship.internshipStatus.statusUpdatedAt,
            importantForRecruiter: chatRoom ? chatRoom.importantForRecruiter : false,
            studentStatus:chatRoom.studentStatus // Default to false if no chatRoom is found
          };
        }),
      };
    });

    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error("Error fetching shortlisted students:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/blocked-chats', async (req, res) => {
  try {
    const blockedChats = await ChatRoom.find({ blockedByRecruiter: true })
      .select('student recruiter internship')

    res.json(blockedChats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
