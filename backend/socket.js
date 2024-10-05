const { Server } = require("socket.io");
const createOrGetChatRoom = require("./utils/chatRoomCreation");
const Message = require("./schema/messageSchema");
const mongoose = require("mongoose");
const ChatRoom = require("./schema/chatRoomSchema");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this based on your CORS policy
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  const onlineStudents = new Set(); // To store active student IDs
  const onlineRecruiters = new Set(); // To store active recruiter IDs

  io.on("connection", (socket) => {
    const { userId, userType } = socket.handshake.query;
    console.log(`${userType} connected: ${socket.id}`);
    console.log(`the user type is ${userType}`);

    if (userType === "Student") {
      // Add student to the active list
      onlineStudents.add(userId);

      // Notify recruiters about the student's active status
      io.emit("studentsActive", { userId, isActive: true });

      const recruitersStatus = Array.from(onlineRecruiters).map((id) => ({
        recruiterId: id,
      }));
      socket.emit("recruitersStatus", recruitersStatus);

      socket.on("disconnect", () => {
        console.log(`${userType} disconnected`);
        onlineStudents.delete(userId);
        io.emit("studentsActive", { userId, isActive: false });
      });
    } else if (userType === "Recruiter") {
      // Add recruiter to the active list
      onlineRecruiters.add(userId);

      // Optionally notify students about recruiter active status (if needed)
      io.emit("recruitersActive", { userId, isActive: true });

      const studentsStatus = Array.from(onlineStudents).map((id) => ({
        studentId: id,
      }));

      socket.emit("studentsStatus", studentsStatus);

      socket.on("disconnect", () => {
        console.log(`${userType} disconnected`);
        onlineRecruiters.delete(userId);
        io.emit("recruitersActive", { userId, isActive: false });
      });
    }

    console.log("list of students active", onlineStudents);
    console.log("list of recruiters active", onlineRecruiters);

    socket.on(
      "joinChatRoom",
      async ({ recruiterId, studentId, internshipId, type }) => {
        try {
          const chatRoom = await createOrGetChatRoom(
            recruiterId,
            studentId,
            internshipId
          );
          const roomId = chatRoom._id.toString();

          // console.log("Chat Room:", chatRoom);
          // console.log(socket.rooms);
          console.log(
            `joinChatRoom event received for internship with id:${internshipId}`
          );
          socket.join(roomId);
          console.log(`${type}: joined a room with id:${roomId}`);

          // const clientsInRoom = io.sockets.adapter.rooms.get(
          //   "66ec63214ef22a5eefd69ce4"
          // );
          // console.log("no of clients", clientsInRoom);

          const chatHistory = await Message.find({ chatRoomId: chatRoom._id })
            .sort({ sentAt: 1 }) // Sort messages by date (oldest to newest)
            .exec();

          const chatHistoryWithInternshipId = chatHistory.map((message) => ({
            ...message.toObject(), // Converts each message to a plain object
            internshipId, // Attach the internshipId field
          }));

          const receiverId = type === "Recruiter" ? studentId : recruiterId;
          // console.log(' chatHistory',chatHistory);
          console.log(`emiting history to ${type}`);
          socket.emit(
            `chatHistory_${receiverId}_${internshipId}`,
            chatHistoryWithInternshipId
          );
        } catch (error) {
          console.error("Error joining chat room:", error);
        }
      }
    );

    socket.on(
      "markLastMessageAsSeen",
      async ({ studentId, internshipId, recruiterId, type }) => {
        try {
          let senderId, receiverId;

          // Determine sender and receiver based on the user type
          if (type === "Recruiter") {
            senderId = studentId; // If recruiter, student is the sender
            receiverId = recruiterId; // Recruiter is the receiver
          } else if (type === "Student") {
            senderId = recruiterId; // If student, recruiter is the sender
            receiverId = studentId; // Student is the receiver
          } else {
            throw new Error("Invalid user type");
          }

          const chatRoom = await createOrGetChatRoom(
            recruiterId,
            studentId,
            internshipId
          );

          // Find the last message in the conversation for the given internship
          const unseenMessages = await Message.find({
            senderId,
            receiverId,
            chatRoomId: new mongoose.Types.ObjectId(chatRoom._id),
            seenStatus: false,
          }); // Sort by sentAt to get the latest message

          if (unseenMessages.length > 0) {
            // Update the seenStatus of all unseen messages to true
            for (const message of unseenMessages) {
              message.seenStatus = true;
              await message.save();
              console.log(
                "status updated for this message",
                message.messageContent
              );
            }

            // Optionally, emit an event back to confirm the update
            socket.emit("messageSeenUpdate", {
              studentId,
              internshipId,
              recruiterId,
              type,
            });
          }
        } catch (error) {
          console.error("Error marking message as seen:", error);
        }
      }
    );

    socket.on("markAsImportant", async ({ studentId, recruiterId,internshipId, type }) => {
      try {
        // Determine the field to update based on the user type
        let updateField;
    
        if (type === "Student") {
          updateField = { "importantForStudent": true };
        } else if (type === "Recruiter") {
          updateField = { "importantForRecruiter": true };
        } else {
          throw new Error("Invalid user type");
        }
    
        // Update the chat room to mark it as important for the respective user
        const chatRoomFromFunc = await createOrGetChatRoom(
          recruiterId,
          studentId,
          internshipId
        );
    
        if (!chatRoomFromFunc) {
          throw new Error("Chat room not found");
        }
        
        const chatRoom = await ChatRoom.findByIdAndUpdate(
          chatRoomFromFunc._id,
          { $set: updateField },
          { new: true }
        );
      
      } catch (error) {
        console.error("Error marking chat room as important:", error);
        socket.emit("error", { message: "Failed to mark chat room as important" });
      }
    });

    socket.on("removeAsImportant", async ({ studentId, recruiterId,internshipId, type }) => {
      try {
        // Determine the field to update based on the user type
        let updateField;
    
        if (type === "Student") {
          updateField = { "importantForStudent": false };
        } else if (type === "Recruiter") {
          updateField = { "importantForRecruiter": false };
        } else {
          throw new Error("Invalid user type");
        }
    
        // Update the chat room to mark it as important for the respective user
        const chatRoomFromFunc = await createOrGetChatRoom(
          recruiterId,
          studentId,
          internshipId
        );
    
        if (!chatRoomFromFunc) {
          throw new Error("Chat room not found");
        }
        
        const chatRoom = await ChatRoom.findByIdAndUpdate(
          chatRoomFromFunc._id,
          { $set: updateField },
          { new: true }
        );
      
      } catch (error) {
        console.error("Error marking chat room as important:", error);
        socket.emit("error", { message: "Failed to mark chat room as important" });
      }
    });

    socket.on("studentStatusChanged",async({studentId, recruiterId,internshipId, valueToChange})=>{
      try {
        
        const chatRoomFromFunc = await createOrGetChatRoom(
          recruiterId,
          studentId,
          internshipId
        );

        if (!chatRoomFromFunc) {
          throw new Error("Chat room not found");
        }

        const chatRoom = await ChatRoom.findByIdAndUpdate(
          chatRoomFromFunc._id,
          { $set: {studentStatus:valueToChange}},
          { new: true }
        );

        socket.to( chatRoomFromFunc._id.toString()).emit("studentStatusChangedAck",{studentStatus:valueToChange,recruiterId,internshipId})

      } catch (error) {
        
      }
    })

    // Move sendMessageRecruiter listener outside
    socket.on("sendMessage", async (messageData) => {
      const { recruiterId, studentId, message, internshipId, type } =
        messageData;

      try {
        const chatRoom = await createOrGetChatRoom(
          recruiterId,
          studentId,
          internshipId
        );

        const newMessage = new Message({
          chatRoomId: chatRoom._id,
          senderId: type === "Student" ? studentId : recruiterId,
          senderType: type,
          receiverId: type === "Student" ? recruiterId : studentId,
          receiverType: type === "Student" ? "Recruiter" : "Student",
          messageContent: message,
        });

        // Save the message in the database
        await newMessage.save();
        console.log(`message sent by ${type}`);
        console.log("this is chat room id:", chatRoom._id);

        const messageWithInternshipId = {
          ...newMessage.toObject(), // Converts Mongoose model to a plain object
          internshipId, // Attach the internshipId field
        };

        // Emit the message to the chat room
        console.log("before emiting");

        //now emit the message to other user type, i.e if recruiter is sender then trigger receiveMessages_recruiterId_internshipId event inside student component
        const receiverId = type === "Recruiter" ? recruiterId : studentId;
        socket
          .to(chatRoom._id.toString())
          .emit(
            `receiveMessages_${receiverId}_${internshipId}`,
            messageWithInternshipId
          );

        console.log("after emiting");
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("sendAssignment", async (assignmentData) => {
      const { recruiterId, studentId, internshipId, assignmentDetails, type } =
        assignmentData;

      try {
        // Get or create the chat room for the given recruiter, student, and internship
        const chatRoom = await createOrGetChatRoom(
          recruiterId,
          studentId,
          internshipId
        );

        // Create a new message with assignment details
        const newAssignment = new Message({
          chatRoomId: chatRoom._id,
          senderId: recruiterId, // The sender is the recruiter
          senderType: "Recruiter",
          receiverId: studentId, // The receiver is the student
          receiverType: "Student",
          messageContent: "", // No normal message content for assignments
          isAssignment: true, // Flag to indicate this is an assignment
          assignmentDetails: {
            description: assignmentDetails.description,
            deadline: assignmentDetails.deadline,
          },
        });

        // Save the assignment message in the database
        await newAssignment.save();
        console.log(`Assignment sent by Recruiter`);

        const messageWithInternshipId = {
          ...newAssignment.toObject(), // Converts Mongoose model to a plain object
          internshipId, // Attach the internshipId field
        };

        // Emit the assignment using the same `receiveMessages` event
        console.log("before emitting message with assignment");

        // Emit the message (assignment) to the student using the same event
        const receiverId = recruiterId; // For this case, student is always the receiver
        socket
          .to(chatRoom._id.toString())
          .emit(
            `receiveMessages_${receiverId}_${internshipId}`,
            messageWithInternshipId
          );

        console.log("after emitting message with assignment");
      } catch (error) {
        console.error("Error sending assignment:", error);
      }
    });

    socket.on("sentAttachment",async({file,recruiterId,studentId,internshipId,fileId,fileName,fileSize})=>{
    try {
      const chatRoom = await createOrGetChatRoom(
        recruiterId,
        studentId,
        internshipId
      );
      console.log(file);

      const newAttachment = new Message({
        chatRoomId: chatRoom._id,
        senderId: studentId,
        senderType: "Student",
        receiverId: recruiterId,
        receiverType: "Recruiter",
        messageContent: "Attachment sent", 
        isAttachment: true, 
        attachment: {
          fileName,
          fileId:fileId,
          fileSize

        },
      });

      await newAttachment.save();

      const newAttachmentWithInternship = {
        ...newAttachment.toObject(), // Converts Mongoose model to a plain object
        internshipId, // Attach the internshipId field
      };

      socket
          .to(chatRoom._id.toString())
          .emit(
            `receiveMessages_${studentId}_${internshipId}`,
            newAttachmentWithInternship
          );

    } catch (error) {
      console.error("Error sending attachment:", err);
    }
    })

    socket.on("submitAssignment", async (submissionData) => {
      try {
        const { msgId, files, link, additionalInfo, internshipId } =
          submissionData;

        const originalMessage = await Message.findById(msgId);
        if (!originalMessage) {
          console.error("originalMessage not found");
          return;
        }

        // Process and map file details from the submissionData
        const submittedFiles = files.map((file) => ({
          fileName: file.fileName,
          fileSize: (file.fileSize / 1024).toFixed(2) + " KB", // Already have the file size
          fileUrl: file.fileUrl, // Use the file URL from your file upload response
          fileId: file.fileId, // Store the fileId for future reference
        }));

        // Create a new message for the assignment submission
        const newSubmission = new Message({
          senderId: originalMessage.receiverId, // Assuming userId is attached to the socket
          senderType: "Student",
          receiverId: originalMessage.senderId,
          receiverType: "Recruiter",
          chatRoomId: originalMessage.chatRoomId, // The ID of the original assignment message
          messageContent: "Assignment submission",
          isAssignment: true,
          submissionDetails: {
            submittedFiles, // Array of submitted files with URLs and IDs
            submissionLink: link, // URL link provided by the student
            additionalInfo: additionalInfo || "", // Additional submission information
            originalAssignmentId: msgId, // Reference to the original assignment
          },
        });

        // Save the message to the database
        await newSubmission.save();

        const submissionWithInternshipId = {
          ...newSubmission.toObject(), // Converts Mongoose model to a plain object
          internshipId, // Attach the internshipId field
        };

        const receiverId = originalMessage.receiverId;
        // Emit the new message to the chat room so that the frontend can update
        socket
          .to(originalMessage.chatRoomId.toString())
          .emit(
            `receiveMessages_${receiverId}_${internshipId}`,
            submissionWithInternshipId
          );
      } catch (err) {
        console.error("Error submitting assignment:", err);
        socket.emit("error", { message: "Failed to submit assignment." });
      }
    });
  });

  return io;
};

module.exports = initSocket;
