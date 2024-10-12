import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../common/server_url'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

const AdminDashboard = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  console.log(recruiters);

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

  const handleLogout=()=>{
    localStorage.removeItem('adminToken');
    navigate('/adminLogin$$$')
  }

  const handleVerified=async(recruiterId)=>{
    try{
    const response=await axios.put(`${api}/admin/verify-recruiter/${recruiterId}`)

    if (response.status === 200) {
      // Optionally update the UI to reflect the status change
      toast.success('Recruiter has been successfully verified');
      setTimeout(()=>{
        window.location.reload();
      },1000)
    } else {
      toast.error('Failed to verify the recruiter');
    }
  
  } catch (error) {
    console.error('Error verifying recruiter:', error);
    toast.error('An error occurred while verifying the recruiter');
  }
  }

  const handleReject=async(recruiterId)=>{
    try{
    const response=await axios.put(`${api}/admin/reject-recruiter/${recruiterId}`)

    if (response.status === 200) {
      // Optionally update the UI to reflect the status change
      toast.success('Recruiter has been successfully rejected');
      
      setTimeout(()=>{
        window.location.reload();
      },1000)
      
    } else {
      toast.error('Failed to verify the recruiter');
    }
  } catch (error) {
    console.error('Error verifying recruiter:', error);
    toast.error('An error occurred while verifying the recruiter');
  }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <button className='absolute right-5 top-5 bg-blue-500 text-white rounded-md  px-2 py-1 font-semibold ' onClick={handleLogout}>Logout</button>
      <h1 className="text-2xl font-bold mb-4 mt-10">Recruiters List</h1>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border border-gray-200">Company Name</th>
            <th className="px-4 py-2 border border-gray-200">Recruiter Name</th>
            <th className="px-4 py-2 border border-gray-200">Email</th>
            <th className="px-4 py-2 border border-gray-200">Website/Certificate</th>  
            <th className="px-4 py-2 border border-gray-200">Actions</th>
            <th className="px-4 py-2 border border-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {recruiters.map((recruiter) => {
            const companyWebsite = recruiter.companyWebsite.link ? recruiter.companyWebsite : null;
            const companyCertificate = recruiter.companyCertificate.data ? recruiter.companyCertificate : null;
            const status=companyWebsite?companyWebsite.status:companyCertificate.status

            return(
            <tr key={recruiter._id} className="bg-white  text-center">
              <td className="px-4 py-2 border border-gray-200">{recruiter.companyName}</td>
              <td className="px-4 py-2 border border-gray-200 capitalize">
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
              
              <td className='px-4 py-2 border border-gray-200'>
                <button className='border mx-1 px-2 py-1 bg-green-600 text-white rounded-md hover:scale-105 duration-300 font-semibold' onClick={()=>handleVerified(recruiter._id)}>Verified</button>
                <button className='border mx-1 px-2 py-1 bg-red-500 text-white rounded-md hover:scale-105 duration-300 font-semibold' onClick={()=>handleReject(recruiter._id)}>Reject</button>
              </td>

              <td className='px-4 py-2 border border-gray-200'>
                <div>{status}</div>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
