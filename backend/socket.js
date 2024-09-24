const { Server } = require("socket.io");
const createOrGetChatRoom = require("./utils/chatRoomCreation");
const Message = require("./schema/messageSchema");

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

      const recruitersStatus = Array.from(onlineRecruiters).map(id => ({
        recruiterId: id
      }));
      socket.emit("recruitersStatus", recruitersStatus);

     

      socket.on('disconnect', () => {
        console.log(`${userType} disconnected`)
        onlineStudents.delete(userId);
        io.emit('studentsActive', { userId, isActive: false });
      });


    } else if (userType === "Recruiter") {
      // Add recruiter to the active list
      onlineRecruiters.add(userId);

      // Optionally notify students about recruiter active status (if needed)
      io.emit("recruitersActive", { userId, isActive: true });

      const studentsStatus = Array.from(onlineStudents).map(id => ({
        studentId: id
      }));

      socket.emit('studentsStatus', studentsStatus);

      socket.on('disconnect', () => {
        console.log(`${userType} disconnected`)
        onlineRecruiters.delete(userId);
        io.emit('recruitersActive', { userId, isActive: false });
      });
    }

    console.log("list of students active", onlineStudents);
    console.log("list of recruiters active", onlineRecruiters);

    socket.on(
      "joinChatRoom",
      async ({ recruiterId, studentId, internshipId,type }) => {
        
        try {
          const chatRoom = await createOrGetChatRoom(
            recruiterId,
            studentId,
            internshipId
          );
          const roomId = chatRoom._id.toString();

          // console.log("Chat Room:", chatRoom);
          // console.log(socket.rooms);
          console.log(`joinChatRoom event received for internship with id:${internshipId}`);
          socket.join(roomId);
          console.log(`${type}: joined a room with id:${roomId}`);

          // const clientsInRoom = io.sockets.adapter.rooms.get(
          //   "66ec63214ef22a5eefd69ce4"
          // );
          // console.log("no of clients", clientsInRoom);

          const chatHistory = await Message.find({ chatRoomId: chatRoom._id })
            .sort({ sentAt: 1 }) // Sort messages by date (oldest to newest)
            .exec();
            

            const receiverId= type==='Recruiter'? studentId : recruiterId
            // console.log(' chatHistory',chatHistory);
            console.log(`emiting history to ${type}`);
            socket.emit(`chatHistory_${receiverId}_${internshipId}`, chatHistory);
        } catch (error) {
          console.error("Error joining chat room:", error);
        }
      }
    );

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

        // Emit the message to the chat room
        console.log("before emiting");

        const receiverId= type==='Recruiter'? recruiterId : studentId
        socket.to(chatRoom._id.toString()).emit(`receiveMessages_${receiverId}_${internshipId}`, newMessage);

        console.log("after emiting");
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });
  });

  return io;
};

module.exports = initSocket;
