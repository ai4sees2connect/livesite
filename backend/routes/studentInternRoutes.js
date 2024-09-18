const express = require("express");
const Student = require("../schema/studentSchema");
const Internship = require("../schema/internshipSchema");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const ChatRoom = require("../schema/chatRoomSchema");

dotenv.config();
const router = express.Router();

router.post("/:studentId/apply/:internshipId", async (req, res) => {
  const { studentId, internshipId } = req.params;
  const { availability, aboutText, assessmentAns } = req.body;

  try {
    const internshipObjectId = new mongoose.Types.ObjectId(internshipId);
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

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

    student.appliedInternships.push({
      internship: internshipObjectId,
      appliedAt: new Date(), // Save the current date and time
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
    const student = await Student.findById(studentId).populate({
      path: "appliedInternships.internship", // Populate the internships the student applied to
      populate: {
        path: "recruiter", // Further populate the recruiter details within each internship
        select: "firstname lastname email companyName", // Select specific fields of the recruiter
      },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let internships = student.appliedInternships.map((application) => ({
      internship: application.internship, // Internship details
      recruiter: application.internship.recruiter, // Recruiter details
      appliedAt: application.appliedAt, // Applied date
      internshipStatus: application.internshipStatus,
    }));

    for (const internship of internships) {
      const students = await Student.find({
        "appliedInternships.internship": internship.internship._id,
      });

      // Add studentCount as a new property to the internship object
      internship.studentCount = students.length;
    }

    res.status(200).json(internships);
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

module.exports = router;
