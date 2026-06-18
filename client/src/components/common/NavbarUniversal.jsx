/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";

import getUserIdFromTokenStudent from "../student/auth/authUtils.js";
import getUserIdFromTokenRecr from "../recruiter/auth/authUtilsRecr.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useStudent } from "../student/context/studentContext.js";
import { useRecruiter } from "../recruiter/context/recruiterContext.js";
import { FaUser, FaAngleUp, FaAngleDown } from "react-icons/fa";
import api from "../common/server_url.js";
import axios from "axios";

const internsnestLogo3 = "/logos/INTERNSNEST LOGO.png";
const NavbarUniversal = () => {
  const navigate = useNavigate();
  
  // Contexts
  const { student, logout: studentLogout } = useStudent();
  const { recruiter, logout: recruiterLogout } = useRecruiter();

  // Determine user type and ID
  const isStudent = !!student;
  const isRecruiter = !!recruiter;
  const isGuest = !isStudent && !isRecruiter;

  const studentId = student?._id || getUserIdFromTokenStudent();
  const recruiterId = recruiter?._id || getUserIdFromTokenRecr();
  const userId = isStudent ? studentId : isRecruiter ? recruiterId : null;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    if (isStudent) studentLogout();
    if (isRecruiter) recruiterLogout();
    navigate("/");
  };

  // Fetch Profile Picture / Logo
  useEffect(() => {
    if (!userId) {
      setProfilePicUrl(null);
      return;
    }

    const fetchPicture = async () => {
      try {
        const endpoint = isStudent 
          ? `${api}/student/get-picture/${userId}` 
          : `${api}/recruiter/get-logo/${userId}`;
          
        const response = await axios.get(endpoint, { responseType: "blob" });
        const picBlob = new Blob([response.data], { type: response.headers["content-type"] });
        const url = URL.createObjectURL(picBlob);
        setProfilePicUrl(url);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProfilePicUrl(null);
        } else {
          console.error("Error fetching picture/logo:", error);
        }
      }
    };

    fetchPicture();

    return () => {
      if (profilePicUrl) URL.revokeObjectURL(profilePicUrl);
    };
  }, [userId, isStudent]);

  // Helper for active link styling using CSS variables
  const activeLinkClass = ({ isActive }) => 
    `p-2 md:p-5 transition-colors duration-200 ${isActive ? 'text-[var(--primary-color)]' : 'hover:text-[var(--primary-color)]'}`;

  return (
    <nav className="navbar bg-white fixed top-0 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* Logo */}
        <Link to={isStudent ? `/student/dashboard/${userId}` : isRecruiter ? `/recruiter/dashboard/${userId}` : "/"}>
          <img src={internsnestLogo3} alt="InternsNest Logo" className="h-12 lg:h-[40px]" />
        </Link>

        {/* Mobile View (Guest) - Register + Login + Hamburger */}
        {isGuest && (
          <div className="flex items-center sm:hidden space-x-2 relative">
            <div className="relative">
              <button
                onClick={() => setRegisterOpen(!registerOpen)}
                className="px-3 py-2 text-white rounded-md flex items-center text-sm font-semibold"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Register {registerOpen ? <FaAngleUp className="ml-1" size={12} /> : <FaAngleDown className="ml-1" size={12} />}
              </button>
              {registerOpen && (
                <div className="absolute top-[40px] right-0 border bg-white shadow-lg w-40 px-3 py-2 rounded-md z-30">
                  <Link to="/recruiter/signup" onClick={() => setRegisterOpen(false)}>
                    <button className="py-2 w-full text-left text-sm hover:text-[var(--primary-color)]">As an employer</button>
                  </Link>
                  <Link to="/student/signup" onClick={() => setRegisterOpen(false)}>
                    <button className="py-2 w-full text-left text-sm hover:text-[var(--primary-color)]">As a student</button>
                  </Link>
                </div>
              )}
            </div>
            <Link to="/student/login">
              <button className="border rounded-md font-semibold px-3 py-2 text-sm" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
                Login
              </button>
            </Link>
            <button onClick={toggleSidebar} className="ml-1">
              <FontAwesomeIcon icon={faBars} size="1x" />
            </button>
          </div>
        )}

        {/* Mobile View (Logged In) - Hamburger Only */}
        {!isGuest && (
          <div className="block sm:hidden">
            <button onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} size="1x" />
            </button>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex items-center justify-end flex-1 text-sm md:text-base lg:space-x-6 lg:tracking-wider font-semibold">
          
          {/* Guest Links */}
          {isGuest && (
            <>
              <NavLink to="/" className={activeLinkClass}>Home</NavLink>
              <NavLink to="/internships/All-Internships" className={activeLinkClass}>Internships</NavLink>
              
              <div className="flex items-center space-x-3 ml-4">
                <Link to="/student/login">
                  <button className="border rounded-md font-semibold px-4 py-1" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
                    Login
                  </button>
                </Link>
                <Link to="/student/signup">
                  <button className="text-white rounded-md font-semibold px-3 py-1" style={{ backgroundColor: 'var(--primary-color)' }}>
                    Sign-up
                  </button>
                </Link>
              </div>
            </>
          )}

          {/* Student Links */}
          {isStudent && (
            <>
              <NavLink to={`/student/dashboard/${userId}`} className={activeLinkClass}>Home</NavLink>
              <NavLink to={`/student/internships/${userId}/All-Internships`} className={activeLinkClass}>Internships</NavLink>
              <NavLink to={`/student/${userId}/chats`} className={activeLinkClass}>Messages</NavLink>
              <NavLink to={`/student/myApplications/${userId}`} className={activeLinkClass}>My Applications</NavLink>
              
              {/* User Dropdown */}
              <div className="relative group ml-4">
                <div className="rounded-full h-10 w-10 flex items-center justify-center cursor-pointer overflow-hidden border-2" style={{ borderColor: 'var(--primary-color)' }}>
                  {profilePicUrl ? (
                    <img src={profilePicUrl} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <FaUser className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                  )}
                </div>
                <div className="absolute right-0 top-10 w-48 bg-white shadow-lg border rounded-md hidden group-hover:block">
                  <ul className="p-2">
                    <li className="py-2 px-4 hover:text-[var(--primary-color)]">
                      <NavLink to={`/student/profile/${userId}`}>Profile</NavLink>
                    </li>
                    <li className="py-2 px-4 hover:text-[var(--primary-color)] cursor-pointer" onClick={handleLogout}>
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Recruiter Links */}
          {isRecruiter && (
            <>
              <NavLink to={`/recruiter/${userId}/pricing`} className={activeLinkClass}>Plans and Pricing</NavLink>
              <NavLink to={`/recruiter/dashboard/${userId}`} className={activeLinkClass}>My Dashboard</NavLink>
              <NavLink to={`/recruiter/posting/${userId}`} className={activeLinkClass}>Post Internship</NavLink>
              <NavLink to={`/recruiter/${userId}/chatroom`} className={activeLinkClass}>Messages</NavLink>
              
              {/* User Dropdown */}
              <div className="relative group ml-4">
                <div className="rounded-full h-10 w-10 flex items-center justify-center cursor-pointer overflow-hidden border-2" style={{ borderColor: 'var(--primary-color)' }}>
                  {profilePicUrl ? (
                    <img src={profilePicUrl} className="w-full h-full object-cover" alt="Logo" />
                  ) : (
                    <FaUser className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                  )}
                </div>
                <div className="absolute right-0 top-10 w-48 bg-white shadow-lg border rounded-md hidden group-hover:block">
                  <ul className="p-2">
                    <li className="py-2 px-4 hover:text-[var(--primary-color)]">
                      <NavLink to={`/recruiter/profile/${userId}`}>Profile</NavLink>
                    </li>
                    <li className="py-2 px-4 hover:text-[var(--primary-color)]">
                      <NavLink to={`/recruiter/orders/${userId}`}>Orders</NavLink>
                    </li>
                    <li className="py-2 px-4 hover:text-[var(--primary-color)] cursor-pointer" onClick={handleLogout}>
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`sm:hidden fixed top-0 left-0 w-[60%] h-screen bg-white shadow-xl z-30 transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--bg-dark-color)' }}>Menu</h2>
          <button onClick={closeSidebar}>
            <FontAwesomeIcon icon={faTimes} size="1x" />
          </button>
        </div>
        <div className="flex flex-col p-4 text-left overflow-y-auto h-[calc(100%-64px)]">
          
          {/* Guest Sidebar Links */}
          {isGuest && (
            <>
              <NavLink to="/" onClick={closeSidebar} className={activeLinkClass}>Home</NavLink>
              <NavLink to="/internships/All-Internships" onClick={closeSidebar} className={activeLinkClass}>Internships</NavLink>
              <Link to="/student/login" onClick={closeSidebar} className="py-2 hover:text-[var(--primary-color)]">Login</Link>
              <Link to="/recruiter/signup" onClick={closeSidebar} className="py-2 hover:text-[var(--primary-color)]">Register - As an employer</Link>
              <Link to="/student/signup" onClick={closeSidebar} className="py-2 hover:text-[var(--primary-color)]">Register - As a student</Link>
            </>
          )}

          {/* Student Sidebar Links */}
          {isStudent && (
            <>
              <NavLink to={`/student/dashboard/${userId}`} onClick={closeSidebar} className={activeLinkClass}>Home</NavLink>
              <NavLink to={`/student/internships/${userId}/All-Internships`} onClick={closeSidebar} className={activeLinkClass}>Internships</NavLink>
              <NavLink to={`/student/${userId}/chats`} onClick={closeSidebar} className={activeLinkClass}>Messages</NavLink>
              <NavLink to={`/student/myApplications/${userId}`} onClick={closeSidebar} className={activeLinkClass}>My Applications</NavLink>
              <NavLink to={`/student/profile/${userId}`} onClick={closeSidebar} className={activeLinkClass}>Profile</NavLink>
              <button onClick={() => { handleLogout(); closeSidebar(); }} className="py-2 text-left hover:text-[var(--primary-color)]">Logout</button>
            </>
          )}

          {/* Recruiter Sidebar Links */}
          {isRecruiter && (
            <>
              <NavLink to={`/recruiter/${userId}/pricing`} onClick={closeSidebar} className={activeLinkClass}>Plans and Pricing</NavLink>
              <NavLink to={`/recruiter/dashboard/${userId}`} onClick={closeSidebar} className={activeLinkClass}>My Dashboard</NavLink>
              <NavLink to={`/recruiter/posting/${userId}`} onClick={closeSidebar} className={activeLinkClass}>Post Internship</NavLink>
              <NavLink to={`/recruiter/${userId}/chatroom`} onClick={closeSidebar} className={activeLinkClass}>Messages</NavLink>
              <NavLink to={`/recruiter/profile/${userId}`} onClick={closeSidebar} className={activeLinkClass}>Profile</NavLink>
              <NavLink to={`/recruiter/orders/${userId}`} onClick={closeSidebar} className={activeLinkClass}>Orders</NavLink>
              <button onClick={() => { handleLogout(); closeSidebar(); }} className="py-2 text-left hover:text-[var(--primary-color)]">Logout</button>
            </>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={closeSidebar}></div>
      )}
    </nav>
  );
};

export default NavbarUniversal;