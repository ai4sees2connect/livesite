import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../common/Spinner";
import getUserIdFromToken from "./auth/authUtilsRecr";
import api from "../common/server_url";
import { FaMapMarkerAlt, FaMoneyBillWave, FaUsers, FaClipboardList, FaTimes, FaClock } from "react-icons/fa";
import TimeAgo from "../common/TimeAgo";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recruiterId = getUserIdFromToken();
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get(
          `${api}/recruiter/internship/${recruiterId}/getInternships`
        );
        const sortedInternships = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const internshipsWithApplicants = await Promise.all(
          sortedInternships.map(async (internship) => {
            const applicantsResponse = await axios.get(
              `${api}/recruiter/internship/${recruiterId}/applicants/${internship._id}`
            );
            return {
              ...internship,
              applicantCount: applicantsResponse.data.length,
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

    fetchInternships();
  }, [recruiterId]);

  // Get current internships to display on the current page
  const indexOfLastInternship = currentPage * itemsPerPage;
  const indexOfFirstInternship = indexOfLastInternship - itemsPerPage;
  const currentInternships = internships.slice(indexOfFirstInternship, indexOfLastInternship);

  // Pagination controls
  const totalPages = Math.ceil(internships.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (internship) => {
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    setSelectedInternship(null);
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

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-3 lg:px-5 mt-10 bg-gray-100 min-h-screen">
      <h1 className=" text-xl lg:text-3xl font-bold text-center mb-8">
        My Posted Internships
      </h1>
      <div className="bg-white w-full shadow-md rounded-lg p-2 lg:p-6 my-3 sm:mx-auto">
        <div className="grid grid-cols-5 font-semibold mb-2 border-b-2 pb-2 text-center">
          <div className="text-xs -ml-3 lg:text-base lg:w-[190px] lg:ml-10">Post</div>
          <div className="text-xs ml-3 lg:text-base lg:w-[90px] lg:ml-28">Status</div>
          <div className="text-xs ml-3 lg:text-base lg:w-[90px] lg:ml-20">Total Views</div>
          <div className="text-xs ml-3 lg:text-base lg:w-[90px] lg:ml-16">View Applicants</div>
          <div className="text-xs ml-6 lg:text-base lg:w-[90px] lg:ml-20 pr-2">View Details</div>
        </div>

        {currentInternships.map((internship) => (
          <div key={internship._id} className="grid grid-cols-5 gap-2 py-2 border-b-2">
            <div className="text-xs text-left ml-0 my-3 w-[80%] sm:text-center sm:text-sm sm:ml-2 lg:text-base lg:ml-10 lg:w-[190px]">
              {internship.internshipName}
            </div>
            <div className="relative inline-flex justify-center h-8 my-auto w-[80%] lg:w-[90px] ml-3 lg:ml-28 group">
              <div className="flex items-center text-xs sm:text-base">
                <span className={`${internship.status === "On Hold" && "bg-orange-300"} ${internship.status === "Fulfilled" && "bg-green-400"} bg-gray-200 rounded-lg px-2 py-1`}>
                  {internship.status}
                </span>
              </div>
            </div>
            <div className="w-[80%] text-xs sm:text-base lg:w-[80px] mx-auto text-center h-6 my-auto ml-3 lg:ml-20">
              {internship.views}
            </div>
            <Link to={`/recruiter/dashboard/${recruiterId}/applicants/${internship._id}`} className="sm:ml-3 md:mx-auto text-xs px-1 sm:text-base lg:ml-4 text-center my-auto rounded-xl bg-blue-400 text-white w-24 lg:w-[190px] hover:bg-blue-700 hover:cursor-pointer py-1">
              Applications ({internship.applicantCount})
            </Link>
            <div className="text-center text-xs sm:text-base ml-8 sm:ml-12 lg:w-36 mx-auto my-auto">
              <button onClick={() => openModal(internship)} className="text-blue-500 hover:underline">
                View
              </button>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-blue-700 text-white rounded-l-lg disabled:opacity-50"
  >
    {"<"}
  </button>
  <span className="px-4 py-2 bg-white border border-gray-300">
    {currentPage} / {totalPages}
  </span>
  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-blue-700 text-white rounded-r-lg disabled:opacity-50"
  >
    {">"}
  </button>
</div>

      </div>
    </div>
  );
};

export default RecDashboard;
