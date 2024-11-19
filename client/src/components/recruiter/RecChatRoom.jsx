
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../common/server_url';
import { io } from 'socket.io-client';
import TimeAgo from '../common/TimeAgo'
// import InternshipSelect from './utils/InternshipSelect';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
// import './utils/styles.css';
// import Select from 'react-select';
// import select from './utils/select.css'
import './utils/Styles.css'
import { FaSearch, FaNewspaper, FaCaretRight, FaCheckCircle, FaFileDownload, FaPaperclip, FaStar, FaEllipsisV, FaBolt, FaClock, FaTimes, FaFilePdf, FaArrowCircleDown, FaExclamation, FaArrowLeft } from 'react-icons/fa';
import RecAssignment from './RecAssignment';
import { MdDoneAll } from 'react-icons/md';
import { toast } from 'react-toastify';
import Spinner from '../common/Spinner';

const RecChatRoom = () => {
  const { recruiterId } = useParams();
  const [shortlistedStudents, setShortlistedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatHistories, setChatHistories] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [internshipName, setInternshipName] = useState('');
  const [activeStatus, setActiveStatus] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef(null);
  const [latestMessagesSeenStatus, setLatestMessagesSeenStatus] = useState({});
  const [internshipOptions, setInternshipOptions] = useState([]);
  const [selectedInternFilter, setSelectedInternFilter] = useState('All');
  const [searchName, setSearchName] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const navigate = useNavigate();
  const [chatBlocked, setChatBlocked] = useState({});
  const [chatListOpen, setChatListOpen] = useState(true);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/internship/${recruiterId}/get-all-internships`);
        const sortedList = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const options = sortedList.map((internship) => ({
          value: internship._id, // Set the ID as value
          label: `${internship.internshipName.replace(/\s*internship\s*$/i, '')} (Posted on: ${new Date(internship.createdAt).toLocaleDateString('en-GB')})`, // Display the name and date
        }));
        const allOption = {
          value: 'All',
          label: 'All Internships',
        };

        setInternshipOptions([allOption, ...options]);
      } catch (error) {
        console.error("Error fetching internships:", error);
      }
    };

    if (recruiterId) {
      fetchInternships();
    }
  }, [recruiterId]);

  console.log('names of internships....', internshipOptions);

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
            studentStatus: shortlisted.studentStatus,
            importantForRecruiter: shortlisted.importantForRecruiter
          }));
        });

        // Set the flattened student list in state
        setShortlistedStudents(flat)
        // sortAndSetShortlistedStudents();
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

              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

              if (lastMessage) {
                setLatestMessagesSeenStatus((prevStatus) => ({
                  ...prevStatus,
                  [`${studentId}_${internshipId}`]: lastMessage.seenStatus,
                }));
                console.log('status of last message', lastMessage.seenStatus)
              }



            });

            const receiveMessageEvent = `receiveMessages_${studentId}_${internshipId}`;
            socketConnection.on(receiveMessageEvent, (message) => {
              console.log(`New message from student ${message.senderId}:`, message);

              // Store real-time messages for each student
              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${studentId}_${internshipId}`]: [
                  ...(prevHistories[`${studentId}_${internshipId}`] || []), // Preserve previous history
                  message, // Add the new real-time message
                ],
              }));
              // setIsAtBottom(false);
              setLatestMessagesSeenStatus((prev) => ({
                ...prev,
                [`${message.senderId}_${message.internshipId}`]: message.seenStatus,
              }));


              // console.log('value set for new messsage');

            });


          });
        }



      } catch (error) {
        console.error('Error fetching shortlisted students:', error);
      }
    };

    fetchShortlistedStudents();
  }, [recruiterId]);

  console.log('seen status', latestMessagesSeenStatus);

  useEffect(() => {
    const fetchBlockedChats = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/blocked-chats`);
        const blockedChats = response.data;

        const blockedMap = blockedChats.reduce((acc, chat) => {
          const chatRoomKey = `${chat.student}_${chat.internship}`;
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
    if (shortlistedStudents.length > 0) {
      console.log('Updated shortlistedStudents:', shortlistedStudents);

      if (socket) {
        console.log('First student:', shortlistedStudents[0].internshipId, shortlistedStudents[0].studentId);
        // Trigger handleStudentClick with the first student
        handleStudentClick(shortlistedStudents[0].studentId, shortlistedStudents[0].internshipId);
        handleInfoSetter(shortlistedStudents[0].firstname, shortlistedStudents[0].lastname, shortlistedStudents[0].internshipName, shortlistedStudents[0].isActive);
        setIsLoading(false);
      } else {
        console.error('No students found.');
      }

      setIsLoading(false);
      console.log('loading status:', isLoading);
    }
  }, [socket, shortlistedStudents]);

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });



    }
    const timer = setTimeout(scrollToBottom, 500);

    return () => clearTimeout(timer);
  }, [selectedInternship, selectedStudent, socket,chatHistories]);


  console.log(`this is selectedStudent: ${selectedStudent} and this is selectedinternship: ${selectedInternship}`);





  const handleStudentClick = (studentId, internshipId) => {
    setSelectedStudent(studentId);
    setSelectedInternship(internshipId);
    setChatListOpen(false);

    socket.emit('markLastMessageAsSeen', {
      studentId,
      internshipId,
      recruiterId, // Assuming recruiterId is available in scope
      type: 'Recruiter'
    });

    console.log('emitinggggggggggggggg.............');

    socket.on('messageSeenUpdate', ({ studentId, internshipId, recruiterId, type }) => {
      // Construct the key based on the type of user (Recruiter or Student)
      let key;
      if (type === 'Recruiter') {
        key = `${studentId}_${internshipId}`;

        setLatestMessagesSeenStatus((prev) => ({
          ...prev,
          [key]: true, // Mark this chat as seen
        }));
      }
      else {
        socket.off('messageSeenUpdate')
      }
    });

  };

  const handleInfoSetter = (firstname, lastname, internshipName, isActive) => {
    setFirstName(firstname);
    setLastName(lastname);
    setInternshipName(internshipName);
    setActiveStatus(isActive)

  }


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

  const sendAssignment = (description, deadline) => {
    if (description.trim() && deadline && socket) {
      const assignmentData = {
        recruiterId,
        studentId: selectedStudent,
        internshipId: selectedInternship,
        type: 'Recruiter',
        isAssignment: true,
        assignmentDetails: {
          description,
          deadline,
        },
      };

      console.log('assignment data', assignmentData);
      socket.emit('sendAssignment', assignmentData);

      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [`${assignmentData.studentId}_${assignmentData.internshipId}`]: [
          ...(prevHistories[`${assignmentData.studentId}_${assignmentData.internshipId}`] || []),
          {
            senderId: recruiterId,
            messageContent: '',
            sentAt: new Date(),
            isAssignment: true,
            assignmentDetails: { description, deadline },
          },
        ],
      }));

      setShowAssignmentModal(false); // Close modal after sending assignment
    }
  };


  const formatSentAt = (sentAt) => {
    const messageDate = new Date(sentAt);

    // Format time as hh:mm AM/PM
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

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

  const sortShortlistedStudentsByLastMessage = (shortlistedStudents, chatHistories) => {
    return shortlistedStudents.sort((a, b) => {
      // Get the last message timestamps for each student-internship pair
      const timestampA = getLastMessageTimestamp(`${a.studentId}_${a.internshipId}`, chatHistories);
      const timestampB = getLastMessageTimestamp(`${b.studentId}_${b.internshipId}`, chatHistories);

      // Sort by descending order of timestamps (latest messages at the top)
      return timestampB - timestampA;
    });
  };

  const sortAndSetShortlistedStudents = () => {
    setShortlistedStudents(prevShortlistedStudents => {
      // console.log('sorting running..................');
      const sortedShortlistedStudents = sortShortlistedStudentsByLastMessage(prevShortlistedStudents, chatHistories);
      return [...sortedShortlistedStudents];
    });
  };

  useEffect(() => {
    sortAndSetShortlistedStudents();

  }, [chatHistories])

  const { filteredStudents, unreadCount } = shortlistedStudents.reduce((acc, student) => {
    const key = `${student.studentId}_${student.internshipId}`;

    // Add to filtered internships based on the active filter
    if (activeFilter === 'all') {
      acc.filteredStudents.push(student); // Add all internships
    } else if (activeFilter === 'unread' && latestMessagesSeenStatus[key] === false) {
      acc.filteredStudents.push(student); // Add to filtered list if unread
    } else if (activeFilter === 'important' && student.importantForRecruiter) {
      acc.filteredStudents.push(student);
    }

    // Count unread messages regardless of the active filter
    if (latestMessagesSeenStatus[key] === false) {
      acc.unreadCount += 1; // Increment the unread count
    }

    return acc; // Return the accumulator
  }, { filteredStudents: [], unreadCount: 0 });

  const extraFilteredStudents = filteredStudents.filter(student => {
    const matchingIntern = selectedInternFilter === 'All' || student.internshipId === selectedInternFilter
    const matchesName = `${student.firstname} ${student.lastname}`.toLowerCase().includes(searchName.toLowerCase());

    return matchingIntern && matchesName
  })


  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSelectChange = (option) => {
    if (option) {
      setSelectedInternFilter(option.value);
    } else {
      console.log('Selection cleared');
    }
  };
  console.log('filter is this', selectedInternFilter);

  const toggleAssignmentModal = () => {
    setShowAssignmentModal(!showAssignmentModal); // Toggles modal visibility
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
      recruiterId,
      internshipId: selectedInternship, // Pass the ID of the logged-in user
      studentId: selectedStudent,
      type: 'Recruiter', // 'Student' or 'Recruiter'
    });
    setIsOptionsOpen(false);

    toast.success("Added to important");

    setShortlistedStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.internshipId === selectedInternship) {
          // Mark as important for the student in the frontend
          return { ...student, importantForRecruiter: true };
        }
        return student;
      })
    );

  };

  const handleRemoveImportant = () => {
    socket.emit("removeAsImportant", {
      recruiterId,
      internshipId: selectedInternship, // Pass the ID of the logged-in user
      studentId: selectedStudent,
      type: 'Recruiter', // 'Student' or 'Recruiter'
    });
    setIsOptionsOpen(false);

    toast.success("Removed from important");

    setShortlistedStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.internshipId === selectedInternship) {
          // Mark as important for the student in the frontend
          return { ...student, importantForRecruiter: false };
        }
        return student;
      })
    );

  }

  const handleViewDetails = () => {
    setIsOptionsOpen(false);
    navigate(`/recruiter/${selectedInternship}/application-details/${selectedStudent}`)
  }

  const handleStatusChange = (value) => {
    let valueToChange;
    if (value === 'Hire') {
      valueToChange = 'Hired'
    } else {
      valueToChange = 'notHired'
    }
    socket.emit('studentStatusChanged', { valueToChange, studentId: selectedStudent, recruiterId, internshipId: selectedInternship });

    setShortlistedStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.internshipId === selectedInternship) {
          return { ...student, studentStatus: valueToChange }
        } else {
          return student
        }
      }
      ))
      toast.success('Status changes successfully');
  }

  const handleBlockChat = () => {
    const updatedBlockStatus = true; // Set this to true for blocking

    // Emit block event to backend using socket
    socket.emit('blockInitiatedByRecruiter', {
      recruiterId: recruiterId,
      studentId: selectedStudent,
      internshipId: selectedInternship,
      blockedByRecruiter: true
    });
    toast.success('You have blocked this student');
    setChatBlocked(prevState=>{
      return {...prevState, [`${selectedStudent}_${selectedInternship}`]: 'recruiter' }
    })

  };

  const handleUnblock=()=>{
    socket.emit('unblockInitiatedByRecruiter', {
      recruiterId: recruiterId,
      studentId: selectedStudent,
      internshipId: selectedInternship,
      blockedByRecruiter: false
    });
    toast.success('You have unblocked this student');
  }

  useEffect(() => {
    if (socket) {
      socket.on('chatBlocked', ({ recruiterId, studentId, internshipId, blockedBy, blocked }) => {
        const chatRoomKey = `${studentId}_${internshipId}`;
        if (blocked) {

          setChatBlocked(prevState => ({
            ...prevState,
            [chatRoomKey]: blockedBy // Update the blocked status for this specific chat room
          }));
          
        }else{
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


  console.log('these are all chats', chatHistories);

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

if(loading){
  return <Spinner/>
}

if(shortlistedStudents.length==0){
  return <div className='h-screen flex items-center justify-center text-lg text-gray-600 tracking-wider font-semibold'>You have not shortlisted any student yet...</div>
}

  return (
    <div className="flex justify-center h-[90vh]  mt-16 relative w-[100%] bg-black-700 ">
      {/* Left Column - Shortlisted Students */}
      <div className={`${!chatListOpen? 'hidden':'flex'} border lg:flex  flex-col items-center   w-[90%]  lg:w-[36%] xl:w-[37%] bg-white py-4  shadow-2xl overflow-y-scroll  scrollbar-thin h-[99%] md:h-[100%]`}>
        <h2 className="text-xl text-white w-fit font-semibold mb-2">Messages from all internships</h2>

        <div className='flex flex-col justify-center w-[80%]'>

          <div className='mx-auto p-2 rounded-lg w-full'>
            <Dropdown
              options={internshipOptions}
              onChange={handleSelectChange}
              placeholder="Select an internship"
              className="w-full text-sm font-semibold"
              controlClassName="custom-control"
              menuClassName="custom-menu"
            />
          </div>
        </div>

        <div className='flex items-center space-x-7 mx-auto p-2 rounded-lg w-[80%] text-sm'>

          <input
            type="text"
            placeholder="&#128269; Search by name... "
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
          />
        </div>

        <div className="flex items-center justify-center text-sm lg:text-base  space-x-1 lg:space-x-2 rounded-md w-fit sm:rounded-full mb-4">
          <button
            className={`text-sm sm:text-base py-2 px-3 rounded-full text-black box-content  ${activeFilter === 'all' ? 'bg-blue-100 ' : 'bg-blue-200 border-2 '}`}
            onClick={() => handleFilterChange('all')}
          >
            All Messages
          </button>
          <button
            className={`py-2 px-4 rounded-full text-black box-content ${activeFilter === 'unread' ? 'bg-blue-100 ' : 'bg-blue-200 border-2'}`}
            onClick={() => handleFilterChange('unread')}
          >
            Unread({`${unreadCount}`})
          </button>

          <button
            className={`py-2 px-3 rounded-full text-black box-content ${activeFilter === 'important' ? 'bg-blue-100 ' : 'bg-blue-200 border-2'}`}
            onClick={() => handleFilterChange('important')}
          >
            Important
          </button>

        </div>

        <ul className="w-[98%] pl-4">
          {extraFilteredStudents.map((student) => {
            const { studentId, internshipId, firstname, lastname, internshipName, statusUpdatedAt, isActive, studentStatus } = student;

            // Construct the chat key for retrieving messages from chatHistories

            const chatKey = `${studentId}_${internshipId}`;
            const chatHistory = chatHistories[chatKey] || [];


            // Get the most recent message
            const lastMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;





            return (
              <div
                key={`${studentId}-${internshipId}`}
                className={`student-internship-entry  shadow-lg rounded-lg p-4 mb-4 flex items-start space-x-4  hover:cursor-pointer hover:bg-blue-200 ${selectedInternship === internshipId ? 'bg-blue-200':'bg-blue-100'} w-full`}
                onClick={() => { handleStudentClick(studentId, internshipId); handleInfoSetter(firstname, lastname, internshipName, isActive) }}
              >
                <div className="flex-grow">
                  <div className="text-lg font-semibold text-black flex items-center relative">
                    <span className='capitalize flex items-center text-xl '>{firstname} {lastname}</span>
                    {isActive && (<div className='ml-2 bg-green-300 rounded-full w-2 h-2'></div>)}
                    {lastMessage && <span className='absolute flex items-center right-0 text-sm font-normal text-black'>{student.importantForRecruiter && <FaStar className='mr-2 text-yellow-400' />}{formatSentAt(lastMessage.sentAt)}</span>}
                  </div>
                  <p className="text-sm text-black-300">{internshipName}</p>
                  {lastMessage && !latestMessagesSeenStatus[`${studentId}_${internshipId}`] && lastMessage.senderId !== recruiterId && (
                    <div className="text-black-300 font-semibold text-xs">New mesage</div>
                  )}

                  {/* Display the most recent message */}
                  {lastMessage && <p className="text-md text-black">
                    <span className='font-semibold text-black'>{lastMessage.senderId === recruiterId ? 'You:  ' : ''}</span>
                    <span className={`${lastMessage.senderId !== recruiterId && !latestMessagesSeenStatus[`${studentId}_${internshipId}`] ? 'text-blue-500 font-semibold' : 'text-black-100'} text-md`}>
                      {lastMessage ? (lastMessage.messageContent.slice(0, 20) + (lastMessage.messageContent.length > 20 ? "..." : "")) : "No messages exchanged yet"}
                    </span>

                  </p>}

                  {studentStatus === 'inTouch' &&
                    <div className='inline-flex space-x-1 items-center px-2 py-1 mt-1 text-sm border rounded-md '>
                      <span>Pending decision</span>
                      <span><FaClock className='w-3 h-3 text-gray-500' /></span>
                    </div>}

                  {studentStatus === 'notHired' &&
                    <div className='inline-flex space-x-1 items-center px-2 py-1 mt-1 text-sm border rounded-md bg-red-100'>
                      <span>Rejected</span>
                      <span><FaTimes className='w-3 h-3 text-red-400' /></span>
                    </div>}

                  {studentStatus === 'Hired' &&
                    <div className='inline-flex space-x-1 items-center px-2 py-1 mt-1 text-sm border rounded-md bg-green-100'>
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

      <div className={`${chatListOpen && 'hidden'} w-[95%] lg:w-[70%] p-4 flex flex-col mx-2 h-[84vh] mt-5`}>
        <div className='w-full h-[15%] lg:h-[10%] -mt-5  relative '>
        <button onClick={()=>setChatListOpen(true)} className='flex lg:hidden space-x-1 text-blue-400 items-center'>
            <FaArrowLeft/>
            <span>back</span>
          </button>
                    <p className='font-semibold capitalize text-2xl'>{firstName} {lastName} {activeStatus && <span className='text-sm text-green-500'>online</span>}</p>
          <div className='flex space-x-5  relative '>
            <p className=''>{internshipName}</p>
            {/* <Link to={`/recruiter/${selectedInternship}/application-details/${selectedStudent}`} target="_blank"
              rel="noopener noreferrer" className='absolute  hidden md:flex top-6 -left-4  sm:items-center space-x-4 text-blue-500 font-semibold'>View application<FaCaretRight className='mt-1 mx-1' /></Link> */}
            <div className='flex mt-2 md:mt-0 items-end md:items-center space-x-4 absolute right-5  font-semibold'>

              <button className='bg-green-400 hidden md:block mt-4 sm:mt-0 h-fit text-sm sm:text-base text-white rounded-lg px-4 py-1 hover:scale-105 duration-300 hover:bg-green-500' onClick={() => handleStatusChange('Hire')}>Hire</button>

              <button className='bg-red-400  hidden md:block h-fit text-sm sm:text-base text-white rounded-lg px-2 py-1 hover:scale-105 duration-300 hover:bg-red-500' onClick={() => handleStatusChange('Reject')}>Reject</button>

              <button className='hover:cursor-pointer' onClick={() => setIsOptionsOpen(!isOptionsOpen)}><FaEllipsisV /></button>

              {isOptionsOpen && (
                <div className='absolute -right-5 top-[36px] md:top-[51px] md:-right-5 bg-white border shadow-md w-48 rounded-md text-gray-800 text-[14px] font-[500] z-10'>
                  <div className='hover:text-blue-400 p-2 cursor-pointer' onClick={handleMarkAsImportant}>Mark as important</div>
                  <div className='hover:text-blue-400 p-2 cursor-pointer' onClick={handleRemoveImportant}>Remove from important</div>
                  <div className='hover:text-blue-400 p-2 cursor-pointer' onClick={handleViewDetails}>Review application</div>
                  <div className='block md:hidden hover:text-blue-400 p-2 cursor-pointer' onClick={() => handleStatusChange('Hire')}>Hire</div>
                  <div className='block md:hidden hover:text-blue-400 p-2 cursor-pointer' onClick={() => handleStatusChange('Reject')}>Reject</div>

                  <div onClick={handleBlockChat} className='hover:text-blue-400 p-2 cursor-pointer'>Block chat</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`flex-grow mt-5 md:mt-7 p-4 rounded-lg bg-gray-100 shadow-lg border-2 relative overflow-y-scroll  scrollbar-thin `}>
          <div className="flex flex-col space-y-4 ">

            {chatHistories[`${selectedStudent}_${selectedInternship}`]?.map((msg, index, arr) => {

              const currentDate = new Date(msg.sentAt);
              const previousDate = index > 0 ? new Date(arr[index - 1].sentAt) : null;
              const isSameDay = previousDate && currentDate.toDateString() === previousDate.toDateString();

              return (
                
                <React.Fragment key={index} className='border border-black'>

                  {!isSameDay && (
                    <div className="text-center text-gray-500 text-sm my-2 font-semibold">
                      {displayDate(currentDate)}
                    </div>
                  )}

                  {!msg.isAssignment && !msg.isAttachment && <div
                    className={`py-2 px-3 rounded inline-block break-words shadow-lg ${msg.senderId === recruiterId ? 'bg-[#ffffff] self-end text-right  ' : 'bg-blue-100 text-black '} `}
                    style={{ maxWidth: 'fit-content' }}
                  >
                    <p className='max-w-[230px] md:max-w-[400px] min-w-[70px]'>{msg.messageContent}</p>
                    <p className={`flex space-x-2 items-center justify-end text-xs font-semibold text-right  text-gray-500`}>
                      <span className={`${msg.senderId !== recruiterId ? 'text-black-300' : 'text-gray-600'}`}>{formatSentAt(msg.sentAt)}</span>
                      {msg.senderId === recruiterId && <span><MdDoneAll className={`w-5 h-5 ${msg.seenStatus && 'text-blue-500'}`} /></span>}
                    </p>
                    {/* <p>{msg.senderId === recruiterId && msg.seenStatus && 'Seen'}</p> */}

                  </div>}

                  {msg.isAssignment && msg.senderId === recruiterId &&
                    <div className=' break-words  shadow-lg  self-end text-right max-w-[260px] md:max-w-[400px] text-white' >
                      <div className='relative bg-blue-400 rounded-t-lg p-3 shadow-lg w-full'>
                        <FaCheckCircle className='absolute top-4 left-4 text-white' />
                        <h1 className='ml-8 text-white font-bold'>Assignment Sent</h1>
                      </div>
                      <div className={`py-2 px-3 w-full inline-block text-black bg-gray-200  `} >
                        <p className='max-w-[230px] md:max-w-[400px] min-w-[150px]'>{msg.assignmentDetails.description}</p>
                        <p className='text-blue-500 font-semibold mt-5'>Deadline- {new Date(msg.assignmentDetails.deadline).toLocaleDateString('en-GB')}</p>

                        <p className={`flex space-x-2 items-center justify-end text-xs font-semibold text-right  text-gray-500`}>
                          <span>{formatSentAt(msg.sentAt)}</span>
                          {msg.senderId === recruiterId && <span><MdDoneAll className={`w-5 h-5 ${msg.seenStatus && 'text-blue-500'}`} /></span>}
                        </p>


                      </div>
                    </div>
                  }

                  {
                    msg.isAssignment && msg.senderId === selectedStudent && (
                      <div className='flex flex-col break-words max-w-[260px] md:max-w-[400px]'>
                        <div className='relative bg-blue-100 rounded-t-lg p-3 shadow-lg w-full'>
                          <FaCheckCircle className='absolute top-4 left-4 text-white' />
                          <h1 className='ml-8 text-white font-bold'>Assignment Received</h1>
                        </div>
                        <div className='bg-blue-100 p-4 rounded-b-lg shadow-lg w-full'>
                          {/* List of submitted files */}
                          <div className='flex flex-col space-y-3 items-end'>
                            {msg.submissionDetails.submittedFiles.map((file, index) => (


                              <div key={index} className='flex justify-start items-center space-x-4 w-full py-1 border-b border-gray-400'>
                                <span className='text-gray-600 hover:cursor-pointer hover:scale-105 duration-300' onClick={() => downloadFile(file.fileId, file.fileName)}>

                                  <FaFileDownload />

                                </span>
                                <span className='font-semibold text-sm md:text-base'>{file.fileName}</span>
                                <span className='text-gray-500 text-sm md:text-base'>{file.fileSize}</span>
                              </div>

                            ))}
                          </div>

                          {/* Submission link */}
                          {msg.submissionDetails.submissionLink && (
                            <a href={msg.submissionDetails.submissionLink} target='_blank' className='mt-3 flex items-center space-x-4 justify-start border-b border-gray-400 font-semibold'>

                              <FaPaperclip className='mx-2' />{msg.submissionDetails.submissionLink}

                            </a>
                          )}

                          {/* Additional Information */}
                          {msg.submissionDetails.additionalInfo && (
                            <p className='mt-3 text-left text-gray-700'>{msg.submissionDetails.additionalInfo}</p>
                          )}

                          <p className='text-xs font-semibold text-right text-gray-500 mt-2'>
                            {formatSentAt(msg.sentAt)}
                          </p>
                        </div>
                      </div>
                    )
                  }

                  {msg.isAttachment &&

                    <div
                      key={index}
                      className={`p-2 rounded bg-gray-200 border shadow-lg max-w-[240px]`}

                    >
                      <div className='flex justify-center h-[100%] relative group'>
                        <FaFilePdf className='w-[60%] h-[60%] text-blue-400 ' />
                        <FaArrowCircleDown onClick={() => downloadFile(msg.attachment.fileId, msg.attachment.fileName)} className='absolute top-16 w-[20%] h-[20%] hidden group-hover:block hover:cursor-pointer text-gray-700' />

                      </div>
                      <p className='text-center'>{msg.attachment.fileName}</p>



                      <p className={`flex space-x-2 items-center justify-end text-xs font-semibold text-right text-gray-500`}>
                        <span>{formatSentAt(msg.sentAt)}</span>
                        {/* {msg.senderId === studentId && <span><MdDoneAll className={`w-5 h-5 ${msg.seenStatus && 'text-blue-500'}`} /></span>} */}
                      </p>
                    </div>

                  }
                <div ref={chatEndRef} />
                </React.Fragment>
                
                
              )
              

            })}
            {chatBlocked[`${selectedStudent}_${selectedInternship}`] === 'recruiter' &&
              <>
                <div className='flex justify-center items-center text-gray-500 font-semibold text-lg'>
              
                  <span>You have blocked this chat</span>
                </div>
                <div className='mx-auto px-2 hover:cursor-pointer hover:bg-gray-200 rounded-lg border-2 text-gray-700 text-center font-bold' onClick={handleUnblock}>Unblock</div>
              </>
            }
            {/* <div ref={chatEndRef} /> */}
          </div>


        </div>

        {/* Chat input */}
        {chatBlocked[`${selectedStudent}_${selectedInternship}`] !== 'recruiter' && <div className="mt-4 flex flex-col space-y-4">
          <button
            onClick={toggleAssignmentModal}
            className="bg-red-400 text-white text-sm sm:text-base w-fit  px-2 py-1 rounded-lg hover:scale-105 duration-300"
          >
            Send Assignment
          </button>
          

          {showAssignmentModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center md:items-center z-50">
              <div className="bg-white p-6 rounded-lg mt-10 md:mt-0 shadow-lg w-[90%] md:w-[50%] h-[70%] md:h-[63%]">
                <RecAssignment onClose={toggleAssignmentModal} sendAssignment={sendAssignment} /> {/* Pass onClose to hide modal */}
              </div>
            </div>
          )}


          <div className='flex space-x-5'>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border-2 rounded-lg"
              placeholder="Type a message..."

            />
            <button disabled={newMessage === '' ? true : false}
              className={`bg-blue-500 text-white text-sm sm:text-base w-fit  px-2 py-1 rounded-lg hover:scale-105 duration-300 ${newMessage === '' && 'bg-blue-00'}`}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>}

      </div>

    </div>


  );
};

export default RecChatRoom;
