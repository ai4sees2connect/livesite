const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
    },
    yearsOfExp: {
      type: String,
      default:'no experience'
      
    },
    homeLocation: {
      country:{
        type:String
      },
      state:{
        type: String
      },
      city:{
        type:String
      }
    },
    profilePic: {
      data: Buffer,        
      contentType: String, 
      filename: String,     
    },
    resume: {
      data: Buffer, // Store the file data as binary
      contentType: String, // Store the MIME type
      filename: String, // Store the original filename
      createdAt: {
        type: Date,
        default: Date.now // Automatically sets the creation date
      }
    },
    education: [
      {
        degree: String,
        fieldOfStudy: String,
        institution: String,
        score: String,
        startYear: String,
        endYear: String,
      },
    ],
    workExperience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        typeofwork: String,
        description: String,
      },
    ],
    certificates: [
      {
        title: String,
        issuingOrganization: String,
        issueDate: String,
        description: String, // Added description field
        fileUpload: {
          data: Buffer,         // Binary data for storing the PDF
          contentType: String,  // MIME type, e.g., "application/pdf"
          filename: String,     // Original filename of the PDF
          createdAt: {
            type: Date,
            default: Date.now // Automatically sets the creation date
          }
        },
      },
    ],
    personalProjects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    skills: [
      {
        skillName: String,
        proficiency: String,
      },
    ],
    portfolioLink: [
      {
        linkType: String,
        linkUrl: String,
      },
    ],
    appliedInternships: [
      {
        internship: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Internship",
        },
        appliedAt: {
          type: Date,
          default: Date.now, 
        },
        assessmentAns: {
          type: String,
          default: "",
        },
        availability: {
          type: String,
        },
        aboutText: {
          type: String,
        },
        internshipStatus: {
          status: {
            type: String,
            default: "Applied"
          },
          statusUpdatedAt: {
            type: Date,
            default: Date.now, 
          },
        },
      },
    ],
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
