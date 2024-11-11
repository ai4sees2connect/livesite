import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import getUserIdFromToken from "./auth/authUtils";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../common/server_url";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

const Certificates = () => {
  const [clicked, setClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [description, setDescription] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `${api}/student/profile/${userId}/certificates`
        );
        setCertificates(response.data || []);
        setClicked(false);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };
    fetchCertificates();
  }, [userId, clicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (issueDate === '') {
      toast.error("Please enter a valid date");
      return;
    }

    if (description === '') {
      toast.error("Please enter a description");
      return;
    }

    if (!file) {
      toast.error("Please upload your certificate");
      return;
    }
    console.log('this is being sent',file);

    // Create FormData and append each field
    const formData = new FormData();
    formData.append('title', title);
    formData.append('issuingOrganization', issuingOrganization);
    formData.append('issueDate', issueDate);
    formData.append('description', description);
    formData.append('certificateFile', file); // "certificateFile" is the field name expected by the backend
     console.log('this is being sent to the backend',formData);
    try {
      let response;
      if (editIndex !== null) {
        // Update existing certificate
        response = await axios.put(
          `${api}/student/profile/${userId}/certificates/${editIndex}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('this is being sent to the backend',formData);

        const updatedCertificates = [...certificates];
        updatedCertificates[editIndex] = response.data;
        setCertificates(updatedCertificates);
        toast.success("Details updated");
      } else {
        // Add new certificate
        response = await axios.post(
          `${api}/student/profile/${userId}/certificates`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setCertificates([...certificates, response.data]);
        toast.success("Details added");
      }

      // Reset form
      setClicked(true);
      setTitle("");
      setIssuingOrganization("");
      setIssueDate("");
      setDescription("");
      setFile(null);
      setEditIndex(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving the certificate details:", error);
      toast.error("Failed to update details");
    }
  };

  const handleDownload = (file) => {
    const blob = new Blob([new Uint8Array(file.data.data)], { type: file.contentType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    link.click();
    
    // Clean up the URL object after download
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `${api}/student/profile/${userId}/certificates/${index}`
      );
      setCertificates(certificates.filter((_, i) => i !== index));
      toast.success("Certificate details deleted");
    } catch (error) {
      console.error("Error deleting certificate details:", error);
      toast.error("Failed to delete details");
    }
  };

  const handleEdit = (index) => {
    const cert = certificates[index];
    console.log('this is certificate',cert);
    console.log('this is file of this certificate',cert.fileUpload);
    console.log('this is edit index',index);

    setIsEditing(true);
    setTitle(cert.title);
    setIssuingOrganization(cert.issuingOrganization);
    setIssueDate(cert.issueDate);
    setDescription(cert.description);
    setFile(cert.fileUpload);
    setEditIndex(index);
  };

  const handleCancel=()=>{
    setIsEditing(false);
    setTitle('');
    setIssuingOrganization('');
    setIssueDate('');
    setDescription('');
    setFile(null);
    setEditIndex(null);

  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);  // Store selected file in state
  };

  const handleInputClick = () => {



    fileInputRef.current.click();
  }


  return (
    <div className="container mx-auto p-4 border shadow-lg mt-[68px] w-full lg:w-[80%]">
      <h2 className="text-xl font-semibold flex justify-between font-outfit">
        Certificates (Optional)
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 flex items-center space-x-1"
        >
          <span>Add </span>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4 flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Certificate Title"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            value={issuingOrganization}
            onChange={(e) => setIssuingOrganization(e.target.value)}
            placeholder="Issuing Organization"
            className="border p-2 mb-2 w-full"
            required
          />
          <div className="flex  items-center">
            <span className="px-2 w-[14%]">Issuing date:</span>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              placeholder="Issue Date (e.g., 2024)"
              className="border p-2 mb-2 w-fit"
              required
            />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (up to 300 characters)"
            className="border p-2 mb-2 w-full"
            rows="4"
            maxLength={300}
            required
          />
          <div className="text-right text-sm text-gray-500">
            {description.length}/300 characters
          </div>

          {/* File upload input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="border p-2 mb-2 w-full hidden"
          />
          {!file ? (<button onClick={handleInputClick} className="bg-blue-500 px-2 py-1 text-white w-fit rounded-md">Upload Certificate</button>) : (<><div className="flex  items-center"><FaCheckCircle className="text-green-500" /><div className="text-green-500 px-2 py-1 w-fit rounded-md">Certificate added</div><span className="text-sm text-gray-700">{file.name?file.name:file.filename}</span></div><span onClick={()=>setFile(null)} className="flex items-center space-x-2 text-red-500 hover:cursor-pointer"><FaTrash className="w-4 h-4"/><span>Delete certificate</span></span></>)}

          <div className="flex space-x-3 my-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded-md w-fit"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="border px-2 py-1 text-gray-500 hover:bg-red-500 rounded-md hover:text-white w-fit"
            >
              Cancel
            </button>
          </div>

        </form>
      ) : (
        <div className="flex flex-col items-center mt-10">
          {certificates.length > 0 ? (
            certificates.map((cert, index) => (
              <div key={index} className="border p-5 mb-2 min-w-full">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{cert.title}</h3>
                    <div className="flex space-x-5">
                      <FontAwesomeIcon
                        icon={faPen}
                        onClick={() => handleEdit(index)}
                        className="hover:scale-125 duration-300 text-blue-500 hover:cursor-pointer"
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDelete(index)}
                        className="hover:scale-125 duration-300 text-red-600 hover:cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="text-gray-600">
                    <p>Issued by: {cert.issuingOrganization}</p>
                    <p>Issue Date: {cert.issueDate}</p>
                    <p>Description: {cert.description}</p>
                    {cert.fileUpload && (
                      <button
                        onClick={() => handleDownload(cert.fileUpload)}
                        className="text-blue-500 underline"
                      >
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No certificates added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificates;
