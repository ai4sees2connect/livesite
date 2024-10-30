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
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Our Location</h2>

      <div className="w-full max-w-4xl h-96 overflow-hidden rounded-lg shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.854688773672!2d77.60144997454579!3d12.917059516072813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1500239a42f7%3A0x3ffdd23e902910b!2sAI4SEE%20PVT%20LTD.!5e0!3m2!1sen!2sin!4v1729145310055!5m2!1sen!2sin"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          title="Google Map"
          className="border-0"
        />
      </div>

      {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.854688773672!2d77.60144997454579!3d12.917059516072813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1500239a42f7%3A0x3ffdd23e902910b!2sAI4SEE%20PVT%20LTD.!5e0!3m2!1sen!2sin!4v1729145310055!5m2!1sen!2sin" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}


    </div>
      </div>
    </div>
  );
};

export default Contact;
