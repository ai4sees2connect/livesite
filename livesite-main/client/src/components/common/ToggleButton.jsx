import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ToggleButton = ({ type, auth }) => {
  const [selected, setSelected] = useState(type);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX 1: state sync (important fix)
  useEffect(() => {
    setSelected(type);
  }, [type]);

  const toggleSelection = () => {
    if (type === "student" && auth === "login") {
      setSelected("recruiter");
      navigate("/recruiter/login");
    }

    if (type === "student" && auth === "signup") {
      setSelected("recruiter");
      navigate("/recruiter/signup");
    }

    if (type === "recruiter" && auth === "login") {
      setSelected("student");
      navigate("/student/login");
    }

    if (type === "recruiter" && auth === "signup") {
      setSelected("student");
      navigate("/student/signup");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex w-[260px] h-14 bg-slate-100 rounded-2xl p-1 shadow-inner border border-slate-200">

        <div
          className={`absolute top-1 left-1 h-12 w-[124px] rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transition-all duration-300 ${
            selected === "student"
              ? "translate-x-0"
              : "translate-x-[126px]"
          }`}
        />

        <button
          className={`flex-1 z-10 text-sm font-semibold transition-all duration-300 ${
            selected === "student"
              ? "text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={toggleSelection}
        >
          Student
        </button>

        <button
          className={`flex-1 z-10 text-sm font-semibold transition-all duration-300 ${
            selected === "recruiter"
              ? "text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={toggleSelection}
        >
          Recruiter
        </button>
      </div>
    </div>
  );
};

export default ToggleButton;