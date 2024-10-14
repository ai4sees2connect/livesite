const mongoose = require('mongoose');
const Skill = require('./schema/skillsSchema'); // Update the path according to your project structure
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the skill to add
const newSkillName = 'Effective Communication'; // Get skill name from command line argument

if (!newSkillName) {
  console.error('Please provide a skill name.');
  process.exit(1);
}

// Function to add the skill
const addSkill = async () => {
  try {
    // Check if the skill already exists
    const existingSkill = await Skill.findOne({ name: newSkillName });
    if (existingSkill) {
      console.log('Skill already exists.');
      process.exit(1);
    }

    // Create and save the new skill
    const newSkill = new Skill({ name: newSkillName });
    await newSkill.save();
    console.log('Skill added successfully:', newSkill);
  } catch (error) {
    console.error('Error adding skill:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Execute the function
addSkill();
