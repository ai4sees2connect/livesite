import React, {useEffect} from 'react';
import findUser from '../common/UserDetection.js'
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import getUserIdFromToken from '../student/auth/authUtils.js';

const Terms = () => {
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
    <nav className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center flex justify-center space-x-5">
          {token && <button onClick={handleUserNavigate} className="text-xl font-bold text-gray-700">Home</button>}
          {!token && <Link to='/' className='text-xl font-bold text-gray-700 '>Home</Link>}
          <button className="text-xl font-bold text-blue-600">Terms and conditions</button>
        </div>
      </nav>

    <div className="p-6 max-w-6xl mx-auto text-justify leading-loose">
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions for Students</h1>
      <p className="mb-4">Welcome to InternsNest! By using our platform to apply for internships and jobs, you agree to the following:</p>
      <ul className="list-disc list-inside mb-8">
        <li><strong>Accuracy Matters:</strong> Provide accurate and complete information in your profile and applications. Misrepresentation can lead to account suspension.</li>
        <li><strong>Timely Responses:</strong> If you receive communication from an employer, respond within 72 hours. Accepting an offer means committing to join the role on time.</li>
        <li><strong>Professional Conduct:</strong> Maintain professionalism in all communications. Offensive content or behavior is not tolerated.</li>
        <li><strong>Job Details:</strong> Read job descriptions thoroughly before applying. Irrelevant applications may result in penalties.</li>
        <li><strong>Data Usage:</strong> Your information may be shared with employers to facilitate the hiring process. We’ll keep your data secure!</li>
        <li><strong>Report Suspicious Activity:</strong> If you notice anything unusual, report it to us immediately.</li>
        <li><strong>Account Notifications:</strong> By registering, you agree to receive updates via email and SMS, but you can opt out at any time.</li>
      </ul>

      <h1 className="text-2xl font-bold mb-4">Terms and Conditions for Employers</h1>
      <p className="mb-4">Welcome to InternsNest! By posting jobs on our platform, you agree to these terms:</p>
      <ul className="list-disc list-inside">
        <li><strong>Authorization Required:</strong> Ensure you’re authorized to post jobs for your organization. You’re responsible for any unauthorized postings.</li>
        <li><strong>Accurate Listings:</strong> Provide complete and truthful job descriptions. Misleading information can lead to account suspension.</li>
        <li><strong>Job Visibility:</strong> Your job listings may be shared on our social media and partner sites to increase visibility.</li>
        <li><strong>Professional Communication:</strong> Interact with applicants professionally and respond to inquiries promptly. Address any complaints within 72 hours.</li>
        <li><strong>Data Protection:</strong> Use applicant data solely for hiring purposes. Sharing or selling this data is strictly prohibited.</li>
        <li><strong>Payment Terms:</strong> All payments for services must be made in advance. Refund policies apply as per our guidelines.</li>
        <li><strong>Policy Compliance:</strong> Familiarize yourself with our prohibited job types and ensure compliance to maintain your account.</li>
      </ul>
    </div>
    </>
  );
};

export default Terms;
