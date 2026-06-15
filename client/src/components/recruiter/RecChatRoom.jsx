import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../common/server_url";
import { io } from "socket.io-client";
import TimeAgo from "../common/TimeAgo";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./utils/Styles.css";
import {
  FaSearch,
  FaCheckCircle,
  FaFileDownload,
  FaPaperclip,
  FaStar,
  FaEllipsisV,
  FaClock,
  FaTimes,
  FaFilePdf,
  FaArrowCircleDown,
  FaArrowLeft,
  FaCircle,
  FaCommentDots,
} from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import RecAssignment from "./RecAssignment";
import { MdDoneAll } from "react-icons/md";
import { toast } from "react-toastify";
import Spinner from "../common/Spinner";

const RecChatRoom = () => {
  const { recruiterId } = useParams();
  const [shortlistedStudents, setShortlistedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatHistories, setChatHistories] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [internshipName, setInternshipName] = useState("");
  const [activeStatus, setActiveStatus] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef(null);
  const [latestMessagesSeenStatus, setLatestMessagesSeenStatus] = useState({});
  const [internshipOptions, setInternshipOptions] = useState([]);
  const [selectedInternFilter, setSelectedInternFilter] = useState("All");
  const [searchName, setSearchName] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const navigate = useNavigate();
  const [chatBlocked, setChatBlocked] = useState({});
  const [chatListOpen, setChatListOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [firstFetched, setFirstFetched] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get(
          `${api}/recruiter/internship/${recruiterId}/get-all-internships`
        );
        const sortedList = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const options = sortedList.map((internship) => ({
          value: internship._id,
          label: `${internship.internshipName.replace(
            /\s*internship\s*$/i,
            ""
          )} (Posted on: ${new Date(internship.createdAt).toLocaleDateString(
            "en-GB"
          )})`,
        }));
        const allOption = {
          value: "All",
          label: "All Internships",
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

  useEffect(() => {
    const fetchShortlistedStudents = async () => {
      try {
        const response = await axios.get(
          `${api}/recruiter/${recruiterId}/fetch-all-shortlisted`
        );
        const students = response.data;

        let flat = students.flatMap((student) => {
          return student.shortlistedInternships.map((shortlisted) => ({
            internshipId: shortlisted.internshipId,
            internshipName: shortlisted.internshipName,
            statusUpdatedAt: shortlisted.statusUpdatedAt,
            studentId: student._id,
            firstname: student.firstname,
            lastname: student.lastname,
            studentStatus: shortlisted.studentStatus,
            importantForRecruiter: shortlisted.importantForRecruiter,
          }));
        });

        setShortlistedStudents(flat);
        setIsLoading(false);

        const socketConnection = io(api, {
          query: { userType: "Recruiter", userId: recruiterId },
        });
        setSocket(socketConnection);

        socketConnection.on("studentsStatus", (students) => {
          setShortlistedStudents((prevStudents) =>
            prevStudents.map((student) => {
              const matched = students.find(
                (s) => s.studentId === student.studentId
              );
              if (matched) {
                return { ...student, isActive: true };
              }
              return student;
            })
          );
        });

        socketConnection.on("studentsActive", ({ userId, isActive }) => {
          setShortlistedStudents((prevStudents) =>
            prevStudents.map((student) => {
              return student.studentId === userId
                ? { ...student, isActive }
                : student;
            })
          );
        });

        if (flat.length > 0) {
          flat.forEach((student) => {
            const { studentId, internshipId } = student;

            socketConnection.emit("joinChatRoom", {
              recruiterId,
              studentId,
              internshipId,
              type: "Recruiter",
            });

            const chatHistoryEvent = `chatHistory_${studentId}_${internshipId}`;
            socketConnection.on(chatHistoryEvent, (messages) => {
              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${studentId}_${internshipId}`]: messages,
              }));

              const lastMessage =
                messages.length > 0 ? messages[messages.length - 1] : null;

              if (lastMessage) {
                setLatestMessagesSeenStatus((prevStatus) => ({
                  ...prevStatus,
                  [`${studentId}_${internshipId}`]: lastMessage.seenStatus,
                }));
              }
            });

            const receiveMessageEvent = `receiveMessages_${studentId}_${internshipId}`;
            socketConnection.on(receiveMessageEvent, (message) => {
              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${studentId}_${internshipId}`]: [
                  ...(prevHistories[`${studentId}_${internshipId}`] || []),
                  message,
                ],
              }));
              setLatestMessagesSeenStatus((prev) => ({
                ...prev,
                [`${message.senderId}_${message.internshipId}`]:
                  message.seenStatus,
              }));
            });
          });
        }
      } catch (error) {
        console.error("Error fetching shortlisted students:", error);
      }
    };

    fetchShortlistedStudents();
    setFirstFetched(true);
  }, [recruiterId]);

  useEffect(() => {
    const fetchBlockedChats = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/blocked-chats`);
        const blockedChats = response.data;

        const blockedMap = blockedChats.reduce((acc, chat) => {
          const chatRoomKey = `${chat.student}_${chat.internship}`;
          acc[chatRoomKey] = "recruiter";
          return acc;
        }, {});

        setChatBlocked(blockedMap);
      } catch (error) {
        console.error("Error fetching blocked chats:", error);
      }
    };

    fetchBlockedChats();
  }, []);

  useEffect(() => {
    if (shortlistedStudents.length > 0) {
      if (socket) {
        handleStudentClick(
          shortlistedStudents[0].studentId,
          shortlistedStudents[0].internshipId
        );
        handleInfoSetter(
          shortlistedStudents[0].firstname,
          shortlistedStudents[0].lastname,
          shortlistedStudents[0].internshipName,
          shortlistedStudents[0].isActive
        );
        setIsLoading(false);
      }
      setIsLoading(false);
    }
  }, [socket, firstFetched]);

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    const timer = setTimeout(scrollToBottom, 500);
    return () => clearTimeout(timer);
  }, [selectedInternship, selectedStudent, socket, chatHistories]);

  const handleStudentClick = (studentId, internshipId) => {
    setSelectedStudent(studentId);
    setSelectedInternship(internshipId);
    setChatListOpen(false);

    socket.emit("markLastMessageAsSeen", {
      studentId,
      internshipId,
      recruiterId,
      type: "Recruiter",
    });

    socket.on(
      "messageSeenUpdate",
      ({ studentId, internshipId, recruiterId, type }) => {
        let key;
        if (type === "Recruiter") {
          key = `${studentId}_${internshipId}`;
          setLatestMessagesSeenStatus((prev) => ({
            ...prev,
            [key]: true,
          }));
        } else {
          socket.off("messageSeenUpdate");
        }
      }
    );
  };

  const handleInfoSetter = (firstname, lastname, internshipName, isActive) => {
    setFirstName(firstname);
    setLastName(lastname);
    setInternshipName(internshipName);
    setActiveStatus(isActive);
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageData = {
        recruiterId,
        studentId: selectedStudent,
        message: newMessage,
        internshipId: selectedInternship,
        type: "Recruiter",
      };

      socket.emit("sendMessage", messageData);

      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [`${messageData.studentId}_${messageData.internshipId}`]: [
          ...(prevHistories[
            `${messageData.studentId}_${messageData.internshipId}`
          ] || []),
          {
            senderId: recruiterId,
            messageContent: newMessage,
            sentAt: new Date(),
          },
        ],
      }));

      setNewMessage("");
    }
  };

  const sendAssignment = (description, deadline) => {
    if (description.trim() && deadline && socket) {
      const assignmentData = {
        recruiterId,
        studentId: selectedStudent,
        internshipId: selectedInternship,
        type: "Recruiter",
        isAssignment: true,
        assignmentDetails: {
          description,
          deadline,
        },
      };

      socket.emit("sendAssignment", assignmentData);

      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [`${assignmentData.studentId}_${assignmentData.internshipId}`]: [
          ...(prevHistories[
            `${assignmentData.studentId}_${assignmentData.internshipId}`
          ] || []),
          {
            senderId: recruiterId,
            messageContent: "",
            sentAt: new Date(),
            isAssignment: true,
            assignmentDetails: { description, deadline },
          },
        ],
      }));

      setShowAssignmentModal(false);
    }
  };

  const formatSentAt = (sentAt) => {
    const messageDate = new Date(sentAt);
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const displayDate = (currentDate) => {
    if (currentDate.toDateString() === new Date().toDateString()) {
      return "Today";
    } else {
      return `${currentDate.getDate()} ${currentDate.toLocaleString("default", {
        month: "long",
      })} `;
    }
  };

  const getLastMessageTimestamp = (chatKey, chatHistories) => {
    const messages = chatHistories[chatKey] || [];
    if (messages.length === 0) return new Date(0);
    const lastMessage = messages[messages.length - 1];
    return new Date(lastMessage.sentAt);
  };

  const sortShortlistedStudentsByLastMessage = (
    shortlistedStudents,
    chatHistories
  ) => {
    return shortlistedStudents.sort((a, b) => {
      const timestampA = getLastMessageTimestamp(
        `${a.studentId}_${a.internshipId}`,
        chatHistories
      );
      const timestampB = getLastMessageTimestamp(
        `${b.studentId}_${b.internshipId}`,
        chatHistories
      );
      return timestampB - timestampA;
    });
  };

  const sortAndSetShortlistedStudents = () => {
    setShortlistedStudents((prevShortlistedStudents) => {
      const sortedShortlistedStudents = sortShortlistedStudentsByLastMessage(
        prevShortlistedStudents,
        chatHistories
      );
      return [...sortedShortlistedStudents];
    });
  };

  useEffect(() => {
    sortAndSetShortlistedStudents();
  }, [chatHistories]);

  const { filteredStudents, unreadCount } = shortlistedStudents.reduce(
    (acc, student) => {
      const key = `${student.studentId}_${student.internshipId}`;

      if (activeFilter === "all") {
        acc.filteredStudents.push(student);
      } else if (
        activeFilter === "unread" &&
        latestMessagesSeenStatus[key] === false
      ) {
        acc.filteredStudents.push(student);
      } else if (
        activeFilter === "important" &&
        student.importantForRecruiter
      ) {
        acc.filteredStudents.push(student);
      }

      if (latestMessagesSeenStatus[key] === false) {
        acc.unreadCount += 1;
      }

      return acc;
    },
    { filteredStudents: [], unreadCount: 0 }
  );

  const extraFilteredStudents = filteredStudents.filter((student) => {
    const matchingIntern =
      selectedInternFilter === "All" ||
      student.internshipId === selectedInternFilter;
    const matchesName = `${student.firstname} ${student.lastname}`
      .toLowerCase()
      .includes(searchName.toLowerCase());

    return matchingIntern && matchesName;
  });

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSelectChange = (option) => {
    if (option) {
      setSelectedInternFilter(option.value);
    } else {
    }
  };

  const toggleAssignmentModal = () => {
    setShowAssignmentModal(!showAssignmentModal);
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${api}/student/get-file/${fileId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleMarkAsImportant = () => {
    socket.emit("markAsImportant", {
      recruiterId,
      internshipId: selectedInternship,
      studentId: selectedStudent,
      type: "Recruiter",
    });
    setIsOptionsOpen(false);
    toast.success("Added to important");

    setShortlistedStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.internshipId === selectedInternship && student.studentId === selectedStudent) {
          return { ...student, importantForRecruiter: true };
        }
        return student;
      })
    );
  };

  const handleRemoveImportant = () => {
    socket.emit("removeAsImportant", {
      recruiterId,
      internshipId: selectedInternship,
      studentId: selectedStudent,
      type: "Recruiter",
    });
    setIsOptionsOpen(false);
    toast.success("Removed from important");

    setShortlistedStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.internshipId === selectedInternship) {
          return { ...student, importantForRecruiter: false };
        }
        return student;
      })
    );
  };

  const handleViewDetails = () => {
    setIsOptionsOpen(false);
    navigate(
      `/recruiter/${selectedInternship}/application-details/${selectedStudent}`
    );
  };

  const handleStatusChange = (value) => {
    let valueToChange;
    if (value === "Hire") {
      valueToChange = "Hired";
    } else {
      valueToChange = "notHired";
    }
    socket.emit("studentStatusChanged", {
      valueToChange,
      studentId: selectedStudent,
      recruiterId,
      internshipId: selectedInternship,
    });

    setShortlistedStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.studentId === selectedStudent) {
          return { ...student, studentStatus: valueToChange };
        } else {
          return student;
        }
      })
    );
    
    toast.success("Status changes successfully");
  };

  const handleBlockChat = () => {
    socket.emit("blockInitiatedByRecruiter", {
      recruiterId: recruiterId,
      studentId: selectedStudent,
      internshipId: selectedInternship,
      blockedByRecruiter: true,
    });
    toast.success("You have blocked this student");
    setChatBlocked((prevState) => {
      return {
        ...prevState,
        [`${selectedStudent}_${selectedInternship}`]: "recruiter",
      };
    });
  };

  const handleUnblock = () => {
    socket.emit("unblockInitiatedByRecruiter", {
      recruiterId: recruiterId,
      studentId: selectedStudent,
      internshipId: selectedInternship,
      blockedByRecruiter: false,
    });
    toast.success("You have unblocked this student");
  };

  useEffect(() => {
    if (socket) {
      socket.on(
        "chatBlocked",
        ({ recruiterId, studentId, internshipId, blockedBy, blocked }) => {
          const chatRoomKey = `${studentId}_${internshipId}`;
          if (blocked) {
            setChatBlocked((prevState) => ({
              ...prevState,
              [chatRoomKey]: blockedBy,
            }));
          } else {
            setChatBlocked((prevState) => ({
              ...prevState,
              [chatRoomKey]: null,
            }));
          }
        }
      );
    }

    return () => {
      if (socket) {
        socket.off("chatBlocked");
      }
    };
  }, [socket]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (shortlistedStudents.length === 0) {
    return (
      <div className="h-[calc(100vh-66px)] flex flex-col items-center justify-center text-[var(--text-light)] bg-[var(--bg-light-color)] mt-[66px]">
        <FaCommentDots className="text-6xl text-[var(--primary-color)] mb-4 opacity-50" />
        <p className="text-xl font-semibold tracking-wide">You have not shortlisted any student yet...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-66px)] w-full mt-[66px] bg-[var(--bg-light-color)] overflow-hidden">
      
      {/* Left Column - Shortlisted Students */}
      <div className={`${!chatListOpen ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-[35%] xl:w-[30%] bg-white border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[var(--text-color)] flex items-center gap-2 mb-4">
            <FaCommentDots className="text-[var(--primary-color)]" /> Messages
          </h2>

          <div className="mb-3">
            <Dropdown
              options={internshipOptions}
              onChange={handleSelectChange}
              placeholder="Select an internship"
              className="w-full text-sm font-semibold"
              controlClassName="custom-control"
              menuClassName="custom-menu"
            />
          </div>

          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-color)] placeholder-[var(--text-light)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {["all", "unread", "important"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-[var(--button-color)] text-white shadow-md"
                    : "bg-gray-100 text-[var(--text-light)] hover:bg-gray-200"
                }`}
              >
                {filter === "all" ? "All" : filter === "unread" ? `Unread (${unreadCount})` : "Important"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin bg-white">
          {extraFilteredStudents.map((student) => {
            const {
              studentId,
              internshipId,
              firstname,
              lastname,
              internshipName,
              isActive,
              studentStatus,
              importantForRecruiter,
            } = student;

            const chatKey = `${studentId}_${internshipId}`;
            const chatHistory = chatHistories[chatKey] || [];
            const lastMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
            const isUnread = latestMessagesSeenStatus[chatKey] === false && lastMessage?.senderId !== recruiterId;

            return (
              <div
                key={`${studentId}-${internshipId}`}
                onClick={() => {
                  handleStudentClick(studentId, internshipId);
                  handleInfoSetter(firstname, lastname, internshipName, isActive);
                }}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-[var(--icon-bg-color)] ${
                  selectedInternship === internshipId ? "bg-[var(--icon-bg-color)] border-l-4 border-[var(--primary-color)]" : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-[var(--text-color)] truncate flex items-center gap-2 capitalize">
                    {firstname} {lastname}
                    {isActive && <FaCircle className="w-2 h-2 text-green-500 fill-green-500" />}
                  </h3>
                  <span className="text-[10px] text-[var(--text-light)] whitespace-nowrap ml-2">
                    {lastMessage ? formatSentAt(lastMessage.sentAt) : ""}
                  </span>
                </div>
                
                <p className="text-xs text-[var(--primary-color)] font-semibold truncate mb-1">{internshipName}</p>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-[var(--text-light)] truncate flex-1">
                    {lastMessage?.senderId === recruiterId && <span className="font-semibold text-[var(--text-color)]">You: </span>}
                    {lastMessage?.messageContent?.slice(0, 35) || "No messages yet"}...
                  </p>
                  <div className="flex items-center gap-2 ml-2">
                    {importantForRecruiter && <FaStar className="text-yellow-500 w-3 h-3" />}
                    {isUnread && <div className="w-2.5 h-2.5 rounded-full bg-[var(--button-color)]"></div>}
                  </div>
                </div>

                {studentStatus && (
                  <div className="mt-2">
                    {studentStatus === "inTouch" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        <FaClock className="w-2.5 h-2.5" /> Pending
                      </span>
                    )}
                    {studentStatus === "notHired" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                        <FaTimes className="w-2.5 h-2.5" /> Rejected
                      </span>
                    )}
                    {studentStatus === "Hired" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                        <FaCheckCircle className="w-2.5 h-2.5" /> Hired
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column - Chat Interface */}
      <div className={`${chatListOpen ? "hidden" : "flex"} lg:flex flex-col flex-1 bg-[var(--bg-light-color)] relative`}>
        
        {/* Chat Header */}
        <div className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center px-4 shadow-sm z-10">
          <button onClick={() => setChatListOpen(true)} className="lg:hidden mr-3 text-[var(--text-color)]">
            <FaArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[var(--text-color)] text-lg truncate flex items-center gap-2 capitalize">
              {firstName} {lastName}
              {activeStatus && <FaCircle className="w-2.5 h-2.5 text-green-500 fill-green-500" />}
            </h3>
            <p className="text-xs text-[var(--text-light)] font-medium truncate">{internshipName}</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:block bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors" onClick={() => handleStatusChange("Hire")}>
              Hire
            </button>
            <button className="hidden md:block bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors" onClick={() => handleStatusChange("Reject")}>
              Reject
            </button>
            
            <div className="relative">
              <button onClick={() => setIsOptionsOpen(!isOptionsOpen)} className="p-2 rounded-full hover:bg-gray-100 text-[var(--text-light)]">
                <FaEllipsisV />
              </button>
              {isOptionsOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-xl rounded-lg border border-gray-100 w-48 z-50 overflow-hidden">
                  <button onClick={handleMarkAsImportant} className="w-full text-left px-4 py-3 text-sm text-[var(--text-color)] hover:bg-[var(--icon-bg-color)] flex items-center gap-2 border-b border-gray-50">
                    <FaStar className="text-yellow-500" /> Mark as important
                  </button>
                  <button onClick={handleRemoveImportant} className="w-full text-left px-4 py-3 text-sm text-[var(--text-color)] hover:bg-[var(--icon-bg-color)] flex items-center gap-2 border-b border-gray-50">
                    <FaStar className="text-gray-400" /> Remove important
                  </button>
                  <button onClick={handleViewDetails} className="w-full text-left px-4 py-3 text-sm text-[var(--text-color)] hover:bg-[var(--icon-bg-color)] flex items-center gap-2 border-b border-gray-50">
                    <FaFilePdf className="text-[var(--primary-color)]" /> Review application
                  </button>
                  <button onClick={() => handleStatusChange("Hire")} className="md:hidden w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 font-semibold">
                    Hire Student
                  </button>
                  <button onClick={() => handleStatusChange("Reject")} className="md:hidden w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold">
                    Reject Student
                  </button>
                  <button onClick={handleBlockChat} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold">
                    Block chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="flex flex-col space-y-3 max-w-4xl mx-auto">
            {chatHistories[`${selectedStudent}_${selectedInternship}`]?.map(
              (msg, index, arr) => {
                const currentDate = new Date(msg.sentAt);
                const previousDate = index > 0 ? new Date(arr[index - 1].sentAt) : null;
                const isSameDay = previousDate && currentDate.toDateString() === previousDate.toDateString();

                return (
                  <React.Fragment key={index}>
                    {!isSameDay && (
                      <div className="text-center my-4">
                        <span className="bg-white text-[var(--text-light)] text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-gray-100">
                          {displayDate(currentDate)}
                        </span>
                      </div>
                    )}

                    {/* Normal Text Message */}
                    {!msg.isAssignment && !msg.isAttachment && (
                      <div className={`flex ${msg.senderId === recruiterId ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] p-3 shadow-sm ${
                          msg.senderId === recruiterId
                            ? "bg-[var(--button-color)] text-white rounded-2xl rounded-tr-none"
                            : "bg-white text-[var(--text-color)] rounded-2xl rounded-tl-none border border-gray-100"
                        }`}>
                          <p className="text-sm break-words">{msg.messageContent}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${msg.senderId === recruiterId ? "text-blue-100" : "text-[var(--text-light)]"}`}>
                            <span className="text-[10px]">{formatSentAt(msg.sentAt)}</span>
                            {msg.senderId === recruiterId && <MdDoneAll className={`w-3.5 h-3.5 ${msg.seenStatus ? "text-blue-200" : "text-blue-300"}`} />}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Assignment Sent (Recruiter -> Student) */}
                    {msg.isAssignment && msg.senderId === recruiterId && (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                          <div className="bg-[var(--primary-color)] p-3 flex items-center gap-2 text-white">
                            <FaCheckCircle />
                            <span className="font-semibold text-sm">Assignment Sent</span>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-[var(--text-color)] mb-3">{msg.assignmentDetails.description}</p>
                            <p className="text-xs text-red-500 font-semibold mb-4">
                              Deadline: {new Date(msg.assignmentDetails.deadline).toLocaleDateString("en-GB")}
                            </p>
                            <div className="flex items-center justify-end gap-1 text-[10px] text-[var(--text-light)]">
                              {formatSentAt(msg.sentAt)}
                              <MdDoneAll className={`w-3.5 h-3.5 ${msg.seenStatus ? "text-blue-500" : "text-gray-400"}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Assignment Received (Student -> Recruiter) */}
                    {msg.isAssignment && msg.senderId === selectedStudent && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                          <div className="bg-green-500 p-3 flex items-center gap-2 text-white">
                            <FaCheckCircle />
                            <span className="font-semibold text-sm">Assignment Received</span>
                          </div>
                          <div className="p-4 bg-gray-50">
                            <div className="flex flex-col space-y-2 mb-3">
                              {msg.submissionDetails.submittedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100">
                                  <span className="text-xs font-medium text-[var(--text-color)] truncate mr-2">{file.fileName}</span>
                                  <FaFileDownload onClick={() => downloadFile(file.fileId, file.fileName)} className="text-[var(--primary-color)] cursor-pointer hover:scale-110 transition-transform flex-shrink-0" />
                                </div>
                              ))}
                            </div>
                            {msg.submissionDetails.submissionLink && (
                              <a href={msg.submissionDetails.submissionLink} target="_blank" className="flex items-center gap-2 text-xs text-[var(--primary-color)] font-medium mb-2 hover:underline">
                                <FaPaperclip /> {msg.submissionDetails.submissionLink}
                              </a>
                            )}
                            {msg.submissionDetails.additionalInfo && (
                              <p className="text-xs text-[var(--text-light)] mb-2">{msg.submissionDetails.additionalInfo}</p>
                            )}
                            <div className="flex items-center justify-end gap-1 text-[10px] text-[var(--text-light)]">
                              {formatSentAt(msg.sentAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Attachment Message */}
                    {msg.isAttachment && (
                      <div className={`flex ${msg.senderId === recruiterId ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-[240px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-3">
                          <div className="flex flex-col items-center justify-center bg-red-50 p-4 rounded-lg mb-2 relative group cursor-pointer" onClick={() => downloadFile(msg.attachment.fileId, msg.attachment.fileName)}>
                            <FaFilePdf className="w-12 h-12 text-red-500 mb-2" />
                            <FaArrowCircleDown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white bg-black/50 rounded-full p-1.5 hidden group-hover:block transition-all" />
                            <p className="text-xs font-semibold text-[var(--text-color)] text-center truncate w-full">{msg.attachment.fileName}</p>
                          </div>
                          <div className="flex items-center justify-end gap-1 text-[10px] text-[var(--text-light)]">
                            {formatSentAt(msg.sentAt)}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </React.Fragment>
                );
              }
            )}

            {chatBlocked[`${selectedStudent}_${selectedInternship}`] === "recruiter" && (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-[var(--text-light)] font-medium mb-4">You have blocked this chat</p>
                <button onClick={handleUnblock} className="bg-[var(--button-color)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[var(--button-hover-color)] transition-colors shadow-sm">
                  Unblock Student
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input Area */}
        {chatBlocked[`${selectedStudent}_${selectedInternship}`] !== "recruiter" && (
          <div className="bg-white border-t border-gray-100 p-3 flex flex-col gap-3 relative">
            <button
              onClick={toggleAssignmentModal}
              className="self-start flex items-center gap-2 bg-[var(--icon-bg-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <FaFilePdf /> Send Assignment
            </button>

            {showAssignmentModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg">
                  <RecAssignment onClose={toggleAssignmentModal} sendAssignment={sendAssignment} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-color)] placeholder-[var(--text-light)]"
                placeholder="Type a message..."
              />
              <button
                disabled={!newMessage.trim()}
                className="bg-[var(--button-color)] text-white p-2.5 rounded-full hover:bg-[var(--button-hover-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                onClick={sendMessage}
              >
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecChatRoom;