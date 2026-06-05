import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import logo from "../../images/logo.png";
import internsnestlogo1 from "../../images/internsnest_pic1.jpg";
import internsnestlogo2 from "../../images/internsnest_pic2.jpg";
import internsnestLogo from "../../images/internnest_logo.png";
import internsnestLogo3 from "../../images/INTERNSNEST LOGO.png";
import getUserIdFromToken from "./auth/authUtilsRecr.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faCaretDown,
  faUser,
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecruiter } from "./context/recruiterContext.js";
import { FaUser } from "react-icons/fa";
import api from "../common/server_url.js";
import axios from "axios";

const RecNavbar = () => {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const { logout } = useRecruiter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navbarState, setNavbarState] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setNavbarState(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(
          `${api}/recruiter/get-logo/${userId}`,
          { responseType: "blob" }
        );

        const logoBlob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        const Url = URL.createObjectURL(logoBlob);
        setLogoUrl(Url);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setLogoUrl(null);
        } else {
          console.error("Error fetching logo:", error);
        }
      }
    };

    fetchLogo();

    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [userId]);

  return (
    <nav className="bg-white fixed top-0 w-full shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

        {/* Logo */}
        <Link to={`/recruiter/dashboard/${userId}`}>
          <div className="inline-flex items-center">
            <img
              src={internsnestLogo3}
              alt=""
              className="h-12 lg:h-[40px] w-24 lg:w-28"
            />
          </div>
        </Link>

        {/* Hamburger */}
        <div className="block sm:hidden">
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size="1x" />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center sm:space-x-4 text-sm md:text-base lg:space-x-6 text-gray-800 lg:tracking-wider font-semibold">

          <NavLink to={`/recruiter/${userId}/pricing`} className={({ isActive }) =>
            `hover:text-blue-500 p-2 md:p-5 ${isActive ? 'text-blue-500' : ''}`
          }>
            Plans and Pricing
          </NavLink>

          <NavLink to={`/recruiter/dashboard/${userId}`} className={({ isActive }) =>
            `hover:text-blue-500 p-2 md:p-5 ${isActive ? 'text-blue-500' : ''}`
          }>
            My Dashboard
          </NavLink>

          <NavLink to={`/recruiter/posting/${userId}`} className={({ isActive }) =>
            `hover:text-blue-500 p-2 md:p-5 ${isActive ? 'text-blue-500' : ''}`
          }>
            Post Internship
          </NavLink>

          <NavLink to={`/recruiter/${userId}/chatroom`} className={({ isActive }) =>
            `hover:text-blue-500 p-2 md:p-5 ${isActive ? 'text-blue-500' : ''}`
          }>
            Messages
          </NavLink>

          {/* User Icon */}
          <div className="relative group">
            <div className="rounded-full h-10 w-10 flex items-center justify-center hover:text-blue-500">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  className="w-full h-full rounded-full object-contain hover:cursor-pointer"
                />
              ) : (
                <FaUser className="w-5 h-5" />
              )}
            </div>

            <div className="absolute right-0 top-10 w-48 bg-white shadow-lg border rounded-md hidden group-hover:block">
              <ul className="p-2">

                <li className="py-2 px-4 hover:text-blue-500">
                  <NavLink to={`/recruiter/profile/${userId}`}>
                    Profile
                  </NavLink>
                </li>

                <li className="py-2 px-4 hover:text-blue-500">
                  <NavLink to={`/recruiter/orders/${userId}`}>
                    Orders
                  </NavLink>
                </li>

                <li className="py-2 px-4 hover:text-blue-500">
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sm:hidden fixed top-0 left-0 w-[50%] h-screen bg-gray-100 shadow-xl z-20 transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} size="1x" />
          </button>
        </div>

        <div className="flex flex-col p-4 text-left">

          <NavLink to={`/recruiter/${userId}/pricing`} className="py-2">
            Plans and Pricing
          </NavLink>

          <NavLink to={`/recruiter/dashboard/${userId}`} className="py-2">
            My Dashboard
          </NavLink>

          <NavLink to={`/recruiter/posting/${userId}`} className="py-2">
            Post Internship
          </NavLink>

          <NavLink to={`/recruiter/${userId}/chatroom`} className="py-2">
            Messages
          </NavLink>

          <NavLink to={`/recruiter/profile/${userId}`} className="py-2">
            Profile
          </NavLink>

          <NavLink to={`/recruiter/orders/${userId}`} className="py-2">
            Orders
          </NavLink>

          <button
            onClick={() => { handleLogout(); toggleSidebar(); }}
            className="py-2 text-left"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default RecNavbar;