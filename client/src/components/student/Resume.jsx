import React, { useState, useRef, useEffect, useId } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FaTrash, FaDownload } from "react-icons/fa";
import getUserIdFromToken from "./auth/authUtils.js";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../common/server_url.js";
import formatDateWithOrdinal from "../common/formatDate.js";

const Resume = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const { userId } = useParams();
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFilename, setResumeFilename] = useState(null);
  const idFromToken = getUserIdFromToken();
  const [resumeCreatedAt, setResumeCreatedAt] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/student/login");
      return;
    }
    if (idFromToken !== userId) {
      localStorage.removeItem("token");
      return;
    }
  }, [userId, idFromToken]);

  useEffect(() => {
    // Fetch the resume from the backend
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${api}/student/resume/${userId}`, {
          responseType: "blob", // Set response type to blob for binary data
        });

        // Create a URL for the blob data
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResumeUrl(url);
        console.log(resumeUrl);
        console.log('this is response',response.data);

        const contentDisposition = response.headers["content-disposition"];
        const createdAt = response.headers["resume-created-at"];
        console.log('this is created at',createdAt);
        if (createdAt) {
          setResumeCreatedAt(new Date(createdAt));
        }
        // console.log('response.headers:', response.headers);
        if (contentDisposition) {
          console.log("yattttaaa");
          const matches = /filename="([^"]*)"/.exec(contentDisposition);
          if (matches) setResumeFilename(matches[1]);
        }

        // setResumeCreatedAt(createdAt);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, [userId]);

  const handleResumeDelete=async(e)=>{
    e.preventDefault();
    try {
      await axios.delete(`${api}/student/${userId}/resume-delete`);
      toast.success("Resume deleted");
      setResumeFilename(null);
      setResumeUrl(null);
      setResumeCreatedAt(null);
    } catch (error) {
      toast.error("Error deleting resume:", error);
    }
  }

  const navigate = useNavigate();

  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  // const handleFileReupload = () => {
  //   setFile(null);
  //   setResumeUrl("");
  //   fileInputRef.current.click();
  // };

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  const handleSubmit = async (e) => {
    // handleFileChange(e);

    if (!e.target.files[0]) {
      alert("Please select a file to upload.");
      return;
    }
    if (!userId) {
      alert("Please ensure you are logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", e.target.files[0]);

    try {
      await axios.post(`${api}/student/upload-resume/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Resume Uploaded Successfully");
      // console.log(e.target.files[0].name);
      setResumeFilename(e.target.files[0].name)
      window.location.reload();
      
    } catch (error) {
      console.error("There was an error uploading the resume:", error);
      alert("Failed to upload the resume.");
    }
  };
  return (
    
    <div className="w-full lg:w-[60%] h-[70%] mx-auto p-4 border-b ">
      <h1 className="text-xl font-outfit font-semibold">Resume</h1>
      <h1 className="text-gray-700">Your resume is the first impression you make on potential employers. Craft it carefully to secure your desired job or internship.</h1>
      <h1> {resumeFilename}</h1>

      <div className="flex justify-between items-center text-gray-600">
      <h2>{resumeCreatedAt ? formatDateWithOrdinal(resumeCreatedAt) : ''}</h2>

        {resumeFilename && <div className="flex space-x-3">

          <a href={resumeUrl} download={resumeFilename} className="text-blue-500 text-xl font-bold mt-4 hover:scale-105 duration-300 pb-4 text-center" >
            <FaDownload />
          </a>
          <button onClick={handleResumeDelete} className="text-red-500"><FaTrash /></button>
        </div>}

      </div>

      <div className="flex flex-col items-center space-y-4 py-4 w-[60%] mx-auto" >
      <input
            ref={fileInputRef}
            type="file"
            onChange={handleSubmit}
            className="hidden my-4 hover:cursor-pointer"
          />
        <button onClick={handleFileClick} className="border-2 border-blue-500 text-blue-500 font-semibold rounded-full px-2 py-1">Upload Resume</button>
        <div className="text-gray-600">Supported formats: PDF</div>
        {!resumeFilename && <div className="text-red-400">No resume uploaded</div>}
      </div>
    </div>
  );


};

export default Resume;
