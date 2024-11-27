import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";
import { toast } from "react-toastify";

const RecAssignment = ({ onClose, sendAssignment }) => {
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentSelected, setAttachmentSelected] = useState(false);

  const handleSendAssignment = () => {
    sendAssignment(description, deadline); // Call the parent function
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Check if the file is a PDF
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setAttachmentSelected(true);
      // setNewMessage(file.name);
      console.log(file);
    } else {
      toast.error("Please upload a PDF file.");
    }
  };
  return (
    <div className="assignment-modal relative">
      <h2 className="text-xl mb-4">New Assignment</h2>
      <FaTimes
        className="absolute right-0 top-0 text-blue-500 hover:cursor-pointer"
        onClick={onClose}
      />

      <div className="mb-2">
        <label className="block">Assignment Description:</label>
        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border-2 rounded-lg"
          placeholder="Enter the assignment description..."
        />
      </div>
      <div className="my-3 inline-block">
        <label
          htmlFor="fileUpload"
          className="my-auto rounded-md hover:cursor-pointer flex items-center gap-2 bg-blue-500 px-3 py-1 text-white hover:scale-105"
        >
          <FaPaperclip className="w-5 h-5" />
          <span>Upload Assignment</span>
        </label>
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf"
        />
      </div>

      <div className="mb-4">
        <label className="block">Deadline:</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border-2 rounded-lg"
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSendAssignment}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Send Assignment
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RecAssignment;
