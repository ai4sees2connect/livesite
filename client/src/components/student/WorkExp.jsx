import React, { useState, useEffect } from "react";
import { FaPlus, FaPen, FaTrash, FaBriefcase } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import getUserIdFromToken from "./auth/authUtils";
import api from "../common/server_url";

const WorkExp = () => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeofwork, setTypeOfWork] = useState("");
  const [description, setDescription] = useState("");
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [clicked, setClicked] = useState(false);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchWorkExperiences = async () => {
      try {
        const response = await axios.get(
          `${api}/student/profile/${userId}/work-experience`
        );
        setWorkExperiences(response.data);
        setClicked(false);
      } catch (error) {
        console.error("Error fetching work experiences:", error);
      }
    };
    fetchWorkExperiences();
  }, [userId, clicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workExpData = {
      company,
      role,
      startDate,
      endDate,
      typeofwork,
      description,
    };

    if (
      !company ||
      !role ||
      !startDate ||
      !endDate ||
      !typeofwork ||
      !description
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (currentEditIndex !== null) {
        await axios.put(
          `${api}/student/profile/${userId}/work-experience/${currentEditIndex}`,
          workExpData
        );
        const updatedExperiences = [...workExperiences];
        updatedExperiences[currentEditIndex] = workExpData;
        setWorkExperiences(updatedExperiences);
        toast.success("Experience updated successfully");
      } else {
        const response = await axios.post(
          `${api}/student/profile/${userId}/work-experience`,
          workExpData
        );
        setWorkExperiences([...workExperiences, response.data.workExperience]);
        toast.success("Experience added successfully");
      }
      setIsEditing(false);
      resetForm();
      setClicked(true);
    } catch (error) {
      console.error("Error saving work experience:", error);
      toast.error("Failed to save experience");
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `${api}/student/profile/${userId}/work-experience/${index}`
      );
      const updatedExperiences = workExperiences.filter((_, i) => i !== index);
      setWorkExperiences(updatedExperiences);
      toast.success("Experience deleted successfully");
    } catch (error) {
      console.error("Error deleting work experience:", error);
      toast.error("Failed to delete experience");
    }
  };

  const handleEdit = (index) => {
    const experienceToEdit = workExperiences[index];
    setCompany(experienceToEdit.company);
    setRole(experienceToEdit.role);
    setStartDate(experienceToEdit.startDate);
    setEndDate(experienceToEdit.endDate);
    setTypeOfWork(experienceToEdit.typeofwork);
    setDescription(experienceToEdit.description);
    setCurrentEditIndex(index);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCompany("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setTypeOfWork("");
    setDescription("");
    setCurrentEditIndex(null);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setDescription(value);
    }
  };

  const formatDate = (givenDate) => {
    const [year, month, day] = givenDate ? givenDate.split("-") : "";
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
          <FaBriefcase className="text-[var(--primary-color)] text-xl" />
          Work Experience <span className="text-xs font-normal text-[var(--text-light)]">(Optional)</span>
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
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company Name"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Your Role"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Type of Work</label>
            <select
              value={typeofwork}
              onChange={(e) => setTypeOfWork(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            >
              <option value="">Select Type</option>
              <option value="job">Job</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe your role and responsibilities..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white resize-none"
              required
            ></textarea>
            <div className="text-right text-xs text-[var(--text-light)] mt-1.5 font-medium">
              {500 - description.length} characters remaining
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-[var(--button-color)] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[var(--button-hover-color)] transition-colors shadow-sm text-sm"
            >
              {currentEditIndex !== null ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                resetForm();
              }}
              className="bg-gray-100 text-[var(--text-color)] px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* List Section */
        <div className="space-y-4 mt-2">
          {workExperiences.length > 0 ? (
            workExperiences.map((work, index) => (
              <div key={index} className="bg-[var(--bg-light-color)] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-[var(--text-color)]">
                    {work.role} <span className="font-normal text-[var(--text-light)]">at</span> {work.company}
                  </h3>
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
                  <p className="font-medium text-[var(--primary-color)] capitalize">{work.typeofwork}</p>
                  <p className="text-xs">Duration: {formatDate(work.startDate)} - {formatDate(work.endDate)}</p>
                  <p className="pt-1 break-words">{work.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-[var(--bg-light-color)] rounded-xl border border-dashed border-gray-200">
              <p className="text-[var(--text-light)] font-medium text-sm">No work experience added yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkExp;