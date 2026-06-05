const ChatRoom=require('../schema/chatRoomSchema')


const createOrGetChatRoom = async (recruiterId, studentId, internshipId) => {
  try {
    // Check if a chat room already exists between the recruiter, student, and internship
    let chatRoom = await ChatRoom.findOne({
      recruiter: recruiterId,
      student: studentId,
      internship: internshipId
    });

    if (!chatRoom) {
      // If no chat room exists, create a new one
      chatRoom = new ChatRoom({
        recruiter: recruiterId,
        student: studentId,
        internship: internshipId
      });
      await chatRoom.save();  // Save the new chat room to the database
    }

    return chatRoom;
  } catch (error) {
    console.error("Error creating or fetching chat room:", error);
    throw error;
  }
};

module.exports = createOrGetChatRoom;