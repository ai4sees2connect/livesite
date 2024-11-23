import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
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


    if (!validateDescription(description)) {
      toast.error("Description should be 100 words or less");
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
    <div className="container mx-auto p-4 border shadow-lg mt-[68px] w-full lg:w-[80%]">
      <h2 className="text-xl font-semibold flex justify-between font-outfit">
        Personal Projects(Optional)
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            className="border p-2 mb-2 w-full"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (100 words max)"
            className="border p-2 mb-2 w-full"
            rows="4"
            required
          />

          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="GitHub Link"
            className="border p-2 mb-2 w-full"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center mt-10">
          {personalProjects.length > 0 ? (
            personalProjects.map((project, index) => (
              <div key={index} className="border p-5 mb-2 min-w-full">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <div className="space-x-6 flex p-1">
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
                    <p>Description: {project.description}</p>
                    <p>
                      Link:{" "}
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                        
                      >
                        {project.link}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No personal projects added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalProjects;
