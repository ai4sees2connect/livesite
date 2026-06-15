import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../common/server_url";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminLogin$$$");
      return;
    }

    const fetchRecruiters = async () => {
      try {
        setLoading(true);
        // Add pagination query
        const response = await axios.get(
          `${api}/admin/fetch-recruiters?page=${page}&limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Extract recruiters array from response
        const recruitersData = response.data.recruiters || [];
        setRecruiters(recruitersData);
        setTotalCount(response.data.totalCount || 0);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recruiters:", error);
        setError("Failed to load recruiters");
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, [navigate, page]); // Add page as dependency

  const downloadCertificate = async (recruiterId, filename) => {
    try {
      const response = await axios.get(
        `${api}/admin/recruiters/download-certificate/${recruiterId}`,
        { responseType: "arraybuffer" },
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminLogin$$$");
  };

  const handleVerified = async (recruiterId) => {
    try {
      const response = await axios.put(
        `${api}/admin/verify-recruiter/${recruiterId}`,
      );

      if (response.status === 200) {
        toast.success("Recruiter has been successfully verified");
        setRecruiters((prevRecruiters) =>
          prevRecruiters.map((rec) =>
            rec._id === recruiterId
              ? {
                  ...rec,
                  companyWebsite: rec.companyWebsite
                    ? { ...rec.companyWebsite, status: "Verified" }
                    : rec.companyWebsite,
                  companyCertificate: rec.companyCertificate
                    ? { ...rec.companyCertificate, status: "Verified" }
                    : rec.companyCertificate,
                }
              : rec,
          ),
        );

        setTimeout(() => {
          // Refresh current page data without full reload
          setPage((prev) => prev);
        }, 1000);
      } else {
        toast.error("Failed to verify the recruiter");
      }
    } catch (error) {
      console.error("Error verifying recruiter:", error);
      toast.error("An error occurred while verifying the recruiter");
    }
  };

  const handleReject = async (recruiterId) => {
    try {
      const response = await axios.put(
        `${api}/admin/reject-recruiter/${recruiterId}`,
      );

      if (response.status === 200) {
        toast.success("Recruiter has been successfully rejected");
        setRecruiters((prevRecruiters) =>
          prevRecruiters.map((rec) =>
            rec._id === recruiterId
              ? {
                  ...rec,
                  companyWebsite: rec.companyWebsite
                    ? { ...rec.companyWebsite, status: "Rejected" }
                    : rec.companyWebsite,
                  companyCertificate: rec.companyCertificate
                    ? { ...rec.companyCertificate, status: "Rejected" }
                    : rec.companyCertificate,
                }
              : rec,
          ),
        );

        setTimeout(() => {
          setPage((prev) => prev);
        }, 1000);
      } else {
        toast.error("Failed to reject the recruiter");
      }
    } catch (error) {
      console.error("Error rejecting recruiter:", error);
      toast.error("An error occurred while rejecting the recruiter");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 relative min-h-screen">
      <button
        className="absolute right-5 top-5 bg-blue-500 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-600 transition duration-300"
        onClick={handleLogout}
      >
        Logout
      </button>

      <h1 className="text-2xl font-bold mb-6 mt-10 text-center">
        Recruiters List
      </h1>

      {/* Show total count */}
      <p className="text-center text-gray-600 mb-4">
        Total Recruiters: {totalCount}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border">Company Name</th>
              <th className="px-4 py-2 border">Recruiter Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Website/Certificate</th>
              <th className="px-4 py-2 border">Plan Type</th>
              <th className="px-4 py-2 border">Actions</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Now recruiters is definitely an array */}
            {recruiters.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No recruiters found
                </td>
              </tr>
            ) : (
              recruiters.map((recruiter) => {
                let status = "Pending";

                if (recruiter.companyWebsite?.status) {
                  status = recruiter.companyWebsite.status;
                } else if (recruiter.companyCertificate?.status) {
                  status = recruiter.companyCertificate.status;
                }

                // Check if certificate exists (for display)
                const hasCertificate =
                  recruiter.companyCertificate?.contentType ||
                  recruiter.certificateUrl;
                const hasWebsite = recruiter.companyWebsite?.link;

                return (
                  <tr
                    key={recruiter._id}
                    className="bg-white text-center border-b border-gray-200 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3 border">
                      {recruiter.companyName || "N/A"}
                    </td>
                    <td className="px-4 py-3 border capitalize">
                      {recruiter.firstname} {recruiter.lastname}
                    </td>
                    <td className="px-4 py-3 border">{recruiter.email}</td>
                    <td className="px-4 py-3 border">
                      {hasWebsite ? (
                        <a
                          href={recruiter.companyWebsite.link}
                          className="text-blue-500 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {recruiter.companyWebsite.link.length > 30
                            ? recruiter.companyWebsite.link.substring(0, 30) +
                              "..."
                            : recruiter.companyWebsite.link}
                        </a>
                      ) : hasCertificate ? (
                        <button
                          onClick={() =>
                            downloadCertificate(
                              recruiter._id,
                              recruiter.companyCertificate?.filename ||
                                "certificate.pdf",
                            )
                          }
                          className="text-blue-500 underline"
                        >
                          {recruiter.companyCertificate?.filename ||
                            "Download Certificate"}
                        </button>
                      ) : (
                        "No website or certificate available"
                      )}
                    </td>
                    <td className="px-4 py-3 border font-semibold text-blue-600">
                      {recruiter.subscription?.planType || "Free"}
                    </td>
                    <td className="px-4 py-3 border">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition duration-300"
                          onClick={() => handleVerified(recruiter._id)}
                          disabled={status === "Verified"} // ✅ Disable if already verified
                        >
                          Verify
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition duration-300"
                          onClick={() => handleReject(recruiter._id)}
                          disabled={status === "Rejected"} // ✅ Disable if already rejected
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-3 border font-semibold ${
                        status === "Verified"
                          ? "text-green-600"
                          : status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {status}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md transition ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
