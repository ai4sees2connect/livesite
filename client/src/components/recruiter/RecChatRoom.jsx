import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../common/server_url';
import { io } from 'socket.io-client';
import TimeAgo from '../common/TimeAgo'


const RecChatRoom = () => {
  const { recruiterId } = useParams(); 
  const [shortlistedStudents, setShortlistedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [socket,setSocket]=useState(null);
  const [isLoading, setIsLoading]=useState(true);
  const chatEndRef = useRef(null);


  useEffect(() => {
    if(!isLoading){
    const socketConnection = io(api,
      {
      query:{userType:'Recruiter',userId:recruiterId}
    }
  );
    setSocket(socketConnection);

    socketConnection.on('studentsStatus', (students) => {
      console.log('Received active students:', students);
     setShortlistedStudents(prevStudents=>
      prevStudents.map(student=>{
        const matched=students.find(s=> s.studentId===student.studentId);
        if(matched){
          return {
            ...student,
            isActive:true
          }
        }
        return student;
      })
     )
    });

    socketConnection.on('studentsActive', ({ userId, isActive }) => {
      console.log('listening to all active students');
      setShortlistedStudents(prevStudents =>
        prevStudents.map(student =>{
          console.log(isActive);
          return student.studentId === userId ? { ...student, isActive } : student
        }
        )
      );

    });

    return () => {
      socketConnection.off('studentsActive');

      socketConnection.disconnect();
    };
  }

  }, [recruiterId,isLoading])



  useEffect(() => {

    const fetchShortlistedStudents = async () => {
     
      try {
        // Fetch the list of shortlisted students
        const response = await axios.get(`${api}/recruiter/${recruiterId}/fetch-all-shortlisted`);
        const students = response.data;
        
        // Flatten the list of students with their internships
        let flat = students.flatMap((student) => {
          return student.shortlistedInternships.map((shortlisted) => ({
            internshipId: shortlisted.internshipId,
            internshipName: shortlisted.internshipName,
            statusUpdatedAt: shortlisted.statusUpdatedAt,
            studentId: student._id,
            firstname: student.firstname,
            lastname: student.lastname,
          }));
        });
  
        // Set the flattened student list in state
        setShortlistedStudents(flat)
        console.log('students fetched',flat);

      


      } catch (error) {
        console.error('Error fetching shortlisted students:', error);
      }
    };
  
    fetchShortlistedStudents();
  
    // Cleanup function to remove socket listener and disconnect on unmount
    
  }, [recruiterId, api]);

  
  
  
  

  useEffect(() => {
    if(shortlistedStudents.length > 0){
    console.log('Updated shortlistedStudents:', shortlistedStudents);

    if (socket) {
      console.log('First student:', shortlistedStudents[0].internshipId, shortlistedStudents[0].studentId);
      // Trigger handleStudentClick with the first student
      handleStudentClick(shortlistedStudents[0].studentId, shortlistedStudents[0].internshipId);
    } else {
      console.error('No students found.');
    }

    setIsLoading(false);
    console.log('loading status:',isLoading);
    }
  }, [shortlistedStudents,socket]);

  useEffect(() => {
    const scrollToBottom=()=>{
      chatEndRef.current?.scrollIntoView({ behavior:'smooth' });
    }
    scrollToBottom();
  }, [chatMessages]);

  
  // useEffect(() => {
  //   // Automatically call handleStudentClick when the component mounts
    
  // }, []);
 

  const handleStudentClick = (studentId, internshipId) => {
    setSelectedStudent(studentId);
    setSelectedInternship(internshipId);


    socket.emit('joinChatRoom', { recruiterId, studentId, internshipId, type:'Recruiter' });

    socket.on('receiveMessages', (message) => {
      console.log('Message received by student', message);
      // alert('new message');
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('chatHistory', (messages) => {
      console.log('Chat history received', messages);
      setChatMessages(messages);
    });

    socket.on('testMessage', (data) => {
      console.log('Received test message:', data.msg);
    });



  };
 

  const sendMessage = () => {
    if (newMessage.trim() && socket) {

      const messageData = {
        recruiterId,  // or studentId depending on who is sending
        studentId: selectedStudent,
        message: newMessage,
        internshipId: selectedInternship,
        type:'Recruiter'
      };
      console.log('message Data', messageData);
     
      // Emit the message event to the backend
      socket.emit('sendMessage', messageData);

      

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { senderId: recruiterId, messageContent: newMessage },  // Add the message locally for immediate display
      ]);


      // Optionally clear the message input
      setNewMessage('');
    }
  };
  // console.log('these are messages', chatMessages);
  console.log('this is the message sent', newMessage);

  return (
    <div className="flex justify-end h-[80vh] border border-black mt-20 mx-8 relative">
      {/* Left Column - Shortlisted Students */}
      <div className="fixed left-10 top-30 w-[30%] bg-gray-100 p-4 shadow-lg overflow-y-auto h-[70vh]">
        <h2 className="text-xl font-semibold mb-4">Shortlisted Students</h2>
        <ul className="space-y-2">
          {shortlistedStudents.map((student) =>
      
              <div
                key={`${student.studentId}-${student.internshipId}`}
                
                className="student-internship-entry bg-white shadow-md rounded-lg p-4 mb-4 flex items-start space-x-4 border border-gray-200 hover:cursor-pointer hover:border-blue-300 hover:scale-105 duration-300"
                onClick={() => handleStudentClick(student.studentId, student.internshipId)}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span>{student.firstname} {student.lastname}</span>
                    {student.isActive && (<div className='ml-2 bg-green-500 rounded-full w-3 h-3'> </div>)}
                  </h3>
                  <p className="text-sm text-gray-600">{student.internshipName}</p>
                  <p>{TimeAgo(student.statusUpdatedAt)}</p>
                 
                </div>
              </div>
            
          )}
        </ul>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="w-[65%] p-4 flex flex-col">
      <div className='w-full h-[10%]'>
          <p>Chatting with student</p>
          </div>
        <div className="flex-grow bg-white mt-4 p-4 border border-black rounded-lg shadow-lg overflow-y-auto">
          
          {/* Chat messages */}
          <div className="flex flex-col space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded max-w-md ${msg.senderId === recruiterId ? 'bg-purple-200 self-end' : 'bg-gray-200'}`}
              >
                <strong>{msg.senderId === recruiterId ? 'You' : 'Student'}:</strong> {msg.messageContent}
              </div>
            ))}
            <div ref={chatEndRef} />
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
