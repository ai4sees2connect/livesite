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
    const Type = socket.handshake.query.Type;
    console.log(`${Type} connected: ${socket.id}`);
    console.log(`the user type is ${Type}`);

    socket.on(
      "joinChatRoom",
      async ({ recruiterId, studentId, internshipId, type }) => {
        try {
          const chatRoom = await createOrGetChatRoom(
            recruiterId,
            studentId,
            internshipId
          );

          // The user joins the room identified by the chatRoom ID
          socket.join(chatRoom._id.toString());

          console.log(`${type} with socket id: ${socket.id} joined chat room ${chatRoom._id}`);

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
    socket.on("sendMessage", async (messageData) => {
      const { recruiterId, studentId, message, internshipId, type } = messageData;

      try {
        const chatRoom = await createOrGetChatRoom(
          recruiterId,
          studentId,
          internshipId
        );

        let senderId;
        let receiverId;
        if(type==='Student'){
          senderId=studentId;
          receiverId=recruiterId;
        }else{
          senderId=recruiterId;
          receiverId=studentId;
        }

        const newMessage = new Message({
          chatRoomId: chatRoom._id,
          senderId,
          senderType: `${type==='Student'?'Student':'Recruiter'}`,
          receiverId,
          receiverType: `${type==='Student'?'Recruiter':'Student'}`,
          messageContent: message,
        });

        // Save the message in the database
        await newMessage.save();
        console.log(`message sent by ${type}`)


        // Emit the message to the chat room
        io.to(chatRoom._id).emit("receiveMessage",newMessage);

      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`${Type} disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
