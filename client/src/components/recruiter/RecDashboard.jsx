import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Spinner from "../common/Spinner"; // Assuming you have a spinner component
import getUserIdFromToken from "./auth/authUtilsRecr"; // Utility to get user ID from token
import api from "../common/server_url"; // Your server URL
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardList,
  FaTimes,
  FaClock,
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
} from "react-icons/fa";
import TimeAgo from "../common/TimeAgo";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecruiter } from "./context/recruiterContext";

const RecDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recruiterId = getUserIdFromToken();
  const [selectedInternship, setSelectedInternship] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const { refreshData } = useRecruiter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const itemsPerPage = 10;
  const scrollRef = useRef();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    refreshData();
  }, [token]);

  const constructQueryStringPageUpdation = (page,name) => {
    let query = `page=${page}`;
    if(name) query+=`&searchName=${name}`;
    return query;
  };


  const fetchInternships = async (pageNo,name) => {
    try {
      setLoading(true);
      const queryString = constructQueryStringPageUpdation(pageNo,name);
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
    fetchInternships(currentPage,searchName);
  }, [recruiterId,currentPage]);

  const openModal = (internship) => {
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  const handleSearchName=()=>{
    if(searchName){
      fetchInternships(1,searchName);
    }
  }

  const handleClearSearch=()=>{
    setSearchName("");
    fetchInternships(1,"");
  }

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
      handleScroll()
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
    scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

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

  // Calculate internships to display based on current page
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const paginatedInternships = internships.slice(
  //   startIndex,
  //   startIndex + itemsPerPage
  // );

  // // const totalPages = Math.ceil(internships.length / itemsPerPage);
  // console.log("these are internships:", paginatedInternships);

  // const filteredInternships = paginatedInternships
  //   .filter((internship) =>
  //     internship.internshipName.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (internships.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-xl font-semibold text-gray-500">
          No internships found.
        </p>
        <Link
          to={`/recruiter/posting/${recruiterId}`}
          className="px-2 py-1 bg-blue-500 text-white rounded-md"
        >
          Post internship
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-3 lg:px-5 mt-10 bg-gray-100 min-h-screen">
      <h1 className="text-xl lg:text-3xl font-bold text-center mb-8">
        My Posted Internships
      </h1>
      <div className="relative">
        <FaSearch className="absolute left-4 top-[13px]" />
        <div className="mb-4 lg:w-[30%] flex space-x-4">
          <input
            type="text"
            placeholder="Search by internship name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full p-2 border pl-10 border-gray-300 rounded-lg text-sm lg:text-base"
          />
          <button onClick={handleSearchName} className="text-white bg-blue-400 rounded-md px-3 ">Search</button>
          <button onClick={handleClearSearch} className="text-white bg-red-400 rounded-md px-3">Clear</button>
        </div>
      </div>
      <div className="bg-white w-full shadow-md rounded-lg p-2 lg:p-6 my-3 sm:mx-auto">
        <div className="grid grid-cols-5 font-semibold mb-2 border-b-2 pb-2 text-center">
          <div className="text-xs -ml-3 lg:text-base lg:w-[190px] lg:ml-10">
            Post
          </div>
          <div className="text-xs ml-3 lg:text-base lg:w-[90px] lg:ml-28">
            Status
          </div>
          <div className="text-xs ml-3 lg:text-base lg:w-[90px] lg:ml-20">
            Total Views
          </div>
          <div className="text-xs ml-4 lg:text-base lg:w-[90px] lg:ml-16 md:mr-3">
            View Applicants
          </div>
          <div className="text-xs ml-6 lg:text-base lg:w-[90px] lg:ml-[93px] md:mr-4">
            View Details
          </div>
        </div>

        <div ref={scrollRef} className="overflow-y-auto h-screen scrollbar-thin">
          {internships.map((internship) => (
            <div
              key={internship._id}
              className="grid grid-cols-5 gap-2 py-2 border-b-2"
            >
              <div className="text-xs text-left ml-1 my-3 w-[80%] sm:text-center sm:text-sm sm:ml-4 lg:text-base lg:ml-10 lg:w-[190px]">
                {internship.internshipName}
              </div>

              <div className="relative inline-flex justify-center h-8 my-auto w-[80%] lg:w-[90px] ml-4 sm:ml-5 md:ml-6 lg:ml-28 group">
                <div className="flex items-center text-xs sm:text-base">
                  <span
                    className={`${internship.status === "On Hold" && "bg-orange-300"
                      } ${internship.status === "Fulfilled" && "bg-green-400"
                      } bg-gray-200 rounded-lg px-2 py-1`}
                  >
                    {internship.status}
                  </span>
                </div>
                <div className="absolute top-[90%] left-0 mt-1 text-sm lg:text-base hidden w-20 lg:w-32 bg-white border rounded shadow-md group-hover:block z-10">
                  <ul className="text-gray-700">
                    <li
                      className="px-3 py-1 lg:px-4 lg:py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => updateStatus("Active", internship._id)}
                    >
                      Active
                    </li>
                    <li
                      className="px-3 py-1 lg:px-4 lg:py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => updateStatus("On Hold", internship._id)}
                    >
                      On Hold
                    </li>
                    <li
                      className="px-3 py-1 lg:px-4 lg:py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => updateStatus("Fulfilled", internship._id)}
                    >
                      Fulfilled
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-[80%] text-xs sm:text-base lg:w-[80px] mx-auto text-center h-6 my-auto ml-3 lg:ml-20">
                {internship.views}
              </div>
              <Link
                to={`/recruiter/dashboard/${recruiterId}/applicants/${internship._id}/page-1`}
                className=" md:mx-auto text-xs px-1 sm:text-base mx-auto  sm:ml-5 lg:ml-4 text-center my-auto rounded-xl bg-blue-400 text-white w-20 sm:w-24 lg:w-[190px] hover:bg-blue-700 hover:cursor-pointer py-1"
              >
                Applications ({internship.applicantCount})
              </Link>
              <div className="text-center text-xs sm:text-base mx-auto sm:ml-14 md:ml-16  lg:w-32 my-auto">
                <button
                  onClick={() => openModal(internship)}
                  className="text-blue-500 hover:underline"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {internships.length > 0 && (
          <div className="flex justify-center my-4 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
            >
              <FaAngleLeft />
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
                }`}
            >
              <FaAngleRight />
            </button>
          </div>
        )}

        {selectedInternship && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40  "
              onClick={closeModal}
            ></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white border-2 border-gray-600 rounded-lg shadow-3xl w-full lg:w-[60%] h-[90%] p-6 relative overflow-auto mx-1 lg:mx-0">
                <h2 className="text-2xl font-semibold mb-4">
                  {selectedInternship.internshipName}
                </h2>
                <button
                  onClick={closeModal}
                  className="absolute top-7 right-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <FaTimes />
                </button>
                {/* <p className="text-gray-600 mb-4">Posted by: {selectedInternship.recruiter.firstname} {selectedInternship.recruiter.lastname}</p> */}
                <p className="text-gray-600 mb-4">
                  Posted: {TimeAgo(selectedInternship.createdAt)}
                </p>

                <div className="flex items-center text-gray-700 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>
                    {selectedInternship.internLocation.city
                      ? `${selectedInternship.internLocation.country + ", " + selectedInternship.internLocation.state + ", " + selectedInternship.internLocation.city}`
                      : "Remote"}
                  </span>
                </div>

                <div className="flex items-center text-gray-700 mb-2">
                  <FaMoneyBillWave className="mr-2" />
                  <span>₹ {selectedInternship.stipend}</span>
                </div>
                <div className="flex items-center text-gray-700 mb-2">
                  <FaClock className="mr-2" />
                  <span>{selectedInternship.duration} Months</span>
                </div>

                <div className="flex items-center text-gray-700 mb-2">
                  <FaUsers className="mr-2" />
                  <span>{selectedInternship.numberOfOpenings} Openings</span>
                </div>

                {selectedInternship.internLocation && (
                  <div className="flex items-center text-gray-700 mb-4">
                    <FaClipboardList className="mr-2" />
                    <span>{selectedInternship.internshipType}</span>
                  </div>
                )}

                <h3 className="text-lg font-medium mb-2">Skills Required:</h3>
                <div className="flex flex-wrap mb-4">
                  {selectedInternship.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-medium mb-2">Description:</h3>
                <div
                  className="text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: selectedInternship.description,
                  }}
                ></div>

                <h3 className="text-lg font-medium mb-2">Perks</h3>
                <div className="flex flex-wrap mb-4">
                  {selectedInternship.perks.map((perk, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                    >
                      {perk}
                    </span>
                  ))}
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
