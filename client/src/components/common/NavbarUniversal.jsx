import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import internsnestlogo2 from '../../images/internsnest_pic2.jpg'
import internsnestLogo from '../../images/internnest_logo.png'
import getUserIdFromToken from "../student/auth/authUtils.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faCaretDown,
  faUser, faBars, faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStudent } from "../student/context/studentContext.js";

const NavbarUniversal = () => {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const { logout } = useStudent();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
  const [registerOpen, setRegisterOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const handleLogout = () => {
  //   // Clear the token from localStorage
  //   logout(); 
  //   toast.success('You are logged out');

  //   // Navigate to the login page
  //   navigate('/student/login');
  // };


  return (
    <nav className="bg-white fixed top-0 w-full shadow-md z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between sm:justify-start items-center h-20">
        {/* Logo */}
        <Link to="/">
          <img src={internsnestLogo} alt="" className="h-16 lg:h-[70px] w-24 lg:w-28" />
        </Link>

        {/* Hamburger Icon for Small Devices */}
        <div className="flex items-center sm:hidden space-x-5 relative">
          <button onClick={() => setRegisterOpen(!registerOpen)} className="bg-blue-400 px-4 py-2 text-white rounded-md flex items-center justify-between font-semibold">
            Register
            {registerOpen ? (
              <FaAngleUp className="ml-2" />
            ) : (
              <FaAngleDown className="ml-2" />
            )}
          </button>

          {registerOpen && <div className="absolute top-[40px] right-8 border bg-white shadow-lg w-full px-3 py-2">
            <Link to='/recruiter/signup'><button className="py-2 hover:text-blue-500">As an employer</button></Link>
            <Link to='/student/signup'> <button className="py-2 hover:text-blue-500">As a student</button></Link>
          </div>}


          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size="1x" />
          </button>


        </div>



        {/* Navigation Links */}
        <div className="hidden sm:flex items-center justify-between  text-sm
        sm:text-base lg:space-x-8 text-gray-800 lg:tracking-wider   w-full font-semibold">
          <div className="flex items-start justify-center">
            
            
        

          </div>

          
      

          {/* User Icon */}
          <div className="hidden sm:flex relative group  items-center justify-center space-x-2 lg:space-x-5 ">
            <Link to='/internships' className="hover:text-blue-500 p-2 md:p-5">
              Internships
            </Link>
            <Link to='/student/login'>
              <button className="border border-blue-500 text-blue-500 rounded-md font-semibold px-4 py-1 lg:px-3">Login</button></Link>
            <Link to='/student/signup'><button className="text-sm md:text-base bg-blue-400 text-white rounded-md font-semibold px-1 md:px-2 py-1 ">Sign-up</button></Link>
            {/* <Link to='/student/signup'> <button className="text-sm md:text-base bg-blue-400 text-white rounded-md font-semibold px-1 md:px-2 py-1">Student Sign-up</button></Link> */}

          </div>
        </div>

      </div>

      {/* Sidebar for Small Devices */}

      <div className={`sm:hidden fixed top-0 left-0 w-[50%] h-screen bg-gray-100 shadow-xl z-20 border
          transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} size="1x" />
          </button>
        </div>
        <div className="flex flex-col p-4">
          <Link to='/internships' onClick={toggleSidebar} className="py-2 hover:text-blue-500">
            Internship
          </Link>
          
          <Link to={`/student/login`} className="py-2 hover:text-blue-500">
            Login
          </Link>
          <Link to={`/recruiter/signup`} className="py-2 hover:text-blue-500">
            Register - As an employer
          </Link>
          <Link to={`/student/signup`} className="py-2 hover:text-blue-500">
            Register - As an student
          </Link>



          {/* <button onClick={handleLogout} className="py-2 hover:text-blue-500 text-left">
              Logout
            </button> */}
        </div>
      </div>

    </nav>
  );
};

export default NavbarUniversal;
