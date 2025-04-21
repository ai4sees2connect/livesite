import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "./server_url";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
// import { toast } from 'react-toastify';
const ForgetPasswordStudent = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [otpInput, setIsOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleVerifyOtp = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${api}/student/forget-pass/verify-otp`,
        {
          email: email,
          otp: otp,
        }
      );

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
      const response = await axios.post(`${api}/student/forget-pass/send-otp`, {
        email,
      });

      // Prompt user to enter the OTP
      toast.success("OTP sent to your email.");
      setSendingOtp(false);

      // Store email and other form data temporarily
      setIsOtpInput(true); // Show OTP input field
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occured");
      setSendingOtp(false);
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
        "Password must contain at least one uppercase , one lowercase , one number, and one special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Check if passwords match
    if (password && e.target.value !== password) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend to update the password
      setLoading(true);
      const response = await axios.put(`${api}/student/update-password`, {
        email, // Send the email of the student
        password, // Send the new password
      });

      toast.success("Password changed successfully");

      setTimeout(() => {
        navigate("/student/login");
      }, 1000);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("some error occured");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    email.trim() === verifiedEmail &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password.trim() === confirmPassword.trim() &&
    otp.trim() !== "" &&
    otpVerified;
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

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col items-center mt-40 space-y-5 h-screen px-4">
      <div>
        <h1 className="text-2xl">Reset your password</h1>
      </div>

      <div className="flex flex-col items-center w-full lg:w-[70%] border-2 p-5 rounded-md">
        <div className="flex flex-col w-full max-w-md">
          <div className="relative my-3">
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                if (!validateEmail(e.target.value)) {
                  setEmailError("The email does not look right. Try again.");
                } else setEmailError("");
              }}
              className="h-12 border border-gray-300 bg-gray-100 p-3 rounded-md w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            {validateEmail(email) && !sendingOtp && !otpInput && (
              <button
                className="absolute right-0 top-10 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2"
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
                  className={`absolute right-0 top-10 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2 ${
                    buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="button"
                  onClick={handleResendOtp}
                  disabled={buttonDisabled}
                >
                  {buttonDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              )}
            {otpVerified && (
              <button
                className="absolute right-0 top-8 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-3 py-1 text-center mr-2 mb-2"
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
                className="h-5 w-5 text-black absolute right-3 top-1/2 transform -translate-y-1/2"
              />
            )}
          </div>
          {emailError && (
            <p className="text-red-500 text-sm text-left mb-2">{emailError}</p>
          )}
          {otpInput && !otpVerified && (
            <div className="relative my-3">
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="h-12 border border-gray-300 bg-gray-100 p-3 rounded-md w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
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
          )}

          {otpVerified && (
            <div className="flex flex-col space-y-4 my-3">
              <div className="flex flex-col  relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  className="h-12 border border-gray-300 bg-gray-100 p-3 rounded-md w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                  className="absolute right-2 top-[45px] transform -translate-y-1/2"
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
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="h-12 border border-gray-300 bg-gray-100 p-3 rounded-md w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Confirm your new password"
                />
                {confirmError && (
                  <p className="mt-1 text-sm text-red-500">{confirmError}</p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleChangePassword}
                  disabled={!isFormValid}
                  className={`${
                    !isFormValid
                      ? "bg-gray-400 "
                      : "bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-800 hover:to-blue-500"
                  } text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out`}
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordStudent;
