const express = require('express');
const cors = require('cors');
const connection=require('./mongoose/connect');
const dotenv = require('dotenv');
const Student=require('./schema/studentSchema');
const Recruiter=require('./schema/recruiterSchema');
const jwt = require('jsonwebtoken');
const studentRoutes= require('./routes/studentRoutes');
const recruiterRoutes= require('./routes/recruiterRoutes')
const studentProfRoutes = require('./routes/studentProfRoutes');
const recruiterInternRoutes=require('./routes/recruiterInternRoutes')
const studentInternRoutes = require('./routes/studentInternRoutes');
const adminRoutes=require('./routes/adminRoutes')
const paymentRoutes=require('./routes/paymentRoutes')
const  internRoutes=require('./routes/internRoutes')
const initSocket= require('./socket');
const http = require('http');
// const cron = require('node-cron');
const axios = require('axios');
const job =require('./cron')


job.start();
const app = express();
const PORT=process.env.PORT || 4000;
dotenv.config();
//cors middleware
app.use(cors());



app.use(express.json());


app.use('/student',studentRoutes);
app.use('/recruiter',recruiterRoutes);
app.use('/student/profile',studentProfRoutes);
app.use('/recruiter/internship',recruiterInternRoutes);
app.use('/student/internship',studentInternRoutes);
app.use('/admin',adminRoutes);
app.use('/payments',paymentRoutes);
app.use('/internship',internRoutes);
app.get('/',(req,res)=>{
  res.send('Welcome to our Server......')
})

app.get('/findUserType/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the userId exists in the Students collection
    const student = await Student.findById(userId);
    if (student) {
      return res.json({ userType: 'student' });
    }

    // Check if the userId exists in the Recruiters collection
    const recruiter = await Recruiter.findById(userId);
    if (recruiter) {
      return res.json({ userType: 'recruiter'});
    }

    // If not found in both collections
    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error('Error finding user type:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//hello 
const server = http.createServer(app);
initSocket(server);  // Initialize the socket


const startServer= async()=>{
  try {
    connection(process.env.MONGO_URI);
    server.listen(PORT,()=> console.log(`Server has Started on port http://localhost:${PORT}`))
  } catch (error) {
    console.log(error);
  }
}
startServer();

