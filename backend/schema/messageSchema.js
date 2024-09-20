const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.Mixed, // This can either be a Recruiter or Student
    required: true
  },
  senderType: {
    type: String,
    enum: ['Recruiter', 'Student'], // To identify the type of sender
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.Mixed, // This can either be a Recruiter or Student
    required: true
  },
  receiverType: {
    type: String,
    enum: ['Recruiter', 'Student'], // To identify the type of receiver
    required: true
  },
  messageContent: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
