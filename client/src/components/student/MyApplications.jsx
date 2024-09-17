import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getUserIdFromToken from './auth/authUtils';
import Spinner from '../common/Spinner';
import api from '../common/server_url';
import TimeAgo from '../common/TimeAgo';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaMoneyBillWave, FaUsers, FaClipboardList, FaTimes, FaClock, FaCheck, FaBuilding, FaArrowLeft } from 'react-icons/fa';

const MyApplications = () => {
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getUserIdFromToken();
  const [selectedInternship,setSelectedInternship] =useState(null);

  useEffect(() => {
    // console.log('insideeeeeeeeeeeee')
    const fetchAppliedInternships = async () => {
      try {
        const response = await axios.get(`${api}/student/internship/${userId}/applied-internships`);
        const sortedInternships = response.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

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
        console.error('Error fetching applied internships:', err);
        setError('Failed to fetch applied internships. Please try again later.');
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

  if (error) {
    return <p className="text-xl font-semibold text-red-500">{error}</p>;
  }

  return (
    <div className="py-10 px-5 mt-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">My Applications</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-[90%] my-3 mx-auto">
        {/* Column Headings */}
        <div className="flex justify-between items-center gap-3 font-semibold mb-2 border-b pb-2 pt-2 rounded-md text-center bg-gray-200">
          <div className="w-[170px] text-center">COMPANY</div>
          <div className="w-[200px] text-center ">PROFILE</div>
          <div className="w-[100px] text-center">APPLIED ON</div>
          <div className="w-[130px] text-center">NUMBER OF APPLICANTS</div>
          <div className="w-[100px] text-center">STATUS</div> {/* Set fixed width for Status */}
          <div className="w-[100px] text-center">VIEW DETAILS</div>
          <div className="w-[140px] text-center">PROFILE MATCH</div>
        </div>

        {appliedInternships.map((applied) => (
          <div key={applied._id} className="flex justify-between gap-3 py-2 border-b h-auto text-gray-600">
            <div className=' text-center w-[170px]'>{applied.recruiter.companyName}</div>
            <div className='w-[200px] text-center ml-8'>{applied.internship.internshipName}</div>
            <div className='w-[100px] text-center ml-7'>{TimeAgo(applied.appliedAt)}</div>
            <div className='w-[130px] text-center ml-8'>{applied.studentCount}</div>
            <div className="w-[100px] text-center ml-7 flex items-center justify-center"> {/* Fixed width for Status */}
            <span className={`rounded-xl ${applied.internshipStatus.status==='Viewed' && 'text-yellow-400' } 
            ${applied.internshipStatus.status==='Rejected' && 'text-red-500'} ${applied.internshipStatus.status==='Shortlisted'&& 'text-green-600'} py-1 px-2`}>{applied.internshipStatus.status}</span>
            </div>
            <div className='w-[100px] text-center ml-8 mt-3'>
              <button onClick={()=>setSelectedInternship(applied)} className="text-blue-500 hover:underline">View</button>
            </div>
            <div className='w-[140px] text-center ml-8'>20% matched</div>
          </div>
        ))}
      </div>

      {selectedInternship && (
              <>
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40  " onClick={closeModal}></div>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white border-2 border-gray-600 rounded-lg shadow-3xl w-[60%] h-[90%] p-6 relative overflow-auto">
                    <div className='border-b'>
                      <h2 className="text-2xl font-semibold mb-4">{selectedInternship.internship.internshipName}</h2>
                      <button
                        onClick={closeModal}
                        className="absolute top-7 right-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        <FaTimes />
                      </button>
                      <p className="text-gray-600 mb-4">{selectedInternship.recruiter.companyName}</p>
                    </div>

                    

                    <div className="flex items-center text-gray-700 mb-2">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{selectedInternship.internship.internLocation ? `${selectedInternship.internship.internLocation}` : 'Remote'}</span>
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
                      <span>{selectedInternship.internship.numberOfOpenings} Openings</span>
                    </div>

                    {selectedInternship.internship.internLocation &&
                      <div className="flex items-center text-gray-700 mb-4">
                        <FaClipboardList className="mr-2" />
                        <span>{selectedInternship.internship.internshipType}</span>
                      </div>
                    }

                    <h3 className="text-lg font-medium mb-2">Skills Required:</h3>
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

                    <h3 className="text-lg font-medium mb-2">Description:</h3>
                    <div
                      className="text-gray-700 mb-4"
                      dangerouslySetInnerHTML={{ __html: selectedInternship.internship.description }}
                    ></div>

                    <h3 className="text-lg font-medium mb-2">Perks and Benefits</h3>
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
