import React, { useState, useEffect } from "react";
import { FaPlus, FaPen, FaTrash, FaTools } from "react-icons/fa";
import getUserIdFromToken from "./auth/authUtils";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../common/server_url";
import Select from "react-select";

const Skills = ({ skillSet, error, clearError, updateError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [skills, setSkills] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const userId = getUserIdFromToken();

  // Custom styles for React-Select
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#e5e7eb",
      boxShadow: "none",
      "&:hover": { borderColor: "var(--primary-color)" },
      borderRadius: "0.5rem",
      minHeight: "42px",
      fontSize: "0.875rem",
      backgroundColor: "white"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "var(--primary-color)" : state.isFocused ? "var(--icon-bg-color)" : "white",
      color: state.isSelected ? "white" : "var(--text-color)",
    }),
    singleValue: (base) => ({ ...base, color: "var(--text-color)" }),
    placeholder: (base) => ({ ...base, color: "var(--text-light)" })
  };

  const getProficiencyStyle = (prof) => {
    switch (prof) {
      case "Expert": return "bg-green-100 text-green-700 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Beginner": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${api}/student/profile/${userId}/skills`
        );
        if (!response.data) {
          toast.error("Sorry, no skills found");
          return;
        }
        setSkills(response.data);
        setIsEditing(false);
        setIsClicked(false);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, [userId, isClicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkills.value || !proficiency) {
      toast.error("Please enter all fields");
      return;
    }

    const skillData = {
      skillName: selectedSkills.value,
      proficiency,
    };

    try {
      if (editIndex !== null) {
        const response = await axios.put(
          `${api}/student/profile/${userId}/skills/${editIndex}`,
          skillData
        );
        const updatedSkills = [...skills];
        updatedSkills[editIndex] = response.data;
        setSkills(updatedSkills);
        setIsEditing(false);
        toast.success("Skill updated");
        clearError();
      } else {
        const response = await axios.post(
          `${api}/student/profile/${userId}/skills`,
          skillData
        );
        setSkills([...skills, response.data.skills]);
        toast.success("Skill added");
        clearError();
      }

      setSkillName("");
      setProficiency("");
      setEditIndex(null);
      setIsEditing(false);
      setIsClicked(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Skill already exists");
      } else {
        toast.error("An error occurred while adding the skill");
      }
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${api}/student/profile/${userId}/skills/${index}`);
      setSkills(skills.filter((_, i) => i !== index));
      const list = skills.filter((_, i) => i !== index);
      if (list.length === 0) {
        updateError("skills", "* Please add atleast one skill");
      }
      toast.success("Skill deleted");
    } catch (error) {
      console.error("Error deleting skill details:", error);
      toast.error("Failed to delete details");
    }
  };

  const handleEdit = (index) => {
    const skill = skills[index];
    setIsEditing(true);
    setSkillName(skill.skillName);
    setProficiency(skill.proficiency);
    setEditIndex(index);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
          <FaTools className="text-[var(--primary-color)] text-xl" />
          Skills <span className="text-red-500">*</span>
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
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Select Skill</label>
            <Select
              value={selectedSkills}
              onChange={(values) => setSelectedSkills(values)}
              options={skillSet}
              placeholder="Select or type skills"
              className="w-full"
              styles={customSelectStyles}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Proficiency Level</label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            >
              <option value="">Select Proficiency</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <div key={index} className="bg-[var(--bg-light-color)] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-[var(--text-color)]">{skill.skillName}</h3>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(index)} className="text-[var(--icon-color)] hover:text-[var(--primary-color)] transition-colors p-1">
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getProficiencyStyle(skill.proficiency)}`}>
                  {skill.proficiency}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-[var(--bg-light-color)] rounded-xl border border-dashed border-gray-200">
              <p className="text-red-500 font-semibold text-sm">{error || "No skills added yet."}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Skills;