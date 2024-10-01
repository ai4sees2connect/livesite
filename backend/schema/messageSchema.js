const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.Mixed, // This can either be a Recruiter or Student
    required: true,
  },
  senderType: {
    type: String,
    enum: ["Recruiter", "Student"], // To identify the type of sender
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.Mixed, // This can either be a Recruiter or Student
    required: true,
  },
  receiverType: {
    type: String,
    enum: ["Recruiter", "Student"], // To identify the type of receiver
    required: true,
  },
  messageContent: {
    type: String
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  seenStatus: {
    type: Boolean,
    default: false,
  },
  isAssignment: {
    type: Boolean,
    default: false,
  },
  assignmentDetails: {
    // only for assignment messages
    description: {
      type: String,
      default: "",
    },
    deadline: {
      type: Date,
    } 
  },
  submissionDetails: {
    // New field for assignment submission details
    submittedFiles: [
      {
        fileName: { type: String },
        fileUrl: { type: String },
        fileSize: { type: Number },
        fileType: { type: String },
      },
    ],
    submissionLink: { type: String },
    additionalInfo: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
