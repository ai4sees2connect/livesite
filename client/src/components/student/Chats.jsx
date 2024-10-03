import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'
import api from '../common/server_url';
import TimeAgo from '../common/TimeAgo';
import { io } from 'socket.io-client';
import SubmitAssignment from './SubmitAssignment';
import { FaCheckCircle, FaFileDownload, FaPaperclip, FaCommentDots,FaEllipsisV } from 'react-icons/fa'
import { MdDoneAll } from 'react-icons/md';
// import 'bootstrap/dist/css/bootstrap.min.css';



const Chats = () => {

  const { studentId } = useParams();
  const [shortlistedInternships, setShortlistedInternships] = useState([]);
  // const [chatMessages, setChatMessages] = useState([]);
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
  // const [latestMessages, setLatestMessages] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [latestMessagesSeenStatus, setLatestMessagesSeenStatus] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);


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

              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

              if (lastMessage) {
                setLatestMessagesSeenStatus((prevStatus) => ({
                  ...prevStatus,
                  [`${recruiterId}_${internshipId}`]: lastMessage.seenStatus,
                }));
                console.log('status of last message', lastMessage.seenStatus)
              }

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

              setLatestMessagesSeenStatus((prev) => ({
                ...prev,
                [`${message.senderId}_${message.internshipId}`]: message.seenStatus,
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
  }, [socket]);

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });



    }
    const timer = setTimeout(scrollToBottom, 500);

    return () => clearTimeout(timer);
  }, [selectedInternship, selectedRecruiter, socket]);


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

    socket.emit('markLastMessageAsSeen', {
      studentId,
      internshipId,
      recruiterId, // Assuming recruiterId is available in scope
      type: 'Student'
    });



    socket.on('messageSeenUpdate', ({ studentId, internshipId, recruiterId, type }) => {
      // Construct the key based on the type of user (Recruiter or Student)
      let key;
      if (type === 'Student') {
        key = `${recruiterId}_${internshipId}`;

        setLatestMessagesSeenStatus((prev) => ({
          ...prev,
          [key]: true, // Mark this chat as seen
        }));
      }
      else {
        socket.off('messageSeenUpdate')
      }
    });
  }

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    scrollToBottom();
  }, [chatHistories]);

  const formatSentAt = (sentAt) => {
    const messageDate = new Date(sentAt);

    // Format time as hh:mm AM/PM
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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

  const getLastMessageTimestamp = (chatKey, chatHistories) => {
    const messages = chatHistories[chatKey] || [];

    if (messages.length === 0) return new Date(0); // Return earliest date if no messages

    // Find the message with the latest sentAt timestamp
    const lastMessage = messages[messages.length - 1]

    return new Date(lastMessage.sentAt); // Return the latest sentAt timestamp
  };

  const sortShortlistedInternshipsByLastMessage = (shortlistedInternships, chatHistories) => {
    return shortlistedInternships.sort((a, b) => {
      // Get the last message timestamps for each student-internship pair
      const timestampA = getLastMessageTimestamp(`${a.recruiterId}_${a.internshipId}`, chatHistories);
      const timestampB = getLastMessageTimestamp(`${b.recruiterId}_${b.internshipId}`, chatHistories);

      // Sort by descending order of timestamps (latest messages at the top)
      return timestampB - timestampA;
    });
  };

  const sortAndSetShortlistedStudents = () => {
    setShortlistedInternships(prevShortlistedInternships => {
      // console.log('sorting running..................');
      const sortedShortlistedInternships = sortShortlistedInternshipsByLastMessage(prevShortlistedInternships, chatHistories);
      return [...sortedShortlistedInternships];
    });
  };

  useEffect(() => {
    sortAndSetShortlistedStudents();

  }, [chatHistories]);


  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const { filteredInternships, unreadCount } = shortlistedInternships.reduce((acc, internship) => {
    const key = `${internship.recruiterId}_${internship.internshipId}`;

    // Add to filtered internships based on the active filter
    if (activeFilter === 'all') {
      acc.filteredInternships.push(internship); // Add all internships
    } else if (latestMessagesSeenStatus[key] === false) {
      acc.filteredInternships.push(internship); // Add to filtered list if unread
    }

    // Count unread messages regardless of the active filter
    if (latestMessagesSeenStatus[key] === false) {
      acc.unreadCount += 1; // Increment the unread count
    }

    return acc; // Return the accumulator
  }, { filteredInternships: [], unreadCount: 0 });


  console.log(unreadCount);

  const openAssignmentPopup = () => {
    setPopupOpen(true);
  };

  const closeAssignmentPopup = () => {
    setPopupOpen(false);
  };

  const handleAssignmentSubmit = async (submissionData) => {
    const { files, link, additionalInfo, msgId } = submissionData;

    const submissionPayload = {
      msgId, // The ID of the original assignment message sent by the recruiter
      files, // The array of uploaded files
      link, // The assignment submission link
      additionalInfo, // Additional info about the submission
      internshipId: selectedInternship
    };

    console.log(submissionPayload);

    socket.emit('submitAssignment', submissionPayload);

    setChatHistories((prevHistories) => {
      const newMessage = {
        senderId: studentId,
        messageContent: "Assignment submission", // You might want to adjust this based on your needs
        sentAt: new Date(),
        isAssignment: true, // Indicate this is an assignment submission
        submissionDetails: {
          submittedFiles: files.map(file => ({
            fileName: file.fileName,
            fileSize: (file.fileSize / 1024).toFixed(2) + ' KB', // Convert to KB with 2 decimal places
            fileUrl: file.fileUrl || '', // Assuming you have a URL for the uploaded file
          })),
          submissionLink: link,
          additionalInfo: additionalInfo || '',
          originalAssignmentId: msgId // Store the ID of the original assignment for reference
        },

      };

      // console.log(newMessage);

      return {
        ...prevHistories,
        [`${selectedRecruiter}_${selectedInternship}`]: [
          ...(prevHistories[`${selectedRecruiter}_${selectedInternship}`] || []), // Get existing messages or an empty array
          newMessage, // Add the new message
        ],
      };
    });

    // Close the popup
    closeAssignmentPopup();
  };

  const downloadFile = async (fileId, fileName) => {
    console.log('this is file id', fileId);
    try {
      // Fetch the file from the backend using axios
      const response = await axios.get(`${api}/student/get-file/${fileId}`, {
        responseType: 'blob', // Important: tell axios to handle the response as a Blob (binary data)
      });

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;  // Use the original file name
      document.body.appendChild(a);  // Append it to the DOM
      a.click();  // Trigger the download
      a.remove();  // Remove the anchor after download

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };


  console.log('these are chat histories', chatHistories);

  return (
    <div className="flex justify-end h-[80vh]  w-[100%]  mt-20 relative">
      {/* Left Column - Shortlisted Students */}
      <div className="fixed flex flex-col items-center left-10 top-30 w-[30%] bg-gray-100 p-4 shadow-lg overflow-y-auto h-[80vh]">
        <h2 className="text-xl font-semibold mb-4">Shortlisted Internships</h2>
        <div className=" inline-block space-x-4  border-2 rounded-full  mb-4">
          <button
            className={`py-2 px-3 rounded-full ${activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => handleFilterChange('all')}
          >
            All Messages
          </button>
          <button
            className={`py-2 px-4 rounded-full ${activeFilter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => handleFilterChange('unread')}
          >
            Unread({`${unreadCount}`})
          </button>
        </div>
        <ul className=" w-[80%] space-y-2">
          {filteredInternships.map((intern) => {
            const { internshipId, recruiterId, companyName, internshipName, statusUpdatedAt, isActive } = intern;

            // Construct the chat key for retrieving messages from chatHistories
            const chatKey = `${recruiterId}_${internshipId}`;
            const chatHistory = chatHistories[chatKey] || [];

            // Get the most recent message
            const lastMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;

            return (
              <div
                key={`${recruiterId}-${internshipId}`}
                className={`student-internship-entry bg-white shadow-md rounded-lg p-4 mb-4 flex items-start space-x-4  border-b-4 hover:cursor-pointer ${selectedInternship === internshipId && 'border-blue-500  '} hover:scale-105 duration-300 w-full`}
                onClick={() => { handleInternClick(internshipId, recruiterId); handleInfoSetter(companyName, internshipName, isActive) }}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center relative">
                    <span>{companyName}</span>
                    {isActive && (<div className='ml-2 bg-green-500 rounded-full w-2 h-2'></div>)}
                    {lastMessage && <span className='absolute right-0 text-sm font-normal text-gray-400'>{formatSentAt(lastMessage.sentAt)}</span>}
                  </h3>
                  <p className="text-sm text-gray-600">{internshipName}</p>
                  {lastMessage && !latestMessagesSeenStatus[`${recruiterId}_${internshipId}`] && lastMessage.senderId !== studentId && (
                    <div className="text-blue-500 font-semibold text-xs">New mesage</div>
                  )}


                  {/* Display the most recent message */}
                  {lastMessage && <p className="text-sm text-gray-800">
                    <span className='font-semibold text-blue-400'>{lastMessage.senderId === studentId ? 'You:  ' : ''}</span>
                    <span className={`${lastMessage.senderId !== studentId && !latestMessagesSeenStatus[`${recruiterId}_${internshipId}`] ? 'text-blue-500 font-semibold' : 'text-gray-500'} text-md`}>
                      {lastMessage ? (lastMessage.messageContent.slice(0, 30) + (lastMessage.messageContent.length > 20 ? "..." : "")) : "No messages exchanged yet"}
                    </span>
                  </p>}


                </div>
              </div>
            );
          })}
        </ul>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="w-[59%] p-4 flex flex-col mx-3 h-[84vh] mr-32 ">

        <div className='w-full h-[10%]  relative border-b shadow-md'>
          <p className='font-semibold capitalize text-2xl'>{companyName} {activeStatus && <span className='text-sm text-green-500'>online</span>}</p>
          <p>{internshipName}</p>
          <div className='absolute right-10 top-7 hover:cursor-pointer' onClick={()=>setIsOptionsOpen(!isOptionsOpen)}><FaEllipsisV/></div>
        </div>
        
        {isOptionsOpen && (
        <div className='absolute right-0 top-16 bg-white border shadow-md w-48 rounded-md text-gray-800 text-[14px] font-[500]'>
          <div className='hover:text-blue-400 p-2 cursor-pointer' >Mark as important</div>
          <div className='hover:text-blue-400 p-2 cursor-pointer'>View internship details</div>
          <div className='hover:text-blue-400 p-2 cursor-pointer'>Review application</div>
          <div className='hover:text-blue-400 p-2 cursor-pointer'>Block chat</div>
        </div>
      )}

        <div className="flex-grow mt-0 bg-white p-4 rounded-lg shadow-lg overflow-y-auto border-2">
          {/* Chat messages */}
          <div className="flex flex-col space-y-4 overflow-y-auto">
            {chatHistories[`${selectedRecruiter}_${selectedInternship}`]?.map((msg, index, arr) => {

              const currentDate = new Date(msg.sentAt);
              const previousDate = index > 0 ? new Date(arr[index - 1].sentAt) : null;
              const isSameDay = previousDate && currentDate.toDateString() === previousDate.toDateString();
              // console.log('this is selected message',msg);

              return (

                <React.Fragment key={index}>

                  {!isSameDay && (
                    <div className="text-center text-gray-500 text-sm my-2 font-semibold">
                      {displayDate(currentDate)}
                    </div>
                  )}

                  {!msg.isAssignment &&

                    <div
                      key={index}
                      className={`p-2 rounded  inline-block break-words  ${msg.senderId === studentId ? 'bg-[#DBEAFE] self-end text-right' : 'bg-gray-100'} `}
                      style={{ maxWidth: 'fit-content' }}
                    >
                      <p className='max-w-[400px]'>{msg.messageContent}</p>
                      <p className={`flex space-x-2 items-center justify-end text-xs font-semibold text-right text-gray-500`}>
                        <span>{formatSentAt(msg.sentAt)}</span>
                        {msg.senderId === studentId && <span><MdDoneAll className={`w-5 h-5 ${msg.seenStatus && 'text-blue-500'}`} /></span>}
                      </p>
                    </div>

                  }

                  {msg.isAssignment && msg.senderId === selectedRecruiter &&
                    <>
                      <div className=' break-words rounded-full w-fit max-w-max' >
                        <div className='relative bg-blue-400 rounded-t-lg p-3 shadow-lg w-full'>
                          <FaCheckCircle className='absolute top-4 left-4 text-white' />
                          <h1 className='ml-8 text-white font-bold'>Assignment Received</h1>
                        </div>
                        <div className={`py-2 px-3  inline-block  bg-gray-100 `} >
                          <p className='max-w-[400px] min-w-[150px]'>{msg.assignmentDetails.description}</p>
                          <p className=' font-semibold mt-5 text-red-500'>Submission deadline: {new Date(msg.assignmentDetails.deadline).toLocaleDateString('en-GB')}</p>
                          <button onClick={openAssignmentPopup} className='bg-blue-400 rounded-lg px-3 py-2 mt-8 text-sm text-white font-bold'>Submit assignment</button>

                          <p className={`text-xs font-semibold text-right text-gray-500`}>
                            {formatSentAt(msg.sentAt)}
                          
                          </p>


                        </div>
                      </div>

                      <SubmitAssignment
                        isOpen={isPopupOpen}
                        onClose={closeAssignmentPopup}
                        onSubmit={handleAssignmentSubmit}
                        msgId={msg._id}
                        recruiterId={msg.senderId}
                      />
                    </>
                  }

                  {
                    msg.isAssignment && msg.senderId === studentId && (
                      <div className='flex flex-col self-end items-end break-words max-w-[600px]'>
                        <div className='relative bg-blue-400 rounded-t-lg p-3 shadow-lg w-full'>
                          <FaCheckCircle className='absolute top-4 left-4 text-white' />
                          <h1 className='ml-8 text-white font-bold'>Assignment Submitted</h1>
                        </div>
                        <div className='bg-blue-100 p-4 rounded-b-lg shadow-lg w-full'>
                          {/* List of submitted files */}
                          <div className='flex flex-col space-y-3 items-end'>
                            {msg.submissionDetails.submittedFiles.map((file, index) => (


                              <div key={index} className='flex justify-end items-center space-x-4 w-full py-1 border-b border-gray-400'>
                                <span className='text-gray-600 hover:cursor-pointer hover:scale-105 duration-300' onClick={() => downloadFile(file.fileId, file.fileName)}>

                                  <FaFileDownload />

                                </span>
                                <span className='font-semibold'>{file.fileName}</span>
                                <span className='text-gray-500'>{file.fileSize}</span>
                              </div>

                            ))}
                          </div>

                          {/* Submission link */}
                          {msg.submissionDetails.submissionLink && (
                            <a href={msg.submissionDetails.submissionLink} target='_blank' className='mt-3 flex items-center space-x-4 justify-end border-b border-gray-400 font-semibold'>

                              <FaPaperclip className='mx-2' />{msg.submissionDetails.submissionLink}

                            </a>
                          )}

                          {/* Additional Information */}
                          {msg.submissionDetails.additionalInfo && (
                            <p className='mt-3 text-right text-gray-700'>{msg.submissionDetails.additionalInfo}</p>
                          )}

                          <div className='flex space-x-2 items-center justify-end text-xs font-semibold text-right text-gray-500 mt-2 '>
                            <span>{formatSentAt(msg.sentAt)}</span>
                            {msg.senderId === studentId && <span><MdDoneAll className={`w-5 h-5 ${msg.seenStatus && 'text-blue-500'}`} /></span>}
                          </div>
                        </div>
                      </div>
                    )
                  }




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