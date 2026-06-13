import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaPen, FaTrash, FaAward, FaCheckCircle, FaFilePdf } from "react-icons/fa";
import getUserIdFromToken from "./auth/authUtils";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../common/server_url";

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

    if (issueDate === '') { toast.error("Please enter a valid date"); return; }
    if (description === '') { toast.error("Please enter a description"); return; }
    if (!file) { toast.error("Please upload your certificate"); return; }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('issuingOrganization', issuingOrganization);
    formData.append('issueDate', issueDate);
    formData.append('description', description);
    formData.append('certificateFile', file);

    try {
      let response;
      if (editIndex !== null) {
        response = await axios.put(
          `${api}/student/profile/${userId}/certificates/${editIndex}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        const updatedCertificates = [...certificates];
        updatedCertificates[editIndex] = response.data;
        setCertificates(updatedCertificates);
        toast.success("Details updated");
      } else {
        response = await axios.post(
          `${api}/student/profile/${userId}/certificates`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setCertificates([...certificates, response.data]);
        toast.success("Details added");
      }

      setClicked(true);
      setTitle(""); setIssuingOrganization(""); setIssueDate("");
      setDescription(""); setFile(null); setEditIndex(null); setIsEditing(false);
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
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${api}/student/profile/${userId}/certificates/${index}`);
      setCertificates(certificates.filter((_, i) => i !== index));
      toast.success("Certificate details deleted");
    } catch (error) {
      console.error("Error deleting certificate details:", error);
      toast.error("Failed to delete details");
    }
  };

  const handleEdit = (index) => {
    const cert = certificates[index];
    setIsEditing(true);
    setTitle(cert.title);
    setIssuingOrganization(cert.issuingOrganization);
    setIssueDate(cert.issueDate);
    setDescription(cert.description);
    setFile(cert.fileUpload);
    setEditIndex(index);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(''); setIssuingOrganization(''); setIssueDate('');
    setDescription(''); setFile(null); setEditIndex(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
          <FaAward className="text-[var(--primary-color)] text-xl" />
          Certificates <span className="text-xs font-normal text-[var(--text-light)]">(Optional)</span>
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--primary-color)] hover:text-[var(--button-hover-color)] transition-colors bg-[var(--icon-bg-color)] px-3 py-1.5 rounded-lg"
          >
            <FaPlus className="text-xs" /> Add
          </button>
        )}
      </div>

      {/* Form Section */}
      {isEditing ? (
        <form className="space-y-4 mt-4 bg-[var(--bg-light-color)] p-5 rounded-xl border border-gray-100" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Certificate Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React Developer Certification"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Issuing Organization</label>
            <input
              type="text"
              value={issuingOrganization}
              onChange={(e) => setIssuingOrganization(e.target.value)}
              placeholder="e.g. Coursera, Udemy"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full sm:w-auto p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the certificate..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white resize-none"
              rows="4"
              maxLength={300}
              required
            />
            <div className="text-right text-xs text-[var(--text-light)] mt-1.5 font-medium">
              {description.length}/300 characters
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Certificate File (PDF)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {!file ? (
              <button
                type="button"
                onClick={handleInputClick}
                className="flex items-center gap-2 bg-white border-2 border-dashed border-gray-300 text-[var(--text-light)] hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] px-4 py-3 rounded-lg w-full justify-center transition-colors text-sm font-medium"
              >
                <FaFilePdf className="text-lg" /> Click to Upload PDF
              </button>
            ) : (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 text-green-700 overflow-hidden">
                  <FaCheckCircle className="flex-shrink-0" />
                  <span className="font-medium text-sm truncate">{file.name ? file.name : file.filename}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-[var(--button-color)] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[var(--button-hover-color)] transition-colors shadow-sm text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 text-[var(--text-color)] px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* List Section */
        <div className="space-y-4 mt-2">
          {certificates.length > 0 ? (
            certificates.map((cert, index) => (
              <div key={index} className="bg-[var(--bg-light-color)] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-[var(--text-color)]">{cert.title}</h3>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(index)} className="text-[var(--icon-color)] hover:text-[var(--primary-color)] transition-colors p-1">
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-[var(--text-light)] space-y-1">
                  <p className="font-medium text-[var(--text-color)]">{cert.issuingOrganization}</p>
                  <p className="text-xs">Issued: {cert.issueDate}</p>
                  <p className="pt-1">{cert.description}</p>
                  
                  {cert.fileUpload && (
                    <button
                      onClick={() => handleDownload(cert.fileUpload)}
                      className="mt-3 flex items-center gap-2 text-[var(--primary-color)] hover:text-[var(--button-hover-color)] font-semibold text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[var(--primary-color)] transition-colors"
                    >
                      <FaFilePdf /> Download Certificate
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-[var(--bg-light-color)] rounded-xl border border-dashed border-gray-200">
              <p className="text-[var(--text-light)] font-medium text-sm">No certificates added yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificates;