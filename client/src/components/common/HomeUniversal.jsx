import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
import NavbarUniversal from "./NavbarUniversal";
// import Sidebar from "./Sidebar";
import RightSide from "../student/RightSide";
import { useNavigate } from "react-router-dom";
// import getUserIdFromToken from "./auth/authUtils"
import { useParams } from "react-router-dom";
import getUserIdFromToken from "../student/auth/authUtils";
import Spinner from "../common/Spinner";
import { useStudent } from "../student/context/studentContext";
import Sidebar from "../student/Sidebar";
// import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

const HomeUniversal = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const idFromToken = getUserIdFromToken();
  const { student, logout } = useStudent();
  const token = localStorage.getItem("token");

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyLargeScreen = window.innerWidth >= 770;
      setIsLargeScreen(isCurrentlyLargeScreen);
      console.log("Screen size changed:", isCurrentlyLargeScreen);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded) {
          const userType = decoded.userType; // 'student' or 'recruiter'

          console.log('User Type:', userType);

          // Navigate or render components based on user type
          if (userType === 'Student') {
            navigate(`/student/dashboard/${idFromToken}`)
          } else if (userType === 'Recruiter') {
            navigate(`/recruiter/dashboard/${idFromToken}`)
          }
        } else {
          console.log('Invalid token');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }

    console.log(userId);
  }, [idFromToken, token]);

  // if (!student) {
  //   return <Spinner />;
  // }

  return (
    <>

      <div className="mt-7 text-center overflow-x-hidden">

        <div className="border border-black w-[96vw] mx-auto">
          <Sidebar student={student} />
        </div>
        <RightSide />
      </div>
    </>
  );
};

export default HomeUniversal;
