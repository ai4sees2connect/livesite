const { Server } = require("socket.io");
const createOrGetChatRoom = require("./utils/chatRoomCreation");
const Message = require("./schema/messageSchema");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Adjust this based on your CORS policy
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const Type = socket.handshake.query.Type;
    console.log(`${Type} connected: ${socket.id}`);
    console.log(`the user type is ${Type}`);

    socket.on(
      "joinChatRoom",
      async ({ recruiterId, studentId, internshipId, type }) => {
        console.log("joinChatRoom event received:");
        try {
          const chatRoom = await createOrGetChatRoom(
            recruiterId,
            studentId,
            internshipId
          );

          // console.log("Chat Room:", chatRoom);
          console.log(socket.rooms);
          // The user joins the room identified by the chatRoom ID
          socket.join(chatRoom._id.toString());
          console.log(socket.rooms);

          const clientsInRoom = io.sockets.adapter.rooms.get(
            "66ec63214ef22a5eefd69ce4"
          );
          console.log("no of clients", clientsInRoom);

          const chatHistory = await Message.find({ chatRoomId: chatRoom._id })
            .sort({ sentAt: 1 }) // Sort messages by date (oldest to newest)
            .exec();

          socket.emit("chatHistory", chatHistory);
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
        // io.to('heelo').emit("event");
        io.to(chatRoom._id.toString()).emit("receiveMessages", newMessage);
        console.log("after emiting");
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
