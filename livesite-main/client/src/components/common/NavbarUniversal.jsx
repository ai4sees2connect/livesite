import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import internsnestlogo2 from "../../images/internsnest_pic2.jpg";
import internsnestLogo from "../../images/internnest_logo.png";
import internsnestLogo3 from "../../images/INTERNSNEST LOGO.png";
import getUserIdFromToken from "../student/auth/authUtils.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faCaretDown,
  faUser,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { useStudent } from "../student/context/studentContext.js";

const NavbarUniversal = () => {
  const getUserId = getUserIdFromToken(); // FIX: safe naming (no change in logic usage)
  const { logout } = useStudent();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-white fixed top-0 w-full shadow-md z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between sm:justify-start items-center h-20">

        {/* Logo */}
        <Link to="/">
          <img
            src={internsnestLogo3}
            alt=""
            className="h-12 lg:h-[40px] w-24 lg:w-28"
          />
        </Link>

        {/* Mobile Buttons */}
        <div className="flex items-center sm:hidden space-x-5 relative">
          <button
            onClick={() => setRegisterOpen(!registerOpen)}
            className="bg-blue-400 px-4 py-2 text-white rounded-md flex items-center justify-between font-semibold"
          >
            Register
            {registerOpen ? (
              <FaAngleUp className="ml-2" />
            ) : (
              <FaAngleDown className="ml-2" />
            )}
          </button>

          {registerOpen && (
            <div className="absolute top-[40px] right-8 border bg-white shadow-lg w-full px-3 py-2">
              <Link to="/recruiter/signup">
                <button className="py-2 hover:text-blue-500">
                  As an employer
                </button>
              </Link>
              <Link to="/student/signup">
                <button className="py-2 hover:text-blue-500">
                  As a student
                </button>
              </Link>
            </div>
          )}

          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size="1x" />
          </button>
        </div>

        {/* Desktop Menu */}
       <div className="hidden sm:flex items-center justify-end w-full">

  <div className="flex items-center gap-10 text-[15px] font-medium text-gray-700">

    <NavLink
      to="/"
      className={({ isActive }) =>
        `hover:text-blue-600 transition ${
          isActive ? "text-blue-600" : ""
        }`
      }
    >
      Home
    </NavLink>

    <NavLink
      to="/internships/All-Internships"
      className={({ isActive }) =>
        `hover:text-blue-600 transition ${
          isActive ? "text-blue-600" : ""
        }`
      }
    >
      Internships
    </NavLink>

    <NavLink
      to="/jobs"
      className={({ isActive }) =>
        `hover:text-blue-600 transition ${
          isActive ? "text-blue-600" : ""
        }`
      }
    >
      Jobs
    </NavLink>

    <Link to="/student/login">
      <button className="border border-blue-600 text-blue-600 px-5 py-2 rounded-md hover:bg-blue-50 transition">
        Login
      </button>
    </Link>

  </div>
   </div>
</div>
      

      {/* Sidebar */}
      <div className={`sm:hidden fixed top-0 left-0 w-[50%] h-screen bg-gray-100 shadow-xl z-20 border transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>

        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} size="1x" />
          </button>
        </div>

        <div className="flex flex-col p-4">

          <NavLink onClick={toggleSidebar} to="/" className={({ isActive }) =>
            `py-2 hover:text-blue-500 ${isActive ? "text-blue-500" : ""}`
          }>
            Home
          </NavLink>

          <NavLink to="/internships" onClick={toggleSidebar} className={({ isActive }) =>
            `py-2 hover:text-blue-500 ${isActive ? "text-blue-500" : ""}`
          }>
            Internship
          </NavLink>

          <Link to="/student/login" className="py-2 hover:text-blue-500">
            Login
          </Link>

          <Link to="/recruiter/signup" className="py-2 hover:text-blue-500">
            Register - As an employer
          </Link>

          <Link to="/student/signup" className="py-2 hover:text-blue-500">
            Register - As an student
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default NavbarUniversal;