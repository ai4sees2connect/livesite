import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Spinner from "../common/Spinner";
import getUserIdFromToken from "./auth/authUtilsRecr";
import api from "../common/server_url";
import {
  FaTimes,
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaEye,
  FaPen,
  FaPlayCircle,
  FaPauseCircle,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";
import TimeAgo from "../common/TimeAgo";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecruiter } from "./context/recruiterContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RecDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recruiterId = getUserIdFromToken();
  const [selectedInternship, setSelectedInternship] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const { refreshData, recruiter } = useRecruiter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatedInternship, setUpdatedInternship] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [postsleft, setPostsLeft] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    refreshData();
  }, [token]);

  useEffect(() => {
    if (recruiter) {
      setPostsLeft(recruiter.subscription.postsRemaining);
    }
  }, [recruiter]);

  const constructQueryStringPageUpdation = (page, name) => {
    let query = `page=${page}`;
    if (name) query += `&searchName=${name}`;
    return query;
  };

  const fetchInternships = async (pageNo, name) => {
    try {
      setLoading(true);
      const queryString = constructQueryStringPageUpdation(pageNo, name);
      const response = await axios.get(
        `${api}/recruiter/internship/${recruiterId}/getInternships?${queryString}`
      );

      setTotalPages(response.data.totalPages);

      const internshipsWithApplicants = await Promise.all(
        response.data.internships.map(async (internship) => {
          const applicantsResponse = await axios.get(
            `${api}/recruiter/internship/${recruiterId}/applicants-count/${internship._id}`
          );
          return {
            ...internship,
            applicantCount: applicantsResponse.data,
          };
        })
      );

      setInternships(internshipsWithApplicants);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to fetch internships. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships(currentPage, searchName);
  }, [recruiterId, currentPage]);

  const openModal = (internship) => setSelectedInternship(internship);
  const closeModal = () => setSelectedInternship(null);

  const handleSearchName = () => {
    if (searchName) {
      fetchInternships(1, searchName);
    }
  };

  const handleClearSearch = () => {
    setSearchName("");
    fetchInternships(1, "");
  };

  const updateStatus = async (newStatus, internshipId) => {
    try {
      const response = await axios.put(
        `${api}/recruiter/internship/${internshipId}/change-status`,
        { status: newStatus }
      );
      if (response.status === 200) {
        toast.success("Status updated successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Some error occurred");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      handleScroll();
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    handleScroll();
  };

  const handleScroll = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
    scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditModal = (internship) => {
    setUpdatedInternship(internship);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleUpdateInternship = async () => {
    if (postsleft < 1) {
      toast.error("You have reached your post limit. Please upgrade your subscription to continue");
      return;
    } else {
      try {
        const { internshipName, description, numberOfOpenings, _id } = updatedInternship;
        const response = await axios.put(`${api}/internship/${_id}/update`, {
          internshipName,
          description,
          numberOfOpenings,
          recruiterId,
        });

        toast.success("Internship updated successfully!");
        setShowConfirmation(false);
        closeEditModal();
        window.location.reload();
      } catch (error) {
        console.error("Error updating internship:", error);
        toast.error("Failed to update the internship. Please try again.");
      }
    }
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--bg-light-color)]">
        <p className="text-xl font-semibold text-red-500 bg-red-50 px-6 py-3 rounded-lg border border-red-100">{error}</p>
      </div>
    );
  }

  if (internships.length === 0 && !searchName) {
    return (
      <div className="min-h-screen bg-[var(--bg-light-color)] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-[var(--border-color)] text-center max-w-md">
          <div className="w-16 h-16 bg-[var(--icon-bg-color)] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaClipboardList className="text-2xl text-[var(--primary-color)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-color)] mb-2">No Internships Posted</h2>
          <p className="text-[var(--text-light)] mb-6">You haven't posted any internships yet. Start hiring top talent today!</p>
          <Link to={`/recruiter/posting/${recruiterId}`} className="inline-block px-6 py-3 bg-[var(--button-color)] text-white font-semibold rounded-lg hover:bg-[var(--button-hover-color)] transition-colors shadow-md">
            Post Your First Internship
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--text-color)] my-8">My Posted Internships</h1>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--border-color)] mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="text"
              placeholder="Search by internship name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent text-[var(--text-color)]"
            />
          </div>
          <button onClick={handleSearchName} className="px-6 py-2.5 bg-[var(--button-color)] text-white font-semibold rounded-lg hover:bg-[var(--button-hover-color)] transition-colors shadow-sm">
            Search
          </button>
          <button onClick={handleClearSearch} className="px-6 py-2.5 bg-gray-100 text-[var(--text-color)] font-semibold rounded-lg hover:bg-gray-200 transition-colors">
            Clear
          </button>
        </div>

        {/* Internships Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[var(--bg-light-color)] border-b border-[var(--border-color)] text-xs font-semibold text-[var(--text-light)] uppercase tracking-wider">
            <div className="col-span-4">Internship</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Applicants</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div ref={scrollRef} className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto scrollbar-thin">
            {internships.map((internship) => (
              <div key={internship._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-[var(--icon-bg-color)] transition-colors items-center">
                {/* Internship Name */}
                <div className="md:col-span-4">
                  <h3 className="text-base font-bold text-[var(--text-color)] truncate">{internship.internshipName}</h3>
                  <p className="text-xs text-[var(--text-light)] mt-1">Posted {TimeAgo(internship.createdAt)}</p>
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex md:justify-center">
                  <div className="relative group w-full md:w-auto">
                    <button className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-full md:w-auto justify-center ${
                      internship.status === "Active" ? "bg-green-50 text-green-700 border-green-200" :
                      internship.status === "On Hold" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }`}>
                      {internship.status === "Active" && <FaPlayCircle className="text-[10px]" />}
                      {internship.status === "On Hold" && <FaPauseCircle className="text-[10px]" />}
                      {internship.status === "Fulfilled" && <FaCheckCircle className="text-[10px]" />}
                      {internship.status}
                    </button>
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                      <ul className="py-1">
                        {["Active", "On Hold", "Fulfilled"].map((status) => (
                          <li key={status} onClick={() => updateStatus(status, internship._id)} className="px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--icon-bg-color)] cursor-pointer">
                            {status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Applicants */}
                <div className="md:col-span-2 flex md:justify-center">
                  <Link to={`/recruiter/dashboard/${recruiterId}/applicants/${internship._id}/page-1`} className="px-4 py-1.5 bg-[var(--icon-bg-color)] text-[var(--primary-color)] rounded-full text-xs font-semibold hover:bg-[var(--primary-color)] hover:text-white transition-colors text-center w-full md:w-auto">
                    {internship.applicantCount} Applicants
                  </Link>
                </div>

                {/* Actions */}
                <div className="md:col-span-4 flex md:justify-end gap-3">
                  <button onClick={() => openModal(internship)} className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--border-color)] text-[var(--text-color)] rounded-lg text-sm font-medium hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors">
                    <FaEye className="text-xs" /> View
                  </button>
                  <button onClick={() => openEditModal(internship)} className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--border-color)] text-[var(--text-color)] rounded-lg text-sm font-medium hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors">
                    <FaPen className="text-xs" /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {internships.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`p-3 rounded-lg transition-colors ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[var(--button-color)] text-white hover:bg-[var(--button-hover-color)]"}`}>
              <FaAngleLeft />
            </button>
            <span className="text-[var(--text-color)] font-medium">Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`p-3 rounded-lg transition-colors ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[var(--button-color)] text-white hover:bg-[var(--button-hover-color)]"}`}>
              <FaAngleRight />
            </button>
          </div>
        )}

        {/* View Details Modal */}
        {selectedInternship && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={closeModal}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
                <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 mr-4">
                      <h2 className="text-2xl font-bold text-[var(--text-color)] leading-tight">{selectedInternship.internshipName}</h2>
                      <p className="text-[var(--text-light)] text-sm mt-1">Posted {TimeAgo(selectedInternship.createdAt)}</p>
                    </div>
                    <button onClick={closeModal} className="text-[var(--text-light)] hover:text-[var(--text-color)] transition-colors p-2 rounded-full hover:bg-gray-100 flex-shrink-0">
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-100 bg-[var(--bg-light-color)]">
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-50">
                    <p className="text-xs text-[var(--text-light)] mb-1 uppercase font-semibold">Location</p>
                    <p className="text-sm font-bold text-[var(--text-color)] truncate">{selectedInternship.internLocation.city ? selectedInternship.internLocation.city : "Remote"}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-50">
                    <p className="text-xs text-[var(--text-light)] mb-1 uppercase font-semibold">Stipend</p>
                    <p className="text-sm font-bold text-[var(--text-color)]">{selectedInternship.stipend ? `${selectedInternship.currency} ${selectedInternship.stipend}` : "Unpaid"}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-50">
                    <p className="text-xs text-[var(--text-light)] mb-1 uppercase font-semibold">Duration</p>
                    <p className="text-sm font-bold text-[var(--text-color)]">{selectedInternship.duration} Mo.</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-50">
                    <p className="text-xs text-[var(--text-light)] mb-1 uppercase font-semibold">Openings</p>
                    <p className="text-sm font-bold text-[var(--text-color)]">{selectedInternship.numberOfOpenings}</p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-2 text-sm">
                    <FaClipboardList className="text-[var(--primary-color)]" />
                    <span className="font-medium text-[var(--text-color)]">{selectedInternship.internshipType}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-color)] uppercase tracking-wide mb-3">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInternship.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-[var(--icon-bg-color)] text-[var(--primary-color)] text-xs font-semibold rounded-full">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-color)] uppercase tracking-wide mb-3">Description</h3>
                    <div className="text-sm text-[var(--text-light)] leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedInternship.description }}></div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-color)] uppercase tracking-wide mb-3">Perks & Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInternship.perks.map((perk, index) => (
                        <span key={index} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">{perk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={closeEditModal}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
                <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">Edit Internship</h2>
                    <button onClick={closeEditModal} className="text-[var(--text-light)] hover:text-[var(--text-color)] p-2 rounded-full hover:bg-gray-100">
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Internship Name</label>
                    <input type="text" value={updatedInternship?.internshipName || ""} onChange={(e) => setUpdatedInternship((prev) => ({ ...prev, internshipName: e.target.value }))} className="w-full p-2.5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-color)] bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Number of Openings</label>
                    <input type="number" value={updatedInternship?.numberOfOpenings || ""} onChange={(e) => setUpdatedInternship((prev) => ({ ...prev, numberOfOpenings: e.target.value }))} className="w-full p-2.5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-color)] bg-white" min={1} max={100} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Intern's Responsibilities</label>
                    <div className="border border-[var(--border-color)] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[var(--primary-color)]">
                      <ReactQuill value={updatedInternship?.description} onChange={(val) => setUpdatedInternship((prev) => ({ ...prev, description: val }))} theme="snow" placeholder="Enter the requirements...." className="h-[200px]" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="button" onClick={() => setShowConfirmation(true)} className="px-6 py-2.5 bg-[var(--button-color)] text-white font-semibold rounded-lg hover:bg-[var(--button-hover-color)] transition-colors shadow-sm">
                      Update Internship
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setShowConfirmation(false)}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-[var(--text-color)] mb-2">Confirm Update</h2>
                <p className="text-[var(--text-light)] mb-6">Your available postings will be deducted by 1. Do you wish to update this internship?</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowConfirmation(false)} className="px-5 py-2.5 bg-gray-100 text-[var(--text-color)] font-semibold rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                  <button onClick={handleUpdateInternship} className="px-5 py-2.5 bg-[var(--button-color)] text-white font-semibold rounded-lg hover:bg-[var(--button-hover-color)] transition-colors shadow-sm">Yes, Update</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecDashboard;