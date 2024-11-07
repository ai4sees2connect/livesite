import React, { useEffect, useState, useRef } from "react";
import {
  FaBuilding,
  FaPlus,
  FaTimes,
  FaPen,
  FaPaperclip,
} from "react-icons/fa";
import getUserIdFromToken from "./auth/authUtilsRecr";
import { useNavigate, useParams } from "react-router-dom";
import { useRecruiter } from "./context/recruiterContext";
import Spinner from "../common/Spinner";
import api from "../common/server_url";
import axios from "axios";
import { toast } from "react-toastify";
import TimeAgo from "../common/TimeAgo";

const RecProfile = () => {
  const fileInputRef = useRef(null);
  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, recruiter } = useRecruiter();
  const token = localStorage.getItem("token");
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isCompanyEdit, setIsCompanyEdit] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyUrl, setCompanyUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (recruiter?.phone) {
      setPhoneNumber(recruiter.phone); // Set phoneNumber once recruiter data is loaded
    }
    if (recruiter?.countryCode) {
      setCountryCode(recruiter.countryCode);
    }
  }, [recruiter]);

  useEffect(() => {
    if (!token) {
      navigate("/recruiter/login");
      return;
    }
    console.log("id from token", idFromToken);
    console.log("id from params", userId);

    if (idFromToken !== userId) {
      logout(); //logout from studentContext to remove token and setToken to null in useeffect of context to trigger the useeffect of studentContext
      navigate("/recruiter/login");
      return;
    }
  }, [userId, idFromToken, token]);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(
          `${api}/recruiter/get-logo/${idFromToken}`,
          {
            responseType: "blob", // Fetching as a blob for image rendering
          }
        );
        console.log("response", response.status);

        const logoBlob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const Url = URL.createObjectURL(logoBlob);
        console.log("logoUrl", Url);
        console.log("logo", logo);
        setLogoUrl(Url);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Logo not found");
          setLogoUrl(null); // Set the logo URL to null if not found
        } else {
          console.error("Error fetching logo:", error);
        }
      }
    };
    fetchLogo();

    return () => {
      if (!logoUrl) {
        URL.revokeObjectURL(logoUrl);
        console.log("Blob URL revoked on cleanup:", logoUrl); // Optional: Add a log to confirm revocation
      }
    };
  }, [logo]);

  useEffect(() => {
    if (recruiter?.companyCertificate?.data) {
      const byteArray = new Uint8Array(recruiter.companyCertificate.data.data);
      const blob = new Blob([byteArray], {
        type: recruiter.companyCertificate.contentType,
      });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    }
  }, [recruiter]);

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    // if (!logo) return;

    const formData = new FormData();
    formData.append("logo", logo);

    try {
      // setUploading(true);
      const response = await axios.post(
        `${api}/recruiter/upload-logo/${idFromToken}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include token if needed for authorization
          },
        }
      );
      // setUploading(false);
      console.log("Logo uploaded successfully", response.data);
      toast.success("Logo uploaded successfully");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      // setUploading(false);
      console.error("Error uploading logo", error);
    }
  };

  const handleSelect = () => {
    fileInputRef.current.click();
  };

  const handleCompanySave = async () => {
    try {
      if (!companyName) {
        toast.error("Company name cannot be empty");
        return;
      }
      axios.put(`${api}/recruiter/api/${idFromToken}/add-company`, {
        companyName: companyName,
      });
      toast.success("Company added successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Error saving company");
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${api}/recruiter/delete-logo/${idFromToken}`);

      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
        console.log("Blob URL revoked:", logoUrl);
      }

      setLogo(null);
      setLogoUrl(null);
      toast.error("Logo deleted successfully");
    } catch (error) {
      console.error("Error deleting logo", error);
    }
  };
  console.log(companyName);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUrlInputChange = (e) => {
    setCompanyUrl(e.target.value);
  };

  const handleSubmit = async () => {
    // Check if either the company URL or the selected file is provided
    if (!companyUrl && !selectedFile) {
      toast.error(
        "Please provide either a company website URL or upload a certificate."
      );
      return;
    }

    try {
      let formData = new FormData();

      // Check if the company URL is provided
      if (companyUrl) {
        formData.append("companyWebsite", companyUrl);
      }

      // Check if the selected file is provided
      if (selectedFile) {
        formData.append("companyCertificate", selectedFile);
      }

      // Make an API call to submit the data
      const response = await axios.post(
        `${api}/recruiter/${idFromToken}/upload-details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Details submitted successfully!");
        // Reset the form after successful submission
        setCompanyUrl("");
        setSelectedFile(null);
        window.location.reload();
      } else {
        toast.error("Failed to submit details. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during submission. Please try again.");
      console.error(error);
    }
  };
  // Separate state for country code and phone number

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

  console.log(countryCode);
  console.log(phoneNumber);

  const handleContactUpdate = async () => {
    try {
      const response = await axios.put(
        `${api}/recruiter/update-Contact/${idFromToken}`,
        {
          phoneNumber,
          countryCode,
        }
      );

      // Handle success response (e.g., show success message, update UI, etc.)
      console.log("Contact updated:", response.data);
      toast.success("Contact updated successfully");
      window.location.reload();
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact. Please try again.");
    }
  };

  console.log(recruiter);

  return !recruiter ? (
    <Spinner />
  ) : (
    <div className="max-w-[1170px] mx-auto py-10 mt-[68px] min-h-screen px-3">
      <div className="border-2 rounded-lg flex flex-col items-center space-y-3 py-5">
        <h1 className="text-3xl font-bold mb-2 text-center">Profile</h1>
        <div className=" w-40 h-auto my-10 flex flex-col space-y-4 items-center">
          {!logoUrl ? (
            <FaBuilding className="text-gray-400 w-full h-full" />
          ) : (
            <img
              src={logoUrl}
              alt="Company Logo"
              className="w-full h-40 my-2 rounded-full"
            />
          )}

          {!logoUrl && !logo && (
            <>
              <div className="text-gray-500">Upload Company logo</div>
              <button
                onClick={handleSelect}
                className="w-[70%] inline-block mx-auto bg-gray-300 rounded-lg py-1 px-2 hover:bg-blue-200 hover:scale-105 duration-300"
              >
                Select Logo
              </button>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                className="my-2 hover:cursor-pointer w-full hidden"
              />
            </>
          )}
          {logo && (
            <button
              type="submit"
              onClick={handleFileUpload}
              className={`  bg-gray-300 rounded-lg py-0 mt-4 px-2 hover:bg-green-200 hover:scale-105 duration-300  `}
            >
              UPLOAD
            </button>
          )}
          {logoUrl && (
            <button
              className="text-blue-500 underline w-full"
              onClick={handleDelete}
            >
              Change Logo
            </button>
          )}
        </div>
        {/* box */}
        {/* firstname and lastname */}
        <div className="flex flex-col md:flex-row gap-5 w-full  lg:w-[70%] px-3 lg:px-0">
          {/* first name */}
          <div className="relative w-full">
            <div className="flex flex-col">
              <label>First Name</label>
              <input
                className="border-2 rounded-lg px-3 py-1"
                defaultValue={recruiter?.firstname}
                type="text"
              />
            </div>
            {/* change button for first name */}
            <div className="p-2 bg-green-200 absolute right-3 top-[27px] rounded-lg">
              <FaPen className="text-sm text-gray-600 hover:cursor-pointer " />
            </div>
          </div>
          {/* Last Name */}
          <div className="relative w-full">
            <div className="flex flex-col w-full">
              <label>Last Name</label>
              <input
                className="border-2 rounded-lg px-3 py-1"
                defaultValue={recruiter?.lastname}
                type="text"
              />
            </div>
            {/* chnage button for last name */}
            <div className="p-2 bg-green-200 absolute right-3 top-[27px] rounded-lg">
              <FaPen className="text-sm text-gray-600 hover:cursor-pointer " />
            </div>
          </div>
        </div>

        {/* recruiter email & company name */}
        <div className="flex flex-col items-end md:flex-row gap-5 w-full  lg:w-[70%] px-3 lg:px-0">
          {/* Recruiter email */}
          <div className="relative w-full">
            <div className="flex flex-col">
              <label>Recruiter Email</label>
              <input
                className="border-2 rounded-lg px-3 py-1"
                defaultValue={recruiter?.email}
                type="text"
              />
            </div>
            {/* change button for recruiter email */}
            <div className="p-2 bg-green-200 absolute right-3 top-[27px] rounded-lg">
              <FaPen className="text-sm text-gray-600 hover:cursor-pointer " />
            </div>
          </div>

          {/* company name */}
          <div className="w-full">
            {recruiter.companyName && (
              <div className="relative">
                <div className="flex flex-col">
                  <label>Company Name</label>
                  <input
                    className="border-2 rounded-lg px-3 py-1"
                    defaultValue={recruiter?.companyName}
                    type="text"
                  />
                </div>
                {/* change button for company */}
                <div className="p-2 bg-green-200 absolute right-3 top-[27px] rounded-lg">
                  <FaPen
                    onClick={() => setIsCompanyEdit(true)}
                    className="text-sm text-gray-600 hover:cursor-pointer "
                  />
                </div>
              </div>
            )}
            {!isCompanyEdit && !recruiter.companyName && (
              <button
                onClick={() => setIsCompanyEdit(true)}
                className="bg-blue-500 text-white px-2 py-1"
              >
                Add Company Name
              </button>
            )}
            {isCompanyEdit && (
              <>
                <div className=" flex space-x-3 items-center mt-3 relative">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="border-2 border-gray-400 px-3 py-1 rounded-lg w-full text-center"
                  />
                  <FaTimes
                    onClick={() => {
                      setIsCompanyEdit(false);
                      setCompanyName("");
                    }}
                    className="hover:cursor-pointer w-5 h-5 absolute right-2"
                  />
                </div>
                <button
                  onClick={handleCompanySave}
                  className="px-3 py-1 rounded-lg bg-green-300 hover:bg-green-500 my-2"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* phone number */}
        {/* <h1 className=" text-gray-600 ">Ph no- {recruiter.phone}</h1> */}
        {/* country code */}

        <div className="bg-white rounded-lg w-full lg:w-[70%]">
          <div className="flex flex-col justify-center md:flex-row gap-2 mt-2 px-3 md:px-0 border-2 md:border-0 py-2 md:py-0 mx-3 rounded-lg">
            {/* Country Code Dropdown */}
            <div className="flex items-center">
              <label className="text-gray-500 mr-2">Country Code</label>
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setPhoneNumber(phoneNumber); // Triggers a re-render
                }}
                className="text-sm outline-none rounded-lg h-full border border-gray-300 p-2"
              >
                <option value="+1">US (+1)</option>
                <option value="+91">IND (+91)</option>
                <option value="+44">EU (+44)</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="flex items-center">
              <label className="text-gray-500 mr-2">Phone</label>
              <input
                type="number"
                defaultValue={recruiter?.phone}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                placeholder="Phone number"
              />
            </div>

            <div>
              <button
                onClick={handleContactUpdate}
                disabled={phoneNumber?.length < 10 || !phoneNumber}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition duration-200 w-full mt-3 md:mt-0
                ${
                  phoneNumber?.length < 10
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                }`}
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {!recruiter.companyWebsite && !recruiter.companyCertificate && (
          <div className="flex flex-col space-y-3  justify-center">
            {/* Trigger button to open popup */}
            <p className="text-red-400">
              Upload company's incorporation certificate or Official website
              link
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Upload PDF or Enter URL
            </button>

            {/* Modal Popup */}
            {isModalOpen && (
              <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-50 z-50 mt-10">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] flex flex-col space-y-4 justify-between relative">
                  {/* File Upload Section */}
                  <FaTimes
                    className="absolute right-3 top-3 text-red-500 hover:cursor-pointer"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedFile(null);
                      setCompanyUrl("");
                    }}
                  />
                  <div className="flex justify-center items-center">
                    {!companyUrl && (
                      <div className="w-[45%] flex flex-col items-center justify-center">
                        <input
                          id="fileinput"
                          type="file"
                          onChange={handleFileInput}
                          className="hidden"
                          accept=".pdf"
                        />
                        <label
                          htmlFor="fileinput"
                          className="text-blue-500 text-lg hover:cursor-pointer hover:scale-105 duration-300"
                        >
                          <span>Upload PDF</span>
                        </label>
                        {selectedFile && <p>{selectedFile.name}</p>}
                      </div>
                    )}

                    {/* OR Divider */}
                    {!selectedFile && !companyUrl && (
                      <div className="w-[10%] flex items-center justify-center">
                        <span className="text-gray-400">OR</span>
                      </div>
                    )}

                    {/* URL Input Section */}
                    {!selectedFile && (
                      <div className="w-[45%] flex flex-col items-center">
                        <input
                          type="text"
                          placeholder="Enter company's website URL"
                          onChange={handleUrlInputChange}
                          className="border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleSubmit();
                    }}
                    className="bg-green-500 text-white mt-2 py-2 px-4 rounded hover:bg-green-700 "
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {pdfUrl && (
          <>
            <a
              href={pdfUrl}
              download={recruiter.companyCertificate.filename}
              className="text-blue-500"
            >
              Download Company Incorporation Certificate
            </a>
            <p className="text-gray-600">
              (
              {`Uploaded ${TimeAgo(recruiter.companyCertificate.uploadedDate)}`}
              )
            </p>
            <p className="text-gray-600">
              Verification:
              <span
                className={`${
                  recruiter.companyCertificate.status === "pending"
                    ? "text-yellow-500"
                    : recruiter.companyCertificate.status === "Verified"
                    ? "text-green-500"
                    : recruiter.companyCertificate.status === "Rejected"
                    ? "text-red-500"
                    : ""
                }`}
              >
                {recruiter.companyCertificate.status}
              </span>
            </p>
            {recruiter.companyCertificate.status !== "Verified" && (
              <>
                <p className="text-red-400">
                  We will verify your certificate shortly!
                </p>
                <p className="text-red-400 text-center">
                  (Estimated time-24hrs)
                </p>
              </>
            )}
          </>
        )}

        {recruiter.companyWebsite && (
          <div className="my-4">
            <p className="text-blue-500 text-center">
              {recruiter.companyWebsite.link}
            </p>
            <p className="text-gray-700 text-center">
              Verification: {recruiter.companyWebsite.status}
            </p>
            {recruiter?.companyWebsite.status !== "Verified" && (
              <>
                <p className="text-red-400">
                  We will verify your provided link shortly!
                </p>
                <p className="text-red-400 text-center">
                  (Estimated time-24hrs)
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecProfile;
