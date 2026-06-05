import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye as EyeIcon,
  faEyeSlash as EyeSlashIcon,
} from "@fortawesome/free-solid-svg-icons";
import google_pic from "../../../images/google_pic.png";
import login_bg from "../../../images/login_bg.jpeg";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import getUserIdFromToken from "./authUtils";
import { auth, provider } from "../../common/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStudent } from "../context/studentContext";
import ToggleButton from "../../common/ToggleButton";
import ToggleButtonSecond from "../../common/ToogleButtonSecond";
import api from "../../common/server_url";
import GoBackButton from "../../common/GoBackButton";
import {
  Briefcase,
  Users,
  GraduationCap,
  Rocket,
} from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const { login } = useStudent();
  const [error, setError] = useState("");

  // ✅ FIX: define recruiter/student mode
  const isRecruiter = window.location.pathname.includes("recruiter");
  const type = isRecruiter ? "recruiter" : "student";

  const params = useParams();

  useEffect(() => {
    if (params && Object.keys(params).length > 0) {
      console.log("URL parameters:", params);
    }
  }, [params]);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login();
      navigate(`/student/dashboard/${userId}`);
      return;
    }
  }, [navigate, userId, login]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  // ✅ FIX: define URL properly
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRecruiter
      ? `${api}/recruiter/login`
      : `${api}/student/login`;

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    try {
      const response = await axios.post(url, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      login();

      const userId = getUserIdFromToken();

      navigate(
        isRecruiter
          ? `/recruiter/dashboard/${userId}`
          : `/student/dashboard/${userId}`
      );
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  // ✅ FIX: google login correct URL
  const handleGoogleClick = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const email = user.email;
      const firstname = user.displayName.split(" ")[0];
      const lastname = user.displayName.split(" ")[1] || "";

      const url = isRecruiter
        ? `${api}/recruiter/login/googleauth`
        : `${api}/student/login/googleauth`;

      const response = await axios.post(url, {
        email,
        firstname,
        lastname,
      });

      if (response.data.success) {
        toast.success("Google login successful!");
        localStorage.setItem("token", response.data.token);
        login();

        const userId = getUserIdFromToken();

        navigate(
          isRecruiter
            ? `/recruiter/dashboard/${userId}`
            : `/student/dashboard/${userId}`
        );
      } else {
        toast.error("Error handling Google sign-in on the server");
      }
    } catch (error) {
      toast.error("Error signing in with Google");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <ToastContainer autoClose={3000} />

      {/* Left Section */}
      <div className="hidden lg:flex flex-1 justify-center px-16 border-r border-gray-100 bg-white pt-8">
        <div className="max-w-xl">
          <h1 className="text-6xl font-bold leading-tight text-black">
            Find Your Dream
            <span className="text-blue-600"> Internship</span>
          </h1>

          <p className="text-gray-600 text-lg mt-4 leading-relaxed">
            Connect with top companies, discover exciting internships and
            kickstart your career with InternsNest.
          </p>

          <div className="grid grid-cols-2 gap-5 mt-10">
            <div className="p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
              <Briefcase className="text-blue-600 mb-3" size={28} />
              <h3 className="text-3xl font-bold">10K+</h3>
              <p className="text-gray-500">Open Opportunities</p>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
              <Users className="text-blue-600 mb-3" size={28} />
              <h3 className="text-3xl font-bold">1K+</h3>
              <p className="text-gray-500">Companies Hiring</p>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
              <GraduationCap className="text-blue-600 mb-3" size={28} />
              <h3 className="text-3xl font-bold">21K+</h3>
              <p className="text-gray-500">Active Students</p>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition">
              <Rocket className="text-blue-600 mb-3" size={28} />
              <h3 className="text-3xl font-bold">5K+</h3>
              <p className="text-gray-500">Learners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 py-10 px-5">
        <div className="w-full max-w-lg bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
          <div className="mb-6">
            <Link to="/">
              <GoBackButton />
            </Link>
          </div>

          <div className="text-center mb-8">
  <h1 className="text-5xl font-bold text-black tracking-tight">
    Welcome Back
  </h1>

  {/* ONLY THESE 2 BUTTONS (keep them) */}
  <div className="flex justify-center mt-6">
    <ToggleButton type={type} auth="login" />
  </div>

  <div className="flex justify-center mt-4">
    <ToggleButtonSecond type={type} auth="login" />
  </div>


            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                value={email}
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-slate-50"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-slate-50 pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? EyeIcon : EyeSlashIcon}
                    className="text-gray-500"
                  />
                </button>
              </div>

              <div className="text-right">
                <Link
                  to="/student/forget-pass"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="text-red-500 text-center font-semibold">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold"
              >
                Log In
              </button>
            </form>

            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button
              onClick={handleGoogleClick}
              className="w-full h-14 border border-gray-200 rounded-xl bg-white"
            >
              <div className="flex justify-center items-center gap-3">
                <img src={google_pic} className="w-5 h-5" />
                <span className="font-semibold">
                  Continue with Google
                </span>
              </div>
            </button>

            <p className="text-gray-500 text-center">
              Don't have an account?{" "}
              <Link
                to={
                  isRecruiter
                    ? "/recruiter/signup"
                    : "/student/signup"
                }
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;