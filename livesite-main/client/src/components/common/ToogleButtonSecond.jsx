import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ToggleButtonSecond = ({ type, auth }) => {
  const [selected, setSelected] = useState(auth);
  const navigate = useNavigate();

  // ✅ FIX 1: sync state with props
  useEffect(() => {
    setSelected(auth);
  }, [auth]);

  const toggleSelection = () => {
    if (auth === "login" && type === "student") {
      setSelected("signup");
      navigate("/student/signup");
    }

    if (auth === "signup" && type === "student") {
      setSelected("login");
      navigate("/student/login");
    }

    if (auth === "login" && type === "recruiter") {
      setSelected("signup");
      navigate("/recruiter/signup");
    }

    if (auth === "signup" && type === "recruiter") {
      setSelected("login");
      navigate("/recruiter/login");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex w-[260px] h-14 bg-slate-100 rounded-2xl p-1 shadow-inner border border-slate-200">

        <div
          className={`absolute top-1 left-1 h-12 w-[124px] rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transition-all duration-300 ${
            selected === "login"
              ? "translate-x-0"
              : "translate-x-[126px]"
          }`}
        />

        <button
          className={`flex-1 z-10 text-sm font-semibold transition-all duration-300 ${
            selected === "login"
              ? "text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={toggleSelection}
        >
          Login
        </button>

        <button
          className={`flex-1 z-10 text-sm font-semibold transition-all duration-300 ${
            selected === "signup"
              ? "text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={toggleSelection}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default ToggleButtonSecond;