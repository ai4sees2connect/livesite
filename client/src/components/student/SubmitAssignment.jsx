import React, { useState } from 'react';

const SubmitAssignment = ({ isOpen, onClose, onSubmit }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [assignmentLink, setAssignmentLink] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > 50 * 1024 * 1024) {
      alert('Total file size exceeds 50MB.');
      return;
    }

    setUploadedFiles(files);
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
    };

    onSubmit(submissionData);
  };

  if (!isOpen) return null; // Don't render if popup is closed

  return (
    <div className='fixed inset-0 bg-opacity-5 bg-white  flex justify-center items-center'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-[500px]'>
        <h2 className='text-lg font-semibold mb-4'>Submit Assignment</h2>

        {/* File Upload */}
        <div className='mb-4'>
          <label className='block mb-2'>Upload Files (Max: 50 MB total)</label>
          <input
            type='file'
            multiple
            accept=".zip, .pdf, .doc, .ppt, .xls, .png, .jpg, .mp3, .mp4"
            onChange={handleFileUpload}
          />
        </div>

        {/* Assignment Link */}
        <div className='mb-4'>
          <label className='block mb-2'>Assignment Link</label>
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
