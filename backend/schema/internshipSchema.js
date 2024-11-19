const mongoose = require("mongoose");
// const Recruiter=require('./recruiterSchema')

const internshipSchema = new mongoose.Schema(
  {
    internshipName: {
      type: String,
      required: true,
    },
    internshipType: {
      type: String,
    },
    internLocation: {
      country: {
        type: String,
       
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    numberOfOpenings: {
      type: Number,
      required: true,
    },
    stipend: {
      type: String,
    },
    stipendType:{
      type: String
    },
    currency:{
      type: String
    },
    incentiveDescription:{
      type: String
    },
    internshipStartDate:{
      type: String
    },
    ppoCheck:{
      type: String
    },
    duration:{
      type:Number,
      required:true
    },
    description: {
      type: String,
      required: true,
    },
    
    assessment:{
      type:String,
    },
    perks:{
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: [],
    },
    jobProfile:{
      type: String,
      required: true
    },
    recruiter: {  // Add this field to link to the recruiter who posted the internship
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter',
      required: true,
    },
    views: {
      type: Number,
      default: 0, // Initialize with 0 views
    },
    status:{
      type: String,
      default: "Active"
    }
  
    
  },{ timestamps: true });

const Internship = mongoose.model("Internship", internshipSchema);

module.exports = Internship;
