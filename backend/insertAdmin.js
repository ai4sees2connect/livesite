const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin =require('./schema/adminSchema.js')
require('dotenv').config(); // Load environment variables


// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Function to insert admin credentials
const insertAdmin = async () => {
  const adminEmail = 'jaichawla074@gmail.com'; // Replace with actual admin email 
  const adminPassword = '$*9999*$'; // Replace with actual admin password 
  const adminName = 'Admin'; // Replace with actual admin name

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create new admin record
    const newAdmin = new Admin({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    // Save the admin to the database
    await newAdmin.save();
    console.log('Admin inserted successfully');
  } catch (err) {
    console.error('Error inserting admin:', err);
  } finally {
    mongoose.connection.close(); // Close the connection after operation
  }
};

// Connect to the DB and insert the admin
connectDB().then(insertAdmin);
