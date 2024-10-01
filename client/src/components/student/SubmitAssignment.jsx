import React, { useState,useRef } from 'react';
import { FaTimes, FaUpload, FaPaperclip } from 'react-icons/fa';
import api from '../common/server_url';
import axios from 'axios';

const SubmitAssignment = ({ isOpen, onClose, onSubmit,msgId }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [assignmentLink, setAssignmentLink] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const fileInputRef = useRef(null);
  console.log('this is message id',msgId);

  const handleFileUpload = async (event) => {
    const newFiles = Array.from(event.target.files); // Get the newly selected files
    const updatedFiles = [...uploadedFiles]; // Start with existing files
  
    // Calculate total size
    const totalSize = [...updatedFiles, ...newFiles].reduce((acc, file) => acc + file.size, 0);
  
    if (totalSize > 50 * 1024 * 1024) {
      alert('Total file size exceeds 50MB.');
      return;
    }
  
    // Use Promise.all to upload all files concurrently
    const uploadedFilePromises = newFiles.map(async (file) => {
      const fileData = await uploadFileToServer(file); // Define this function to upload the file and return the URL
      return {
        fileId:fileData.fileId,
        fileName: file.name,
        fileUrl:fileData.fileUrl, // Save the URL returned from the upload function
        fileSize: file.size,
      };
    });
  
    try {
      const uploadedFilesWithUrls = await Promise.all(uploadedFilePromises);
      setUploadedFiles((prevFiles) => [...prevFiles, ...uploadedFilesWithUrls]); // Update the state with the new files
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload some files.');
    }
  };
  

  const uploadFileToServer = async (file) => {
    // Implement your file upload logic here (e.g., using fetch to send to your backend)
    // This is a mock function; you will need to replace this with actual upload logic
    const formData = new FormData();
    formData.append('file', file);


    try {
      const response = await axios.post(`${api}/student/file-to-url`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      alert('Files uploaded succesfully')
      
      return response.data; 
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed');
    }
  }

  console.log('urls of uploaded file',uploadedFiles);

  const removeFile = (indexToRemove) => {
    const updatedFiles = uploadedFiles.filter((_, index) => index !== indexToRemove);
    setUploadedFiles(updatedFiles);
  };

  const handleLinkChange = (event) => {
    setAssignmentLink(event.target.value);
  };

  const handleAdditionalInfoChange = (event) => {
    setAdditionalInfo(event.target.value);
  };

  const handleSubmit = () => {
    const submissionData = {
      files: uploadedFiles,
      link: assignmentLink,
      additionalInfo,
      msgId
    };

    onSubmit(submissionData);
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Trigger click on the hidden input
  };

  if (!isOpen) return null; // Don't render if popup is closed

  return (
    <div className='fixed inset-0 bg-opacity-20 bg-gray-300  flex justify-center items-center'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-[670px]'>
        <h2 className='text-lg font-semibold mb-4'>Submit Assignment</h2>

        {/* File Upload */}
        <div className='mb-4 '>
          <label className='block mb-2'>Upload Files (Max: 50 MB total)</label>
          <input
            type='file'
            ref={fileInputRef}
            multiple
            accept=".zip, .pdf, .doc, .ppt, .xls, .png, .jpg, .mp3, .mp4"
            onChange={handleFileUpload}
            className='hidden'
          />
          <div onClick={handleIconClick} className='flex items-center justify-center space-x-3 border border-dashed bg-blue-100  border-blue-400 cursor-pointer w-[200px] h-[90px] '>
            <FaUpload  className="text-blue-500 w-8 h-8" />
            <span className='text-blue-500'>Upload files</span>
          </div>

          <div className='mt-4 flex flex-wrap space-x-3 text-sm '>
            {uploadedFiles.length > 0 && uploadedFiles.map((file, index) => (
              <div key={index} className='flex text-gray-600 space-x-2 border items-center w-fit justify-between  p-2 rounded-md mb-2'>
                <span className=''>{file.fileName}</span>
                <span>{(file.fileSize/1024).toFixed(2)} KB</span>
                <FaTimes 
                  className='text-red-500 cursor-pointer' 
                  onClick={() => removeFile(index)} 
                />
              </div>
            ))}
          </div>

          <div>
          <p className='text-xs text-gray-600'>Maximum combined file size 50 MB • Only zip, pdf, doc, ppt, xls, png, jpg, mp3, mp4 allowed</p>
          </div>

        </div>

        {/* Assignment Link */}
        <div className='mb-4'>
          <label className='items-center mb-2 inline-flex'>Assignment Link <FaPaperclip className='mx-1 text-gray-700 w-3 h-3'/></label>
          <input
            type='url'
            className='border rounded-lg px-3 py-2 w-full'
            placeholder='Paste assignment link here'
            onChange={handleLinkChange}
          />
        </div>

        {/* Additional Info */}
        <div className='mb-4'>
          <label className='block mb-2'>Additional Information</label>
          <textarea
            className='border rounded-lg px-3 py-2 w-full'
            placeholder='Add any additional info'
            rows='3'
            onChange={handleAdditionalInfoChange}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          className='bg-green-500 text-white px-4 py-2 rounded-lg'
          onClick={handleSubmit}
        >
          Submit
        </button>

        <button
          className='bg-red-500 text-white px-4 py-2 ml-4 rounded-lg'
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SubmitAssignment;
