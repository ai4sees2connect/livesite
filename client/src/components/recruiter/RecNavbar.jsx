import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from "../../images/logo.png";
import internsnestlogo1 from '../../images/internsnest_pic1.jpg'
import internsnestlogo2 from '../../images/internsnest_pic2.jpg'
import getUserIdFromToken from "./auth/authUtilsRecr.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faCaretDown,
  faUser,
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRecruiter } from "./context/recruiterContext.js";
import {FaRegCommentDots} from 'react-icons/fa';

const RecNavbar = () => {
  const navigate=useNavigate();
  const userId = getUserIdFromToken();
  const {logout}=useRecruiter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLogout = () => {
    // Clear the token from localStorage
    logout(); 
    toast.success('You are logged out');

    // Navigate to the login page
    navigate('/recruiter/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <nav className="bg-white fixed top-0 w-full shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/">
          <div className="inline-flex items-center">
            <img src={internsnestlogo2} alt="" className="h-14 w-24" />
          </div>
        </Link>

        {/* Hamburger Icon for Small Devices */}
        <div className="block sm:hidden">
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size="1x" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center sm:space-x-4 text-sm
        md:text-base lg:space-x-8">
          <Link to={`/recruiter/${userId}/pricing`} className="hover:text-blue-500 p-2 md:p-5">
            Plans and Pricing
          </Link>
          <Link to={`/recruiter/dashboard/${userId}`} className="hover:text-blue-500 p-5">
            My Dashboard
          </Link>
          <Link to={`/recruiter/posting/${userId}`} className="hover:text-blue-500 p-5">
            Post Internship
          </Link>
          <Link to={`/recruiter/${userId}/chatroom`} className="hover:text-blue-500 p-5">
            Messages
          </Link>

          {/* User Icon */}
          <div className="relative group">
            <div className="p-0  rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-300">
              <FontAwesomeIcon icon={faUser} size="1x" />
            </div>
            <div className="absolute right-0 top-10 w-48 bg-white shadow-lg border border-gray-200 rounded-md hidden group-hover:block">
              <ul className="list-none p-2 m-0">
                <li className="py-2 px-4 hover:bg-purple-300">
                  <Link to="/">Home</Link>
                </li>
                <li className="py-2 px-4 hover:bg-purple-300">
                  <Link to={`/recruiter/profile/${userId}`}>Profile</Link>
                </li>
                <li className="py-2 px-4 hover:bg-purple-300">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for Small Devices */}
      {isSidebarOpen && (
       
        <div className="sm:hidden fixed left-0 top-0 w-[50%] h-screen bg-gray-200 shadow-xl z-20 ">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faTimes} size="1x" />
            </button>
          </div>
          <div className="flex flex-col p-4 text-left">
            <Link to={`/recruiter/${userId}/pricing`} className="py-2 hover:text-blue-500">
              Plans and Pricing
            </Link>
            <Link to={`/recruiter/dashboard/${userId}`} className="py-2 hover:text-blue-500">
              My Dashboard
            </Link>
            <Link to={`/recruiter/posting/${userId}`} className="py-2 hover:text-blue-500">
              Post Internship
            </Link>
            <Link to={`/recruiter/${userId}/chatroom`} className="py-2 hover:text-blue-500">
              Messages
            </Link>
            <Link to={`/recruiter/profile/${userId}`} className="py-2 hover:text-blue-500">
              Profile
            </Link>
            <button onClick={handleLogout} className="py-2 hover:text-blue-500 text-left">
              Logout
            </button>
          </div>
        </div>
       
      )}
    </nav>
  );
};

export default RecNavbar;
