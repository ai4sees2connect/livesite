import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import google_pic from "../../../images/google_pic.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getUserIdFromToken from "./authUtils";
import { auth, provider } from "../../common/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStudent } from "../context/studentContext";
import login_bg from "../../../images/login_bg.jpeg";
import ToggleButton from "../../common/ToggleButton";
import ToggleButtonSecond from "../../common/ToogleButtonSecond";
import api from "../../common/server_url";
import Spinner from "../../common/Spinner";
import GoBackButton from "../../common/GoBackButton";
import { FaCheckCircle } from "react-icons/fa";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const { login } = useStudent();
  const [otpInput, setIsOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
    //const userIdFromToken = getUserIdFromToken();
      if (userId){
        login();
        navigate(`/student/dashboard/${userId}`);
      } else {
        // Optionally clear an invalid token and notify the user
        localStorage.removeItem("token");
        toast.error("Token not found or invalid. Please log in again.");
      }
    }
  }, [login, navigate, userId]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Define the regex pattern
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (newPassword.trim().length === 20) {
      setPasswordError("Password must not exceed 20 characters");
    } else if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        "Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character from @, $, !, %, *, ?, &"
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
  
    if (!validateEmail(email)) {
      setEmailError("The email does not look right. Try again.");
      return;
    }
    setEmailError("");
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${api}/student/signup`, {
        firstname,
        lastname,
        email,
        password,
      });
  
      if (!data.token) {
        toast.error("Signup failed: Token not received from server.");
        return;
      }
  
      toast.success("You are Signed in");
      localStorage.setItem("token", data.token); // Store token if needed
      login();
      const userId = getUserIdFromToken();
      console.log(data.token);
      navigate(`/student/dashboard/${userId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during signup.");
    } finally {
      setIsSubmitting(false);
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
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
        setVerifiedEmail(email);
      } else {
        setOtpError(response.data.message);
        setOtpVerified(false);
      }
    } catch (error) {
      if (error.response) {
        setOtpError(error.response.data.message);
      } else {
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
      await axios.post(`${api}/student/send-otp`, { email });
      toast.success("OTP sent to your email.");
      setSendingOtp(false);
      setIsOtpInput(true);
    } catch (error) {
      setEmailError(error.response?.data?.message || "Error sending OTP");
      setSendingOtp(false);
      setButtonDisabled(false);
    }
  };

  const handleResendOtp = async (e) => {
    try {
      await handleSendOtp(e);
      setButtonDisabled(true);
      setCountdown(60);
    } catch (error) {
      console.error("Error in handleResendOtp:", error);
    }
  };

  const isFormValid =
    email.trim() === verifiedEmail &&
    password.trim() !== "" &&
    firstname.trim() !== "" &&
    lastname.trim() !== "" &&
    otp.trim() !== "" &&
    passwordError === "" &&
    otpVerified;

  const handleGoogleClick = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      const firstname = user.displayName.split(" ")[0];
      const lastname = user.displayName.split(" ")[1] || "";
      const { data } = await axios.post(`${api}/student/signup/googleauth`, {
        email,
        firstname,
        lastname,
      });
      if (data.success) {
        toast.success("You are Signed in");
        localStorage.setItem("token", data.token);
        login();
        navigate(`/student/dashboard/${getUserIdFromToken()}`);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  useEffect(() => {
    let timer;
    if (buttonDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(timer);
          setButtonDisabled(false); // Enable the button after countdown ends
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [buttonDisabled]);

  return (
    <div className="flex mt-10 md:mt-0 min-h-screen">
      <div className="relative flex-1 hidden lg:block ">
        <img src={login_bg} alt="" className=" w-full h-full" />
      </div>
      <div className="flex-1 mx-auto w-[90%] mb-20 min-h-[635px]">
        <div className="absolute left-0 top-5  rounded-full">
          <Link to="/" className="px-5 py-1 text-blue-400  font-semibold">
            <GoBackButton />
          </Link>
        </div>
        <div className="flex flex-col items-center mt-[20px]">
          <p className="text-5xl font-extrabold mb-5 md:mb-12 mt-10 lg:mt-0">
            Sign up
          </p>
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-5  md:items-center mt-8 md:mt-0">
            <ToggleButton type="student" auth="signup" />
            <ToggleButtonSecond type="student" auth="signup" />
          </div>
        </div>
        <div>
          <div className="flex flex-col justify-center items-center mt-[40px] md:mt-[36px] w-full ">
            <form className="space-y-4 w-full lg:w-[60%]  md:max-w-xl px-5 lg:px-0">
              <div className="mx-auto md:max-w-xl">
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  placeholder="Enter Your First Name"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const regex = /^[A-Za-z\s]*$/;
                    if (inputValue === "") {
                      setFirstNameError("Field cannot be empty");
                      setFirstName(inputValue);
                    } else if (!regex.test(inputValue)) {
                      setFirstNameError("Only alphabets are allowed");
                    } else if (inputValue.length > 12) {
                      setFirstNameError("Name should not exceed 12 characters");
                    } else {
                      setFirstNameError("");
                      setFirstName(inputValue);
                    }
                  }}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-full"
                />
                {firstNameError && (
                  <p className="text-red-500 text-left w-full mb-0">
                    {firstNameError}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center">
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  placeholder="Enter Your Last Name"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const regex = /^[A-Za-z\s]*$/;
                    if (inputValue === "") {
                      setLastNameError("Field cannot be empty");
                      setLastName(inputValue);
                    } else if (!regex.test(inputValue)) {
                      setLastNameError("Only alphabets are allowed");
                    } else if (inputValue.length > 12) {
                      setLastNameError("Name should not exceed 12 characters");
                    } else {
                      setLastNameError("");
                      setLastName(inputValue);
                    }
                  }}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-full"
                />
                {lastNameError && (
                  <p className="text-red-500 text-left w-full mb-0">
                    {lastNameError}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                {firstname && lastname && (
                  <div className="flex relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setOtpVerified(false);
                        setOtp("");
                        if (!validateEmail(e.target.value)) {
                          setEmailError("The email does not look right. Try again.");
                        } else setEmailError("");
                      }}
                      className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-full relative"
                      required
                    />
                    {validateEmail(email) && !sendingOtp && !otpInput && (
                      <button
                        className="absolute right-0 top-[50%] -translate-y-[50%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2"
                        type="button"
                        onClick={handleSendOtp}
                      >
                        Send OTP
                      </button>
                    )}
                    {validateEmail(email) &&
                      !sendingOtp &&
                      otpInput &&
                      !otpVerified && (
                        <button
                          className={`absolute right-0 top-2.5 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2 ${
                            buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          type="button"
                          onClick={handleResendOtp}
                          disabled={buttonDisabled}
                        >
                          {buttonDisabled
                            ? `Resend in ${countdown}s`
                            : "Resend OTP"}
                        </button>
                      )}
                    {otpVerified && (
                      <button
                        className="absolute right-0 top-[50%] -translate-y-[50%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2"
                        type="button"
                      >
                        <div className="flex gap-2 items-center">
                          <FaCheckCircle />
                          <span> Verified</span>
                        </div>
                      </button>
                    )}
                    {sendingOtp && (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="h-5 w-5 text-black absolute right-2 top-4"
                      />
                    )}
                  </div>
                )}
                {emailError && (
                  <p className="text-red-500 text-left w-full px-2">{emailError}</p>
                )}
                {otpInput && !otpVerified && (
                  <div className="relative my-3 w-full">
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter otp"
                      className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md pr-20 w-full"
                    />
                    {!otpVerified && (
                      <button
                        className="absolute right-0 top-[50%] -translate-y-[50%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-4"
                        type="button"
                        onClick={handleVerifyOtp}
                      >
                        Verify OTP
                      </button>
                    )}
                    {otpError && (
                      <p className="text-red-500 text-left w-full px-2">{otpError}</p>
                    )}
                  </div>
                )}
              </div>

              {otpVerified && (
                <div className="flex flex-col items-center relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    placeholder="Password"
                    onChange={handlePasswordChange}
                    className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md pr-10 w-full"
                    required
                    maxLength={20}
                  />
                  {passwordError && (
                    <p className="text-red-500 text-left w-full">{passwordError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handlePasswordToggle}
                    className="absolute right-2 top-[24px] transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEye} className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className={`w-full py-2 border-none h-[50px] text-gray-700 rounded-full 
                  ${isFormValid ? "bg-blue-500 text-white" : "bg-[rgb(228,228,215)] cursor-not-allowed"}`}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? <Spinner /> : "Create Account"}
              </button>
            </form>

            <div className="w-full md:w-[70%] lg:w-[60%] mt-8 mb-10 md:mb-0 space-y-3 px-5 md:px-0">
              <p className="mb-5 text-center">OR</p>
              <button
                onClick={handleGoogleClick}
                className="w-full mx-auto py-2 border border-gray-300 md:h-[50px] text-black text-[18px] rounded-full font-semibold"
              >
                <div className="flex items-center justify-center space-x-4">
                  <img src={google_pic} alt="" className="w-5 h-5 py-0 px-0 ml-5 mt-2" />
                  <span className="mt-1 text-sm md:text-base text-center pr-2">
                    Sign up with Google
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;