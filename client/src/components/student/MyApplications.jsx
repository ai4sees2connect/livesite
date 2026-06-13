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
    const fetchAppliedInternships = async () => {
      try {
        const response = await axios.get(
          `${api}/student/internship/${userId}/applied-internships`
        );
        const sortedInternships = response.data.sort(
          (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
        );

        setAppliedInternships(sortedInternships);
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
  };

  if (loading) {
    return <Spinner />;
  }

  if (appliedInternships.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-[var(--bg-light-color)]">
        <h1 className="text-lg text-[var(--text-light)] tracking-wider text-center px-4">
          You have not applied to any internship..
        </h1>
        <Link
          to={`/student/internships/${userId}`}
          className="border-2 border-[var(--primary-color)] rounded-lg px-4 py-2 text-[var(--primary-color)] font-semibold hover:bg-[var(--primary-color)] hover:text-white transition-colors"
        >
          Browse Internships
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-xl font-semibold text-red-500 text-center mt-20">
        {error}
      </p>
    );
  }

  return (
    <div className="py-10 px-5 mt-10 bg-[var(--bg-light-color)] min-h-screen">
      <h1 className="text-3xl font-bold text-left my-8 text-[var(--text-color)]">
        My Applications
      </h1>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-white text-left font-semibold border-b border-gray-200">
              <th className="px-4 py-3 w-[170px] text-[var(--text-color)] text-bold">COMPANY</th>
              <th className="px-4 py-3 w-[200px] text-[var(--text-color)] text-bold">PROFILE</th>
              <th className="px-4 py-3 w-[100px] text-[var(--text-color)] text-bold">APPLIED</th>
              <th className="px-4 py-3 w-[130px] text-[var(--text-color)] text-bold">APPLICANTS</th>
              <th className="px-4 py-3 w-[100px] text-[var(--text-color)] text-bold">STATUS</th>
              <th className="px-4 py-3 w-[100px] text-[var(--text-color)] text-bold">VIEW DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {appliedInternships.map((applied) => (
              <tr
                key={applied._id}
                className="text-left text-[var(--text-light)] border-b border-gray-100 hover:bg-[var(--icon-bg-color)] transition-colors"
              >
                <td className="px-4 py-3 w-[170px] font-medium text-[var(--text-color)]">
                  {applied.recruiter.companyName !== ""
                    ? applied.recruiter.companyName
                    : applied.recruiter.firstname + " " + applied.recruiter.lastname}
                </td>
                <td className="px-4 py-3 w-[200px]">
                  {applied.internship.internshipName}
                </td>
                <td className="px-4 py-3 w-[100px]">
                  {TimeAgo(applied.appliedAt)}
                </td>
                <td className="px-4 py-3 w-[130px]">{applied.studentCount}</td>
                <td className="px-4 py-3 w-[100px]">
                  <span
                    className={`inline-block rounded-xl py-1 px-3 font-semibold text-sm ${
                      applied.internshipStatus.status === "Applied"
                        ? "bg-yellow-100 text-yellow-700"
                        : applied.internshipStatus.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : applied.internshipStatus.status === "Hired"
                        ? "bg-green-100 text-green-700"
                        : applied.internshipStatus.status === "Shortlisted"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {applied.internshipStatus.status}
                  </span>
                </td>
                <td className="px-4 py-3 w-[100px]">
                  <button
                    onClick={() => setSelectedInternship(applied)}
                    className="text-[var(--primary-color)] hover:text-[var(--button-hover-color)] font-semibold hover:underline transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {appliedInternships.map((applied) => (
          <div
            key={applied._id}
            className="bg-white border border-gray-200 shadow-sm rounded-xl py-4 px-4 space-y-2 w-full mx-auto hover:shadow-md transition-shadow"
          >
            <div className="md:flex md:justify-between md:items-center">
              <div className="font-bold text-lg capitalize text-[var(--text-color)]">
                {applied.recruiter.companyName || `${applied.recruiter.firstname} ${applied.recruiter.lastname}`}
              </div>
              <div className="mt-2 md:mt-0">
                <button
                  onClick={() => setSelectedInternship(applied)}
                  className="text-[var(--primary-color)] hover:text-[var(--button-hover-color)] font-semibold hover:underline"
                >
                  View details
                </button>
              </div>
            </div>
            <div className="text-[var(--text-light)] font-medium">
              {applied.internship.internshipName}
            </div>
            <div className="text-[var(--text-light)] text-sm">
              Applied: {TimeAgo(applied.appliedAt)}
            </div>
            <div className="flex items-center text-[var(--text-light)] text-sm">
              <FaUserFriends className="mr-2 text-[var(--icon-color)]" />
              {applied.studentCount} Applicants
            </div>
            <div>
              <span
                className={`inline-flex items-center py-1 px-2 rounded-lg text-sm font-semibold ${
                  applied.internshipStatus.status === "Viewed"
                    ? "text-yellow-600 bg-yellow-50"
                    : applied.internshipStatus.status === "Rejected"
                    ? "text-red-600 bg-red-50"
                    : applied.internshipStatus.status === "Shortlisted"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 bg-gray-50"
                }`}
              >
                {applied.internshipStatus.status === "Viewed" && (
                  <FaEye className="mr-2" />
                )}
                {applied.internshipStatus.status === "Shortlisted" && (
                  <FaCheckCircle className="mr-2" />
                )}
                {applied.internshipStatus.status === "Rejected" && (
                  <FaTimes className="mr-2" />
                )}
                {applied.internshipStatus.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal View Details */}
      {selectedInternship && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] p-6 relative overflow-y-auto scrollbar-thin">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--text-color)] mb-2 pr-8">
                  {selectedInternship.internship.internshipName}
                </h2>
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 text-[var(--text-light)] hover:text-[var(--primary-color)] focus:outline-none transition-colors text-xl"
                >
                  <FaTimes />
                </button>
                <p className="text-[var(--text-light)] font-medium">
                  {selectedInternship.recruiter.companyName || `${selectedInternship.recruiter.firstname} ${selectedInternship.recruiter.lastname}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-[var(--text-color)]">
                  <FaMapMarkerAlt className="mr-2 text-[var(--icon-color)]" />
                  <span>
                    {selectedInternship.internship.internshipType === "Work From Home"
                      ? "Remote"
                      : `${selectedInternship.internship.internLocation.city}, ${selectedInternship.internship.internLocation.state}, ${selectedInternship.internship.internLocation.country}`}
                  </span>
                </div>

                <div className="flex items-center text-[var(--text-color)]">
                  <FaMoneyBillWave className="mr-2 text-[var(--icon-color)]" />
                  <span>
                    {selectedInternship.internship.currency} {selectedInternship.internship.stipend}
                  </span>
                </div>

                <div className="flex items-center text-[var(--text-color)]">
                  <FaClock className="mr-2 text-[var(--icon-color)]" />
                  <span>{selectedInternship.internship.duration} Months</span>
                </div>

                <div className="flex items-center text-[var(--text-color)]">
                  <FaUsers className="mr-2 text-[var(--icon-color)]" />
                  <span>
                    {selectedInternship.internship.numberOfOpenings} Openings
                  </span>
                </div>

                {selectedInternship.internship.internLocation && (
                  <div className="flex items-center text-[var(--text-color)] md:col-span-2">
                    <FaClipboardList className="mr-2 text-[var(--icon-color)]" />
                    <span>{selectedInternship.internship.internshipType}</span>
                  </div>
                )}
              </div>

              {selectedInternship.internship.skills && selectedInternship.internship.skills.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-[var(--text-color)] mb-3">Skills Required:</h3>
                  <div className="flex flex-wrap mb-6">
                    {selectedInternship.internship.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-[var(--icon-bg-color)] text-[var(--primary-color)] text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <h3 className="text-lg font-bold text-[var(--text-color)] mb-3">Description:</h3>
              <div
                className="text-[var(--text-light)] mb-6 text-sm md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: selectedInternship.internship.description,
                }}
              ></div>

              {selectedInternship.internship.perks && selectedInternship.internship.perks.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-[var(--text-color)] mb-3">Perks and Benefits</h3>
                  <div className="flex flex-wrap mb-6">
                    {selectedInternship.internship.perks.map((perk, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-green-700 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full border border-green-100"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {selectedInternship.internship.assessment !== "" && (
                <>
                  <h3 className="text-lg font-bold text-[var(--text-color)] mb-3">Question from Recruiter</h3>
                  <div className="flex items-start mb-2">
                    <span className="font-bold mr-2 text-[var(--primary-color)]">Q:</span>
                    <p className="text-[var(--text-color)]">{selectedInternship.internship.assessment}</p>
                  </div>
                  <div className="flex items-start bg-[var(--bg-light-color)] p-4 rounded-lg border border-gray-100">
                    <span className="font-bold mr-2 text-[var(--primary-color)]">A:</span>
                    <div className="text-[var(--text-color)]">{selectedInternship.assessmentAns}</div>
                  </div>
                </>
              )}

              {selectedInternship.aboutText && (
                <>
                  <h3 className="text-lg font-bold text-[var(--text-color)] mb-3 mt-6">About yourself</h3>
                  <div className="bg-[var(--bg-light-color)] p-4 rounded-lg border border-gray-100">
                    <p className="text-[var(--text-color)] leading-relaxed">{selectedInternship.aboutText}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyApplications;