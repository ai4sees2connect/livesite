const { Server } = require("socket.io");
const createOrGetChatRoom = require("./utils/chatRoomCreation");
const Message = require("./schema/messageSchema");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this based on your CORS policy
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on(
      "joinChatRoom",
      async ({ recruiterId, studentId, internshipId }) => {
        try {
          const chatRoom = await createOrGetChatRoom(
            recruiterId,
            studentId,
            internshipId
          );

          // The user joins the room identified by the chatRoom ID
          socket.join(chatRoom._id.toString());

          console.log(`User ${socket.id} joined chat room ${chatRoom._id}`);

          // Fetch old messages for this chatRoom
          const chatHistory = await Message.find({ chatRoomId: chatRoom._id })
            .sort({ sentAt: 1 }) // Sort messages by date (oldest to newest)
            .exec();

          // Send the chat history to the client
          socket.emit("chatHistory", chatHistory);
          // Optionally emit a message or notify the user
          socket.emit("chatRoomJoined", { chatRoomId: chatRoom._id });
        } catch (error) {
          console.error("Error joining chat room:", error);
        }
      }
    );

    // Move sendMessageRecruiter listener outside
    socket.on("sendMessageRecruiter", async (messageData) => {
      const { senderId, receiverId, message, internshipId } = messageData;

      try {
        const chatRoom = await createOrGetChatRoom(
          senderId,
          receiverId,
          internshipId
        );

        const newMessage = new Message({
          chatRoomId: chatRoom._id,
          senderId,
          senderType: "Recruiter",
          receiverId,
          receiverType: "Student",
          messageContent: message,
        });

        // Save the message in the database
        await newMessage.save();

        // Emit the message to the chat room
        io.to(chatRoom._id).emit("receiveMessage", {
          senderId,
          message: newMessage.messageContent,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
