const mongoose = require('mongoose');
const Recruiter = require('./schema/recruiterSchema'); // Adjust path to your Recruiter model

const MONGO_URI = 'idk'; // Replace with your MongoDB URI

const updatePostsRemaining = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB.');

    // Update all recruiters: convert postsRemaining from string to number
    const result = await Recruiter.updateMany(
      { 'subscription.postsRemaining': { $type: "string" } }, // Only target string values
      [
        {
          $set: {
            'subscription.postsRemaining': { $toInt: '$subscription.postsRemaining' },
          },
        },
      ]
    );

    console.log(`Updated ${result.modifiedCount} recruiters.`);
  } catch (error) {
    console.error('Error updating recruiters:', error);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

// Run the update function
updatePostsRemaining();
