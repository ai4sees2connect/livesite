import React, { useState, useEffect } from "react";
import { FaPlus, FaPen, FaTrash, FaLink, FaGithub, FaLinkedin } from "react-icons/fa";
import getUserIdFromToken from "./auth/authUtils";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../common/server_url";

const Portfolio = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [linkType, setLinkType] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [urlError, setUrlError] = useState("");

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchPortfolioLinks = async () => {
      try {
        const response = await axios.get(
          `${api}/student/profile/${userId}/portfolioLinks`
        );
        if (!response.data) {
          toast.error("Sorry, no portfolio links found");
          return;
        }
        setPortfolioLinks(response.data);
        setIsEditing(false);
        setIsClicked(false);
      } catch (error) {
        console.error("Error fetching portfolio links:", error);
      }
    };
    fetchPortfolioLinks();
  }, [userId, isClicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate URL based on selected link type without popup
    if (linkType === "GitHub" && !linkUrl.startsWith("https://github.com/")) {
      setUrlError("Please enter a valid GitHub URL.");
      return;
    }
    if (
      linkType === "LinkedIn" &&
      !linkUrl.startsWith("https://www.linkedin.com/")
    ) {
      setUrlError("Please enter a valid LinkedIn URL.");
      return;
    }
    setUrlError(""); // Clear error if URL is valid

    const portfolioData = {
      linkType,
      linkUrl,
    };

    try {
      if (editIndex !== null) {
        const response = await axios.put(
          `${api}/student/profile/${userId}/portfolioLinks/${editIndex}`,
          portfolioData
        );
        const updatedPortfolioLinks = [...portfolioLinks];
        updatedPortfolioLinks[editIndex] = response.data;
        setPortfolioLinks(updatedPortfolioLinks);
        setIsEditing(false);
        toast.success("Portfolio link updated");
      } else {
        const response = await axios.post(
          `${api}/student/profile/${userId}/portfolioLinks`,
          portfolioData
        );
        setPortfolioLinks([...portfolioLinks, response.data.portfolioLink]);
        toast.success("Portfolio link added");
      }

      setLinkType("");
      setLinkUrl("");
      setEditIndex(null);
      setIsEditing(false);
      setIsClicked(true);
    } catch (error) {
      console.error("Error saving the portfolio link:", error);
      toast.error("Failed to update details");
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `${api}/student/profile/${userId}/portfolioLinks/${index}`
      );
      setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index));
      toast.success("Portfolio link deleted");
    } catch (error) {
      console.error("Error deleting portfolio link:", error);
      toast.error("Failed to delete details");
    }
  };

  const handleEdit = (index) => {
    const portfolioLink = portfolioLinks[index];
    setIsEditing(true);
    setLinkType(portfolioLink.linkType);
    setLinkUrl(portfolioLink.linkUrl);
    setEditIndex(index);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
          <FaLink className="text-[var(--primary-color)] text-xl" />
          Portfolio <span className="text-xs font-normal text-[var(--text-light)]">(Optional)</span>
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
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Link Type</label>
            <select
              value={linkType}
              onChange={(e) => setLinkType(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            >
              <option value="">Select Link Type</option>
              <option value="GitHub">GitHub</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Link URL</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => { setLinkUrl(e.target.value); setUrlError(""); }}
              placeholder="https://..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              required
            />
            {urlError && <p className="text-red-500 text-xs mt-1.5 font-medium">{urlError}</p>}
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
          {portfolioLinks.length > 0 ? (
            portfolioLinks.map((portfolioLink, index) => (
              <div key={index} className="bg-[var(--bg-light-color)] border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {portfolioLink.linkType === "GitHub" ? (
                      <FaGithub className="text-2xl text-gray-800" />
                    ) : (
                      <FaLinkedin className="text-2xl text-blue-600" />
                    )}
                    <h3 className="text-base font-bold text-[var(--text-color)]">{portfolioLink.linkType}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(index)} className="text-[var(--icon-color)] hover:text-[var(--primary-color)] transition-colors p-1">
                      <FaPen className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <a
                  href={portfolioLink.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--primary-color)] hover:text-[var(--button-hover-color)] font-semibold text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[var(--primary-color)] transition-colors break-all"
                >
                  {portfolioLink.linkUrl}
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-[var(--bg-light-color)] rounded-xl border border-dashed border-gray-200">
              <p className="text-[var(--text-light)] font-medium text-sm">No portfolio links added yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;