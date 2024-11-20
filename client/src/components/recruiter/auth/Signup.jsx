import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import google_pic from "../../../images/google_pic.png";
import recruiter_bg from "../../../images/intern_pic.jpeg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getUserIdFromToken from "../auth/authUtilsRecr";
import { auth, provider } from "../../common/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleButton from "../../common/ToggleButton";
import ToggleButtonSecond from "../../common/ToogleButtonSecond";
import api from "../../common/server_url";
import { FaCheckCircle } from "react-icons/fa";
import GoBackButton from "../../common/GoBackButton";
function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const [countryCode, setCountryCode] = useState("+91");
  const [otpInput, setIsOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/recruiter/dashboard/${userId}`);
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

  const handleVerifyOtp = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${api}/recruiter/verify-otp`, {
        email: email,
        otp: otp,
      });

      if (response.status === 200) {
        // OTP verified successfully
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
        setVerifiedEmail(email);
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
      const response = await axios.post(`${api}/recruiter/send-otp`, { email });

      // Prompt user to enter the OTP
      toast.success("OTP sent to your email.");
      setSendingOtp(false);

      // Store email and other form data temporarily
      setIsOtpInput(true); // Show OTP input field
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    }
  };
  const handleResendOtp = async (e) => {
    try {
      await handleSendOtp(e);
      setButtonDisabled(true);
      setCountdown(30);
    } catch (error) {
      console.error("Error in handleResendOtp:", error);
    }
  };

  const isFormValid =
    email.trim() === verifiedEmail &&
    password.trim() !== "" &&
    firstname.trim() !== "" &&
    lastname.trim() !== "" 
    // &&
    // otp.trim() !== "" &&
    // otpVerified;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission

    if (!validateEmail(email)) {
      setEmailError("The email does not look right. Try again.");
      return;
    }
    if (phone.length < 10) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    setEmailError("");
    console.log("new phone no is", countryCode + " " + phone);
    try {
      // Send a POST request to the backend
      const response = await axios.post(`${api}/recruiter/signup`, {
        firstname,
        lastname,
        email,
        phone,
        countryCode,
        password,
      });

      // Handle success
      toast.success("You are Signed in");
      localStorage.setItem("token", response.data.token); // Store token if needed
      const userId = getUserIdFromToken();
      console.log(response.data.token);
      navigate(`/recruiter/dashboard/${userId}`);
    } catch (error) {
      // Handle error
      toast.error(error.response.data.message);
    }
  };

  const handleGoogleClick = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      const firstname = user.displayName.split(" ")[0];
      const lastname = user.displayName.split(" ")[1] || "";

      const response = await axios.post(`${api}/recruiter/signup/googleauth`, {
        email,
        firstname,
        lastname,
      });

      if (response.data.success) {
        toast.success("You are Signed in");
        const token = response.data.token;
        localStorage.setItem("token", token);
        const userId = getUserIdFromToken();
        navigate(`/recruiter/dashboard/${userId}`);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

  // resend button
  const [countdown, setCountdown] = useState(30);
  const [buttonDisabled, setButtonDisabled] = useState(true);

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

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [buttonDisabled]);

  return (
    <div className="flex mt-10 md:mt-0 min-h-screen">
      <div className="relative flex-1 hidden lg:block">
        <img
          src={recruiter_bg}
          alt=""
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <div className="mx-auto flex-1 mb-20 min-h-[635px]">
        {/* back button */}
        <div className="absolute left-0 top-5  rounded-full">
          <Link to="/" className="px-5 py-1 text-blue-400  font-semibold">
            <GoBackButton />
          </Link>
        </div>
        <div className=" flex flex-col items-center mt-[20px]">
          <p className="text-5xl font-extrabold mb-8 md:mb-6 mt-10 lg:mt-0">
            Sign up
          </p>
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-5  md:items-center mt-5 md:mt-6">
            <ToggleButton type="recruiter" auth="signup" />
            <ToggleButtonSecond type="recruiter" auth="signup" />
          </div>
          {/* <p className='text-gray-500 text-lg'>Recruiter Sign up</p> */}
        </div>
        <div>
          {/* form starts from here */}

          <div className="flex justify-center items-center mt-[40px] md:mt-[36px] w-full">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 w-full lg:w-[60%]  md:max-w-xl px-5 lg:px-0"
            >
              <div className="flex flex-col items-center">
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
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-full relative"
                  required
                />

                {/* {validateEmail(email) && !sendingOtp && !otpInput && (
                  <button
                    className="absolute right-0 top-[50%] -translate-y-[50%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2"
                    type="button"
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </button>
                )} */}
                {/* {validateEmail(email) &&
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
                  )} */}
                {/* {otpVerified && (
                  <button
                    className="absolute right-0 top-[50%] -translate-y-[50%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2"
                    type="button"
                  >
                    <div className="flex gap-2 items-center">
                      <FaCheckCircle />
                      <span> Verified</span>
                    </div>
                  </button>
                )} */}

                {/* {sendingOtp && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="h-5 w-5 text-black absolute right-2 top-4"
                  />
                )} */}

                {/* {otpInput && !otpVerified && (
                  <div className="relative my-3 w-full">
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter otp"
                      className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md pr-20 w-full relative"
                    />

                    {!otpVerified && (
                      <button
                        className="absolute right-0 top-[50%] -translate-y-[50%] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2"
                        type="button"
                        onClick={handleVerifyOtp}
                      >
                        Verify OTP
                      </button>
                    )}
                  </div>
                )} */}
              </div>
              {emailError && (
                <p className="text-red-500 text-left w-full">{emailError}</p>
              )}

              {!otpVerified && (
                <div className="flex flex-col items-start">
                  <div className="flex  justify-start md:flex-row gap-2 mt-[6.5px] w-full">
                    {/* Country Code Dropdown */}
                    <div className="flex items-center">
                      <select
                        value={countryCode}
                        onChange={handleCountryChange}
                        className="text-sm outline-none rounded-lg h-full border border-gray-300 p-2"
                      >
                        <option value="+1">US (+1)</option>
                        <option value="+91">IND (+91)</option>
                        <option value="+44">EU (+44)</option>
                      </select>
                    </div>

                    {/* Phone Number */}
                    <div className="w-full">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                        placeholder="Phone number"
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (e.target.value.trim().length < 10) {
                            setPhoneError("Enter a valid phone number");
                          } else setPhoneError("");
                        }}
                      />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="text-red-500 text-left w-full mb-0">
                      {phoneError}
                    </p>
                  )}
                </div>
              )}

              {!otpVerified && (
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
                    <p className="text-red-500 text-left w-full mb-0">
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
              )}

              <button
                type="submit"
                className={`w-full py-2 bg-blue-400 border-none h-[50px] text-white rounded-full ${
                  !isFormValid ? `bg-[rgb(224,226,217)]` : ""
                } `}
                // disabled={!isFormValid}
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
                <span className="mt-1 font-semibold text-sm md:text-base text-center pr-2">
                  Sign up with Google
                </span>
              </div>
            </button>
          </div>

          {/* <div className='flex space-x-3 justify-center items-center mt-3'>
          <div >
            <span className='text-gray-500 '>Already have an account? </span>
            <Link to='/student/login'><span className='text-purple-500 '>Log in</span></Link>
          </div>

          <div>
            <span className='text-gray-500 '>Sign up as Student?</span>
            <Link to='/student/signup'><span className='text-purple-500 '>&nbsp;Sign up</span></Link>
          </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Signup;
