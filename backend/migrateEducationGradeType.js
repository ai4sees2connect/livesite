const mongoose = require("mongoose");
const Student = require("./schema/studentSchema"); // Replace with the path to your Student model

const updateStudentEducationGradeType = async () => {
  try {
    // Connect to your MongoDB
    await mongoose.connect("mongodb+srv://connect:roM8yUkBXlBcMbXr@cluster0.9wv0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

   

    // Fetch all students
    const students = await Student.find({});

    for (const student of students) {
      // Skip students with no education
      if (!student.education || student.education.length === 0) {
        
        continue;
      }

      let isModified = false;

      // Update each education entry
      student.education = student.education.map((edu) => {
        if (!edu.gradeType) {
          isModified = true;

          // Determine the gradeType
          const isCGPA = / CGPA$/i.test(edu.score);
          return {
            ...edu,
            gradeType: isCGPA ? "CGPA" : "Percentage",
            score: isCGPA
              ? edu.score.replace(" CGPA", "").trim()
              : edu.score.replace("%", "").trim(),
          };
        }
        return edu; // No change needed
      });

      // Save only if there was a modification
      if (isModified) {
        await student.save();
        
      }
    }

    
    mongoose.disconnect();
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

updateStudentEducationGradeType();
