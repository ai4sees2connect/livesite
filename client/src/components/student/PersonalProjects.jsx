import React, { useState, useEffect } from "react";
import { FaPlus, FaPen, FaTrash, FaLaptopCode, FaExternalLinkAlt } from "react-icons/fa";
import getUserIdFromToken from "./auth/authUtils";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../common/server_url";

const PersonalProjects = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [personalProjects, setPersonalProjects] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchPersonalProjects = async () => {
      try {
        const response = await axios.get(
          `${api}/student/profile/${userId}/personal-projects`
        );
        if (!response.data) {
          toast.error("Sorry, no projects found");
          return;
        }
        setPersonalProjects(response.data);
      } catch (error) {
        console.error("Error fetching personal projects:", error);
      }
    };
    fetchPersonalProjects();
  }, [userId]);

  const validateDescription = (desc) => desc.trim().split(" ").length <= 100;
  const validateLink = (url) => /^https:\/\/github\.com\/.+/.test(url);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !link) {
      toast.error("Please enter all fields");
      return;
    }

    if (!validateDescription(description)) {
      toast.error("Description should be 100 words or less");
      return;
    }

    if (!validateLink(link)) {
      toast.error("Please enter a valid link");
      return;
    }

    const projectData = {
      title,
      description,
      link,
    };

    try {
      if (editIndex !== null) {
        // Update existing project entry
        const response = await axios.put(
          `${api}/student/profile/${userId}/personal-projects/${editIndex}`,
          projectData
        );
        const updatedProjects = [...personalProjects];
        updatedProjects[editIndex] = response.data;
        setPersonalProjects(updatedProjects);
        toast.success("Project updated");
      } else {
        // Add new project entry
        const response = await axios.post(
          `${api}/student/profile/${userId}/personal-projects`,
          projectData
        );
        setPersonalProjects([
          ...personalProjects,
          response.data.personalProjects,
        ]);
        toast.success("Project added");
      }

      setTitle("");
      setDescription("");
      setLink("");
      setEditIndex(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving the project details:", error);
      toast.error("Failed to update details");
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `${api}/student/profile/${userId}/personal-projects/${index}`
      );
      setPersonalProjects(personalProjects.filter((_, i) => i !== index));
      toast.success("Project deleted");
    } catch (error) {
      console.error("Error deleting project details:", error);
      toast.error("Failed to delete details");
    }
  };

  const handleEdit = (index) => {
    const project = personalProjects[index];
    setIsEditing(true);
    setTitle(project.title);
    setDescription(project.description);
    setLink(project.link);
    setEditIndex(index);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
          <FaLaptopCode className="text-[var(--primary-color)] text-xl" />
          Personal Projects <span className="text-xs font-normal text-[var(--text-light)]">(Optional)</span>
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
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. E-commerce Website"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your project (100 words max)..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white resize-none"
              rows="4"
              required
            />
            <div className="text-right text-xs text-[var(--text-light)] mt-1.5 font-medium">
              {description.trim().split(" ").filter(Boolean).length}/100 words
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">GitHub Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            />
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
              onClick={() => setIsEditing(false)}
              className="bg-gray-100 text-[var(--text-color)] px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* List Section */
        <div className="space-y-4 mt-2">
          {personalProjects.length > 0 ? (
            personalProjects.map((project, index) => (
              <div key={index} className="bg-[var(--bg-light-color)] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-[var(--text-color)]">{project.title}</h3>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(index)} className="text-[var(--icon-color)] hover:text-[var(--primary-color)] transition-colors p-1">
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-[var(--text-light)] space-y-2">
                  <p className="pt-1">{project.description}</p>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--primary-color)] hover:text-[var(--button-hover-color)] font-semibold text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[var(--primary-color)] transition-colors mt-2"
                  >
                    <FaExternalLinkAlt className="text-[10px]" /> View Project
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-[var(--bg-light-color)] rounded-xl border border-dashed border-gray-200">
              <p className="text-[var(--text-light)] font-medium text-sm">No personal projects added yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalProjects;