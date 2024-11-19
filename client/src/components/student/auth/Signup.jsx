import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import google_pic from "../../../images/google_pic.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getUserIdFromToken from "./authUtils";
import { auth, provider } from "../../common/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useStudent } from "../context/studentContext";
import login_bg from "../../../images/login_bg.jpeg";
import ToggleButton from "../../common/ToggleButton";
import ToggleButtonSecond from "../../common/ToogleButtonSecond";
import api from "../../common/server_url";
import Spinner from "../../common/Spinner";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import GoBackButton from "../../common/GoBackButton";
function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const { login } = useStudent();
  const [otpInput, setIsOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login();
      navigate(`/student/dashboard/${userId}`);
    }
  }, [userId]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Define the regex pattern
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (newPassword.trim().length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        "Password must contain at least one uppercase , one lowercase , one number, and any one of special characters from @,$,!,%,*,?,&"
      );
    } else {
      setPasswordError("");
    }
  };

  const validateEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission

    if (!validateEmail(email)) {
      setEmailError("The email does not look right. Try again.");
      return;
    }
    setEmailError("");
    try {
      // Send a POST request to the backend
      const response = await axios.post(`${api}/student/signup`, {
        firstname,
        lastname,
        email,
        password,
      });

      // Handle success
      toast.success("You are Signed in");
      localStorage.setItem("token", response.data.token); // Store token if needed
      login();
      const userId = getUserIdFromToken();
      console.log(response.data.token);
      navigate(`/student/dashboard/${userId}`);
    } catch (error) {
      // Handle error
      toast.error(error.response.data.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${api}/student/verify-otp`, {
        email: email,
        otp: otp,
      });

      if (response.status === 200) {
        // OTP verified successfully
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
      } else {
        // Something went wrong, show the error message
        toast.error(response.data.message);
        setOtpVerified(false);
      }
    } catch (error) {
      if (error.response) {
        // If the request was made and the server responded with a status code that falls out of the range of 2xx
        toast.error(error.response.data.message);
      } else {
        // Something else went wrong (e.g., network error)
        toast.error("An error occurred while verifying the OTP");
      }
      console.error("Error verifying OTP:", error);
    }
  };

  const handleSendOtp = async (e) => {
    try {
      e.preventDefault();
      if (!validateEmail(email)) {
        setEmailError("The email does not look right. Try again.");
        return;
      }
      setEmailError("");
      setSendingOtp(true);
      const response = await axios.post(`${api}/student/send-otp`, { email });

      // Prompt user to enter the OTP
      toast.success("OTP sent to your email.");
      setSendingOtp(false);

      // Store email and other form data temporarily
      setIsOtpInput(true); // Show OTP input field
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    }
  };

  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    firstname.trim() !== "" &&
    lastname.trim() !== "" &&
    otp.trim() !== "" &&
    otpVerified;

  const handleGoogleClick = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      const firstname = user.displayName.split(" ")[0];
      const lastname = user.displayName.split(" ")[1] || "";

      const response = await axios.post(`${api}/student/signup/googleauth`, {
        email,
        firstname,
        lastname,
      });

      if (response.data.success) {
        toast.success("You are Signed in");
        const token = response.data.token;
        localStorage.setItem("token", token);
        login();
        const userId = getUserIdFromToken();
        navigate(`/student/dashboard/${userId}`);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="flex mt-10 md:mt-0 min-h-screen">
      <div className="relative flex-1 hidden lg:block ">
        <img src={login_bg} alt="" className=" w-full h-full" />
      </div>
      <div className="flex-1 mx-auto w-[90%] mb-20">
        {/* back button */}
        <div className="absolute left-0 top-5  rounded-full">
        <Link
            to="/"
            className="px-5 py-1 text-blue-400  font-semibold"
          >
            <GoBackButton/>
          </Link>
        </div>
        <div className="flex flex-col items-center mt-[20px]">
          <p className="text-3xl lg:text-5xl font-extrabold mb-5 md:mb-12">
            Sign up
          </p>
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-5  md:items-center">
            <ToggleButton type="student" auth="signup" />
            <ToggleButtonSecond type="student" auth="signup" />
          </div>
        </div>
        <div>
          {/* form starts from here */}

          <div className="flex justify-center items-center mt-[40px] md:mt-[36px] w-full ">
            <form className="space-y-4 w-[80%] lg:w-[60%]  md:max-w-xl px-5 lg:px-0">
              <div className="mx-auto md:max-w-xl">
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  placeholder="Enter Your First Name"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (e.target.value.trim() === "") {
                      setNameError("Give complete name");
                    } else setNameError("");
                  }}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-full"
                />
                {nameError && (
                  <p className="text-red-500 text-left w-full">{nameError}</p>
                )}
              </div>

              <div className="flex flex-col items-center">
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  placeholder="Enter Your Last Name"
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (e.target.value.trim() === "") {
                      setNameError("Give complete name");
                    } else setNameError("");
                  }}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-full"
                />
                {nameError && (
                  <p className="text-red-500 text-left w-full">{nameError}</p>
                )}
              </div>

              <div className="flex flex-col items-center relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!validateEmail(e.target.value)) {
                        setEmailError(
                          "The email does not look right. Try again."
                        );
                      } else setEmailError("");
                    }}
                    className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-full"
                    required
                  />
                  {validateEmail(email) && !sendingOtp && !otpInput && (
                    <button
                      className="border border-blue-500 bg-white text-blue-500 text-left absolute right-3 sm:-right-[70px] sm:top-3 text-xxs sm:text-sm top-3 rounded-md px-0.5 py-0.5 shadow-md hover:shadow-lg transition-shadow duration-200"
                      onClick={handleSendOtp}
                    >
                      Send OTP
                    </button>
                  )}
                        {validateEmail(email) && !sendingOtp && otpInput && (
                  <button
                    className="border border-blue-500 bg-white text-blue-500 text-left absolute right-2 sm:-right-[80px] sm:top-3 text-xxs sm:text-sm top-5 rounded-md px-0.5 py-1 shadow-md hover:shadow-lg transition-shadow duration-200"
                    onClick={handleSendOtp}
                  >
                    Resend otp
                  </button>
                )}


                  {sendingOtp && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className="h-5 w-5 text-black absolute right-2 top-4"
                    />
                  )}
      
                {emailError && (
                  <p className="text-red-500 text-left w-full">{emailError}</p>
                )}
                {otpInput && (
                  <div className="relative my-3 w-full">
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter otp"
                      className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md pr-20 w-full"
                    />
                    {!otpVerified ? (
                      <button
                        onClick={handleVerifyOtp}
                        className="border border-blue-500 bg-white text-blue-500 text-left absolute right-3 sm:-right-[45px] sm:top-3 text-xxs sm:text-sm top-3 rounded-md px-0.5 py-1 shadow-md hover:shadow-lg transition-shadow duration-200"
                      >
                        Verify
                      </button>
                    ) : (
                      <div className="absolute flex items-center space-x-1 right-3 sm:-right-[78px] top-4 sm:top-3 text-green-500 text-xs sm:text-base">
                        <FaCheckCircle />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md pr-10 w-full"
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-left w-full">
                    {passwordError}
                  </p>
                )}

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

              <button
                onClick={handleSubmit}
                className={`w-full py-2 bg-[rgb(129,41,217)] border-none h-[50px] text-white rounded-full ${
                  !isFormValid ? `bg-[rgb(224,226,217)]` : ""
                } `}
                disabled={!isFormValid}
              >
                Create Account
              </button>
            </form>
          </div>

          <p className="mt-5 text-center">OR</p>

          <div className="w-[70%] mx-auto mt-8 mb-10 md:mb-0 space-y-3">
            <button
              onClick={handleGoogleClick}
              className="w-full mx-auto py-2 border border-gray-300 md:h-[50px] text-black text-[18px] rounded-full font-semibold"
            >
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={google_pic}
                  alt=""
                  className="w-5 h-5 py-0 px-0 ml-5 mt-2"
                />
                <span className="mt-1 text-sm md:text-base text-center pr-2">
                  Sign up with Google
                </span>
              </div>
            </button>
            {/* <button
            className='w-full py-2 border border-gray-300 h-[50px] text-black text-[18px] rounded-full font-semibold'
          >
            <div className='inline-flex space-x-1 ml-0'>
            <img src={apple_pic} alt="" className='w-10 h-10 py-0 px-0 ml-5 mt-[-4px]'/>
            <span className='mt-1'>Sign up with Apple</span>
            </div>
          </button> */}
          </div>

          {/* <div className='flex justify-center items-center space-x-7 mt-3'>
          <div className='  flex '>
            <span className='text-gray-500 '>Already have an account?</span>
            <Link to='/student/login'><span className='text-purple-500 underline'>Log in</span></Link>
          </div>

          <div className=' flex items-center'>
            <span className='text-gray-500 '>Sign up as recruiter?</span>
            <Link to='/recruiter/signup'><span className='text-purple-500 underline'>&nbsp;Sign up</span></Link>
          </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Signup;
