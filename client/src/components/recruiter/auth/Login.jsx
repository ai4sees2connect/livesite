import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye as EyeIcon,
  faEyeSlash as EyeSlashIcon,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import google_pic from "../../../images/google_pic.png";
import recruiter_bg from "../../../images/intern_pic.jpeg";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import getUserIdFromToken from "../auth/authUtilsRecr";
import { auth, provider } from "../../common/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useStudent } from '../context/studentContext';
import { useRecruiter } from "../context/recruiterContext";
import ToggleButton from "../../common/ToggleButton";
import ToggleButtonSecond from "../../common/ToogleButtonSecond";
import api from "../../common/server_url";
import GoBackButton from "../../common/GoBackButton";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const { login } = useRecruiter();
    const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/recruiter/dashboard/${userId}`);
      return;
    }
  }, [navigate, userId]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/recruiter/login`, {
        email,
        password,
      });
      // toast.success("Login successful!");

      // Handle success
      console.log(response.data.message);
      localStorage.setItem("token", response.data.token);
      login();
      const userId = getUserIdFromToken();
      navigate(`/recruiter/dashboard/${userId}`);
    } catch (error) {
   
      setError("Invalid credentials");
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleGoogleClick = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      const firstname = user.displayName.split(" ")[0];
      const lastname = user.displayName.split(" ")[1] || "";

      const response = await axios.post(`${api}/recruiter/login/googleauth`, {
        email,
        firstname,
        lastname,
      });

      if (response.data.success) {
        toast.success("Google login successful!");
        const token = response.data.token;
        localStorage.setItem("token", token);
        login();
        const userId = getUserIdFromToken();
        navigate(`/recruiter/dashboard/${userId}`);
      } else {
        toast.error("Error handling Google sign-in on the server");
      }
    } catch (error) {
      toast.error("Error signing in with Google");
    }
  };

  return (
    <div className="flex mt-10 md:mt-0 min-h-screen">
      <div className="relative flex-1 hidden lg:block">
        <img
          src={recruiter_bg}
          alt=""
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="mx-auto flex-1  mb-20 min-h-[730px]">
        {/* back button */}
        <div className="absolute left-0 top-5  rounded-full ">
          <Link to="/" className="px-5 py-1 text-blue-500  font-semibold">
            <GoBackButton />
          </Link>
        </div>
        <div className=" flex flex-col items-center mt-[20px]">
          <p className="text-5xl font-extrabold mb-8 md:mb-6 mt-10 lg:mt-0">
            Login
          </p>
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-5  md:items-center mt-5 md:mt-6">
            <ToggleButton type="recruiter" auth="login" />
            <ToggleButtonSecond type="recruiter" auth="login" />
          </div>
        </div>

        <div>
          {/* form starts from here */}

          <div className="flex justify-center items-center mt-[40px] md:mt-[36px] w-full ">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 w-full lg:w-[60%]  md:max-w-xl px-5 lg:px-0"
            >
              <div className="mx-auto w-full md:max-w-xl">
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-full"
                  required
                />
              </div>

              <div className="flex flex-col items-center relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md pr-10 w-full"
                  required
                />

                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-2 top-[24px] transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="w-5 h-5 text-gray-500"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="w-5 h-5 text-gray-500"
                    />
                  )}
                </button>
              </div>
              <div>
                <Link
                  to="/recruiter/forget-pass"
                  className="text-sm px-2 text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="text-red-500 font-semibold mb-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                className={`w-full py-2 bg-blue-500 border-none h-[50px] text-white rounded-full ${
                  !isFormValid ? `bg-blue-500` : ""
                } `}
                disabled={!isFormValid}
              >
                Log in
              </button>
            </form>
          </div>

          <p className="mt-7 text-center">OR</p>

          <div className="w-full md:w-[70%] lg:w-[60%] mt-8 mb-10 md:mb-0 space-y-3 px-5 md:px-0 mx-auto">
            <button
              className="w-full mx-auto py-2 border border-gray-300 md:h-[50px] text-black text-[18px] rounded-full font-semibold"
              onClick={handleGoogleClick}
            >
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={google_pic}
                  alt=""
                  className="w-5 h-5 py-0 px-0 ml-5 mt-2"
                />
                <span className="mt-1 font-semibold text-sm md:text-base text-center pr-2">
                  Continue up with Google
                </span>
              </div>
            </button>
          </div>

          {/* <div className='mt-[30px] text-center'>
            <span className='text-gray-500 '>Don't have an account? </span>
            <Link to='/student/signup'><span className='text-purple-500 underline'>Sign up.</span></Link>
          </div> */}
        </div>

        {/* <div className='mt-[30px] text-center'>
            <span className='text-gray-500 '>login as student </span>
            <Link to='/student/login'><span className='text-purple-500 underline'>login</span></Link>
          </div> */}
      </div>
    </div>
  );
}

export default Login;
