import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
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
    <div className="container mx-auto p-4 border shadow-lg mt-[68px] w-full lg:w-[80%]">
      <h2 className="text-xl font-semibold flex justify-between font-outfit">
        Work Experience / Internship (Optional)
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 flex items-center space-x-1"
        >
          <span>Add</span>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="border p-2 mb-2 w-full"
            required
          />

          <div className="flex items-center space-x-4">
            <label className="text-gray-500 mx-2 px-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 mb-2"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-gray-500 mx-3 px-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 mb-2"
              required
            />
          </div>

          <select
            type="text"
            value={typeofwork}
            onChange={(e) => setTypeOfWork(e.target.value)}
            className="border p-2 mb-2 w-full"
            required
          >
            <option value="">Select Type</option>
            <option value="job">Job</option>
            <option value="internship">Internship</option>
          </select>
          <textarea
            rows={5}
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Description"
            className="border p-2 mb-2 w-full"
            required
          ></textarea>
          <div className="text-right text-sm text-gray-500">
            {500 - description.length} characters remaining
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4"
          >
            {currentEditIndex !== null ? "Update" : "Save"}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              resetForm();
            }}
            className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex gap-5 flex-col items-center mt-10">
          {workExperiences.length > 0 && (
            workExperiences.map((work, index) => (
              <div key={index} className="border p-5 mb-2 w-[90%]">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">
                    {work.role} at: {work.company}
                  </h3>
                  <div className="flex space-x-5">
                    <FontAwesomeIcon
                      icon={faPen}
                      onClick={() => handleEdit(index)}
                      className="hover:scale-125 duration-300 text-blue-500 hover:cursor-pointer"
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDelete(index)}
                      className="hover:scale-125 duration-300 text-red-500 hover:cursor-pointer"
                    />
                  </div>
                </div>
                <div className="text-gray-600 max-w-[80%]">
                  <p>({work.typeofwork})</p>
                  <p>
                    Duration: {formatDate(work.startDate)} -{" "}
                    {formatDate(work.endDate)}
                  </p>
                  <p className="w-[90%] break-words">
                    Details: {work.description}
                  </p>
                </div>
              </div>
            ))
          ) }
        </div>
      )}
    </div>
  );
};

export default WorkExp;
