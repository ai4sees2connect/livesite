import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import internsnestlogo2 from '../../images/internsnest_pic2.jpg'
import getUserIdFromToken from "./auth/authUtils.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faCaretDown,
  faUser, faBars, faTimes
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStudent } from "./context/studentContext.js";

const Navbar = () => {
  const navigate=useNavigate();
  const userId = getUserIdFromToken();
  const {logout}=useStudent();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    logout(); 
    toast.success('You are logged out');

    // Navigate to the login page
    navigate('/');
  };


  return (
    <nav className="bg-white fixed top-0 w-full shadow-md z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/">
          <img src={internsnestlogo2} alt="" className="h-14 w-24" />
        </Link>

        {/* Hamburger Icon for Small Devices */}
        <div className="block sm:hidden">
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size="1x" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center sm:space-x-4 text-sm
        md:text-base lg:space-x-8 text-gray-800 lg:tracking-wider font-[400]">
          <Link to={`/student/internships/${userId}`} className="hover:text-blue-500 p-2 md:p-5">
            Internships
          </Link>
          <Link to={`/student/${userId}/chats`} className="hover:text-blue-500 p-2 md:p-5">
            Messages
          </Link>
          <Link to={`/student/myApplications/${userId}`} className="hover:text-blue-500 p-2 md:p-5">
            My Applications
          </Link>

          {/* User Icon */}
          <div className="relative group px-0 mx-0 ">
            <div className="p-0   rounded-full h-10 w-10  flex items-center justify-center hover:text-blue-500">
              <FontAwesomeIcon icon={faUser} size="1x" className="w-10" />
            </div>

            <div className="absolute right-0 top-10 w-48 bg-white shadow-lg border border-gray-200 rounded-md hidden group-hover:block">
              <ul className="list-none p-2 m-0">
                <li className="py-2 px-4 hover:text-blue-500">
                  <a href="/">Home</a>
                </li>
                <li className="py-2 px-4 hover:text-blue-500">
                  <Link to={`/student/profile/${userId}`}>Profile</Link>
                </li>
                <li className="py-2 px-4 hover:text-blue-500">
                  <Link to={`/student/resume/${userId}`}>Resume</Link>
                </li>
                <li className="py-2 px-4 hover:text-blue-500">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for Small Devices */}
      
        <div className={`sm:hidden fixed top-0 left-0 w-[50%] h-screen bg-gray-200 shadow-xl z-20 
          transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faTimes} size="1x" />
            </button>
          </div>
          <div className="flex flex-col p-4">
            <Link to={`/student/internships/${userId}`} className="py-2 hover:text-blue-500">
              Internship
            </Link>
            <Link to={`/student/${userId}/chats`} className="py-2 hover:text-blue-500">
              Messages
            </Link>
            <Link to={`/student/myApplications/${userId}`} className="py-2 hover:text-blue-500">
              My Applications
            </Link>
            <Link to={`/student/profile/${userId}`} className="py-2 hover:text-blue-500">
              Profile
            </Link>
            <Link to={`/student/resume/${userId}`} className="py-2 hover:text-blue-500">
              Resume
            </Link>
            <button onClick={handleLogout} className="py-2 hover:text-blue-500 text-left">
              Logout
            </button>
          </div>
        </div>
      
    </nav>
  );
};

export default Navbar;
