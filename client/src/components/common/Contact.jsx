import React, {useEffect} from 'react';
import contact_pic from '../../images/contact_pic.jpeg';
import findUser from '../common/UserDetection.js'
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import getUserIdFromToken from '../student/auth/authUtils.js';

const Contact = () => {

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
    <div className="flex flex-col items-center bg-gray-50">
      <nav className="w-full bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center flex justify-center space-x-5">
          {token && <button onClick={handleUserNavigate} className='text-xl font-bold text-gray-700'>Home</button>}
          {!token && <Link to='/' className='text-xl font-bold text-gray-700 '>Home</Link>}
          <button className="text-xl font-bold text-blue-600 ">Contact Us</button>
        </div>
      </nav>

      {/* Image Section */}
      <div className="w-full ">
        <img src={contact_pic} alt="Contact" className="w-full h-[400px] object-cover" />
      </div>

      {/* Contact Information Section */}
      <div className="p-8 max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Phone- </span>+91 8867583329
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Email ID:</span> connect@ai4sees.com
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Address:</span> 9th Main Road, Vysya Bank Colony, New Gurappana Palya, 1st Stage, BTM 1st Stage, Bengaluru, Karnataka
        </p>
       
      </div>
    </div>
  );
};

export default Contact;
