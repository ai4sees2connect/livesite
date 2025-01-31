import React, { useState, useRef, useEffect } from "react";
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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/student/login");
      return;
    }
    if (idFromToken !== userId) {
      localStorage.removeItem("token");
      navigate("/student/login");
      return;
    }
  }, [userId, idFromToken, navigate]);



  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${api}/student/resume/${userId}`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResumeUrl(url); 

        const contentDisposition = response.headers["content-disposition"];
        const createdAt = response.headers["resume-created-at"];
        if (createdAt) setResumeCreatedAt(new Date(createdAt));

        if (contentDisposition) {
          const matches = /filename="([^"]*)"/.exec(contentDisposition);
          if (matches) setResumeFilename(matches[1]);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
        // toast.info('Please upload your resume');
      }
    };

    fetchResume();
  }, [userId]);

  const handleResumeDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`${api}/student/${userId}/resume-delete`);
      toast.success("Resume deleted");
      setResumeFilename(null);
      setResumeUrl(null);
      setResumeCreatedAt(null);
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (
      !["application/pdf", "application/msword"].includes(selectedFile.type)
    ) {
      toast.error("Only PDF files are supported.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      // 5 MB size limit
      toast.error("File size should not exceed 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      await axios.post(`${api}/student/upload-resume/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Resume uploaded successfully");
      setResumeFilename(selectedFile.name);
      window.location.reload();
    } catch (error) {
      console.error("There was an error uploading the resume:", error);
      toast.error("Failed to upload the resume.");
    }
  };

  const handleViewResume = () => {
    window.open(resumeUrl, "_blank");
  };

  console.log(resumeUrl);

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-xl  ">Resume</h1>
      <h2 className="text-gray-700 my-2">
        Your resume is the first impression you make on potential employers.
        Craft it carefully to secure your desired job or internship.
      </h2>
      <h2  className="text-blue-500 font-semibold">{resumeFilename}</h2>

      <div className="flex justify-between items-center text-gray-600">
        <h2>{resumeCreatedAt ? formatDateWithOrdinal(resumeCreatedAt) : ""}</h2>

        {resumeFilename && (
          <div className="flex space-x-3 my-3">
            <a
              href={resumeUrl}
              download={resumeFilename}
              className="text-blue-500 text-xl font-bold mt-4 hover:scale-105 duration-300 pb-4 text-center"
            >
              <FaDownload />
            </a>
            <button onClick={handleResumeDelete} className="text-red-500 hover:scale-105 duration-300">
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-3 py-3 mx-auto">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleSubmit}
          className="hidden my-4 hover:cursor-pointer"
          accept=".pdf" // Only PDF and DOC files are allowed
        />
        <button
          onClick={handleFileClick}
          className="border-2 border-blue-500 text-blue-500 font-semibold rounded-full px-2 py-1 hover:bg-blue-500 hover:text-white"
        >
          {resumeUrl? (<span>Update</span>):(<span>Upload</span>)} Resume
        </button>
        <div className="text-gray-600">Supported formats: PDF</div>
        {!resumeFilename && (
          <div className="text-red-400 font-semibold">No resume uploaded</div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Resume;
