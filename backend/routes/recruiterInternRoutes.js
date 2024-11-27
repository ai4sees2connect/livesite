const express = require('express');
// const Student = require('../schema/studentSchema');
const Recruiter =require('../schema/recruiterSchema');
const Internship=require('../schema/internshipSchema');
const Student=require('../schema/studentSchema')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {jwtDecode} = require('jwt-decode');

dotenv.config();
const router= express.Router();

router.post('/post/:userId',async(req,res)=>{
  const {userId}=req.params;
  const {internshipName,internshipType,internLocation,numberOfOpenings,jobProfile,stipend,duration,description,assessment,skills,perks,internshipStartQues,stipendType,currency,incentiveDescription,ppoCheck}=req.body;
  try{

  const recruiter=await Recruiter.findById(userId);
  
  if(!recruiter) return res.status(404).json({message:'Recruiter not found'});

  recruiter.subscription.postsRemaining = parseInt(recruiter.subscription.postsRemaining) - 1;

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
  
  console.log('Recruiter object:', recruiter);
  recruiter.internships.push(newInternship._id);
  await recruiter.save();


  res.status(201).json({ success: true, internship: newInternship });

}catch(error){
  console.error('Error posting internship:', error);
  res.status(500).json({ message: 'Internal server error' });
}

})

router.get('/:recruiterId/getInternships',async(req,res)=>{
  const {recruiterId}=req.params;
  try {
    const recruiter=await Recruiter.findById(recruiterId);
    if(!recruiter) return res.status(404).json({message:'Recruiter not found'});
    
    const internships=await Internship.find({recruiter:recruiterId}).sort({ createdAt: -1 });
    res.status(200).json(internships);


  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server Error' });
  }
})


router.get('/:recruiterId/applicants-count/:internshipId', async (req, res) => {
  const { recruiterId, internshipId } = req.params;

  try {
    // Check if the recruiter exists
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    // Check if the internship exists and belongs to the recruiter
    const internship = await Internship.findOne({ _id: internshipId, recruiter: recruiterId });
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    // Count the number of students who have applied for this internship
    const applicantCount = await Student.countDocuments({
      'appliedInternships.internship': internshipId
    });

    // Return the count
    res.status(200).json( applicantCount );
  } catch (error) {
    console.error('Error fetching applicant count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:recruiterId/applicants/:internshipId', async (req, res) => {
  const { recruiterId, internshipId } = req.params;

  try {
    // Check if the recruiter exists
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    // Check if the internship exists and belongs to the recruiter
    const internship = await Internship.findOne({ _id: internshipId, recruiter: recruiterId });
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    // Fetch only relevant details of students who applied for this internship
    const applicants = await Student.find(
      { 'appliedInternships.internship': internshipId },
      {
        
        password:0,
        profilePic:0,

        resume:0,

        appliedInternships: { $elemMatch: { internship: internshipId } } 
      }
    );

    // Return the list of applicants
    res.status(200).json(applicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/:recruiterId/getDetails/:internshipId',async(req,res)=>{
  const {recruiterId,internshipId}=req.params;
  try {
    const recruiter=await Recruiter.findById(recruiterId);
    if(!recruiter) return res.status(404).json({message:'Recruiter not found'});

    const internship = await Internship.findOne({ _id: internshipId, recruiter: recruiterId }); 
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.status(200).json(internship);
  } catch (error) {
    console.error('Error fetching internhsip details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
})

router.get('/:internshipId/:recruiterId/get-logo',async(req,res)=>{
  try {
    // Extract the recruiterId from the request parameters
    const { recruiterId } = req.params;

    // Find the recruiter by ID
    const recruiter = await Recruiter.findById(recruiterId);
    
    // Check if recruiter or companyLogo is not found
    if (!recruiter || !recruiter.companyLogo) {
      return res.status(404).send('Logo not found.');
    }

    // Set the Content-Type header based on the logo's MIME type
    res.setHeader('Content-Type', recruiter.companyLogo.contentType);

    // Send the logo data
    res.status(200).send(recruiter.companyLogo.data);

  } catch (error) {
    console.error('Error fetching logo:', error);
    res.status(500).send('Error fetching logo.');
  }
})

router.put('/:internshipId/change-status',async(req,res)=>{
  const {internshipId}=req.params;
  const {status}=req.body;
  try {
    const internship=await Internship.findByIdAndUpdate(internshipId,{status},{new:true});
    if(!internship) return res.status(404).json({message:'Internship not found'});
    res.status(200).json({message:"success"});
  }catch(error){
    console.error('Error changing internship status:',error);
    res.status(500).json({message:'Internal server error'});
  }
})

router.get('/:recruiterId/get-all-internships',async(req,res)=>{
 const {recruiterId}=req.params;
 try {
  const recruiterObjectId = new mongoose.Types.ObjectId(recruiterId);
  const internships = await Internship.find({ recruiter:recruiterObjectId }).select('_id internshipName createdAt');;

  if (internships.length === 0) {
    return res.status(404).json({ message: 'No internships found for this recruiter.' });
  }
  // console.log(internships);
  res.status(200).json(internships);
 } catch (error) {

  console.error('Error fetching internships:', error.message, error.stack);
  res.status(500).json({ message: 'Server error, please try again later.' });
  
 }
})

router.get('/:studentId/:internshipId/application-details', async (req, res) => {
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
      return res.status(404).json({ message: 'Student not found.' });
    }

    if (!student.appliedInternships || student.appliedInternships.length === 0) {
      return res
        .status(404)
        .json({ message: 'Internship not found in applied internships.' });
    }

    // Return the student profile along with the specific applied internship details
    // const studentProfile = {
    //   ...student.toObject(),
    //   appliedInternships: [appliedInternship], // Only return the internship that matches
    // };

    const studentProfile = {
     ...student.toObject(),
      appliedInternship:student.appliedInternships[0], // Only the matching internship
      resumeUrl: `/api/students/${studentId}/resume`, // Lazy load resume
    };

    res.status(200).json(studentProfile);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});




module.exports = router;