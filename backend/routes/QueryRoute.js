const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const router = express.Router();


// Middleware for parsing JSON data
router.use(bodyParser.json());

// Route to handle query submission
router.post('/', async (req, res) => {
  const { name, phone, email, query } = req.body;

  if (!name || !phone || !email || !query) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use environment variables
      pass: process.env.EMAIL_PASS, // Admin's Gmail app password
    },
  });

  // Email options
  const mailOptions = {
    from: email, // User's email
    to: process.env.EMAIL_USER, // Admin's email
    subject: 'New Query from user',
    text: `*****Internsnest***** You have received a new query:
    
Name: ${name}
Phone: ${phone}
Email: ${email}
Query: ${query}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Your query has been sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send query. Please try again later.' });
  }
});

module.exports = router;
