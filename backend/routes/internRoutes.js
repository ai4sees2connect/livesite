const express = require('express');
const Internship = require("../schema/internshipSchema");
const Recruiter = require('../schema/recruiterSchema');
const router = express.Router();


router.get('/get-internship/:internshipId', async (req, res) => {
  try {
    // const { workType, locationName,minStipend,profile } = req.query;
    // console.log('Received workType:', workType);
    // console.log('Received locationName:', locationName);
    const {internshipId}=req.params;

    const internship=await Internship.findById(internshipId).populate('recruiter')
    
    const recruiters = await Recruiter.find().populate({
      path: 'internships',
      match: { status: 'Active' },
      options: { sort: { createdAt: -1 } } // Sort by createdAt in descending order
    });
    let internships = [];

    recruiters.forEach(recruiter => {
      recruiter.internships.forEach(internship => {
        internships.push({
          ...internship._doc,
          recruiter: {
            _id: recruiter._id,
            firstname: recruiter.firstname,
            lastname: recruiter.lastname,
            email: recruiter.email,
            phone: recruiter.phone,
            companyName: recruiter.companyName
          }
        });
      });
    });

    internships = internships.sort((a, b) => b.createdAt - a.createdAt).slice(0, 15);
    
    for (const internship of internships) {
      const students = await Student.find({ 'appliedInternships.internship': internship._id });
      
      // Add studentCount as a new property to the internship object
      internship.studentCount = students.length;
    }
    // console.log(internships);
     res.status(200).json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put("/:internId/update", async (req, res) => {
  const { internshipName, description, numberOfOpenings, recruiterId } = req.body;
  const internId = req.params.internId;

  try {
    // Update the internship details
    const internship = await Internship.findByIdAndUpdate(
      internId,
      { internshipName, description, numberOfOpenings },
      { new: true } // Return the updated document
    );

    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    // Deduct 1 from recruiter's postsRemaining
    await Recruiter.findByIdAndUpdate(recruiterId, {
      $inc: { "subscription.postsRemaining": -1 }, // Decrement postsRemaining by 1
    });

    res.status(200).json({
      message: "Internship updated successfully",
      updatedInternship: internship,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update internship" });
  }
});

module.exports = router;