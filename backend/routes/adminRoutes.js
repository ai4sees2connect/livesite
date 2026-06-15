const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For token-based authentication (if you're using it)
const Admin  = require('../schema/adminSchema'); // Your Admin model
const Recruiter = require('../schema/recruiterSchema');
const mongoose = require('mongoose');

const router = express.Router();

// Admin login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
   

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
   

    // Generate a JWT or session (if using token-based auth)
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    // Send the token or session response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/fetch-recruiters', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // ✅ Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // ✅ Exclude binary data from initial query
    const recruiters = await Recruiter.find({
      $or: [
        { 'companyWebsite.link': { $exists: true, $ne: null } },
        { 'companyCertificate.data': { $exists: true, $ne: null } }
      ]
    })
    .select('firstname lastname email phone companyName companyWebsite.link companyWebsite.status companyWebsite.uploadedDate companyCertificate.contentType companyCertificate.filename companyCertificate.status companyCertificate.uploadedDate') // ✅ Don't fetch binary data
    .skip(skip)
    .limit(parseInt(limit))
    .lean(); // ✅ .lean() for faster plain JS objects
    
    // Get total count for pagination
    const totalCount = await Recruiter.countDocuments({
      $or: [
        { 'companyWebsite.link': { $exists: true, $ne: null } },
        { 'companyCertificate.data': { $exists: true, $ne: null } }
      ]
    });
    
    // ✅ Add separate endpoint for certificate if needed
    const recruitersWithCertificateUrl = recruiters.map(recruiter => ({
      ...recruiter,
      certificateUrl: recruiter.companyCertificate?.contentType 
        ? `/admin/certificate/${recruiter._id}` 
        : null
    }));
    
    res.json({
      recruiters: recruitersWithCertificateUrl,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Separate endpoint for serving certificate (load on demand)
router.get('/certificate/:recruiterId', async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(
      req.params.recruiterId,
      'companyCertificate.data companyCertificate.contentType'
    );
    
    if (!recruiter?.companyCertificate?.data) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Content-Type', recruiter.companyCertificate.contentType);
    res.send(recruiter.companyCertificate.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to serve certificate' });
  }
});

router.get('/recruiters/download-certificate/:id', async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);

    if (!recruiter || !recruiter.companyCertificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.set({
      'Content-Type': recruiter.companyCertificate.contentType,
      'Content-Disposition': `attachment; filename=${recruiter.companyCertificate.filename}`
    });

    res.send(recruiter.companyCertificate.data);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/verify-recruiter/:recruiterId',async(req,res)=>{
  const {recruiterId}=req.params;
  // const id =new mongoose.Types.ObjectId(recruiterId);
  try{
    const recruiter=await Recruiter.findById(recruiterId);
    if(!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
    console.log(recruiter);
    if (recruiter.companyWebsite.link) {
      // Update the status for companyWebsite if it exists
      recruiter.companyWebsite.status = 'Verified';
    } else if (recruiter.companyCertificate.data) {
      // Update the status for companyCertificate if it exists
      recruiter.companyCertificate.status = 'Verified';
    } else {
      return res.status(400).json({ message: 'No website or certificate to verify' });
    }

   

    // Save the updated recruiter
    await recruiter.save();

    // Send a success response
    res.status(200).json({ message: 'Recruiter status updated to verified' });

  } catch (error) {
    console.error('Error verifying recruiter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

router.put('/reject-recruiter/:recruiterId',async(req,res)=>{
  const recruiterId=req.params.recruiterId;
  try{
    const recruiter=await Recruiter.findById(recruiterId);
    if(!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
    if (recruiter.companyWebsite.link) {
      // Update the status for companyWebsite if it exists
      recruiter.companyWebsite.status = 'Rejected';
    } else if (recruiter.companyCertificate.data) {
      // Update the status for companyCertificate if it exists
      recruiter.companyCertificate.status = 'Rejected';
    } else {
      return res.status(400).json({ message: 'No website or certificate to verify' });
    }

    // Save the updated recruiter
    await recruiter.save();

    // Send a success response
    res.status(200).json({ message: 'Recruiter status updated to rejected' });

  } catch (error) {
    console.error('Error verifying recruiter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

module.exports = router;
