import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../common/server_url'

const AdminDashboard = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the recruiters data from the backend
    const fetchRecruiters = async () => {
      try {
        const response = await axios.get(`${api}/admin/fetch-recruiters`); // Adjust the endpoint if needed
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
      const response = await axios.get(`${api}/admin/recruiters/download-certificate/${recruiterId}`, {
        responseType: 'arraybuffer', // Get the binary data as an ArrayBuffer
      });

      // Create a Blob from the binary data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Set the filename for download
      document.body.appendChild(link);
      link.click();

      // Cleanup the URL object and remove the link
      link.remove();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recruiters List</h1>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border border-gray-200">Company Name</th>
            <th className="px-4 py-2 border border-gray-200">Recruiter Name</th>
            <th className="px-4 py-2 border border-gray-200">Email</th>
            <th className="px-4 py-2 border border-gray-200">Website/Certificate</th>
          </tr>
        </thead>
        <tbody>
          {recruiters.map((recruiter) => (
            <tr key={recruiter._id} className="bg-white hover:bg-gray-100 text-center">
              <td className="px-4 py-2 border border-gray-200">{recruiter.companyName}</td>
              <td className="px-4 py-2 border border-gray-200">
                {recruiter.firstname} {recruiter.lastname}
              </td>
              <td className="px-4 py-2 border border-gray-200">{recruiter.email}</td>
              <td className="px-4 py-2 border border-gray-200">
                {recruiter.companyWebsite?.link ? (
                  <a
                    href={recruiter.companyWebsite.link}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {recruiter.companyWebsite.link}
                  </a>
                ) : recruiter.companyCertificate ? (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
