const express = require("express");
// const Student = require('../schema/studentSchema');
const Recruiter = require("../schema/recruiterSchema");
const Internship = require("../schema/internshipSchema");
const Student = require("../schema/studentSchema");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { jwtDecode } = require("jwt-decode");
const Skill = require("../schema/skillsSchema");

dotenv.config();
const router = express.Router();

router.post("/post/:userId", async (req, res) => {
  const { userId } = req.params;
  const {
    internshipName,
    internshipType,
    internLocation,
    numberOfOpenings,
    jobProfile,
    stipend,
    duration,
    description,
    assessment,
    skills,
    perks,
    internshipStartQues,
    stipendType,
    currency,
    incentiveDescription,
    ppoCheck,
  } = req.body;
  try {
    const recruiter = await Recruiter.findById(userId);

    if (!recruiter)
      return res.status(404).json({ message: "Recruiter not found" });

    recruiter.subscription.postsRemaining =
      parseInt(recruiter.subscription.postsRemaining) - 1;

       // Get existing skills from the Skills schema
    const existingSkills = await Skill.find({}, { name: 1 });
    const existingSkillNames = existingSkills.map((skill) => skill.name);

    // Identify new skills
    const newSkills = skills.filter((skill) => !existingSkillNames.includes(skill));
    

    if (newSkills.length > 0) {
      const newSkillsToSave = newSkills.map((skill) => ({ name: skill }));
      await Skill.insertMany(newSkillsToSave);
    }

    
    const newInternship = new Internship({
      internshipName,
      internshipType,
      internLocation,
      numberOfOpenings,
      internshipStartQues,
      stipendType,
      stipend,
      currency,
      incentiveDescription,
      duration,
      jobProfile,
      perks,
      ppoCheck,
      description,
      assessment,
      skills,
      recruiter: userId,
    });
    await newInternship.save();

    console.log("Recruiter object:", recruiter);
    recruiter.internships.push(newInternship._id);
    await recruiter.save();

    res.status(201).json({ success: true, internship: newInternship });
  } catch (error) {
    console.error("Error posting internship:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:recruiterId/getInternships", async (req, res) => {
  const { recruiterId } = req.params;
  try {
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter)
      return res.status(404).json({ message: "Recruiter not found" });

    const internships = await Internship.find({ recruiter: recruiterId }).sort({
      createdAt: -1,
    });
    res.status(200).json(internships);
  } catch (error) {
    console.error("Error fetching internships:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:recruiterId/applicants-count/:internshipId", async (req, res) => {
  const { recruiterId, internshipId } = req.params;

  try {
    // Check if the recruiter exists
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter)
      return res.status(404).json({ message: "Recruiter not found" });

    // Check if the internship exists and belongs to the recruiter
    const internship = await Internship.findOne({
      _id: internshipId,
      recruiter: recruiterId,
    });
    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    // Count the number of students who have applied for this internship
    const applicantCount = await Student.countDocuments({
      "appliedInternships.internship": internshipId,
    });

    // Return the count
    res.status(200).json(applicantCount);
  } catch (error) {
    console.error("Error fetching applicant count:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:recruiterId/applicants/:internshipId", async (req, res) => {
  try {
    const { recruiterId, internshipId } = req.params;
    const {
      page = 1,
      searchName,
      country,
      state,
      city,
      workExperience,
      skills,
      education,
      match = 0,
      genders,
      selectedStatus

    } = req.query;
    const limit = 20;
    let matchPercentageFilter;
    if (match == 0) {
      matchPercentageFilter = 0;
    } else if (match == 1) {
      matchPercentageFilter = 50;
    } else if (match == 2) {
      matchPercentageFilter = 80;
    }

    
    const filters = {};

    // console.log("this is page value", page);

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter)
      return res.status(404).json({ message: "Recruiter not found" });

    const internship = await Internship.findOne({
      _id: internshipId,
      recruiter: recruiterId,
    });
    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    // Convert internshipId to ObjectId
    const internshipObjectId = new mongoose.Types.ObjectId(internshipId);

    // Apply filters based on query parameters
    if (searchName) {
      const nameFilter = {
        $regexMatch: {
          input: { $concat: ["$firstname", " ", "$lastname"] },
          regex: searchName,
          options: "i",
        },
      };
      filters.$expr = nameFilter;
      console.log("Name Filter:", JSON.stringify(nameFilter, null, 2)); // Log for debugging
    }

    if (country) {
      filters["homeLocation.country"] = country;
    }

    if (state) {
      filters["homeLocation.state"] = state;
    }

    if (city) {
      filters["homeLocation.city"] = city;
    }

    if (workExperience && parseInt(workExperience) >= 0) {
      filters.$expr = {
        ...filters.$expr,
        $cond: {
          if: { $eq: ["$yearsOfExp", "no experience"] },
          then: { $gte: [0, parseInt(workExperience)] },
          else: { $gte: [{ $toInt: "$yearsOfExp" }, parseInt(workExperience)] },
        },
      };
    }

    if (skills) {
      const skillsArray = skills.split(",").map((skill) => skill.trim()); // Split the skills query into an array
      if (skillsArray.length > 0) {
        filters.skills = {
          $elemMatch: {
            skillName: {
              $in: skillsArray.map((skill) => new RegExp(skill, "i")),
            }, // Case-insensitive match for skillName
          },
        };
      }
    }

    if (education) {
      const educationArray = education
        .split(",")
        .map((degree) => degree.trim()); // Split the education query into an array
      if (educationArray.length > 0) {
        filters.education = {
          $elemMatch: {
            degree: {
              $in: educationArray.map((degree) => new RegExp(degree, "i")),
            }, // Match degree with case-insensitive regex
          },
        };
      }
    }

    if (genders) {
      const gendersArray = genders.split(",").map((gender) => gender.trim());
      if (gendersArray.length > 0) {
        filters.gender = { $in: gendersArray }; // Match any selected gender
      }
    }

    if (selectedStatus) {
      if (selectedStatus === "Applications Received") {
        // No additional filtering; include all statuses
      } else if (selectedStatus === "Not Interested") {
        filters["appliedInternships.internshipStatus.status"] = "Rejected";
      } else if (selectedStatus === "Hired") {
        filters["appliedInternships.internshipStatus.status"] = "Hired";
      } else if (selectedStatus === "Shortlisted") {
        filters["appliedInternships.internshipStatus.status"] = "Shortlisted";
      }
    }

    console.log("Filters:", JSON.stringify(filters, null, 2));

    const applicants = await Student.aggregate([
      // Match students who applied for the specific internship
      {
        $match: {
          "appliedInternships.internship": internshipObjectId,
           // Apply other filters here (filters can be an empty object if no filters are set)
        },
      },
    
      // Unwind the appliedInternships array
      { $unwind: "$appliedInternships" },
    
      // Match the specific internshipId after unwind
      {
        $match: {
          "appliedInternships.internship": internshipObjectId,
          ...filters,
        },
      },
    
      // Include necessary fields and filter 'education' array based on degree and graduation year
      {
        $project: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
          gender: 1,
          yearsOfExp: 1,
          homeLocation: 1,
          appliedInternships: 1, // Include appliedInternships
          education:1,
          workExperience: 1,
          certificates: 1,
          personalProjects: 1,
          skills: 1,
          portfolioLink: 1,
        }
      },
      {
        $project: {
          profilePic: 0,
          resume: 0,
          password: 0,
        },
      },
    
      // Sort by appliedAt in descending order
      { $sort: { "appliedInternships.appliedAt": -1 } },
    
      // Pagination: Skip documents for previous pages
      { $skip: (page - 1) * limit },
    
      // Limit to the specified number of documents
      { $limit: limit },
    ]);

    // console.log("list size",applicants[1])

    delete filters["appliedInternships.internshipStatus.status"];

    const applicantsCounts = await Student.aggregate([
      // Match students who applied for the specific internship
      {
        $match: {
          "appliedInternships.internship": internshipObjectId,
          ...filters, // Add filters here
        },
      },
    
      // Unwind the appliedInternships array
      { $unwind: "$appliedInternships" },
    
      // Match the specific internshipId after unwind
      {
        $match: {
          "appliedInternships.internship": internshipObjectId,
        },
      },
    
      // Group by internshipStatus.status and count each status
      {
        $group: {
          _id: "$appliedInternships.internshipStatus.status", // Group by status
          count: { $sum: 1 }, // Count the documents for each status
        },
      },
    
      // Add a stage to calculate the total count and consolidate counts by status
      {
        $group: {
          _id: null,
          totalApplicants: { $sum: "$count" }, // Sum all counts for total
          countsByStatus: {
            $push: {
              status: "$_id",
              count: "$count",
            },
          },
        },
      },
    ]);

    // console.log("Initial applicants:", applicants.length);
    // console.log('Education records:', applicants.map(applicant => applicant.education));
    const countsByStatus = applicantsCounts[0]?.countsByStatus || [];
    const totalCount = applicantsCounts[0]?.totalApplicants || 0;
    const totalPages = Math.ceil(totalCount / limit);
    // console.log("this is count", totalCount);
    const hiredCount = countsByStatus.find(item => item.status === "Hired")?.count || 0;
    const shortlistedCount = countsByStatus.find(item => item.status === "Shortlisted")?.count || 0;
    const rejectedCount = countsByStatus.find(item => item.status === "Rejected")?.count || 0;
     console.log(shortlistedCount)
    res.status(200).json({
      totalApplicants: totalCount,
      totalPages,
      applicants: applicants,
      hiredCount,
      shortlistedCount,
      rejectedCount
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:recruiterId/getDetails/:internshipId", async (req, res) => {
  const { recruiterId, internshipId } = req.params;
  try {
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter)
      return res.status(404).json({ message: "Recruiter not found" });

    const internship = await Internship.findOne({
      _id: internshipId,
      recruiter: recruiterId,
    });
    if (!internship)
      return res.status(404).json({ message: "Internship not found" });
    res.status(200).json(internship);
  } catch (error) {
    console.error("Error fetching internhsip details:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:internshipId/:recruiterId/get-logo", async (req, res) => {
  try {
    // Extract the recruiterId from the request parameters
    const { recruiterId } = req.params;

    // Find the recruiter by ID
    const recruiter = await Recruiter.findById(recruiterId);

    // Check if recruiter or companyLogo is not found
    if (!recruiter || !recruiter.companyLogo) {
      return res.status(404).send("Logo not found.");
    }

    // Set the Content-Type header based on the logo's MIME type
    res.setHeader("Content-Type", recruiter.companyLogo.contentType);

    // Send the logo data
    res.status(200).send(recruiter.companyLogo.data);
  } catch (error) {
    console.error("Error fetching logo:", error);
    res.status(500).send("Error fetching logo.");
  }
});

router.put("/:internshipId/change-status", async (req, res) => {
  const { internshipId } = req.params;
  const { status } = req.body;
  try {
    const internship = await Internship.findByIdAndUpdate(
      internshipId,
      { status },
      { new: true }
    );
    if (!internship)
      return res.status(404).json({ message: "Internship not found" });
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error changing internship status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:recruiterId/get-all-internships", async (req, res) => {
  const { recruiterId } = req.params;
  try {
    const recruiterObjectId = new mongoose.Types.ObjectId(recruiterId);
    const internships = await Internship.find({
      recruiter: recruiterObjectId,
    }).select("_id internshipName createdAt");

    if (internships.length === 0) {
      return res
        .status(404)
        .json({ message: "No internships found for this recruiter." });
    }
    // console.log(internships);
    res.status(200).json(internships);
  } catch (error) {
    console.error("Error fetching internships:", error.message, error.stack);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

router.get(
  "/:studentId/:internshipId/application-details",
  async (req, res) => {
    const { studentId, internshipId } = req.params;

    try {
      // Find the student by studentId
      const student = await Student.findOne(
        { _id: studentId },
        {
          password: 0,
          resume: 0,

          appliedInternships: { $elemMatch: { internship: internshipId } },
        }
      );

      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }

      if (
        !student.appliedInternships ||
        student.appliedInternships.length === 0
      ) {
        return res
          .status(404)
          .json({ message: "Internship not found in applied internships." });
      }

      // Return the student profile along with the specific applied internship details
      // const studentProfile = {
      //   ...student.toObject(),
      //   appliedInternships: [appliedInternship], // Only return the internship that matches
      // };

      const studentProfile = {
        ...student.toObject(),
        appliedInternship: student.appliedInternships[0], // Only the matching internship
        resumeUrl: `/api/students/${studentId}/resume`, // Lazy load resume
      };

      res.status(200).json(studentProfile);
    } catch (error) {
      console.error("Error fetching student details:", error);
      res
        .status(500)
        .json({ message: "Server error, please try again later." });
    }
  }
);

module.exports = router;
