import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../common/server_url";
import TimeAgo from "../common/TimeAgo";
import { io } from "socket.io-client";
import SubmitAssignment from "./SubmitAssignment";
import {
  FaCheckCircle,
  FaFileDownload,
  FaPaperclip,
  FaCommentDots,
  FaEllipsisV,
  FaStar,
  FaBolt,
  FaExclamation,
  FaFile,
  FaArrowCircleDown,
  FaFilePdf,
  FaArrowLeft,
  FaCircle,
  FaArrowRight,
} from "react-icons/fa";
import { MdDoneAll } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner";

const Chats = () => {
  const { studentId } = useParams();
  const [shortlistedInternships, setShortlistedInternships] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatHistories, setChatHistories] = useState({});

  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [recruiterName, setRecruiterName] = useState("");

  const [internshipName, setInternshipName] = useState("");
  const [activeStatus, setActiveStatus] = useState(false);

  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
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
        const response = await axios.get(
          `${api}/student/internship/${studentId}/shortlisted-internships`
        );
        const result = response.data;
        setShortlistedInternships(result);

        const socketConnection = io(api, {
          query: { userType: "Student", userId: studentId },
        });
        setSocket(socketConnection);

        socketConnection.on("recruitersStatus", (recruiters) => {
          setShortlistedInternships((prevInterns) =>
            prevInterns.map((intern) => {
              const matchingRecruiter = recruiters.find(
                (rec) => rec.recruiterId === intern.recruiterId
              );
              if (matchingRecruiter && intern.isActive !== true) {
                return { ...intern, isActive: true };
              }
              return intern;
            })
          );
        });

        socketConnection.on("recruitersActive", ({ userId, isActive }) => {
          setShortlistedInternships((prevInterns) => {
            return prevInterns.map((intern) =>
              intern.recruiterId === userId ? { ...intern, isActive } : intern
            );
          });
        });

        if (result.length > 0) {
          result.forEach((intern) => {
            const { recruiterId, internshipId } = intern;

            socketConnection.emit("joinChatRoom", {
              recruiterId,
              studentId,
              internshipId,
              type: "Student",
            });

            const chatHistoryEvent = `chatHistory_${recruiterId}_${internshipId}`;
            socketConnection.on(chatHistoryEvent, (messages) => {
              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${recruiterId}_${internshipId}`]: messages,
              }));

              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
              if (lastMessage) {
                setLatestMessagesSeenStatus((prevStatus) => ({
                  ...prevStatus,
                  [`${recruiterId}_${internshipId}`]: lastMessage.seenStatus,
                }));
              }
            });

            const receiveMessageEvent = `receiveMessages_${recruiterId}_${internshipId}`;
            socketConnection.on(receiveMessageEvent, (message) => {
              setChatHistories((prevHistories) => ({
                ...prevHistories,
                [`${recruiterId}_${internshipId}`]: [
                  ...(prevHistories[`${recruiterId}_${internshipId}`] || []),
                  message,
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
        toast.error("Some error occurred");
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
    if (shortlistedInternships && shortlistedInternships.length > 0) {
      if (socket) {
        handleInternClick(
          shortlistedInternships[0].internshipId,
          shortlistedInternships[0].recruiterId
        );
        handleInfoSetter(
          shortlistedInternships[0].companyName,
          shortlistedInternships[0].internshipName,
          shortlistedInternships[0].isActive,
          shortlistedInternships[0].recruiterFirstName,
          shortlistedInternships[0].recruiterLastName
        );
      }
      setIsLoading(false);
    }
  }, [socket, shortlistedInternships]);

  useEffect(() => {
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    const timer = setTimeout(scrollToBottom, 500);
    return () => clearTimeout(timer);
  }, [selectedInternship, selectedRecruiter, socket]);

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageData = {
        studentId,
        recruiterId: selectedRecruiter,
        message: newMessage,
        internshipId: selectedInternship,
        type: "Student",
      };
      socket.emit("sendMessage", messageData);

      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [`${messageData.recruiterId}_${messageData.internshipId}`]: [
          ...(prevHistories[`${messageData.recruiterId}_${messageData.internshipId}`] || []),
          { senderId: studentId, messageContent: newMessage, sentAt: new Date() },
        ],
      }));
      setNewMessage("");
    }
  };

  const handleInternClick = (internshipId, recruiterId) => {
    setSelectedRecruiter(recruiterId);
    setSelectedInternship(internshipId);
    setChatListOpen(false);

    socket.emit("markLastMessageAsSeen", {
      studentId,
      internshipId,
      recruiterId,
      type: "Student",
    });

    socket.on("messageSeenUpdate", ({ studentId, internshipId, recruiterId, type }) => {
      if (type === "Student") {
        const key = `${recruiterId}_${internshipId}`;
        setLatestMessagesSeenStatus((prev) => ({ ...prev, [key]: true }));
      } else {
        socket.off("messageSeenUpdate");
      }
    });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistories]);

  const formatSentAt = (sentAt) => {
    const messageDate = new Date(sentAt);
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleInfoSetter = (companyName, internshipName, isActive, recruiterFirstName, recruiterLastName) => {
    setCompanyName(companyName);
    setInternshipName(internshipName);
    setActiveStatus(isActive);
    setRecruiterName(`${recruiterFirstName} ${recruiterLastName}`);
  };

  const displayDate = (currentDate) => {
    if (currentDate.toDateString() === new Date().toDateString()) return "Today";
    return `${currentDate.getDate()} ${currentDate.toLocaleString("default", { month: "long" })}`;
  };

  const getLastMessageTimestamp = (chatKey, chatHistories) => {
    const messages = chatHistories[chatKey] || [];
    if (messages.length === 0) return new Date(0);
    return new Date(messages[messages.length - 1].sentAt);
  };

  const sortShortlistedInternshipsByLastMessage = (shortlistedInternships, chatHistories) => {
    return shortlistedInternships.sort((a, b) => {
      const timestampA = getLastMessageTimestamp(`${a.recruiterId}_${a.internshipId}`, chatHistories);
      const timestampB = getLastMessageTimestamp(`${b.recruiterId}_${b.internshipId}`, chatHistories);
      return timestampB - timestampA;
    });
  };

  const sortAndSetShortlistedStudents = () => {
    setShortlistedInternships((prev) => [...sortShortlistedInternshipsByLastMessage(prev, chatHistories)]);
  };

  useEffect(() => {
    sortAndSetShortlistedStudents();
  }, [chatHistories]);

  const handleFilterChange = (filter) => setActiveFilter(filter);

  useEffect(() => {
    if (shortlistedInternships && shortlistedInternships.length > 0) {
      const { filteredInternships, unreadCount } = shortlistedInternships.reduce(
        (acc, internship) => {
          const key = `${internship.recruiterId}_${internship.internshipId}`;
          if (activeFilter === "all") acc.filteredInternships.push(internship);
          else if (activeFilter === "unread" && latestMessagesSeenStatus[key] === false) acc.filteredInternships.push(internship);
          else if (activeFilter === "important" && internship.importantForStudent) acc.filteredInternships.push(internship);

          if (latestMessagesSeenStatus[key] === false) acc.unreadCount += 1;
          return acc;
        },
        { filteredInternships: [], unreadCount: 0 }
      );
      setFilteredInternships(filteredInternships);
      setUnreadCount(unreadCount);
    } else {
      setFilteredInternships([]);
      setUnreadCount(0);
    }
  }, [shortlistedInternships, activeFilter, latestMessagesSeenStatus]);

  const openAssignmentPopup = () => setPopupOpen(true);
  const closeAssignmentPopup = () => setPopupOpen(false);

  const handleAssignmentSubmit = async (submissionData) => {
    const { files, link, additionalInfo, msgId } = submissionData;
    const submissionPayload = {
      msgId, files, link, additionalInfo, internshipId: selectedInternship,
    };
    socket.emit("submitAssignment", submissionPayload);

    setChatHistories((prevHistories) => {
      const newMessage = {
        senderId: studentId,
        messageContent: "Assignment submission",
        sentAt: new Date(),
        isAssignment: true,
        submissionDetails: {
          submittedFiles: files.map((file) => ({
            fileName: file.fileName,
            fileSize: (file.fileSize / 1024).toFixed(2) + " KB",
            fileUrl: file.fileUrl || "",
          })),
          submissionLink: link,
          additionalInfo: additionalInfo || "",
          originalAssignmentId: msgId,
        },
      };
      return {
        ...prevHistories,
        [`${selectedRecruiter}_${selectedInternship}`]: [
          ...(prevHistories[`${selectedRecruiter}_${selectedInternship}`] || []),
          newMessage,
        ],
      };
    });
    closeAssignmentPopup();
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${api}/student/get-file/${fileId}`, { responseType: "blob" });
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
    socket.emit("markAsImportant", { recruiterId: selectedRecruiter, internshipId: selectedInternship, studentId, type: "Student" });
    setIsOptionsOpen(false);
    toast.success("Added to important");
    setShortlistedInternships((prev) => prev.map((i) => i.internshipId === selectedInternship ? { ...i, importantForStudent: true } : i));
  };

  const handleRemoveImportant = () => {
    socket.emit("removeAsImportant", { recruiterId: selectedRecruiter, internshipId: selectedInternship, studentId, type: "Student" });
    setIsOptionsOpen(false);
    toast.success("Removed from important");
    setShortlistedInternships((prev) => prev.map((i) => i.internshipId === selectedInternship ? { ...i, importantForStudent: false } : i));
  };

  const handleViewDetails = () => navigate(`/student/myApplications/${studentId}`);

  useEffect(() => {
    if (socket) {
      socket.on("studentStatusChangedAck", ({ studentStatus, internshipId }) => {
        setShortlistedInternships((prev) => prev.map((i) => i.internshipId === internshipId ? { ...i, studentStatus } : i));
      });
    }
  }, [socket]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setAttachmentSelected(true);
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return toast.error("No file selected");
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await axios.post(`${api}/student/file-to-url`, formData, { headers: { "Content-Type": "multipart/form-data" } });

    socket.emit("sentAttachment", {
      file: selectedFile, studentId, recruiterId: selectedRecruiter, internshipId: selectedInternship,
      fileId: response.data.fileId, fileName: selectedFile.name, fileSize: selectedFile.size,
    });

    setChatHistories((prev) => {
      const newMessage = {
        senderId: studentId, messageContent: "Attachment sent", sentAt: new Date(), isAttachment: true,
        attachment: { fileName: selectedFile.name, fileSize: (selectedFile.size / 1024).toFixed(2) + " KB" },
      };
      return {
        ...prev,
        [`${selectedRecruiter}_${selectedInternship}`]: [...(prev[`${selectedRecruiter}_${selectedInternship}`] || []), newMessage],
      };
    });
    setSelectedFile(null);
    setAttachmentSelected(false);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setAttachmentSelected(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("chatBlocked", ({ recruiterId, internshipId, blockedBy, blocked }) => {
        const chatRoomKey = `${recruiterId}_${internshipId}`;
        setChatBlocked((prev) => ({ ...prev, [chatRoomKey]: blocked ? blockedBy : null }));
      });
    }
    return () => socket && socket.off("chatBlocked");
  }, [socket]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (loading) return <Spinner />;

  if (!internsFoundCheck) {
    return (
      <div className="h-[calc(100vh-66px)] flex flex-col items-center justify-center text-[var(--text-light)] bg-[var(--bg-light-color)] mt-[66px]">
        <FaCommentDots className="text-6xl text-[var(--primary-color)] mb-4 opacity-50" />
        <p className="text-xl font-semibold tracking-wide">You are not shortlisted for any internship yet</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-66px)] w-full mt-[66px] bg-[var(--bg-light-color)] overflow-hidden">
      
      {/* Left Column - Chat List */}
      <div className={`${!chatListOpen ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-[35%] xl:w-[30%] bg-white border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[var(--text-color)] flex items-center gap-2">
            <FaCommentDots className="text-[var(--primary-color)]" /> Messages
          </h2>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
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
          {filteredInternships.length > 0 ? (
            filteredInternships.map((intern) => {
              const { internshipId, recruiterId, companyName, internshipName, isActive, studentStatus, recruiterFirstName, recruiterLastName } = intern;
              const chatKey = `${recruiterId}_${internshipId}`;
              const chatHistory = chatHistories[chatKey] || [];
              const lastMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
              const isUnread = latestMessagesSeenStatus[chatKey] === false && lastMessage?.senderId !== studentId;

              return (
                <div
                  key={`${recruiterId}-${internshipId}`}
                  onClick={() => {
                    handleInternClick(internshipId, recruiterId);
                    handleInfoSetter(companyName, internshipName, isActive, recruiterFirstName, recruiterLastName);
                  }}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-[var(--icon-bg-color)] ${
                    selectedInternship === internshipId ? "bg-[var(--icon-bg-color)] border-l-4 border-[var(--primary-color)]" : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[var(--text-color)] truncate flex items-center gap-2">
                      {companyName || `${recruiterFirstName} ${recruiterLastName}`}
                      {isActive && <FaCircle className="w-2 h-2 text-green-500 fill-green-500" />}
                    </h3>
                    <span className="text-[10px] text-[var(--text-light)] whitespace-nowrap ml-2">
                      {lastMessage ? formatSentAt(lastMessage.sentAt) : ""}
                    </span>
                  </div>
                  
                  <p className="text-xs text-[var(--primary-color)] font-semibold truncate mb-1">{internshipName}</p>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[var(--text-light)] truncate flex-1">
                      {lastMessage?.senderId === studentId && <span className="font-semibold text-[var(--text-color)]">You: </span>}
                      {lastMessage?.messageContent?.slice(0, 35) || "No messages yet"}...
                    </p>
                    <div className="flex items-center gap-2 ml-2">
                      {intern.importantForStudent && <FaStar className="text-yellow-500 w-3 h-3" />}
                      {isUnread && <div className="w-2.5 h-2.5 rounded-full bg-[var(--button-color)]"></div>}
                    </div>
                  </div>

                  {studentStatus && (
                    <div className="mt-2">
                      {studentStatus === "inTouch" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                          <FaBolt className="w-2.5 h-2.5" /> In-touch
                        </span>
                      )}
                      {studentStatus === "notHired" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                          <FaExclamation className="w-2.5 h-2.5" /> Not selected
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
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-[var(--text-light)]">
              <p className="text-sm">No chats found</p>
            </div>
          )}
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
            <h3 className="font-bold text-[var(--text-color)] text-lg truncate flex items-center gap-2">
              {companyName || recruiterName}
              {activeStatus && <FaCircle className="w-2.5 h-2.5 text-green-500 fill-green-500" />}
            </h3>
            <p className="text-xs text-[var(--text-light)] font-medium truncate">{internshipName}</p>
          </div>

          <div className="relative">
            <button onClick={() => setIsOptionsOpen(!isOptionsOpen)} className="p-2 rounded-full hover:bg-gray-100 text-[var(--text-light)]">
              <FaEllipsisV />
            </button>
            {isOptionsOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-xl rounded-lg border border-gray-100 w-48 z-50 overflow-hidden">
                <button onClick={handleMarkAsImportant} className="w-full text-left px-4 py-3 text-sm text-[var(--text-color)] hover:bg-[var(--icon-bg-color)] flex items-center gap-2 border-b border-gray-50">
                  <FaStar className="text-yellow-500" /> Mark as important
                </button>
                {shortlistedInternships.find(i => i.internshipId === selectedInternship)?.importantForStudent && (
                  <button onClick={handleRemoveImportant} className="w-full text-left px-4 py-3 text-sm text-[var(--text-color)] hover:bg-[var(--icon-bg-color)] flex items-center gap-2 border-b border-gray-50">
                    <FaStar className="text-gray-400" /> Remove important
                  </button>
                )}
                <button onClick={handleViewDetails} className="w-full text-left px-4 py-3 text-sm text-[var(--text-color)] hover:bg-[var(--icon-bg-color)] flex items-center gap-2">
                  <FaFile className="text-[var(--primary-color)]" /> View Details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="flex flex-col space-y-3 max-w-4xl mx-auto">
            {chatHistories[`${selectedRecruiter}_${selectedInternship}`]?.map((msg, index, arr) => {
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
                    <div className={`flex ${msg.senderId === studentId ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] p-3 shadow-sm ${
                        msg.senderId === studentId
                          ? "bg-[var(--button-color)] text-white rounded-2xl rounded-tr-none"
                          : "bg-white text-[var(--text-color)] rounded-2xl rounded-tl-none border border-gray-100"
                      }`}>
                        <p className="text-sm break-words">{msg.messageContent}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${msg.senderId === studentId ? "text-blue-100" : "text-[var(--text-light)]"}`}>
                          <span className="text-[10px]">{formatSentAt(msg.sentAt)}</span>
                          {msg.senderId === studentId && <MdDoneAll className={`w-3.5 h-3.5 ${msg.seenStatus ? "text-blue-200" : "text-blue-300"}`} />}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assignment Received (Recruiter -> Student) */}
                  {msg.isAssignment && msg.senderId === selectedRecruiter && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-[var(--primary-color)] p-3 flex items-center gap-2 text-white">
                          <FaCheckCircle />
                          <span className="font-semibold text-sm">Assignment Received</span>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-[var(--text-color)] mb-3">{msg.assignmentDetails.description}</p>
                          <p className="text-xs text-red-500 font-semibold mb-4">
                            Deadline: {new Date(msg.assignmentDetails.deadline).toLocaleDateString("en-GB")}
                          </p>
                          <button onClick={openAssignmentPopup} className="w-full bg-[var(--button-color)] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[var(--button-hover-color)] transition-colors">
                            Submit Assignment
                          </button>
                          <p className="text-[10px] text-[var(--text-light)] text-right mt-2">{formatSentAt(msg.sentAt)}</p>
                        </div>
                      </div>
                      <SubmitAssignment isOpen={isPopupOpen} onClose={closeAssignmentPopup} onSubmit={handleAssignmentSubmit} msgId={msg._id} recruiterId={msg.senderId} />
                    </div>
                  )}

                  {/* Assignment Submitted (Student -> Recruiter) */}
                  {msg.isAssignment && msg.senderId === studentId && (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-green-500 p-3 flex items-center gap-2 text-white">
                          <FaCheckCircle />
                          <span className="font-semibold text-sm">Assignment Submitted</span>
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
                            <MdDoneAll className={`w-3.5 h-3.5 ${msg.seenStatus ? "text-blue-500" : "text-gray-400"}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attachment Message */}
                  {msg.isAttachment && (
                    <div className={`flex ${msg.senderId === studentId ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[240px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-3">
                        <div className="flex flex-col items-center justify-center bg-red-50 p-4 rounded-lg mb-2 relative group cursor-pointer" onClick={() => downloadFile(msg.attachment.fileId, msg.attachment.fileName)}>
                          <FaFilePdf className="w-12 h-12 text-red-500 mb-2" />
                          <FaArrowCircleDown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white bg-black/50 rounded-full p-1.5 hidden group-hover:block transition-all" />
                          <p className="text-xs font-semibold text-[var(--text-color)] text-center truncate w-full">{msg.attachment.fileName}</p>
                          <p className="text-[10px] text-[var(--text-light)]">{msg.attachment.fileSize}</p>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-[var(--text-light)]">
                          {formatSentAt(msg.sentAt)}
                          {msg.senderId === studentId && <MdDoneAll className={`w-3.5 h-3.5 ${msg.seenStatus ? "text-blue-500" : "text-gray-400"}`} />}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </React.Fragment>
              );
            })}

            {chatBlocked[`${selectedRecruiter}_${selectedInternship}`] === "recruiter" && (
              <div className="flex justify-center items-center text-[var(--text-light)] font-medium text-sm bg-white/80 p-3 rounded-lg border border-gray-200">
                You can no longer send or receive messages in this chat.
              </div>
            )}
          </div>
        </div>

        {/* Chat Input Area */}
        {chatBlocked[`${selectedRecruiter}_${selectedInternship}`] !== "recruiter" && (
          <div className="bg-white border-t border-gray-100 p-3 flex items-center gap-3 relative">
            <label className="text-[var(--text-light)] hover:text-[var(--primary-color)] cursor-pointer transition-colors p-2">
              <FaPaperclip className="w-5 h-5" />
              <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
            </label>
            
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

            {attachmentSelected && (
              <div className="absolute bottom-full left-0 w-full bg-white border-t border-gray-200 p-3 shadow-lg flex items-center justify-between">
                <span className="text-sm text-[var(--text-color)] font-medium truncate mr-3 flex items-center gap-2">
                  <FaFilePdf className="text-red-500" /> {selectedFile.name}
                </span>
                <div className="flex gap-2">
                  <button onClick={handleFileUpload} className="bg-[var(--button-color)] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[var(--button-hover-color)]">Send</button>
                  <button onClick={handleFileRemove} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;