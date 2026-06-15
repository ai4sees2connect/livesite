import React, { useEffect, useState, useRef } from "react";
import {
  FaBuilding,
  FaPlus,
  FaTimes,
  FaPen,
  FaPaperclip,
  FaUpload,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import getUserIdFromToken from "./auth/authUtilsRecr";
import {
  MdVerifiedUser,
  MdOutlinePendingActions,
  MdOutlineCancel,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosBriefcase } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useRecruiter } from "./context/recruiterContext";
import Spinner from "../common/Spinner";
import api from "../common/server_url";
import axios from "axios";
import { toast } from "react-toastify";
import TimeAgo from "../common/TimeAgo";
import countryData from "../TESTJSONS/countries+states+cities.json";
import Select from "react-select";

const RecProfile = () => {
  const fileInputRef = useRef(null);
  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, recruiter, refreshData } = useRecruiter();
  const token = localStorage.getItem("token");

  // UI States
  const [activeTab, setActiveTab] = useState("Tab1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyUrl, setCompanyUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [progress, setProgress] = useState(0);

  // Form States - Personal
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  // Form States - Organization
  const [company, setCompany] = useState("");
  const [independentCheck, setIndependentCheck] = useState(false);
  const [companyDesc, setCompanyDesc] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");

  // Derived states
  const [companyPresent, setCompanyPresent] = useState(false);
  const [linkPresent, setLinkPresent] = useState(false);

  const [hasShownCompletionToast, setHasShownCompletionToast] = useState(false);

  // Country codes for phone
  const countryCodes = [
    { value: "+1", label: "🇺🇸 +1 (USA)" },
    { value: "+44", label: "🇬🇧 +44 (UK)" },
    { value: "+91", label: "🇮🇳 +91 (India)" },
    { value: "+61", label: "🇦🇺 +61 (Australia)" },
    { value: "+81", label: "🇯🇵 +81 (Japan)" },
    { value: "+49", label: "🇩🇪 +49 (Germany)" },
    { value: "+33", label: "🇫🇷 +33 (France)" },
    { value: "+39", label: "🇮🇹 +39 (Italy)" },
    { value: "+86", label: "🇨🇳 +86 (China)" },
    { value: "+55", label: "🇧🇷 +55 (Brazil)" },
    { value: "+7", label: "🇷🇺 +7 (Russia)" },
    { value: "+27", label: "🇿🇦 +27 (South Africa)" },
    { value: "+34", label: "🇪🇸 +34 (Spain)" },
    { value: "+971", label: "🇦🇪 +971 (UAE)" },
    { value: "+62", label: "🇮🇩 +62 (Indonesia)" },
    { value: "+90", label: "🇹🇷 +90 (Turkey)" },
    { value: "+82", label: "🇰🇷 +82 (South Korea)" },
    { value: "+234", label: "🇳🇬 +234 (Nigeria)" },
    { value: "+92", label: "🇵🇰 +92 (Pakistan)" },
    { value: "+52", label: "🇲🇽 +52 (Mexico)" },
  ];

  // Industry suggestions
  const suggestions = [
    "Accounting",
    "Advertising",
    "Aerospace",
    "Agriculture",
    "Apparel & Fashion",
    "Architecture & Planning",
    "Arts & Crafts",
    "Automotive",
    "Aviation & Aerospace",
    "Banking",
    "Biotechnology",
    "Broadcast Media",
    "Computer Software",
    "Construction",
    "Education Management",
    "Financial Services",
    "Health, Wellness & Fitness",
    "Hospital & Health Care",
    "Human Resources",
    "Information Technology & Services",
    "Insurance",
    "Legal Services",
    "Marketing & Advertising",
    "Pharmaceuticals",
    "Real Estate",
    "Retail",
    "Telecommunications",
    "Transportation",
    "Utilities",
  ].map((item) => ({ label: item, value: item }));

  const maxChars = 300;

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (!token || idFromToken !== userId) {
      logout();
      navigate("/recruiter/login");
      return;
    }
  }, [userId, idFromToken, token]);

  useEffect(() => {
    if (!recruiter) return;

    setFirstName(recruiter.firstname || "");
    setLastName(recruiter.lastname || "");
    setDesignation(recruiter.designation || "");
    setCountryCode(recruiter.countryCode || "");
    setPhoneNumber(recruiter.phone || "");
    setCompany(recruiter.companyName || "");
    setIndependentCheck(recruiter.independentRec === true);
    setCompanyDesc(recruiter.orgDescription || "");
    setSelectedCountry(recruiter.companyLocation?.country || "");
    setSelectedState(recruiter.companyLocation?.state || "");
    setSelectedCity(recruiter.companyLocation?.city || "");
    setIndustry(recruiter.industryType || "");
    setEmployeesCount(recruiter.numOfEmployees || "");

    if (recruiter.companyCertificate?.data) {
      setCompanyPresent(true);
      urlCreator(recruiter.companyCertificate);
    }
    if (recruiter.companyWebsite?.link) {
      setLinkPresent(true);
      setCompanyUrl(recruiter.companyWebsite.link);
    }
  }, [recruiter]);

  useEffect(() => {
    fetchLogo();
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, []);

  useEffect(() => {
    const requiredFields = [
      firstName,
      lastName,
      countryCode,
      phoneNumber,
      designation,
      company,
      companyDesc,
      selectedCountry,
      selectedState,
      selectedCity,
      industry,
      employeesCount,
      logoUrl,
      companyUrl,
    ];
    const filled = requiredFields.filter(
      (f) =>
        (typeof f === "string" && f.trim() !== "") ||
        (f !== null && f !== undefined),
    ).length;
    const percentage = Math.round((filled / requiredFields.length) * 100);
    setProgress(percentage);
    if (percentage === 100 && !hasShownCompletionToast) {
      toast.success("🎉 Profile Completed!", { autoClose: 3000 });
      setHasShownCompletionToast(true);
    }

    if (percentage !== 100 && hasShownCompletionToast) {
      setHasShownCompletionToast(false);
    }
  }, [
    firstName,
    lastName,
    countryCode,
    phoneNumber,
    designation,
    company,
    companyDesc,
    selectedCountry,
    selectedState,
    selectedCity,
    industry,
    employeesCount,
    logoUrl,
    companyUrl,
    hasShownCompletionToast,
  ]);

  // ==================== HELPERS ====================

  const urlCreator = (cert) => {
    const byteArray = new Uint8Array(cert.data.data);
    const blob = new Blob([byteArray], { type: cert.contentType });
    setPdfUrl(URL.createObjectURL(blob));
  };

  const fetchLogo = async () => {
    try {
      const res = await axios.get(`${api}/recruiter/get-logo/${idFromToken}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      setLogoUrl(URL.createObjectURL(blob));
    } catch (err) {
      if (err.response?.status !== 404) console.error("Logo fetch error:", err);
    }
  };

  // ==================== HANDLERS ====================

  const handleSelect = () => fileInputRef.current?.click();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("Please select a picture.");
    const formData = new FormData();
    formData.append("logo", file);
    try {
      await axios.post(
        `${api}/recruiter/upload-logo/${idFromToken}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Logo uploaded successfully");
      fetchLogo();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${api}/recruiter/delete-logo/${idFromToken}`);
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      setLogoUrl(null);
      toast.error("Logo deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleFileInput = (e) => setSelectedFile(e.target.files[0]);
  const handleUrlInputChange = (e) => setCompanyUrl(e.target.value);

  const handleSubmit = async () => {
    // Validation
    if (!companyUrl && !selectedFile) {
      toast.error(
        "❌ Please provide either a website URL or upload a certificate PDF",
      );
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Submitting your details...", {
      position: "top-center",
    });

    const formData = new FormData();
    if (companyUrl) formData.append("companyWebsite", companyUrl);
    if (selectedFile) formData.append("companyCertificate", selectedFile);

    try {
      const res = await axios.post(
        `${api}/recruiter/${idFromToken}/upload-details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        // ✅ Update local state only, don't refresh entire recruiter

        // Handle certificate response
        if (res.data.companyCertificate) {
          if (selectedFile) {
            // Create PDF URL from uploaded file
            const newPdfUrl = URL.createObjectURL(selectedFile);
            setPdfUrl(newPdfUrl);
            setCompanyPresent(true);

            // Update local recruiter certificate data without refresh
            if (recruiter) {
              recruiter.companyCertificate = {
                ...recruiter.companyCertificate,
                data: {
                  data: Array.from(
                    new Uint8Array(await selectedFile.arrayBuffer()),
                  ),
                },
                contentType: selectedFile.type,
                filename: selectedFile.name,
                status: "pending",
                uploadedDate: new Date(),
              };
            }

            toast.success(
              "📄 Certificate uploaded successfully! Waiting for admin verification.",
              {
                autoClose: 4000,
              },
            );
          } else if (res.data.companyCertificate.data) {
            setCompanyPresent(true);
            urlCreator(res.data.companyCertificate);
            toast.info("Certificate retrieved successfully", {
              autoClose: 2000,
            });
          }
        }

        // Handle website response
        if (res.data.companyWebsite) {
          setCompanyUrl(res.data.companyWebsite.link);
          setLinkPresent(true);

          // Update local recruiter website data
          if (recruiter) {
            recruiter.companyWebsite = {
              link: res.data.companyWebsite.link,
              status: res.data.companyWebsite.status || "pending",
              uploadedDate: new Date(),
            };
          }

          if (companyUrl && !selectedFile) {
            toast.success(
              "🌐 Website link submitted successfully! Waiting for admin verification.",
              {
                autoClose: 4000,
              },
            );
          } else if (res.data.companyWebsite.status === "Verified") {
            toast.success("✅ Your website has been verified!", {
              autoClose: 3000,
            });
          } else {
            toast.info(
              "Website link saved. It will be verified by admin soon.",
              { autoClose: 3000 },
            );
          }
        }

        // Clear selected file after successful upload
        setSelectedFile(null);

        // ❌ REMOVE THIS LINE - It's causing the reset
        // await refreshData();

        // ✅ Close modal
        setIsModalOpen(false);

        toast.update(loadingToast, {
          render: "✅ Details submitted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Submission error:", err);

      let errorMessage = "❌ Submission error. Please try again.";

      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = "❌ Invalid data. Please check your inputs.";
            break;
          case 401:
            errorMessage = "❌ Authentication failed. Please login again.";
            break;
          case 413:
            errorMessage =
              "❌ File too large. Please upload a smaller PDF (max 5MB).";
            break;
          case 500:
            errorMessage = "❌ Server error. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = "❌ Network error. Please check your connection.";
      }

      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleDetailsUpdate = async () => {
    if (String(phoneNumber).length !== 10)
      return toast.error("Enter valid 10-digit number.");
    if (!designation.trim()) return toast.error("Enter your designation.");
    try {
      await axios.put(`${api}/recruiter/update-details/${idFromToken}`, {
        phone: phoneNumber,
        countryCode,
        firstname: firstName,
        lastname: lastName,
        designation,
      });
      toast.success("Details updated!");
      setActiveTab("Tab2");
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  const handleDetailsUpdate_2 = async () => {
    if (!independentCheck && !company.trim())
      return toast.error("Enter company name.");
    if (!companyDesc.trim()) return toast.error("Enter company description.");
    if (!selectedCountry || !selectedState || !selectedCity)
      return toast.error("Enter company location.");
    if (!industry) return toast.error("Select industry type.");
    if (!employeesCount) return toast.error("Select employee count.");
    if (!logoUrl) return toast.error("Upload organization logo.");
    if (!companyUrl && !selectedFile && !companyPresent && !linkPresent) {
      return toast.error(
        "Please enter official website OR upload company certificate",
      );
    }

    try {
      setProgress(100);
      toast.success("🎉 Profile completed!!");
      setActiveTab("Tab3");
      await axios.put(`${api}/recruiter/update-details-2/${idFromToken}`, {
        companyName: company,
        independentRec: independentCheck,
        orgDescription: companyDesc,
        companyLocation: {
          country: selectedCountry,
          state: selectedState,
          city: selectedCity,
        },
        industryType: industry,
        numOfEmployees: employeesCount,
      });
      toast.success("Details updated!");
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  const handleDesignationChange = (e) => {
    const val = e.target.value;
    if (val === "notAvailable") {
      setShowManualInput(true);
      setDesignation("");
    } else {
      setShowManualInput(false);
      setDesignation(val);
    }
  };

  const handleCloseManualInput = () => {
    setShowManualInput(false);
    setDesignation("");
  };

  const handleCompanyNameChange = (e) => {
    setCompany(e.target.value);
    if (e.target.value) setIndependentCheck(false);
  };

  const handleCheckboxChange = (e) => {
    setIndependentCheck(e.target.checked);
    if (e.target.checked) setCompany("");
  };

  const handleInputChange = (e) => {
    if (e.target.value.length <= maxChars) setCompanyDesc(e.target.value);
  };

  const handleCompanySizeChange = (e) => setEmployeesCount(e.target.value);

  // ==================== RENDER ====================

  if (!recruiter) return <Spinner />;

  const states = selectedCountry
    ? countryData.find((c) => c.name === selectedCountry)?.states || []
    : [];
  const cities = selectedState
    ? states.find((s) => s.name === selectedState)?.cities || []
    : [];

  return (
    <div className="min-h-screen mt-20">
      <div className="w-full lg:w-[50%] mx-auto p-4">
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-300 rounded-md overflow-hidden mb-6">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-6 mb-6">
          {[
            {
              id: "Tab1",
              icon: <CgProfile className="text-2xl" />,
              label: "Personal Details",
            },
            {
              id: "Tab2",
              icon: <IoIosBriefcase className="text-2xl" />,
              label: "Organisational Details",
            },
            {
              id: "Tab3",
              icon: <IoIosBriefcase className="text-2xl" />,
              label: "Profile",
            },
          ].map(({ id, icon, label }) => (
            <button
              key={id}
              className={`flex flex-col items-center py-2 px-3 rounded-t-lg border-b-2 ${
                activeTab === id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent"
              }`}
              onClick={() => setActiveTab(id)}
            >
              <span className="bg-blue-500 text-white p-2 rounded-full mb-1">
                {icon}
              </span>
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          {/* Tab 1: Personal Details */}
          {activeTab === "Tab1" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  value={recruiter.email}
                  readOnly
                  className="w-full border rounded-md px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={showManualInput ? "notAvailable" : designation}
                    onChange={handleDesignationChange}
                    className="w-full border rounded-md px-3 py-2 appearance-none"
                  >
                    <option value="Manager">Manager</option>
                    <option value="CEO">CEO</option>
                    <option value="CTO">CTO</option>
                    <option value="HR">HR</option>
                    <option value="notAvailable">
                      Designation Not Available?
                    </option>
                  </select>
                  {showManualInput && (
                    <button
                      onClick={handleCloseManualInput}
                      className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  )}
                </div>
                {showManualInput && (
                  <input
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Enter Designation"
                    className="mt-2 w-full border rounded-md px-3 py-2"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-start">
                  <Select
                    options={countryCodes}
                    value={countryCodes.find(
                      (opt) => opt.value === countryCode,
                    )}
                    onChange={(opt) => setCountryCode(opt.value)}
                    className="w-32 md:w-40"
                    isSearchable
                  />
                  <div className="flex-1 relative">
                    <input
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPhoneNumber(val);
                        setPhoneError(
                          val.length !== 10
                            ? "Enter a valid 10-digit number"
                            : "",
                        );
                      }}
                      maxLength={10}
                      type="number"
                      className="w-full border rounded-md px-3 py-2"
                    />
                    {phoneError && (
                      <p className="absolute top-full left-0 text-red-500 text-xs mt-1">
                        {phoneError}
                      </p>
                    )}
                  </div>
                  <div className="ml-2 mt-1">
                    <span
                      className={`flex items-center gap-1 ${
                        recruiter?.companyCertificate?.status === "Verified"
                          ? "text-green-500"
                          : recruiter?.companyCertificate?.status === "pending"
                            ? "text-yellow-500"
                            : recruiter?.companyCertificate?.status ===
                                "Rejected"
                              ? "text-red-500"
                              : ""
                      }`}
                    >
                      {recruiter?.companyCertificate?.status === "Verified" && (
                        <MdVerifiedUser />
                      )}
                      {recruiter?.companyCertificate?.status === "pending" && (
                        <MdOutlinePendingActions />
                      )}
                      {recruiter?.companyCertificate?.status === "Rejected" && (
                        <MdOutlineCancel />
                      )}
                      {recruiter?.companyCertificate?.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right mt-4">
                <button
                  onClick={handleDetailsUpdate}
                  className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Organisational Details */}
          {activeTab === "Tab2" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={company}
                  onChange={handleCompanyNameChange}
                  disabled={independentCheck}
                  className="w-full border rounded-md px-3 py-2"
                />
                <div className="flex items-start mt-2">
                  <input
                    type="checkbox"
                    checked={independentCheck}
                    onChange={handleCheckboxChange}
                    disabled={!!company}
                    className="mt-0.5 mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm text-gray-600">
                    I am an Independent Practitioner (Freelancer, Architect,
                    Lawyer, etc.), hiring for myself.
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Organization Description{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={companyDesc}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter company description..."
                />
                <p
                  className={`text-xs mt-1 ${companyDesc.length === maxChars ? "text-red-500" : "text-gray-500"}`}
                >
                  {maxChars - companyDesc.length} characters remaining
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Organization Location <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedState("");
                    }}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="">-- Select Country --</option>
                    {countryData.map((country) => (
                      <option key={country.id} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    disabled={!selectedCountry}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="">-- Select State --</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="">-- Select City --</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Industry Type <span className="text-red-500">*</span>
                </label>
                <Select
                  options={suggestions}
                  value={suggestions.find((opt) => opt.value === industry)}
                  onChange={(opt) => setIndustry(opt.value)}
                  placeholder="Select Industry type"
                  className="w-full"
                  classNamePrefix="custom-select-dropdown"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Number Of Employees <span className="text-red-500">*</span>
                </label>
                <select
                  value={employeesCount}
                  onChange={handleCompanySizeChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select Number of Employees</option>
                  <option value="0-5">0-5</option>
                  <option value="5-50">5-50</option>
                  <option value="50-200">50-200</option>
                  <option value="200-500">200-500</option>
                  <option value="500-1000">500-1000</option>
                  <option value="1000+">More than 1000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Organization Logo <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4 mt-2">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <FaBuilding className="text-gray-400 text-3xl" />
                  )}
                  {!logoUrl ? (
                    <>
                      <button
                        onClick={handleSelect}
                        className="flex items-center gap-2 border-2 border-dashed border-green-400 bg-green-100 rounded px-4 py-2 hover:bg-green-200"
                      >
                        <FaUpload className="text-blue-500" /> Upload Logo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </>
                  ) : (
                    <button
                      onClick={handleDelete}
                      className="text-blue-500 underline"
                    >
                      Delete Logo
                    </button>
                  )}
                </div>
              </div>

              <div className="text-right mt-4">
                <button
                  onClick={handleDetailsUpdate_2}
                  className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Details
                </button>
              </div>

              {/* Certificate / URL Section */}
              <div className="mt-6 p-4 border rounded-md">
                {!companyPresent && !linkPresent && (
                  <div className="text-center">
                    <p className="text-red-500 mb-3">
                      Upload company's incorporation certificate or official
                      website link
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mx-auto"
                    >
                      <FaUpload /> Upload PDF or Enter URL
                    </button>
                  </div>
                )}

                {pdfUrl && (
                  <div className="text-center space-y-2">
                    <a
                      href={pdfUrl}
                      download={
                        recruiter?.companyCertificate?.filename ||
                        "Company_Certificate.pdf"
                      }
                      className="text-blue-500 underline"
                    >
                      Download Company Incorporation Certificate
                    </a>
                    <button
                      onClick={() => {
                        setPdfUrl(null);
                        setCompanyPresent(false);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-500 underline"
                    >
                      Reupload
                    </button>
                    {companyPresent && (
                      <button
                        onClick={() => {
                          setCompanyPresent(false);
                          setIsModalOpen(true);
                        }}
                        className="text-green-600 underline"
                      >
                        Want to provide company's website link?
                      </button>
                    )}
                    <p className="text-gray-600">
                      Uploaded{" "}
                      {TimeAgo(
                        recruiter?.companyCertificate?.uploadedDate ||
                          new Date(),
                      )}
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span>Verification status:</span>
                      <span
                        className={`flex items-center gap-1 ${
                          recruiter?.companyCertificate?.status === "Verified"
                            ? "text-green-500"
                            : recruiter?.companyCertificate?.status ===
                                "pending"
                              ? "text-yellow-500"
                              : recruiter?.companyCertificate?.status ===
                                  "Rejected"
                                ? "text-red-500"
                                : ""
                        }`}
                      >
                        {recruiter?.companyCertificate?.status ===
                          "Verified" && <MdVerifiedUser />}
                        {recruiter?.companyCertificate?.status ===
                          "pending" && <MdOutlinePendingActions />}
                        {recruiter?.companyCertificate?.status ===
                          "Rejected" && <MdOutlineCancel />}
                        {recruiter?.companyCertificate?.status || "Pending"}
                      </span>
                    </div>
                  </div>
                )}

                {companyUrl && (
                  <div className="text-center space-y-2">
                    <p className="font-semibold">Your Company's Website Link</p>
                    <a
                      href={companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {companyUrl}
                    </a>
                    <button
                      onClick={() => {
                        setLinkPresent(false);
                        setIsModalOpen(true);
                        setCompanyUrl("");
                      }}
                      className="text-blue-500 underline"
                    >
                      Update Link
                    </button>
                    <div className="flex items-center justify-center gap-1">
                      <span>Verification status:</span>
                      <span
                        className={`flex items-center gap-1 ${
                          recruiter?.companyWebsite?.status === "Verified"
                            ? "text-green-500"
                            : recruiter?.companyWebsite?.status === "pending"
                              ? "text-yellow-500"
                              : recruiter?.companyWebsite?.status === "Rejected"
                                ? "text-red-500"
                                : ""
                        }`}
                      >
                        {recruiter?.companyWebsite?.status === "Verified" && (
                          <MdVerifiedUser />
                        )}
                        {recruiter?.companyWebsite?.status === "pending" && (
                          <MdOutlinePendingActions />
                        )}
                        {recruiter?.companyWebsite?.status === "Rejected" && (
                          <MdOutlineCancel />
                        )}
                        {recruiter?.companyWebsite?.status || "Pending"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Profile View */}
          {activeTab === "Tab3" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    First Name
                  </label>
                  <p className="border rounded-md px-3 py-2 bg-gray-50">
                    {firstName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Last Name
                  </label>
                  <p className="border rounded-md px-3 py-2 bg-gray-50">
                    {lastName}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  E-mail
                </label>
                <p className="border rounded-md px-3 py-2 bg-gray-50">
                  {recruiter.email}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Designation
                </label>
                <p className="border rounded-md px-3 py-2 bg-gray-50">
                  {designation}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Mobile
                </label>
                <div className="flex gap-2">
                  <p className="border rounded-md px-3 py-2 bg-gray-50">
                    {countryCode}
                  </p>
                  <p className="border rounded-md px-3 py-2 bg-gray-50">
                    {phoneNumber}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Organization Name
                </label>
                <p className="border rounded-md px-3 py-2 bg-gray-50">
                  {company}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Organization Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <p className="border rounded-md px-3 py-2 bg-gray-50">
                    {selectedCountry}
                  </p>
                  <p className="border rounded-md px-3 py-2 bg-gray-50">
                    {selectedState}
                  </p>
                  <p className="border rounded-md px-3 py-2 bg-gray-50">
                    {selectedCity}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Industry Type
                </label>
                <p className="border rounded-md px-3 py-2 bg-gray-50">
                  {industry}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Number Of Employees
                </label>
                <p className="border rounded-md px-3 py-2 bg-gray-50">
                  {employeesCount}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Upload Certificate or Enter URL
            </h3>
            <div className="space-y-4">
              {!companyUrl && (
                <div>
                  <label className="block text-sm mb-2">Upload PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="w-full"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              )}
              {!selectedFile && !companyUrl && (
                <div className="text-center text-gray-400">OR</div>
              )}
              {!selectedFile && (
                <div>
                  <label className="block text-sm mb-2">Website URL</label>
                  <input
                    type="text"
                    value={companyUrl}
                    onChange={handleUrlInputChange}
                    placeholder="https://example.com"
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              )}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  handleSubmit();
                }}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecProfile;
