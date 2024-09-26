import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'
import api from '../common/server_url';
import TimeAgo from '../common/TimeAgo';
import { io } from 'socket.io-client';


const Chats = () => {

  const { studentId } = useParams();
  const [shortlistedInternships, setShortlistedInternships] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatHistories, setChatHistories] = useState({});

  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [companyName, setCompanyName] = useState('');

  const [internshipName, setInternshipName] = useState('');
  const [activeStatus, setActiveStatus] = useState(false);

  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef(null);
  const [latestMessages, setLatestMessages] = useState({});


  useEffect(() => {
    const fetchShortlistedInternships = async () => {
      try {
        const response = await axios.get(`${api}/student/internship/${studentId}/shortlisted-internships`);
        const result = response.data;
        setShortlistedInternships(result);
        console.log('this is on initial fetching', response.data);



        const socketConnection = io(api, {
          query: { userType: 'Student', userId: studentId }
        });
        setSocket(socketConnection);
        console.log('socket connection established from student side');

        socketConnection.on('recruitersStatus', (recruiters) => {
          if (shortlistedInternships) {
            console.log('yes interns to haii', recruiters);
            console.log('theeeeeseee', shortlistedInternships.length);
          }
          setShortlistedInternships(prevInterns =>
            prevInterns.map(intern => {
              // Find the matching recruiter in the recruiters array
              const matchingRecruiter = recruiters.find(rec => rec.recruiterId === intern.recruiterId);
              console.log('Intern recruiterId:', intern.recruiterId);
              console.log('Matching recruiter:', matchingRecruiter);

              // If a match is found, update the isActive status
              if (matchingRecruiter && intern.isActive !== true) {
                console.log('Updating isActive for recruiterId:', intern.recruiterId);
                return {
                  ...intern,
                  isActive: true, // Set the active status
                };
              }

              console.log('not changing any thing');
              return intern;
            })
          );
          // setShortlistedRecruiters(recruiters);
        });

        socketConnection.on('recruitersActive', ({ userId, isActive }) => {
          console.log('listening to all active recruiters')
          setShortlistedInternships(prevInterns => {
            console.log(isActive);
            return prevInterns.map(intern => intern.recruiterId === userId ? { ...intern, isActive } : intern)
          }
          )
        })


        if (result.length > 0) {
          result.forEach((intern, index) => {
            const { recruiterId, internshipId } = intern;
            console.log(recruiterId, internshipId);

            // Emit joinChatRoom for each student
            socketConnection.emit('joinChatRoom', { recruiterId, studentId, internshipId, type: 'Student' });

            const chatHistoryEvent = `chatHistory_${recruiterId}_${internshipId}`;
            socketConnection.on(chatHistoryEvent, (messages) => {

              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${recruiterId}_${internshipId}`]: messages, // Store history for each student using their studentId as key
              }));
            });

            const receiveMessageEvent = `receiveMessages_${recruiterId}_${internshipId}`;
            socketConnection.on(receiveMessageEvent, (message) => {
              console.log(`New message from recruiter ${message.senderId}:`, message);

              // Store real-time messages for each student
              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${recruiterId}_${internshipId}`]: [
                  ...(prevHistories[`${recruiterId}_${internshipId}`] || []), // Preserve previous history
                  message, // Add the new real-time message
                ],
              }));

              setLatestMessages((prev) => ({
                ...prev,
                [`${message.senderId}_${message.internshipId}`]: true,
              }));

            });


          });
        }



      } catch (err) {
        toast.success('some error occured');

      }
    };

    fetchShortlistedInternships();

  }, [studentId]);


  // useEffect(() => {
  //   if(!isLoading){
  //   const socketConnection = io(api, {
  //     query: { userType: 'Student', userId: studentId }
  //   });
  //   setSocket(socketConnection);
  //   console.log('socket connection established from student side');

  //   socketConnection.on('recruitersStatus', (recruiters) => {
  //     if(shortlistedInternships){
  //       console.log('yes interns to haii',recruiters);
  //       console.log('theeeeeseee',shortlistedInternships.length);
  //     }
  //     setShortlistedInternships(prevInterns => 
  //       prevInterns.map(intern => {
  //         // Find the matching recruiter in the recruiters array
  //         const matchingRecruiter = recruiters.find(rec => rec.recruiterId === intern.recruiterId);
  //         console.log('Intern recruiterId:', intern.recruiterId);
  //         console.log('Matching recruiter:', matchingRecruiter);

  //         // If a match is found, update the isActive status
  //         if (matchingRecruiter && intern.isActive!==true) {
  //           console.log('Updating isActive for recruiterId:', intern.recruiterId);
  //           return {
  //             ...intern,
  //             isActive: true, // Set the active status
  //           };
  //         }

  //         console.log('not changing any thing');
  //         return intern;
  //       })
  //     );
  //     // setShortlistedRecruiters(recruiters);
  //   });

  //   socketConnection.on('recruitersActive', ({ userId, isActive }) => {
  //     console.log('listening to all active recruiters')
  //     setShortlistedInternships(prevInterns => {
  //       console.log(isActive);
  //       return prevInterns.map(intern => intern.recruiterId === userId ? { ...intern, isActive } : intern)
  //     }
  //     )
  //   })

  //   return () => {
  //     socketConnection.disconnect();
  //   }}
  // }, [studentId,isLoading]);

  useEffect(() => {
    if (shortlistedInternships.length > 0) {
      console.log('Updated shortlistedInternships:', shortlistedInternships);
      if (socket) {
        handleInternClick(shortlistedInternships[0].internshipId, shortlistedInternships[0].recruiterId);
        handleInfoSetter(shortlistedInternships[0].companyName, shortlistedInternships[0].internshipName, shortlistedInternships[0].isActive);
      }
      setIsLoading(false);
      console.log('loading status:', isLoading);
    }
  }, [shortlistedInternships, socket]);

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
       setLatestMessages((prev) => ({
      ...prev,
      [`${selectedRecruiter}_${selectedInternship}`]: false,
    }));
    
    }
    const timer = setTimeout(scrollToBottom, 500);

    return () => clearTimeout(timer);
  }, [selectedInternship,selectedRecruiter]);


  const sendMessage = () => {
    if (newMessage.trim() && socket) {



      const messageData = {
        studentId,  // or studentId depending on who is sending
        recruiterId: selectedRecruiter,
        message: newMessage,
        internshipId: selectedInternship,
        type: 'Student'
      };
      console.log('message Data', messageData);

      // Emit the message event to the backend
      socket.emit('sendMessage', messageData);

      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [`${messageData.recruiterId}_${messageData.internshipId}`]: [
          ...(prevHistories[`${messageData.recruiterId}_${messageData.internshipId}`] || []),  // Get existing messages or an empty array
          { senderId: studentId, messageContent: newMessage, sentAt: new Date() }, // Add the new message
        ],
      }));




      // Optionally clear the message input
      setNewMessage('');
    }
  };

  const handleInternClick = (internshipId, recruiterId) => {
    setSelectedRecruiter(recruiterId);
    setSelectedInternship(internshipId);
  }

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    scrollToBottom();
  }, [chatHistories]);

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

  const handleInfoSetter = (companyName, internshipName, isActive) => {
    setCompanyName(companyName);
    setInternshipName(internshipName);
    setActiveStatus(isActive)
    console.log('running');
  }

  const displayDate = (currentDate) => {
    if (currentDate.toDateString() === new Date().toDateString()) {
      return 'Today';
    } else {
      return `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} `;
    }
  };

  return (
    <div className="flex justify-end h-[80vh]  w-[100%]  mt-20 relative">
      {/* Left Column - Shortlisted Students */}
      <div className="fixed left-10 top-30 w-[30%] bg-gray-100 p-4 shadow-lg overflow-y-auto h-[70vh]">
        <h2 className="text-xl font-semibold mb-4">Shortlisted Internships</h2>
        <ul className="space-y-2">
          {shortlistedInternships.map((intern) => {
            const { internshipId, recruiterId, companyName, internshipName, statusUpdatedAt, isActive } = intern;

            // Construct the chat key for retrieving messages from chatHistories
            const chatKey = `${recruiterId}_${internshipId}`;
            const chatHistory = chatHistories[chatKey] || [];

            // Get the most recent message
            const lastMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;

            return (
              <div
              key={`${recruiterId}-${internshipId}`}
              className={`student-internship-entry bg-white shadow-md rounded-lg p-4 mb-4 flex items-start space-x-4  border-b-4 hover:cursor-pointer ${selectedInternship===internshipId && 'border-blue-500  '} hover:scale-105 duration-300`}
                onClick={() => { handleInternClick(internshipId, recruiterId); handleInfoSetter(companyName, internshipName, isActive) }}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center relative">
                    <span>{companyName}</span>
                    {isActive && (<div className='ml-2 bg-green-500 rounded-full w-2 h-2'></div>)}
                    {lastMessage && <span className='absolute right-0 text-sm font-normal text-gray-400'>{formatSentAt(lastMessage.sentAt)}</span>}
                  </h3>
                  <p className="text-sm text-gray-600">{internshipName}</p>
                  {latestMessages[`${recruiterId}_${internshipId}`] && (
                    <div className="text-blue-500 font-semibold text-xs">New mesage</div>
                  )}


                  {/* Display the most recent message */}
                  {lastMessage && <p className="text-sm text-gray-800">
                    <span className='font-semibold text-blue-400'>{lastMessage.senderId === studentId ? 'You:  ' : ''}</span>
                    <span className={`${latestMessages[`${recruiterId}_${internshipId}`]?'text-blue-500 font-semibold':'text-gray-600'} text-md`}>
                    {lastMessage ? (lastMessage.messageContent.slice(0, 50) + (lastMessage.messageContent.length > 20 ? "..." : "")) : "No messages exchanged yet"}
                    </span>
                  </p>}


                </div>
              </div>
            );
          })}
        </ul>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="w-[65%] p-4 flex flex-col mx-3">

        <div className='w-full h-[10%]  mb-2'>
          <p className='font-semibold capitalize text-2xl'>{companyName} {activeStatus && <span className='text-sm text-green-500'>online</span>}</p>
          <p>{internshipName}</p>
        </div>

        <div className="flex-grow  mt-4 bg-white p-4 rounded-lg shadow-lg overflow-y-auto border-2">
          {/* Chat messages */}
          <div className="flex flex-col space-y-4 overflow-y-auto">
            {chatHistories[`${selectedRecruiter}_${selectedInternship}`]?.map((msg, index, arr) => {

const currentDate = new Date(msg.sentAt);
              const previousDate = index > 0 ? new Date(arr[index - 1].sentAt) : null;
              const isSameDay = previousDate && currentDate.toDateString() === previousDate.toDateString();

              return (

                <React.Fragment key={index}>

                  {!isSameDay && (
                    <div className="text-center text-gray-500 text-sm my-2 font-semibold">
                      {displayDate(currentDate)}
                    </div>
                  )}

                <div
                  key={index}
                  className={`p-2 rounded  inline-block break-words  ${msg.senderId === studentId ? 'bg-blue-400 self-end text-white' : 'bg-gray-100'} `}
                  style={{ maxWidth: 'fit-content' }}
                >
                  <p className='max-w-[400px]'>{msg.messageContent}</p>
                  <p className={`text-xs font-semibold text-right ${msg.senderId === studentId && 'text-white'} text-gray-500`}>{formatSentAt(msg.sentAt)}</p>
                </div>
                </React.Fragment>
              )
            })}
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
}

export default Chats