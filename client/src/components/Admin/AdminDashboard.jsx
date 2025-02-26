import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../common/server_url';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await axios.get(`${api}/admin/fetch-recruiters`);
        setRecruiters(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
        setError('Failed to load recruiters');
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  const downloadCertificate = async (recruiterId, filename) => {
    try {
      const response = await axios.get(
        `${api}/admin/recruiters/download-certificate/${recruiterId}`,
        { responseType: 'arraybuffer' }
      );

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/adminLogin');
  };

  const handleVerified = async (recruiterId) => {
    try {
      const response = await axios.put(`${api}/admin/verify-recruiter/${recruiterId}`);

      if (response.status === 200) {
        toast.success('Recruiter has been successfully verified');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error('Failed to verify the recruiter');
      }
    } catch (error) {
      console.error('Error verifying recruiter:', error);
      toast.error('An error occurred while verifying the recruiter');
    }
  };

  const handleReject = async (recruiterId) => {
    try {
      const response = await axios.put(`${api}/admin/reject-recruiter/${recruiterId}`);

      if (response.status === 200) {
        toast.success('Recruiter has been successfully rejected');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error('Failed to reject the recruiter');
      }
    } catch (error) {
      console.error('Error rejecting recruiter:', error);
      toast.error('An error occurred while rejecting the recruiter');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500 text-xl font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 relative h-screen">
  <button
    className="absolute right-5 top-5 bg-blue-500 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-600 transition duration-300"
    onClick={handleLogout}
  >
    Logout
  </button>

  <h1 className="text-2xl font-bold mb-6 mt-10 text-center">Recruiters List</h1>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
      <thead>
        <tr className="bg-gray-200 text-gray-700">
          <th className="px-4 py-2 border">Company Name</th>
          <th className="px-4 py-2 border">Recruiter Name</th>
          <th className="px-4 py-2 border">Email</th>
          <th className="px-4 py-2 border">Website/Certificate</th>
          <th className="px-4 py-2 border">Plan Type</th> {/* New Column */}
          <th className="px-4 py-2 border">Actions</th>
          <th className="px-4 py-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {recruiters.map((recruiter) => {
          const companyWebsite = recruiter?.companyWebsite?.link ? recruiter.companyWebsite : null;
          const companyCertificate = recruiter.companyCertificate?.data ? recruiter.companyCertificate : null;
          const status = companyWebsite ? companyWebsite.status : companyCertificate?.status || 'Pending';

          return (
            <tr key={recruiter._id} className="bg-white text-center border-b border-gray-200 hover:bg-gray-100 transition">
              <td className="px-4 py-3 border">{recruiter.companyName}</td>
              <td className="px-4 py-3 border capitalize">{recruiter.firstname} {recruiter.lastname}</td>
              <td className="px-4 py-3 border">{recruiter.email}</td>
              <td className="px-4 py-3 border">
                {companyWebsite ? (
                  <a href={companyWebsite.link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    {companyWebsite.link}
                  </a>
                ) : companyCertificate ? (
                  <button
                    onClick={() => downloadCertificate(recruiter._id, recruiter.companyCertificate.filename)}
                    className="text-blue-500 underline"
                  >
                    {recruiter.companyCertificate.filename}
                  </button>
                ) : (
                  'No website or certificate available'
                )}
              </td>
              <td className="px-4 py-3 border font-semibold text-blue-600">
                {recruiter.subscription?.planType || 'Free'} {/* Plan Type Display */}
              </td>
              <td className="px-4 py-3 border flex justify-center space-x-2">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition duration-300"
                  onClick={() => handleVerified(recruiter._id)}
                >
                  Verify
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition duration-300"
                  onClick={() => handleReject(recruiter._id)}
                >
                  Reject
                </button>
              </td>
              <td className={`px-4 py-3 border font-semibold ${status === 'Verified' ? 'text-green-600' : 'text-yellow-600'}`}>
                {status}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default AdminDashboard;
