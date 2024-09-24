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
  const [chatHistories, setChatHistories] = useState({});

  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef(null);


  // useEffect(() => {
  //   if(!isLoading){
  //   const socketConnection = io(api,
  //     {
  //     query:{userType:'Recruiter',userId:recruiterId}
  //   }
  // );
  //   setSocket(socketConnection);

  //   socketConnection.on('studentsStatus', (students) => {
  //     console.log('Received active students:', students);
  //    setShortlistedStudents(prevStudents=>
  //     prevStudents.map(student=>{
  //       const matched=students.find(s=> s.studentId===student.studentId);
  //       if(matched){
  //         return {
  //           ...student,
  //           isActive:true
  //         }
  //       }
  //       return student;
  //     })
  //    )
  //   });

  //   socketConnection.on('studentsActive', ({ userId, isActive }) => {
  //     console.log('listening to all active students');
  //     setShortlistedStudents(prevStudents =>
  //       prevStudents.map(student =>{
  //         console.log(isActive);
  //         return student.studentId === userId ? { ...student, isActive } : student
  //       }
  //       )
  //     );

  //   });

  //   return () => {
  //     socketConnection.off('studentsActive');

  //     socketConnection.disconnect();
  //   };
  // }

  // }, [recruiterId,isLoading])



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
        setIsLoading(false);
        console.log('students fetchedddddddddddddddddd', flat);
        console.log('hello');


        const socketConnection = io(api,
          {
            query: { userType: 'Recruiter', userId: recruiterId }
          }
        );
        setSocket(socketConnection);

        socketConnection.on('studentsStatus', (students) => {
          console.log('Received active students:', students);
          setShortlistedStudents(prevStudents =>
            prevStudents.map(student => {
              const matched = students.find(s => s.studentId === student.studentId);
              if (matched) {
                return {
                  ...student,
                  isActive: true
                }
              }
              return student;
            })
          )
        });


        socketConnection.on('studentsActive', ({ userId, isActive }) => {
          console.log('listening to all active students');
          setShortlistedStudents(prevStudents =>
            prevStudents.map(student => {
              console.log(isActive);
              return student.studentId === userId ? { ...student, isActive } : student
            }
            )
          );

        });



        if (flat.length > 0) {
          flat.forEach((student, index) => {
            const { studentId, internshipId } = student;
            // console.log(studentId, internshipId);

            // Emit joinChatRoom for each student
            socketConnection.emit('joinChatRoom', { recruiterId, studentId, internshipId, type: 'Recruiter' });

            const chatHistoryEvent = `chatHistory_${studentId}_${internshipId}`;
            socketConnection.on(chatHistoryEvent, (messages) => {

              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${studentId}_${internshipId}`]: messages, // Store history for each student using their studentId as key
              }));
            });

            const receiveMessageEvent = `receiveMessages_${studentId}_${internshipId}`;
            socketConnection.on(receiveMessageEvent, (message) => {
              // console.log(`New message from student ${message.senderId}:`, message);

              // Store real-time messages for each student
              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${studentId}_${internshipId}`]: [
                  ...(prevHistories[`${studentId}_${internshipId}`] || []), // Preserve previous history
                  message, // Add the new real-time message
                ],
              }));
            });


          });
        }



      } catch (error) {
        console.error('Error fetching shortlisted students:', error);
      }
    };

    fetchShortlistedStudents();

    // return () => {
    //   shortlistedStudents.forEach(({ studentId, internshipId }) => {
    //     const chatHistoryEvent = `chatHistory_${studentId}_${internshipId}`;
    //     const receiveMessageEvent = `receiveMessages_${studentId}_${internshipId}`;
    //     socketConnection.off(chatHistoryEvent);
    //     socketConnection.off(receiveMessageEvent);
    //   });
    // };

  }, []);

  console.log('this is histories', chatHistories);
  console.log('this is studentid and internshipid', selectedStudent, selectedInternship);



  //this s for selecting first student on page render
  useEffect(() => {
    if (shortlistedStudents.length > 0) {
      console.log('Updated shortlistedStudents:', shortlistedStudents);

      if (socket) {
        console.log('First student:', shortlistedStudents[0].internshipId, shortlistedStudents[0].studentId);
        // Trigger handleStudentClick with the first student
        handleStudentClick(shortlistedStudents[0].studentId, shortlistedStudents[0].internshipId);
      } else {
        console.error('No students found.');
      }

      setIsLoading(false);
      console.log('loading status:', isLoading);
    }
  }, [shortlistedStudents, socket]);

  //this is to auto scroll messages to the bottom
  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    scrollToBottom();
  }, [chatHistories]);


  const handleStudentClick = (studentId, internshipId) => {
    setSelectedStudent(studentId);
    setSelectedInternship(internshipId);
  };


  const sendMessage = () => {
    if (newMessage.trim() && socket) {

      const messageData = {
        recruiterId,  // or studentId depending on who is sending
        studentId: selectedStudent,
        message: newMessage,
        internshipId: selectedInternship,
        type: 'Recruiter'
      };
      console.log('message Data', messageData);

      // Emit the message event to the backend
      socket.emit('sendMessage', messageData);



      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [`${messageData.studentId}_${messageData.internshipId}`]: [
          ...(prevHistories[`${messageData.studentId}_${messageData.internshipId}`] || []),  // Get existing messages or an empty array
          { senderId: recruiterId, messageContent: newMessage, sentAt: new Date() }, // Add the new message
        ],
      }));


      // Optionally clear the message input
      setNewMessage('');
    }
  };
  
  const formatSentAt = (sentAt) => {
    const messageDate = new Date(sentAt);
    const today = new Date();

    const isSameDay =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    if (isSameDay) {
      // Format time as hh:mm AM/PM
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } else {
      // Format date as dd/mm/yyyy
      return messageDate.toLocaleDateString('en-GB');
    }
  };

  return (
    <div className="flex justify-end h-[80vh] border border-black mt-20 mx-8 relative">
      {/* Left Column - Shortlisted Students */}
      <div className="fixed left-10 top-30 w-[30%] bg-gray-100 p-4 shadow-lg overflow-y-auto h-[70vh]">
        <h2 className="text-xl font-semibold mb-4">Shortlisted Students</h2>
        <ul className="space-y-2">
          {shortlistedStudents.map((student) => {
            const { studentId, internshipId, firstname, lastname, internshipName, statusUpdatedAt, isActive } = student;

            // Construct the chat key for retrieving messages from chatHistories
           
            const chatKey = `${studentId}_${internshipId}`;
            const chatHistory = chatHistories[chatKey] || [];
            

            // Get the most recent message
            const lastMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
            console.log(lastMessage)


            return (
              <div
                key={`${studentId}-${internshipId}`}
                className="student-internship-entry bg-white shadow-md rounded-lg p-4 mb-4 flex items-start space-x-4 border border-gray-200 hover:cursor-pointer hover:border-blue-300 hover:scale-105 duration-300"
                onClick={() => handleStudentClick(studentId, internshipId)}
              >
                <div className="flex-grow">
                  <div className="text-lg font-semibold text-gray-800 flex items-center relative">
                    <span className='capitalize'>{firstname} {lastname}</span>
                    {isActive && (<div className='ml-2 bg-green-500 rounded-full w-2 h-2'></div>)}
                    {lastMessage && <span className='absolute right-0 text-sm font-normal text-gray-400'>{formatSentAt(lastMessage.sentAt)}</span>}
                  </div>
                  <p className="text-sm text-gray-500">{internshipName}</p>

                  {/* Display the most recent message */}
                  {lastMessage &&<p className="text-sm text-gray-800 mt-2">
                     <span className='font-semibold'>{lastMessage.senderId===recruiterId?'You:  ':''}</span>
                     {lastMessage ? lastMessage.messageContent : "No messages exchanged yet"}
                  </p>}
                </div>
              </div>
            );
          })}

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
            {chatHistories[`${selectedStudent}_${selectedInternship}`]?.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded max-w-md ${msg.senderId === recruiterId ? 'bg-blue-300 self-end' : 'bg-gray-200'}`}
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
