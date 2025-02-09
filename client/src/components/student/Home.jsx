import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import RightSide from "./RightSide";
import { useNavigate } from "react-router-dom";
// import getUserIdFromToken from "./auth/authUtils"
import { useParams } from "react-router-dom";
import getUserIdFromToken from "./auth/authUtils";
import Spinner from "../common/Spinner";
import { useStudent } from "./context/studentContext";

const Home = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const idFromToken = getUserIdFromToken();
  const { student, logout } = useStudent();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    if (userId !== idFromToken) {
      logout();
      navigate("/");
      return;
    }

    console.log(userId);
  }, [userId, idFromToken, token]);

  if (!student) {
    return <Spinner />;
  }

  return (
    <>
      <div className="">
        <div className="text-center">
          <Sidebar student={student} />
        </div>
        <RightSide />
      </div>
    </>
  );
};

export default Home;
