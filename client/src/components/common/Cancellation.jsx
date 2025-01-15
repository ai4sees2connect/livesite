import React, {useEffect} from 'react';
import findUser from '../common/UserDetection.js'
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import getUserIdFromToken from '../student/auth/authUtils.js';

const Cancellation = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const idFromToken = getUserIdFromToken();
  const token = localStorage.getItem("token");

  const handleUserNavigate=async()=>{
    const decoded = jwtDecode(token);
    const userType = decoded.userType;
    console.log(userType)
    if(userType==='Student'){
      navigate(`/student/dashboard/${idFromToken}`)
      return;
    }

    if(userType==='Recruiter'){
      navigate(`/recruiter/dashboard/${idFromToken}`)
      return;
    }
  }

  return (
    <>
    <nav className="w-full bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center flex justify-center space-x-5">
          {token && <button onClick={handleUserNavigate} className='text-xl font-bold text-gray-700'>Home</button>}
          {!token && <Link to='/' className='text-xl font-bold text-gray-700 '>Home</Link>}
          <button className="text-xl font-bold text-blue-600 ">Refund policy</button>
        </div>
      </nav>

    <div className="p-6 max-w-6xl mx-auto h-screen">
      <h1 className="text-2xl font-bold mb-4">Refund & Cancellation Policy</h1>

      <h2 className="text-xl font-semibold mb-3">Jobs and Internships</h2>
      <p className="mb-4">For job listings and internships, the following refund policies apply:</p>

      <ul className="list-disc list-inside mb-8">
        <li><strong>Refund Requests:</strong> Employers may request a full refund within 30 days of purchase if they have not hired any candidates. The refund will be processed within 15 working days after the request.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">Important Notes</h2>
      <ul className="list-disc list-inside mb-8">
        <li>Refunds may be denied for violations of terms and conditions.</li>
        <li>No refunds are allowed for Premium Plans or bulk plans; refunds can only be claimed once by a company.</li>
        <li>For advertisers, no refunds are available after the campaign begins or payment is received. If Internsnest cancels the campaign, a pro-rata refund will be issued for unserved deliverables.</li>
      </ul>
    </div>
    </>
  );
};

export default Cancellation;
