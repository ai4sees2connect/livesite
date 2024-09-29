import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
import {FaSearch} from 'react-icons/fa';

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
  const [searchName,setSearchName]=useState('');



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
  }, [socket]);

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });



    }
    const timer = setTimeout(scrollToBottom, 500);

    return () => clearTimeout(timer);
  }, [selectedInternship, selectedStudent, socket]);


  console.log(`this is selectedStudent: ${selectedStudent} and this is selectedinternship: ${selectedInternship}`);





  const handleStudentClick = (studentId, internshipId) => {
    setSelectedStudent(studentId);
    setSelectedInternship(internshipId);

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
    } else if (latestMessagesSeenStatus[key] === false) {
      acc.filteredStudents.push(student); // Add to filtered list if unread
    }

    // Count unread messages regardless of the active filter
    if (latestMessagesSeenStatus[key] === false) {
      acc.unreadCount += 1; // Increment the unread count
    }

    return acc; // Return the accumulator
  }, { filteredStudents: [], unreadCount: 0 });

  const extraFilteredStudents=filteredStudents.filter(student=>{
    const matchingIntern= selectedInternFilter==='All' || student.internshipId===selectedInternFilter
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

  return (
    <div className="flex justify-end h-[80vh]  mt-20 relative w-[100%]">
      {/* Left Column - Shortlisted Students */}
      <div className="fixed flex flex-col items-center left-10 top-30 w-[30%] bg-gray-100 p-4 shadow-lg overflow-y-auto h-[80vh]">
        <h2 className="text-xl font-semibold mb-4">Messages from all internships</h2>

        <div className='flex flex-col justify-center w-full'>
         
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

        <div className='flex items-center space-x-7 mx-auto p-2 rounded-lg w-full text-sm'>
          
        <input
            type="text"
            placeholder="&#128269; Search by name... "
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
          />
        </div>

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

        <ul className="w-[80%] space-y-2">
          {extraFilteredStudents.map((student) => {
            const { studentId, internshipId, firstname, lastname, internshipName, statusUpdatedAt, isActive } = student;

            // Construct the chat key for retrieving messages from chatHistories

            const chatKey = `${studentId}_${internshipId}`;
            const chatHistory = chatHistories[chatKey] || [];


            // Get the most recent message
            const lastMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;





            return (
              <div
                key={`${studentId}-${internshipId}`}
                className={`student-internship-entry bg-white shadow-md rounded-lg p-4 mb-4 flex items-start space-x-4  border-b-4 hover:cursor-pointer ${selectedInternship === internshipId && 'border-blue-500  '} hover:scale-105 duration-300 w-full`}
                onClick={() => { handleStudentClick(studentId, internshipId); handleInfoSetter(firstname, lastname, internshipName, isActive) }}
              >
                <div className="flex-grow">
                  <div className="text-lg font-semibold text-gray-800 flex items-center relative">
                    <span className='capitalize'>{firstname} {lastname}</span>
                    {isActive && (<div className='ml-2 bg-green-500 rounded-full w-2 h-2'></div>)}
                    {lastMessage && <span className='absolute right-0 text-sm font-normal text-gray-400'>{formatSentAt(lastMessage.sentAt)}</span>}
                  </div>
                  <p className="text-sm text-gray-500">{internshipName}</p>
                  {lastMessage && !latestMessagesSeenStatus[`${studentId}_${internshipId}`] && lastMessage.senderId !== recruiterId && (
                    <div className="text-blue-500 font-semibold text-xs">New mesage</div>
                  )}

                  {/* Display the most recent message */}
                  {lastMessage && <p className="text-md text-gray-800">
                    <span className='font-semibold text-blue-400'>{lastMessage.senderId === recruiterId ? 'You:  ' : ''}</span>
                    <span className={`${lastMessage.senderId !== recruiterId && !latestMessagesSeenStatus[`${studentId}_${internshipId}`] ? 'text-blue-500 font-semibold' : 'text-gray-500'} text-md`}>
                      {lastMessage ? (lastMessage.messageContent.slice(0, 40) + (lastMessage.messageContent.length > 20 ? "..." : "")) : "No messages exchanged yet"}
                    </span>

                  </p>}

                </div>
              </div>
            );
          })}

        </ul>
      </div>

      {/* Right Column - Chat Interface */}
      <div className="w-[65%] p-4 flex flex-col  mx-3 ">
        <div className='w-full h-[10%]  mb-2'>
          <p className='font-semibold capitalize text-2xl'>{firstName} {lastName} {activeStatus && <span className='text-sm text-green-500'>online</span>}</p>
          <p>{internshipName}</p>
        </div>
        <div className="flex-grow bg-white mt-4 p-4 rounded-lg shadow-lg overflow-y-auto border-2">

          {/* Chat messages */}
          <div className="flex flex-col space-y-4">
            {chatHistories[`${selectedStudent}_${selectedInternship}`]?.map((msg, index, arr) => {

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
                    className={`py-2 px-3 rounded inline-block break-words ${msg.senderId === recruiterId ? 'bg-blue-400 self-end text-right  text-white ' : 'bg-gray-100 '} `}
                    style={{ maxWidth: 'fit-content' }}
                  >
                    <p className='max-w-[400px] min-w-[70px]'>{msg.messageContent}</p>
                    <p className={`text-xs font-semibold text-right ${msg.senderId === recruiterId && 'text-white'} text-gray-500`}>{formatSentAt(msg.sentAt)}</p>
                    {/* <p>{msg.senderId === recruiterId && msg.seenStatus && 'Seen'}</p> */}

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
          <button disabled={newMessage === '' ? true : false}
            className={`bg-blue-500 text-white border px-9 py-1 rounded-lg ${newMessage === '' && 'bg-gray-300'}`}
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
