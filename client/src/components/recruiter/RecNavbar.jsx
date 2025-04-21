import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from "../../images/logo.png";
import internsnestLogo3 from "../../images/INTERNSNEST LOGO.png";
import internsnestlogo1 from '../../images/internsnest_pic1.jpg'
import internsnestlogo2 from '../../images/internsnest_pic2.jpg'
import internsnestLogo from '../../images/internnest_logo.png'
import internsnestLogo3 from "../../images/INTERNSNEST LOGO.png";
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
import { FaRegCommentDots, FaUser } from 'react-icons/fa';
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
    // Clear the token from localStorage
    logout();
    // window.location.reload();

    // Navigate to the login page
    navigate('/');
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
          {
            responseType: "blob", // Fetching as a blob for image rendering
          }
        );
        // console.log("response", response.status);

        const logoBlob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const Url = URL.createObjectURL(logoBlob);
        // console.log("logoUrl", Url);
        // console.log("logo", logo);
        setLogoUrl(Url);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Logo not found");
          setLogoUrl(null); // Set the logo URL to null if not found
        } else {
          console.error("Error fetching logo:", error);
        }
      }
    };
    fetchLogo();

    return () => {
      if (!logoUrl) {
        URL.revokeObjectURL(logoUrl);
        console.log("Blob URL revoked on cleanup:", logoUrl); // Optional: Add a log to confirm revocation
      }
    };
  }, []);


  return (
    <nav className="bg-white fixed top-0 w-full shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to={`/recruiter/dashboard/${userId}`}>
          <div className="inline-flex items-center ">
<<<<<<< HEAD
            <img src={internsnestLogo3} alt="" className="h-16  w-24 lg:w-20 lg:h-[60px]" />
=======
            <img
              src={internsnestLogo3}
              alt=""
              className="h-12 lg:h-[40px] w-24 lg:w-28"
            />
>>>>>>> 9118fbb (Changes in Loginsignup studentpage)
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
        md:text-base lg:space-x-6 text-gray-800 lg:tracking-wider font-semibold">

          {/* <Link to={`/recruiter/${userId}/pricing`}>Home</Link> */}

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
          <div className="p-0    rounded-full h-10 w-10  flex items-center justify-center hover:text-blue-500">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  className="w-full h-full rounded-full object-contain hover:cursor-pointer "
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center hover:cursor-pointer">
                  <FaUser className="w-5 h-5 " />
                </div>
              )}
            </div>
            <div className="absolute right-0 top-10 w-48 bg-white shadow-lg border border-gray-200 rounded-md hidden group-hover:block">
              <ul className="list-none p-2 m-0">

                <li className={`py-2 px-4 hover:text-blue-500 ${navbarState === 'Profile' && 'text-blue-500'}`}>
                  <NavLink to={`/recruiter/profile/${userId}`} className={({ isActive }) =>
                    `hover:text-blue-500 ${isActive ? 'text-blue-500' : ''}`
                  }>Profile</NavLink>
                </li>
                <li className={`py-2 px-4 hover:text-blue-500 ${navbarState === 'Orders' && 'text-blue-500'}`}>
                  <NavLink to={`/recruiter/orders/${userId}`} className={({ isActive }) =>
                    `hover:text-blue-500 ${isActive ? 'text-blue-500' : ''}`
                  }>Orders</NavLink>
                </li>
                <li className={`py-2 px-4 hover:text-blue-500 `}>
                  <button onClick={() => handleLogout()}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for Small Devices */}


      <div className={`sm:hidden fixed top-0 left-0 w-[50%] h-screen bg-gray-100 shadow-xl z-20 border tracking-wider transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faTimes} size="1x" />
          </button>
        </div>
        <div className="flex flex-col p-4 text-left">
          <NavLink
            to={`/recruiter/${userId}/pricing`}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `py-2 hover:text-blue-500 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            Plans and Pricing
          </NavLink>

          <NavLink
            to={`/recruiter/dashboard/${userId}`}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `py-2 hover:text-blue-500 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            My Dashboard
          </NavLink>

          <NavLink
            to={`/recruiter/posting/${userId}`}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `py-2 hover:text-blue-500 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            Post Internship
          </NavLink>

          <NavLink
            to={`/recruiter/${userId}/chatroom`}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `py-2 hover:text-blue-500 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            Messages
          </NavLink>

          <NavLink
            to={`/recruiter/profile/${userId}`}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `py-2 hover:text-blue-500 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to={`/recruiter/orders/${userId}`}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `py-2 hover:text-blue-500 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            Orders
          </NavLink>

          

          <button
            onClick={() => { handleLogout(); toggleSidebar(); }}
            className="py-2 hover:text-blue-500 text-left"
          >
            Logout
          </button>
        </div>
      </div>


    </nav>
  );
};

export default RecNavbar;
