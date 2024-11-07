import axios from 'axios';
import React, { useState, useEffect, useRef, } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'
import api from '../common/server_url';
import TimeAgo from '../common/TimeAgo';
import { io } from 'socket.io-client';
import SubmitAssignment from './SubmitAssignment';
import { FaCheckCircle, FaFileDownload, FaPaperclip, FaCommentDots, FaEllipsisV, FaStar, FaBolt, FaExclamation, FaFile, FaArrowCircleDown, FaFilePdf, FaArrowLeft } from 'react-icons/fa'
import { MdDoneAll } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner'
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
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentSelected, setAttachmentSelected] = useState(false);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatBlocked, setChatBlocked] = useState({});
  const [chatListOpen, setChatListOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [internsFoundCheck, setInternsFoundCheck] = useState(true);



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
        if (err.response && err.response.status === 404) {
          setInternsFoundCheck(false);
          return;
        }
        toast.success('some error occured');

      }
    };

    fetchShortlistedInternships();

  }, [studentId]);


  useEffect(() => {
    const fetchBlockedChats = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/blocked-chats`);
        const blockedChats = response.data;

        const blockedMap = blockedChats.reduce((acc, chat) => {
          const chatRoomKey = `${chat.recruiter}_${chat.internship}`;
          acc[chatRoomKey] = 'recruiter';
          return acc;
        }, {});

        setChatBlocked(blockedMap); // Update the state with blocked chats
      } catch (error) {
        console.error('Error fetching blocked chats:', error);
      }
    };

    fetchBlockedChats(); // Call the function to fetch blocked chats when the component mounts
  }, []);

  useEffect(() => {
    if (shortlistedInternships && shortlistedInternships.length > 0) {
      console.log('Updated shortlistedInternships:', shortlistedInternships);
      if (socket) {
        handleInternClick(shortlistedInternships[0].internshipId, shortlistedInternships[0].recruiterId);
        handleInfoSetter(shortlistedInternships[0].companyName, shortlistedInternships[0].internshipName, shortlistedInternships[0].isActive);
      }
      setIsLoading(false);
      console.log('loading status:', isLoading);
    }
  }, [socket, shortlistedInternships]);

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });



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
    setChatListOpen(false);

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
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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

  console.log('this is shortlisted internships', shortlistedInternships);
  useEffect(() => {
    if (shortlistedInternships && shortlistedInternships.length > 0) {
      const { filteredInternships, unreadCount } = shortlistedInternships.reduce((acc, internship) => {
        const key = `${internship.recruiterId}_${internship.internshipId}`;

        // Add to filtered internships based on the active filter
        if (activeFilter === 'all') {
          acc.filteredInternships.push(internship); // Add all internships
        } else if (activeFilter === 'unread' && latestMessagesSeenStatus[key] === false) {
          acc.filteredInternships.push(internship); // Add to filtered list if unread
        } else if (activeFilter === 'important' && internship.importantForStudent) {
          acc.filteredInternships.push(internship);
        }

        // Count unread messages regardless of the active filter
        if (latestMessagesSeenStatus[key] === false) {
          acc.unreadCount += 1; // Increment the unread count
        }

        return acc; // Return the accumulator
      }, { filteredInternships: [], unreadCount: 0 });

      // Update state with new filtered internships and unread count
      setFilteredInternships(filteredInternships);
      setUnreadCount(unreadCount);
    } else {
      // Reset state if there are no shortlisted internships
      setFilteredInternships([]);
      setUnreadCount(0);
    }
  }, [shortlistedInternships, activeFilter, latestMessagesSeenStatus]);


  console.log(unreadCount);
  console.log('these are filtered', filteredInternships);

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

  const handleMarkAsImportant = () => {

    // Emit socket event to mark the chat room as important for the current user
    socket.emit("markAsImportant", {
      recruiterId: selectedRecruiter,
      internshipId: selectedInternship, // Pass the ID of the logged-in user
      studentId,
      type: 'Student', // 'Student' or 'Recruiter'
    });
    setIsOptionsOpen(false);

    toast.success("Added to important");

    setShortlistedInternships((prevInternships) =>
      prevInternships.map((internship) => {
        if (internship.internshipId === selectedInternship) {
          // Mark as important for the student in the frontend
          return { ...internship, importantForStudent: true };
        }
        return internship;
      })
    );

  };

  const handleRemoveImportant = () => {
    socket.emit("removeAsImportant", {
      recruiterId: selectedRecruiter,
      internshipId: selectedInternship, // Pass the ID of the logged-in user
      studentId,
      type: 'Student', // 'Student' or 'Recruiter'
    });

    setIsOptionsOpen(false);
    toast.success("Removed to important");

    setShortlistedInternships((prevInternships) =>
      prevInternships.map((internship) => {
        if (internship.internshipId === selectedInternship) {
          // Mark as important for the student in the frontend
          return { ...internship, importantForStudent: false };
        }
        return internship;
      })
    );

  }

  const handleViewDetails = () => {
    navigate(`/student/myApplications/${studentId}`)
  }

  useEffect(() => {
    if (socket) {
      socket.on("studentStatusChangedAck", ({ studentStatus, recruiterId, internshipId }) => {
        setShortlistedInternships(prevInterns =>
          prevInterns.map(intern => {
            if (intern.internshipId === internshipId) {
              return { ...intern, studentStatus }
            }
            return intern

          })
        )
      })
    }
  }, [socket])


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Check if the file is a PDF
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setAttachmentSelected(true);
      // setNewMessage(file.name);
      console.log(file)
    } else {
      toast.error('Please upload a PDF file.');
    }
  };

  const handleFileUpload = async () => {

    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    console.log('yooooooooooooooooo*******************', selectedFile);

    const response = await axios.post(`${api}/student/file-to-url`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });


    socket.emit('sentAttachment', { file: selectedFile, studentId, recruiterId: selectedRecruiter, internshipId: selectedInternship, fileId: response.data.fileId, fileName: selectedFile.name, fileSize: selectedFile.size });

    setChatHistories((prevHistories) => {
      const newMessage = {
        senderId: studentId,
        messageContent: "Attachment sent", // You might want to adjust this based on your needs
        sentAt: new Date(),
        isAttachment: true, // Indicate this is an assignment submission
        attachment: {
          fileName: selectedFile.name,
          fileSize: (selectedFile.size / 1024).toFixed(2) + ' KB',
        }
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

    setSelectedFile(null);
    setAttachmentSelected(false);

  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setAttachmentSelected(false);
  }

  useEffect(() => {
    if (socket) {
      socket.on('chatBlocked', ({ recruiterId, studentId, internshipId, blockedBy, blocked }) => {
        const chatRoomKey = `${recruiterId}_${internshipId}`;
        if (blocked) {

          setChatBlocked(prevState => ({
            ...prevState,
            [chatRoomKey]: blockedBy // Update the blocked status for this specific chat room
          }));

        } else {
          setChatBlocked(prevState => ({
            ...prevState,
            [chatRoomKey]: null // Update the blocked status for this specific chat room
          }));

        }
      });
    }

    return () => {
      if (socket) {
        socket.off('chatBlocked'); // Clean up the event listener when component unmounts
      }
    };
  }, [socket]);

  console.log('blocked status', chatBlocked);


  console.log('these are chat histories', chatHistories);
  console.log('chat list', chatListOpen);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Set timer for 1 second

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (loading) {
    return <Spinner />
  }

  console.log('internsFoundCheck', internsFoundCheck)
  if (!internsFoundCheck) {
    return <div className='h-screen flex items-center justify-center text-lg text-gray-600 tracking-wider font-semibold'>You are not shortlisted for any internship yet</div>
  }

  return (
    <div className="flex justify-center h-[90vh]  w-[100%]  mt-[66px] relative bg-gray-200">





      {/* Left Column - Shortlisted Students */}
      <div className={`${!chatListOpen ? 'hidden' : 'flex'}  lg:flex  flex-col items-center   w-[90%]  lg:w-[36%] xl:w-[37%] bg-blue-500 py-4  shadow-2xl overflow-y-scroll  scrollbar-thin  h-[90%] md:h-[100%]`}>
        {/* <div className={`${!chatListOpen? 'hidden':'flex'} border lg:flex  flex-col items-center  absolute  top-0 left-5 lg:left-4 md:left-20 w-[90%]  lg:w-[36%] xl:w-[30%] bg-gray-100 py-4 lg:px-1 shadow-lg overflow-y-auto h-[90%] md:h-[80vh]`}> */}
        <h2 className="text-xl text-white w-fit font-semibold mb-2 ">Shortlisted Internships</h2>

        <div className="flex items-center justify-center text-sm lg:text-base w-fit space-x-1 lg:space-x-2  rounded-md sm:rounded-full mb-4">
          <button
            className={`text-sm sm:text-base py-2 px-3 rounded-full text-white box-content ${activeFilter === 'all'
              ? '  bg-blue-400 '
              : 'bg-blue-500 border-2 '
              }`}
            onClick={() => handleFilterChange('all')}
          >
            All Messages
          </button>
          <button
            className={`text-sm sm:text-base py-2 px-4 rounded-full text-white box-content ${activeFilter === 'unread' ? '  bg-blue-400' : 'bg-blue-500 border-2'}`}
            onClick={() => handleFilterChange('unread')}
          >
            Unread({`${unreadCount}`})
          </button>

          <button
            className={`py-2 px-3 rounded-full text-white box-content ${activeFilter === 'important' ? 'bg-blue-400' : 'bg-blue-500 border-2'}`}
            onClick={() => handleFilterChange('important')}
          >
            Important
          </button>
        </div>

        <ul className=" w-[98%] pl-4">
          {filteredInternships.map((intern) => {
            const { internshipId, recruiterId, companyName, internshipName, statusUpdatedAt, isActive, studentStatus } = intern;

            // Construct the chat key for retrieving messages from chatHistories
            const chatKey = `${recruiterId}_${internshipId}`;
            const chatHistory = chatHistories[chatKey] || [];

            console.log('isActive status of intern', isActive);
            const lastMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;

            return (
              <div
                key={`${recruiterId}-${internshipId}`}
                className={`student-internship-entry shadow-lg hover:bg-blue-400  p-4 mb-4 flex items-start space-x-4 rounded-lg  hover:cursor-pointer ${selectedInternship === internshipId ? 'bg-blue-400 ' : 'bg-blue-500 '}  w-full`}
                onClick={() => { handleInternClick(internshipId, recruiterId); handleInfoSetter(companyName, internshipName, isActive) }}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white flex items-center relative">
                    <span className='flex items-center text-xl capitalize'>{companyName}</span>
                    {isActive && (<div className='ml-2 bg-green-300 rounded-full w-2 h-2'></div>)}
                    {lastMessage && <span className='absolute flex items-center right-0 text-sm font-normal text-white'>{intern.importantForStudent && <FaStar className='mr-2 text-yellow-400' />}{formatSentAt(lastMessage.sentAt)}</span>}
                  </h3>
                  <p className="text-sm text-white">{internshipName}</p>
                  {lastMessage && !latestMessagesSeenStatus[`${recruiterId}_${internshipId}`] && lastMessage.senderId !== studentId && (
                    <div className="text-blue-500 font-semibold text-xs">New mesage</div>
                  )}


                  {/* Display the most recent message */}
                  {lastMessage && <p className="text-sm text-gray-800">
                    <span className='font-semibold text-sm md:text-base text-white'>{lastMessage.senderId === studentId ? 'You:  ' : ''}</span>
                    <span className={`${lastMessage.senderId !== studentId && !latestMessagesSeenStatus[`${recruiterId}_${internshipId}`] ? 'text-white font-semibold' : 'text-white'} text-md`}>
                      {lastMessage ? (lastMessage.messageContent.slice(0, 20) + (lastMessage.messageContent.length > 20 ? "..." : "")) : "No messages exchanged yet"}
                    </span>
                  </p>}

                  {studentStatus === 'inTouch' &&
                    <div className='inline-flex space-x-1 items-center px-2 py-1 mt-1 text-sm bg-blue-100 rounded-md '>
                      <span>In-touch</span>
                      <span><FaBolt className='w-3 h-3 text-blue-400 ' /></span>
                    </div>}
                  {studentStatus === 'notHired' &&
                    <div className='inline-flex space-x-1 items-center px-2 py-1 mt-1 text-sm bg-yellow-100 rounded-md '>
                      <span>Not selected</span>
                      <span><FaExclamation className='w-3 h-3 text-yellow-400 ' /></span>
                    </div>}
                  {studentStatus === 'Hired' &&
                    <div className='inline-flex space-x-1 items-center px-2 py-1 mt-1 text-sm bg-green-100 rounded-md '>
                      <span>Hired</span>
                      <span><FaBolt className='w-3 h-3 text-green-400' /></span>
                    </div>}


                </div>
              </div>
            );
          })}
        </ul>
      </div>





      {/* Right Column - Chat Interface */}
      <div className={`${chatListOpen && 'hidden'} w-[95%] lg:w-[70%] p-4 flex flex-col  h-[84vh] `}>

        <div className='w-full h-[15%] lg:h-[10%] my-4 ml-1 relative '>
          <button onClick={() => setChatListOpen(true)} className='flex lg:hidden space-x-1 text-white items-center'>
            <FaArrowLeft />
            <span>back</span>
          </button>
          <p className='font-semibold flex items-center space-x-4 capitalize text-2xl text-black'><span>{companyName}</span> {activeStatus && <span className='text-sm text-green-500 flex mt-2 items-center space-x-2'>
            <span>online</span>
            <div className='ml-2 bg-green-500 rounded-full w-2 h-2'></div>
          </span>
          }</p>
          <p className='text-black'>{internshipName}</p>
          <div className='absolute right-0 top-9 md:right-1 md:top-7 hover:cursor-pointer text-black ' onClick={() => setIsOptionsOpen(!isOptionsOpen)}><FaEllipsisV /></div>
        </div>

        {isOptionsOpen && (
          <div className='absolute right-5 top-[70px] bg-white border shadow-md w-48 rounded-md text-gray-800 text-[14px] font-[500] z-10'>
            <div className='hover:text-blue-400 p-2 cursor-pointer' onClick={handleMarkAsImportant}>Mark as important</div>
            {shortlistedInternships.map(intern => intern.internshipId === selectedInternship && intern.importantForStudent) && (<div className='hover:text-blue-400 p-2 cursor-pointer' onClick={handleRemoveImportant}>Remove from important</div>)}
            <div className='hover:text-blue-400 p-2 cursor-pointer' onClick={handleViewDetails}>View internship details</div>

          </div>
        )}

        <div className="flex-grow mt-0 bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto scrollbar-thin border-2">
          {/* Chat messages */}
          <div className="flex flex-col space-y-4 overflow-y-auto bg-gray-100">
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

                  {!msg.isAssignment && !msg.isAttachment &&

                    <div
                      key={index}
                      className={`p-2 rounded  inline-block break-words shadow-lg  ${msg.senderId === studentId ? 'bg-gray-100 self-end text-right' : 'bg-blue-400 text-white'} `}
                      style={{ maxWidth: 'fit-content' }}
                    >
                      <p className='max-w-[230px] md:max-w-[400px]'>{msg.messageContent}</p>
                      <p className={`flex space-x-2 items-center justify-end text-xs font-semibold text-right text-gray-500`}>
                        <span className={`${msg.senderId !== studentId ? 'text-white' : 'text-gray-600'}`}>{formatSentAt(msg.sentAt)}</span>
                        {msg.senderId === studentId && <span><MdDoneAll className={`w-5 h-5 ${msg.seenStatus && 'text-blue-500'}`} /></span>}
                      </p>
                    </div>

                  }

                  {msg.isAssignment && msg.senderId === selectedRecruiter &&
                    <>
                      <div className=' break-words rounded-full w-fit max-w-max shadow-lg' >
                        <div className='relative bg-blue-400 rounded-t-lg p-3 shadow-lg w-full'>
                          <FaCheckCircle className='absolute top-4 left-4 text-white' />
                          <h1 className='ml-8 text-white font-bold'>Assignment Received</h1>
                        </div>
                        <div className={`py-2 px-3  inline-block  bg-gray-100 `} >
                          <p className='max-w-[230px] md:max-w-[400px] min-w-[150px]'>{msg.assignmentDetails.description}</p>
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
                      <div className='flex flex-col self-end items-end break-words max-w-[260px] md:max-w-[400px] shadow-lg'>
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
                                <span className='font-semibold text-sm md:text-base'>{file.fileName}</span>
                                <span className='text-gray-500 text-sm '>{file.fileSize}</span>
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

                  {msg.isAttachment &&

                    <div
                      key={index}
                      className={`p-2 rounded bg-[#DBEAFE] self-end text-right min-w-[240px] max-h-[200px] shadow-lg`}

                    >
                      <div className='flex justify-center h-[100%] w-full relative group'>
                        <FaFilePdf className='w-[60%] h-[60%] text-blue-400 ' />
                        <FaArrowCircleDown onClick={() => downloadFile(msg.attachment.fileId, msg.attachment.fileName)} className='absolute top-16 w-[20%] h-[20%] hidden group-hover:block hover:cursor-pointer text-gray-700' />

                      </div>
                      <p className='text-center text-blue-500'>{msg.attachment.fileName}</p>



                      <p className={`flex space-x-2 items-center justify-end text-xs font-semibold text-right text-gray-500`}>
                        <span>{formatSentAt(msg.sentAt)}</span>
                        {msg.senderId === studentId && <span><MdDoneAll className={`w-5 h-5 ${msg.seenStatus && 'text-blue-500'}`} /></span>}
                      </p>
                    </div>

                  }



                  <div ref={chatEndRef} />
                </React.Fragment>
              )
            })}

            {chatBlocked[`${selectedRecruiter}_${selectedInternship}`] === 'recruiter' &&
              <>
                <div className='flex justify-center items-center text-gray-500 font-semibold text-lg'>

                  <span>You can no longer send or receive messages</span>
                </div>
              </>
            }



          </div>
        </div>

        {/* Chat input */}
        {chatBlocked[`${selectedRecruiter}_${selectedInternship}`] !== 'recruiter' && <div className="mt-4 flex space-x-4 relative">

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border-2 rounded-lg shadow-md"
            placeholder="Type a message..."
          />
          <label htmlFor="fileUpload" className='my-auto text-black hover:cursor-pointer'><FaPaperclip className='w-5 h-5' /></label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf"
          />
          {attachmentSelected && (
            <div className="absolute flex items-center justify-between space-x-2 bg-white border border-gray-300 shadow-lg p-3 rounded-md w-full h-[105%] -left-4">
              <span className="text-gray-800 font-medium">Send Attachment- {selectedFile.name}</span>
              <div className='flex space-x-3 items-center'>
                <button
                  onClick={handleFileUpload} // Your file upload handler
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-200"
                >
                  Upload
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition duration-200" onClick={handleFileRemove}>Delete </button>
              </div>
            </div>
          )}

          <button
          disabled={newMessage === '' ? true : false}
            className={`bg-blue-500 text-white border-2 font-semibold px-9 py-1 rounded-lg shadow-md ${newMessage === '' && 'bg-gray-300'}`}
            onClick={sendMessage}
          >
            Send
          </button>
        </div>}
      </div>
    </div>
  );
}

export default Chats