const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For token-based authentication (if you're using it)
const Admin  = require('../schema/adminSchema'); // Your Admin model
const Recruiter = require('../schema/recruiterSchema');

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
    // Query to find recruiters where either companyWebsite.link or companyCertificate is present
    const recruiters = await Recruiter.find({
      $or: [
        { 'companyWebsite.link': { $exists: true, $ne: null } },  // companyWebsite.link is not null
        { 'companyCertificate': { $exists: true, $ne: null } }     // companyCertificate is not null
      ]
    })
    .select('firstname lastname email phone companyName companyWebsite companyCertificate'); // Select only necessary fields

    if (!recruiters.length) {
      return res.status(404).json({ message: 'No recruiters found' });
    }

    // Send the list of recruiters
    res.json(recruiters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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


module.exports = router;
