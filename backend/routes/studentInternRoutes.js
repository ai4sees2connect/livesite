const express = require("express");
const Student = require("../schema/studentSchema");
const Internship = require("../schema/internshipSchema");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const ChatRoom = require("../schema/chatRoomSchema");

dotenv.config();
const router = express.Router();


const calculateSkillMatch = (applicantSkills, internSkills) => {


  const applicantSkillNames = applicantSkills.map(skill => skill.skillName.toLowerCase());
  const matchedSkills = internSkills.filter(skill => applicantSkillNames.includes(skill.toLowerCase()));
  return (matchedSkills.length / internSkills.length) * 100;
};

router.post("/:studentId/apply/:internshipId", async (req, res) => {
  const { studentId, internshipId } = req.params;
  const { availability, aboutText, assessmentAns } = req.body;

  try {
    const internshipObjectId = new mongoose.Types.ObjectId(internshipId);
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const internship=await Internship.findById(internshipId);

    const alreadyApplied = student.appliedInternships.some((application) =>
      application.internship.equals(internshipObjectId)
    );

    if (alreadyApplied) {
      return res
        .status(200)
        .json({
          success: "True",
          message: "Already applied for this internship",
        });
    }

    const matchPercentage = calculateSkillMatch(student.skills, internship.skills);

    student.appliedInternships.push({
      internship: internshipObjectId,
      appliedAt: new Date(), // Save the current date and time
      matchPer: matchPercentage,
      availability,
      aboutText,
      assessmentAns,
      internshipStatus: {
        status: "Applied",
        statusUpdatedAt: new Date(),
      },
    });

    await student.save();

    res.status(200).json({ message: "Successfully applied to internship" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error);
  }
});

router.get("/:studentId/applied-internships", async (req, res) => {
  const { studentId } = req.params;

  try {
    // Fetch the student and populate the internships they applied to, including recruiters
    const student = await Student.findById(studentId).populate({
      path: "appliedInternships.internship",
      populate: {
        path: "recruiter",
        select: "firstname lastname email companyName",
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const internships = student.appliedInternships.map((application) => ({
      internship: application.internship,
      recruiter: application.internship.recruiter,
      appliedAt: application.appliedAt,
      internshipStatus: application.internshipStatus,
    }));

    // Extract internship IDs
    const internshipIds = internships.map((application) => application.internship._id);

    // Batch query: Fetch student counts for all internships in a single query
    const studentCounts = await Student.aggregate([
      { $unwind: "$appliedInternships" },
      { $match: { "appliedInternships.internship": { $in: internshipIds } } },
      {
        $group: {
          _id: "$appliedInternships.internship",
          count: { $sum: 1 },
        },
      },
    ]);

    // Map student counts to internships
    const studentCountMap = studentCounts.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    // Add the studentCount property to each internship
    const internshipsWithCounts = internships.map((application) => ({
      ...application,
      studentCount: studentCountMap[application.internship._id] || 0, // Default to 0 if no students applied
    }));

    res.status(200).json(internshipsWithCounts);
  } catch (error) {
    console.error("Error fetching applied internships:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.put("/:internshipId/view", async (req, res) => {
  const { internshipId } = req.params;

  try {
    const internship = await Internship.findByIdAndUpdate(
      internshipId,
      { $inc: { views: 1 } }, // Increment the views by 1
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json(internship);
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:studentId/:internshipId/viewed", async (req, res) => {
  const { studentId, internshipId } = req.params;

  try {
    // Find the student and update the status of the specific internship
    const student = await Student.findOneAndUpdate(
      { _id: studentId, "appliedInternships.internship": internshipId },
      {
        $set: {
          "appliedInternships.$.internshipStatus.status": "Viewed",
          "appliedInternships.$.statusUpdatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student or internship not found" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating internship status:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:studentId/:internshipId/:recruiterId/shortlist", async (req, res) => {
  const { studentId, internshipId, recruiterId } = req.params;
  try {
    const student = await Student.findOneAndUpdate(
      { _id: studentId, "appliedInternships.internship": internshipId },
      {
        $set: {
          "appliedInternships.$.internshipStatus.status": "Shortlisted",
          "appliedInternships.$.statusUpdatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student or internship not found" });
    }

    let chatRoom = await ChatRoom.findOne({
      recruiter: recruiterId,
      student: studentId,
      internship: internshipId
    });

    if (!chatRoom) {
      // Create a new chat room if it doesn't exist
      chatRoom = new ChatRoom({
        recruiter: recruiterId,
        student: studentId,
        internship: internshipId
      });

      await chatRoom.save();
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating internship status:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

router.put("/:studentId/:internshipId/reject", async (req, res) => {
  const { studentId, internshipId } = req.params;
  try {
    const student = await Student.findOneAndUpdate(
      { _id: studentId, "appliedInternships.internship": internshipId },
      {
        $set: {
          "appliedInternships.$.internshipStatus.status": "Rejected",
          "appliedInternships.$.statusUpdatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student or internship not found" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating internship status:", error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

router.get('/:studentId/shortlisted-internships', async (req, res) => {
  const { studentId } = req.params;

  try {
    // Find the student and filter for shortlisted internships
    const student = await Student.findOne(
      { _id: studentId, 'appliedInternships.internshipStatus.status': 'Shortlisted' }
    ).populate({
      path: 'appliedInternships.internship', // Populate the internship field
      populate: {
        path: 'recruiter'
      }
    }); 

    if (!student) {
      return res.status(404).json({ message: 'No shortlisted internships found for this student.' });
    }

    // Send the shortlisted internships details
    const shortlistedInternships = await Promise.all(
      student.appliedInternships.map(async appliedInternship => {
        const { internship, internshipStatus } = appliedInternship;

        // Find the chat room between this student, recruiter, and internship
        const chatRoom = await ChatRoom.findOne({
          student: studentId,
          recruiter: internship.recruiter._id,
          internship: internship._id
        }).select('importantForStudent importantForRecruiter studentStatus'); // Select only the fields we need
        
        if(!chatRoom) console.log('not found')
        return {
          internshipId: internship._id,
          internshipName: internship.internshipName, // Adjust based on your Internship schema
          statusUpdatedAt: internshipStatus.statusUpdatedAt,
          recruiterId: internship.recruiter._id,
          recruiterFirstName: internship.recruiter.firstname,
          recruiterLastName: internship.recruiter.lastname,
          companyName: internship.recruiter.companyName,
          isActive: false,
          importantForStudent: chatRoom ? chatRoom.importantForStudent : false, // Check if it's important for the student
          importantForRecruiter: chatRoom ? chatRoom.importantForRecruiter : false, // Check if it's important for the recruiter
          studentStatus:chatRoom ? chatRoom.studentStatus: 'inTouch'
        };
      })
    );

    res.json(shortlistedInternships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving shortlisted internships.' });
  }
});


module.exports = router;
