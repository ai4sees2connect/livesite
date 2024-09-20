import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../common/server_url';
import { io } from 'socket.io-client';

const RecChatRoom = () => {
  const { recruiterId } = useParams();  // Recruiter ID from the URL
  const [shortlistedStudents, setShortlistedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch the list of shortlisted students when the component mounts
    const fetchShortlistedStudents = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/${recruiterId}/fetch-all-shortlisted`);
        setShortlistedStudents(response.data);
      } catch (error) {
        console.error('Error fetching shortlisted students:', error);
      }
    };

    fetchShortlistedStudents();
  }, [recruiterId]);

  useEffect(() => {
    // Establish a socket connection when the component mounts
    const socketConnection = io(api);
    setSocket(socketConnection);

    // Clean up the connection when the component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleStudentClick = (student, internship) => {
    setSelectedStudent(student);
    setSelectedInternship(internship);

    // Emit a 'joinChatRoom' event to the server
    
    socket.emit('joinChatRoom', { recruiterId, studentId: student._id, internshipId: internship.internshipId });


    socket.on('chatHistory', (messages) => {
      setChatMessages(messages);  // Update the state with the fetched messages
    });


    // Listen for incoming messages in the selected room
    socket.on('receiveMessageRecruiter', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });
  };
  console.log('selected Student',selectedStudent)
  console.log('selected internship',selectedInternship);

  const sendMessage = () => {
    if (newMessage.trim() && socket) {

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { senderId: recruiterId, message: newMessage },  // Add the message locally for immediate display
      ]);
      
      const messageData = {
        senderId: recruiterId,  // or studentId depending on who is sending
        receiverId:selectedStudent._id,
        message: newMessage,
        internshipId:selectedInternship.internshipId
      };
      console.log('message Data',messageData);

      // Emit the message event to the backend
      socket.emit('sendMessageRecruiter', messageData);


      // Update local chat messages with the new message
      

      // Optionally clear the message input
      setNewMessage('');
    }
  };
  console.log('these are messages',chatMessages);
  console.log('this is the message sent',newMessage);

  return (
    <div className="flex justify-end h-[80vh] border border-black mt-20 mx-8 relative">
      {/* Left Column - Shortlisted Students */}
      <div className="fixed left-10 top-30 w-[30%] bg-gray-100 p-4 overflow-y-auto h-[70vh]">
        <h2 className="text-xl font-semibold mb-4">Shortlisted Students</h2>
        <ul className="space-y-2">
          {shortlistedStudents.flatMap((student) =>
            student.shortlistedInternships.map((internship) => (
              <div
                key={`${student._id}-${internship.internshipId}`}
                className="student-internship-entry bg-white shadow-md rounded-lg p-4 mb-4 flex items-start space-x-4 border border-gray-200 hover:cursor-pointer hover:border-blue-300 hover:scale-105 duration-300"
                onClick={() => handleStudentClick(student, internship)}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {student.firstname} {student.lastname}
                  </h3>
                  <p className="text-sm text-gray-600">{internship.internshipName}</p>
                </div>
              </div>
            ))
          )}
        </ul>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="w-[65%] p-4 flex flex-col border border-red-500">
        <div className="flex-grow bg-white p-4 rounded-lg shadow overflow-y-auto">
          {/* Chat messages */}
          <div className="flex flex-col space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded max-w-md ${msg.senderId === recruiterId ? 'bg-purple-200 self-end' : 'bg-gray-200'}`}
              >
                <strong>{msg.senderId === recruiterId ? 'Recruiter' : 'Student'}:</strong> {msg.messageContent}
              </div>
            ))}
          </div>
        </div>

        {/* Chat input */}
        <div className="mt-4 flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border-2 rounded-lg"
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-500 text-white border px-9 py-1 rounded-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecChatRoom;
