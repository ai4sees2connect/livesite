import React, { useEffect, useState } from "react";
import axios from "axios";
import getUserIdFromToken from "./auth/authUtils";
import Spinner from "../common/Spinner";
import api from "../common/server_url";
import TimeAgo from "../common/TimeAgo";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardList,
  FaTimes,
  FaClock,
  FaCheck,
  FaBuilding,
  FaArrowLeft,
  FaUserFriends,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";

const MyApplications = () => {
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getUserIdFromToken();
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    // console.log('insideeeeeeeeeeeee')
    const fetchAppliedInternships = async () => {
      try {
        const response = await axios.get(
          `${api}/student/internship/${userId}/applied-internships`
        );
        const sortedInternships = response.data.sort(
          (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
        );

        // const updatedAppliedInternships = response.data.map(application => ({
        //   internship: application.internship,
        //   recruiter: application.recruiter,
        //   appliedAt: application.appliedAt,
        // }));
        // console.log('inside applicants',updatedAppliedInternships);
        setAppliedInternships(sortedInternships);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applied internships:", err);
        setError(
          "Failed to fetch applied internships. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchAppliedInternships();
  }, [userId]);

  const closeModal = () => {
    setSelectedInternship(null);
    // setIsInterestedModalOpen(false);
  };

  if (loading) {
    return <Spinner />;
  }

  if (appliedInternships.length == 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-lg text-gray-600 tracking-wider">
          You have not applied to any internship..
        </h1>
        <Link
          to={`/student/internships/${userId}`}
          className="border-2 border-blue-500 rounded-lg px-3 py-1 text-blue-500 font-semibold "
        >
          Browse Internships
        </Link>
      </div>
    );
  }

  if (error) {
    return <p className="text-xl font-semibold text-red-500">{error}</p>;
  }

  return (
    <div className="py-10 px-5 mt-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">My Applications</h1>

      {/* Bapi Used Table */}
      <div className=" hidden lg:block">
        <table className="min-w-full table-auto border-collapse border-spacing-2">
          <thead>
            <tr className="bg-gray-200 text-center font-semibold border-b">
              <th className="px-4 py-2 w-[170px]">COMPANY</th>
              <th className="px-4 py-2 w-[200px]">PROFILE</th>
              <th className="px-4 py-2 w-[100px]">APPLIED</th>
              <th className="px-4 py-2 w-[130px]">NUMBER OF APPLICANTS</th>
              <th className="px-4 py-2 w-[100px]">STATUS</th>
              <th className="px-4 py-2 w-[100px]">VIEW DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {appliedInternships.map((applied) => (
              <tr
                key={applied._id}
                className="text-center text-gray-600 lg:border-b-2"
              >
                <td className="px-4 py-2 w-[170px]">
                  {applied.recruiter.companyName !== ""
                    ? applied.recruiter.companyName
                    : applied.recruiter.firstname +
                    " " +
                    applied.recruiter.lastname}
                </td>
                <td className="px-4 py-2 w-[200px]">
                  {applied.internship.internshipName}
                </td>
                <td className="px-4 py-2 w-[100px]">
                  {TimeAgo(applied.appliedAt)}
                </td>
                <td className="px-4 py-2 w-[130px]">{applied.studentCount}</td>
                <td className="px-4 py-2 w-[100px]">
                  <span
                    className={`rounded-xl py-1 px-2 ${applied.internshipStatus.status === "Viewed" &&
                      "text-yellow-400"
                      } 
            ${applied.internshipStatus.status === "Rejected" && "text-red-500"} 
            ${applied.internshipStatus.status === "Shortlisted" &&
                      "text-green-600"
                      }`}
                  >
                    {applied.internshipStatus.status}
                  </span>
                </td>
                <td className="px-4 py-2 w-[100px]">
                  <button
                    onClick={() => setSelectedInternship(applied)}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden">
        {appliedInternships.map((applied) => (
          <div
            key={applied._id}
            className="border-2 shadow-lg py-4 px-4 space-y-1 md:space-y-2 w-full md:w-[83%] mx-auto "
          >
            <div>
              <div className="md:flex md:justify-between md:items-center">
                <div className="font-bold text-xl capitalize">
                  {applied.recruiter.companyName}
                </div>
                <div className="">
                  <button
                    onClick={() => setSelectedInternship(applied)}
                    className="text-blue-400 hover:underline"
                  >
                    View details
                  </button>
                </div>
              </div>
              <div className="text-gray-600">
                {applied.internship.internshipName}
              </div>
              <div className="text-gray-600">
                Applied: {TimeAgo(applied.appliedAt)}
              </div>
              <div className="flex  items-center text-gray-600">
                <span className="font-semibold">
                  <FaUserFriends className="mr-2" />
                </span>{" "}
                {applied.studentCount} Applicants
              </div>
              <div>
                <span
                  className={` py-1 flex items-center ${applied.internshipStatus.status === "Viewed" &&
                    "text-yellow-500"
                    } ${applied.internshipStatus.status === "Rejected" &&
                    "text-red-500"
                    } ${applied.internshipStatus.status === "Shortlisted" &&
                    "text-green-600"
                    }`}
                >
                  {applied.internshipStatus.status === "Viewed" && (
                    <FaEye className=" mr-2" />
                  )}{" "}
                  {applied.internshipStatus.status === "Shortlisted" && (
                    <FaCheckCircle className="mr-2" />
                  )}{" "}
                  {applied.internshipStatus.status === "Rejected" && (
                    <FaTimes className="mr-2" />
                  )}
                  {applied.internshipStatus.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedInternship && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40  "
            onClick={closeModal}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border-2 border-gray-600 rounded-lg shadow-3xl w-[90%] lg:w-[60%] h-[90%] p-6 relative overflow-auto">
              <div className="border-b">
                <h2 className=" text-lg md:text-2xl font-semibold md:mb-4">
                  {selectedInternship.internship.internshipName}
                </h2>
                <button
                  onClick={closeModal}
                  className="absolute top-7 right-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <FaTimes />
                </button>
                <p className="text-gray-600 mb-4">
                  {selectedInternship.recruiter.companyName}
                </p>
              </div>

              <div className="flex items-center text-gray-700 mb-2">
                <FaMapMarkerAlt className="mr-2" />
                <span>
                  {selectedInternship.internship.internLocation
                    ? `${selectedInternship.internship.internLocation}`
                    : "Remote"}
                </span>
              </div>

              <div className="flex items-center text-gray-700 mb-2">
                <FaMoneyBillWave className="mr-2" />
                <span>₹ {selectedInternship.internship.stipend}</span>
              </div>
              <div className="flex items-center text-gray-700 mb-2">
                <FaClock className="mr-2" />
                <span>{selectedInternship.internship.duration} Months</span>
              </div>

              <div className="flex items-center text-gray-700 mb-2">
                <FaUsers className="mr-2" />
                <span>
                  {selectedInternship.internship.numberOfOpenings} Openings
                </span>
              </div>

              {selectedInternship.internship.internLocation && (
                <div className="flex items-center text-gray-700 mb-4">
                  <FaClipboardList className="mr-2" />
                  <span>{selectedInternship.internship.internshipType}</span>
                </div>
              )}

              <h3 className="lg:text-lg font-medium mb-2">Skills Required:</h3>
              <div className="flex flex-wrap mb-4">
                {selectedInternship.internship.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="lg:text-lg font-medium mb-2">Description:</h3>
              <div
                className="text-gray-700 mb-4 text-sm md:text-base"
                dangerouslySetInnerHTML={{
                  __html: selectedInternship.internship.description,
                }}
              ></div>

              <h3 className="md:text-lg font-medium mb-2">
                Perks and Benefits
              </h3>
              <div className="flex flex-wrap mb-4">
                {selectedInternship.internship.perks.map((perk, index) => (
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
  );
};

export default MyApplications;
