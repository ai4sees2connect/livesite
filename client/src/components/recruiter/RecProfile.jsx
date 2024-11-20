import React, { useEffect, useState, useRef } from "react";
import {
  FaBuilding,
  FaPlus,
  FaTimes,
  FaPen,
  FaPaperclip,
  FaUpload,
} from "react-icons/fa";
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
import statesAndCities from "../common/statesAndCities";
import Select from "react-select";
// country
import countryData from "../TESTJSONS/countries+states+cities.json";

const RecProfile = () => {
  const fileInputRef = useRef(null);
  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, recruiter, refreshData } = useRecruiter();
  const token = localStorage.getItem("token");
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  // const [isCompanyEdit, setIsCompanyEdit] = useState(false);
  // const [companyName, setCompanyName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyUrl, setCompanyUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [independentCheck, setIndependentCheck] = useState(null);
  const [companyDesc, setCompanyDesc] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [cityPresent, setCityPresent] = useState("");
  const [companyPresent, setCompanyPresent] = useState(false);
  const [linkPresent, setLinkPresent] = useState(false);
  const [companyCountry,setCompanyCountry] =useState("");
  const [companyState,setCompanyState] =useState("");
  const [companyCity,setCompanyCity] =useState("");

  console.log(recruiter);

  useEffect(() => {
    if (recruiter?.phone) {
      setPhoneNumber(recruiter.phone); // Set phoneNumber once recruiter data is loaded
      // console.log('**********************************************************')
    }
    if (recruiter?.countryCode) {
      setCountryCode(recruiter.countryCode);
    }
    if (recruiter?.firstname) {
      setFirstName(recruiter.firstname);
    }
    if (recruiter?.lastname) {
      setLastName(recruiter.lastname);
    }

    if (recruiter?.companyName) {
      setCompany(recruiter.companyName);
    }

    if (
      recruiter?.independentRec === false ||
      recruiter?.independentRec === true
    ) {
      setIndependentCheck(recruiter.independentRec);
    }
    if (recruiter?.orgDescription) {
      setCompanyDesc(recruiter.orgDescription);
    }

    if (recruiter?.designation) {
      setDesignation(recruiter.designation);
    }

    if (recruiter?.companyLocation?.country) {
      setSelectedCountry(recruiter.companyLocation.country);
    }
    if (recruiter?.companyLocation?.state) {
      setSelectedState(recruiter.companyLocation.state);
    }
    if (recruiter?.companyLocation?.city) {
      setSelectedCity(recruiter.companyLocation.city);
    }

    if (recruiter?.industryType) {
      setIndustry(recruiter.industryType);
    }

    if (recruiter?.numOfEmployees) {
      setEmployeesCount(recruiter.numOfEmployees);
    }

    if (recruiter?.companyCertificate?.data) {
      setCompanyPresent(true);
      urlCreator(recruiter.companyCertificate)
    }
    if (recruiter?.companyWebsite) {
      setLinkPresent(true);
      setCompanyUrl(recruiter.companyWebsite.link);
    }
  }, [recruiter]);

  const urlCreator = (companyCertificate) => {
    const byteArray = new Uint8Array(companyCertificate.data.data);
    const blob = new Blob([byteArray], {
      type: companyCertificate.contentType,
    });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  }

  console.log('this is link', companyUrl);

  useEffect(() => {
    if (!token) {
      navigate("/recruiter/login");
      return;
    }
    // console.log("id from token", idFromToken);
    // console.log("id from params", userId);

    if (idFromToken !== userId) {
      logout(); //logout from studentContext to remove token and setToken to null in useeffect of context to trigger the useeffect of studentContext
      navigate("/recruiter/login");
      return;
    }
  }, [userId, idFromToken, token]);

  const fetchLogo = async () => {
    try {
      const response = await axios.get(
        `${api}/recruiter/get-logo/${idFromToken}`,
        {
          responseType: "blob", // Fetching as a blob for image rendering
        }
      );
      // console.log("response", response.status);

      const logoBlob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const Url = URL.createObjectURL(logoBlob);
      // console.log("logoUrl", Url);
      // console.log("logo", logo);
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

  useEffect(() => {
    fetchLogo();

    return () => {
      if (!logoUrl) {
        URL.revokeObjectURL(logoUrl);
        // console.log("Blob URL revoked on cleanup:", logoUrl); // Optional: Add a log to confirm revocation
      }
    };
  }, [logo]);




  const handleFileUpload = async (e) => {
    // if (!logo) return;
    const selectedPicture = e.target.files[0];
    if (!selectedPicture) {
      toast.error("Please select a Picture to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", selectedPicture);

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
      // console.log("Logo uploaded successfully", response.data);
      toast.success("Logo uploaded successfully");

      fetchLogo();
    } catch (error) {
      // setUploading(false);
      console.error("Error uploading logo", error);
    }
  };

  const handleSelect = () => {
    fileInputRef.current.click();
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
  console.log('this is selected certificate', selectedFile);

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
        toast.info('link is present');
      }

      if (selectedFile) {
        formData.append("companyCertificate", selectedFile);
        toast.info('file is present');
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
        // console.log('this is from backend',response.data.companyCertificate)
        console.log('this is response', response.data);
        if (response.data.companyCertificate) {
          const url = URL.createObjectURL(selectedFile);
          setPdfUrl(url);
          
          setCompanyUrl("");
          setCompanyPresent(true);
        }
        if (response.data.companyWebsite) {
          setCompanyUrl(response.data.companyWebsite.link)
          setLinkPresent(true);
          setPdfUrl(null);
        }
        refreshData();
        // setSelectedFile(null);
        // window.location.reload();
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

  // console.log(countryCode);
  // console.log('this is recent ph no', phoneNumber);
  // console.log('this is present city',companyLocation);

  const handleDetailsUpdate = async () => {
    try {
      const phoneStr = String(phoneNumber); // Convert number to string
      if (phoneStr.length !== 10) {
        // console.log("This is length:", phoneStr.length);
        // console.log(phoneNumber);
        // console.log('this is length',phoneNumber.length);
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      if (designation === "") {
        toast.error("Please enter your designation");
        return;
      }

      const response = await axios.put(
        `${api}/recruiter/update-details/${idFromToken}`,
        {
          phone: phoneNumber,
          countryCode,
          firstname: firstName,
          lastname: lastName,
          designation,
        }
      );

      // Handle success response (e.g., show success message, update UI, etc.)
      // console.log("Details updated:", response.data);
      toast.success("Details updated successfully");
      // window.location.reload();
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error updating Details:", error);
      toast.error("Failed to update Details. Please try again.");
    }
  };
  const handleDetailsUpdate_2 = async () => {
    try {
      if (company === "" && independentCheck === false) {
        toast.error("Please enter your name of company");
        return;
      }

      if (companyDesc === "") {
        toast.error("Please enter your company description");
        return;
      }

      if (selectedCountry === "" || selectedState==="" || selectedCity==="") {
        toast.error("Please enter your company location");
        return;
      }

      if (industry === "") {
        toast.error("Please enter industry type");
        return;
      }

      if (employeesCount === "") {
        toast.error("Please enter number of employees ");
        return;
      }

      const response = await axios.put(
        `${api}/recruiter/update-details-2/${idFromToken}`,
        {
          companyName: company,
          independentRec: independentCheck,
          orgDescription: companyDesc,
          companyLocation: {country:selectedCountry,state: selectedState,city: selectedCity},
          industryType: industry,
          numOfEmployees: employeesCount,
        }
      );

      // Handle success response (e.g., show success message, update UI, etc.)
      // console.log("Details updated:", response.data);
      toast.success("Details updated successfully");
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error updating Details:", error);
      toast.error("Failed to update Details. Please try again.");
    }
  };

  // console.log(recruiter);
  // console.log(firstName);
  // console.log(lastName);
  // console.log(company);
  // console.log('independence', independentCheck);
  // console.log('this is location', companyLocation);
  // console.log('this is employeesCount', employeesCount);

  // new recruiter profile  functionalities*******
  const [activeTab, setActiveTab] = useState("Tab1");
  // State for the checkbox
  // const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const [designation, setDesignation] = useState(recruiter?.designation || "");
  const [showManualInput, setShowManualInput] = useState(false);

  const handleDesignationChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "notAvailable") {
      setShowManualInput(true);
      setDesignation("");
    } else {
      setShowManualInput(false);
      setDesignation(selectedValue);
    }
  };

  // console.log('this is designation', designation);
  const handleCloseManualInput = () => {
    setShowManualInput(false);
    setDesignation("");
  };
  // Handle changes to the company name input
  const handleCompanyNameChange = (e) => {
    setCompany(e.target.value);
    if (e.target.value) {
      setIndependentCheck(false);
    }
  };

  // console.log('this is company name', companyName);

  // Handle changes to the checkbox
  const handleCheckboxChange = (e) => {
    setIndependentCheck(e.target.checked);
    if (e.target.checked) {
      setCompany("");
    }
  };

  // Industry functions
  // const [industry, setIndustry] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
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
    "Building Materials",
    "Business Supplies & Equipment",
    "Capital Markets",
    "Chemicals",
    "Civic & Social Organization",
    "Civil Engineering",
    "Commercial Real Estate",
    "Computer & Network Security",
    "Computer Games",
    "Computer Hardware",
    "Computer Networking",
    "Computer Software",
    "Construction",
    "Consumer Electronics",
    "Consumer Goods",
    "Consumer Services",
    "Cosmetics",
    "Defense & Space",
    "Design",
    "Education Management",
    "E-Learning",
    "Electrical & Electronic Manufacturing",
    "Entertainment",
    "Environmental Services",
    "Events Services",
    "Facilities Services",
    "Farming",
    "Financial Services",
    "Fine Art",
    "Food & Beverages",
    "Food Production",
    "Fund-Raising",
    "Furniture",
    "Gambling & Casinos",
    "Glass, Ceramics & Concrete",
    "Government Administration",
    "Government Relations",
    "Graphic Design",
    "Health, Wellness & Fitness",
    "Higher Education",
    "Hospital & Health Care",
    "Hospitality",
    "Human Resources",
    "Import & Export",
    "Individual & Family Services",
    "Industrial Automation",
    "Information Services",
    "Information Technology & Services",
    "Insurance",
    "International Affairs",
    "International Trade & Development",
    "Internet",
    "Investment Banking",
    "Investment Management",
    "Judiciary",
    "Law Enforcement",
    "Law Practice",
    "Legal Services",
    "Legislative Office",
    "Leisure, Travel & Tourism",
    "Libraries",
    "Logistics & Supply Chain",
    "Luxury Goods & Jewelry",
    "Machinery",
    "Management Consulting",
    "Maritime",
    "Marketing & Advertising",
    "Market Research",
    "Mechanical or Industrial Engineering",
    "Media Production",
    "Medical Devices",
    "Medical Practice",
    "Mental Health Care",
    "Military",
    "Mining & Metals",
    "Motion Pictures & Film",
    "Museums & Institutions",
    "Music",
    "Nanotechnology",
    "Newspapers",
    "Nonprofit Organization Management",
    "Oil & Energy",
    "Online Media",
    "Outsourcing/Offshoring",
    "Package/Freight Delivery",
    "Packaging & Containers",
    "Paper & Forest Products",
    "Performing Arts",
    "Pharmaceuticals",
    "Philanthropy",
    "Photography",
    "Plastics",
    "Political Organization",
    "Primary/Secondary Education",
    "Printing",
    "Professional Training & Coaching",
    "Program Development",
    "Public Policy",
    "Public Relations & Communications",
    "Public Safety",
    "Publishing",
    "Railroad Manufacture",
    "Ranching",
    "Real Estate",
    "Recreational Facilities & Services",
    "Religious Institutions",
    "Renewables & Environment",
    "Research",
    "Restaurants",
    "Retail",
    "Security & Investigations",
    "Semiconductors",
    "Shipbuilding",
    "Sporting Goods",
    "Sports",
    "Staffing & Recruiting",
    "Supermarkets",
    "Telecommunications",
    "Textiles",
    "Think Tanks",
    "Tobacco",
    "Translation & Localization",
    "Transportation/Trucking/Railroad",
    "Utilities",
    "Venture Capital & Private Equity",
    "Veterinary",
    "Warehousing",
    "Wholesale",
    "Wine & Spirits",
    "Wireless",
    "Writing & Editing",
  ].map((item) => ({
    label: item,
    value: item,
  }));

  // console.log(suggestions)

  // Handle industry change to filter suggestions
  // const handleIndustryChange = (e) => {
  //   setIndustry(e.target.value);
  // };

  // Add an industry to the selected list
  // const handleSelectIndustry = (industry) => {
  //   if (!selectedIndustries.includes(industry)) {
  //     setSelectedIndustries([...selectedIndustries, industry]);
  //   }
  //   setIndustry(""); // Clear input field after selecting
  // };

  // Remove an industry from the selected list
  // const handleRemoveIndustry = (industryToRemove) => {
  //   setSelectedIndustries(
  //     selectedIndustries.filter((ind) => ind !== industryToRemove)
  //   );
  // };

  // Filter suggestions based on the input
  // const filteredSuggestions = suggestions.filter(
  //   (suggestion) =>
  //     suggestion.toLowerCase().includes(industry.toLowerCase()) &&
  //     !selectedIndustries.includes(suggestion)
  // );
  // company employee numbers
  const [totalEmployees, setTotalEmployees] = useState();
  // state for country and state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const handleCompanySizeChange = (e) => {
    setEmployeesCount(e.target.value);
  };

  console.log('this is country',selectedCountry);
  console.log('this is state',selectedState);
  console.log('this is city',selectedCity);


  // console.log(recruiter.companyWebsite,'******', recruiter.companyCertificate,"******",pdfUrl);
  // country state city Api

  // Get available states and cities based on selections
  const states = selectedCountry
    ? countryData.find((c) => c.name === selectedCountry)?.states
    : [];
  const cities = selectedState
    ? states.find((s) => s.name === selectedState)?.cities
    : [];
  const maxChars = 300; // Maximum character limit

  const handleInputChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setCompanyDesc(e.target.value);
    }
  };
  return !recruiter ? (
    <Spinner />
  ) : (
    <div className="min-h-screen mt-20">
      <div className="w-full lg:w-[50%] mx-auto p-4">
        {/* Tab Buttons */}
        <div className="flex space-x-4 justify-center items-center">
          {/* tab 1 */}
          <button
            className={`py-2 px-4 flex flex-col justify-center items-center ${activeTab === "Tab1"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 border-b-2 border-white"
              }`}
            onClick={() => setActiveTab("Tab1")}
          >
            <CgProfile className="bg-blue-500 text-white text-4xl p-2 rounded-full" />
            <span> Personal Details</span>
          </button>
          {/* tab-2 */}
          <button
            className={`py-2 px-4 flex flex-col justify-center items-center  ${activeTab === "Tab2"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 border-b-2 border-white"
              }`}
            onClick={() => setActiveTab("Tab2")}
          >
            <IoIosBriefcase className="bg-blue-500 text-white text-4xl p-2 rounded-full" />
            Organisational Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {/* Tab 1 content */}
          {activeTab === "Tab1" && (
            <div>
              <div className="p-5 border-2 rounded-md space-y-3">
                {/* first and last name */}
                <div className="flex flex-col md:flex-row gap-5 justify-center">
                  {/* first name */}
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1 ml-1">
                        First Name
                      </label>
                      <input
                        className="border-2 rounded-md px-3 py-1"
                        defaultValue={firstName}
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* last name */}
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1 ml-1">
                        Last Name
                      </label>
                      <input
                        className="border-2 rounded-md px-3 py-1"
                        defaultValue={lastName}
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {/* email */}
                <div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 ml-1">
                      E-mail
                    </label>
                    <input
                      className="border-2 rounded-md px-3 py-1"
                      defaultValue={recruiter?.email}
                      type="text"
                      readOnly
                    />
                  </div>
                </div>
                {/* Designation */}
                <div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 ml-1">
                      Designation
                    </label>

                    <div className="relative flex items-center">
                      <select
                        className={`border-2 rounded-md px-3 py-1 w-full ${showManualInput ? "appearance-none" : ""
                          }`}
                        value={showManualInput ? "notAvailable" : designation}
                        onChange={handleDesignationChange}
                      >
                        <option value="manager">Manager</option>
                        <option value="ceo">CEO</option>
                        <option value="cto">CTO</option>
                        <option value="hr">HR</option>
                        <option value="notAvailable">
                          Designation Not Available?
                        </option>
                      </select>

                      {/* Conditionally render the close button on the dropdown */}
                      {showManualInput && (
                        <button
                          className="absolute text-2xl top-0 right-2 text-gray-500 hover:text-gray-700"
                          onClick={handleCloseManualInput}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                      )}
                    </div>

                    {/* Conditionally render the manual input field */}
                    {showManualInput && (
                      <input
                        className="border-2 rounded-md px-3 py-1 mt-2"
                        placeholder="Enter Designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        type="text"
                      />
                    )}
                  </div>
                </div>
                {/* Mobile and status */}
                <div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 ml-1">
                      Mobile
                    </label>
                    <div className="flex gap-2 items-center relative">
                      <input
                        className="border-2 rounded-md px-3 py-1 w-[60px] md:w-[100px]"
                        defaultValue={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        type="text"
                      />
                      <input
                        className="border-2 rounded-md px-3 py-1 w-full lg:w-[50%]"
                        // defaultValue={recruiter?.phone}
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (
                            e.target.value.trim().length < 10 ||
                            e.target.value.trim().length > 10
                          ) {
                            setPhoneError("Enter a valid phone number");
                          } else {
                            setPhoneError("");
                          }
                        }}
                        maxLength={10}
                        type="number"
                      />
                      {phoneError !== "" && (
                        <div className="absolute text-red-500 text-sm top-8 left-[69px] md:left-28">
                          Enter a valid phone number
                        </div>
                      )}

                      <p className="text-gray-600 ml-2 md:ml-5">
                        <span
                          className={`flex items-center gap-[2px] ${recruiter?.companyCertificate?.status === "pending"
                            ? "text-yellow-500"
                            : recruiter?.companyCertificate?.status ===
                              "Verified"
                              ? "text-green-500"
                              : recruiter?.companyCertificate?.status ===
                                "Rejected"
                                ? "text-red-500"
                                : ""
                            }`}
                        >
                          <MdOutlineCancel
                            className={`${recruiter?.companyCertificate?.status ===
                              "Rejected"
                              ? "block"
                              : "hidden"
                              }`}
                          />
                          <MdVerifiedUser
                            className={`${recruiter?.companyCertificate?.status ===
                              "Verified"
                              ? "block"
                              : "hidden"
                              }`}
                          />
                          <MdOutlinePendingActions
                            className={`${recruiter?.companyCertificate?.status ===
                              "pending"
                              ? "block"
                              : "hidden"
                              }`}
                          />
                          {recruiter?.companyCertificate?.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-right">
                <button
                  onClick={handleDetailsUpdate}
                  className="px-5 py-1 bg-blue-500 text-white rounded-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
          {/* Tab 2 content */}
          {activeTab === "Tab2" && (
            <div>
              <div className="p-5 border-2 rounded-md space-y-3">
                {/* Organization name */}
                <div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 ml-1">
                      Organization Name
                    </label>
                    <input
                      className="border-2 rounded-md px-3 py-1"
                      value={company}
                      type="text"
                      onChange={handleCompanyNameChange}
                      disabled={independentCheck}
                    />
                  </div>
                  {/* Checkbox below the input */}
                  <div className="flex items-start mt-3">
                    <input
                      id="checkbox"
                      type="checkbox"
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded mt-[3px]"
                      checked={independentCheck}
                      onChange={handleCheckboxChange}
                      disabled={company !== ""}
                    />
                    <label htmlFor="checkbox" className="text-sm text-gray-600">
                      I am an Independent Practitionar(Freelancer, Architect,
                      Lawyer etc.)Hiring for myself and not hiring on behalf of
                      any company.
                    </label>
                  </div>
                </div>
                {/* Organization description */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 ml-1">
                    Organization Description
                  </label>
                  <div className="">
                    <textarea
                      className="border-2 rounded-md px-3 py-1 w-full"
                      value={companyDesc}
                      onChange={handleInputChange}
                      type="text"
                      rows={5}
                      placeholder="Enter company description..."
                    />

                    {/* Character Count */}
                    <div
                      className={`mt-1 text-sm ${companyDesc.length === maxChars
                        ? "text-red-500"
                        : "text-gray-500"
                        }`}
                    >
                      {maxChars - companyDesc.length} characters remaining
                    </div>
                  </div>
                </div>
                {/* Organization city */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 ml-1">
                    Organization Location
                  </label>
              
                  <div className="flex flex-col md:flex-row gap-3 w-full">
                    {/* Country Dropdown */}
                    <select
                      className="border-2 py-1 rounded-md px-2 w-full"
                      id="country"
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSelectedState(""); // Reset state and cities dropdowns
                      }}
                    >
                      <option value="">-- Select Country --</option>
                      {countryData.map((country) => (
                        <option key={country.id} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>

                    {/* State Dropdown */}
                    <select
                      className="border-2 py-1 rounded-md px-2 w-full"
                      id="state"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      disabled={!selectedCountry}
                    >
                      <option value="">-- Select State --</option>
                      {states?.map((state) => (
                        <option key={state.id} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>

                    {/* City Dropdown */}
                    <select
                      id="city"
                      disabled={!selectedState}
                      className="border-2 py-1 rounded-md px-2 w-full"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      <option value="">-- Select City --</option>
                      {cities?.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Industry */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 ml-1">
                    Industry Type
                  </label>
                  <Select
                    options={suggestions}
                    // values={industry}
                    value={suggestions.find(
                      (option) => option.value === industry
                    )}
                    onChange={(values) => setIndustry(values.value)}
                    placeholder="Select Industry type"
                    searchable={true}
                    className="w-full shadow-md"
                    classNamePrefix="custom-select-dropdown"
                  />
                </div>
                {/* number of employees */}
                <div className="flex flex-col w-full lg:w-1/2">
                  <label className="text-sm text-gray-600 mb-1 ml-1">
                    Number Of Employees
                  </label>
                  <select
                    className="border-2 rounded-md px-3 py-1"
                    onChange={handleCompanySizeChange}
                    value={employeesCount}
                    disabled={independentCheck}
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
                {/* Upload logo */}
                <div>
                  <label> Organization Logo(Recommended)</label>
                  <div className="h-auto flex mt-2 flex-row">
                    {!logoUrl ? (
                      <FaBuilding className="text-gray-400 text-4xl" />
                    ) : (
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        className="h-16 w-16 my-2 rounded-full"
                      />
                    )}

                    {!logoUrl && !logo && (
                      <>
                        {/* <div className="text-gray-500">Upload</div> */}
                        <button
                          onClick={handleSelect}
                          className="border-2 border-dashed border-green-400 bg-green-100 rounded-sm py-1 px-5 hover:bg-green-200 hover:scale-105 duration-300 flex items-center justify-center gap-2"
                        >
                          <FaUpload className="text-blue-500" />
                          <span>Upload Logo</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          onChange={handleFileUpload}
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
                        className="text-blue-500 underline ml-3"
                        onClick={handleDelete}
                      >
                        Delete Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* File Upload */}
              <div className="p-5 border-2 mt-5 rounded-md">
                {!companyPresent && !linkPresent &&(
                  <div className="flex flex-col space-y-3  justify-center">
                    {/* Trigger button to open popup */}
                    <p className="text-red-400">
                      Upload company's incorporation certificate or Official
                      website link
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center gap-3"
                    >
                      <FaUpload /> <span>Upload PDF or Enter URL</span>
                    </button>

                    {/* Modal Popup */}
                    {isModalOpen && (
                      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-50 z-50 mt-10 w-full]">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%]  lg:w-[600px] flex flex-col space-y-4 justify-between relative mx-5">
                          {/* File Upload Section */}
                          <FaTimes
                            className="absolute right-3 top-3 text-red-500 hover:cursor-pointer"
                            onClick={() => {
                              setIsModalOpen(false);
                              setSelectedFile(null);
                              setCompanyUrl("");
                              if (recruiter?.companyCertificate) {
                                urlCreator(recruiter.companyCertificate);
                                setCompanyPresent(true);
                                setLinkPresent(false);
                              }
                              if(recruiter?.companyWebsite){
                                setCompanyUrl(recruiter.companyWebsite.link);
                                setLinkPresent(true);
                                setCompanyPresent(false);
                              }
                            }}
                          />
                          <div className="flex flex-col md:flex-row  justify-center  items-center">
                            <div className={`mx-3`}>
                              {!companyUrl && (
                                <div className="w-full  flex flex-col items-center justify-center">
                                  <input
                                    id="fileinput"
                                    type="file"
                                    onChange={handleFileInput}
                                    className="hidden"
                                    accept=".pdf"
                                  />
                                  <label
                                    htmlFor="fileinput"
                                    className="text-blue-500 text-lg hover:cursor-pointer hover:scale-105 duration-300 flex justify-center items-center gap-2 border-2 px-3 mx-auto rounded-md border-dashed border-blue-500"
                                  >
                                    <FaUpload />
                                    <span>Upload PDF</span>
                                  </label>
                                  {selectedFile && (
                                    <p className="text-center mt-5">
                                      {selectedFile.name}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            {/* OR Divider */}
                            <div className="mx-3">
                              {!selectedFile && !companyUrl && (
                                <div className="">
                                  <span className="text-gray-400">OR</span>
                                </div>
                              )}
                            </div>

                            {/* URL Input Section */}
                            <div className="mx-3">
                              {!selectedFile && (
                                <div className="w-full ">
                                  <input
                                    type="text"
                                    placeholder="Enter website link"
                                    onChange={handleUrlInputChange}
                                    className="border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-blue-500  "
                                  />
                                </div>
                              )}
                            </div>
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
                  <div className="text-center space-y-2">
                    <a
                      href={pdfUrl}
                      download={
                        recruiter?.companyCertificate
                          ? recruiter.companyCertificate.filename
                          : selectedFile?.name || "Company_Certificate.pdf"
                      }
                      className="text-blue-500 text-lg underline"
                    >
                      Download Company Incorporation Certificate?
                    </a>
                    <div
                      onClick={() => {
                        setIsModalOpen(true); // Open the modal dialog box
                        setPdfUrl(null);
                        setCompanyPresent(false);
                        setSelectedFile(null);
                      }}
                      className="hover:cursor-pointer bg-blue-500 rounded-md px-2 py-1 w-fit mx-auto text-white"
                    >
                      Reupload
                    </div>

                    {companyPresent && <div onClick={()=>{setCompanyPresent(false);setIsModalOpen(true); setSelectedFile(null)}} className="text-green-600 hover:cursor-pointer">
                      Want to provide company's website link?
                    </div>}
                    <p className="text-gray-600 text-md font-semibold">
                      (
                      {recruiter?.companyCertificate
                        ? `Uploaded ${TimeAgo(recruiter.companyCertificate.uploadedDate)}`
                        : selectedFile
                          ? `Uploaded just now`
                          : "No details available"}
                      )
                    </p>
                    <p className="text-gray-600 text-md font-bold flex justify-center gap-2">
                      Verification status:
                      <span
                        className={`flex items-center gap-[2px] ${recruiter?.companyCertificate?.status === "pending"
                          ? "text-yellow-500"
                          : recruiter?.companyCertificate?.status ===
                            "Verified"
                            ? "text-green-500"
                            : recruiter?.companyCertificate?.status ===
                              "Rejected"
                              ? "text-red-500"
                              : ""
                          } `}
                      >
                        <MdOutlineCancel
                          className={`${recruiter?.companyCertificate?.status === "Rejected"
                            ? "block"
                            : "hidden"
                            }`}
                        />
                        <MdVerifiedUser
                          className={`${recruiter?.companyCertificate?.status === "Verified"
                            ? "block"
                            : "hidden"
                            }`}
                        />
                        <MdOutlinePendingActions
                          className={`${recruiter?.companyCertificate?.status === "pending"
                            ? "block"
                            : "hidden"
                            }`}
                        />
                        {recruiter?.companyCertificate?.status || "Pending"}
                      </span>
                    </p>
                    {recruiter.companyCertificate?.status !== "Verified" ||
                      recruiter.companyCertificate?.status !== "Rejected" ? (
                      ""
                    ) : (
                      <div className="flex flex-col md:flex-row items-center gap-1 justify-center text-md font-semibold">
                        <p className="text-red-600">
                          We will verify your certificate shortly!
                        </p>
                        <p className="text-red-600 text-center">
                          (Estimated time-24hrs)
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {companyUrl && (
                  <div className="text-center space-y-2">
                    <div className="font-semibold text-lg">Your Company's Wesbite Link</div>
                    <a href={companyUrl} target="_blank"
                      rel="noopener noreferrer">{companyUrl}</a>
                      <div onClick={()=>{setLinkPresent(false);setIsModalOpen(true);setPdfUrl(null);setCompanyUrl(null)}} className="hover:cursor-pointer bg-blue-500 rounded-md px-2 py-1 w-fit mx-auto text-white">Update Link</div>
                      <p className="text-gray-600 text-md font-bold flex justify-center gap-2">
                      Verification status:
                      <span
                        className={`flex items-center gap-[2px] ${recruiter?.companyWebsite?.status === "pending"
                          ? "text-yellow-500"
                          : recruiter?.companyWebsite?.status ===
                            "Verified"
                            ? "text-green-500"
                            : recruiter?.companyWebsite?.status ===
                              "Rejected"
                              ? "text-red-500"
                              : ""
                          } `}
                      >
                        <MdOutlineCancel
                          className={`${recruiter?.companyWebsite?.status === "Rejected"
                            ? "block"
                            : "hidden"
                            }`}
                        />
                        <MdVerifiedUser
                          className={`${recruiter?.companyWebsite?.status === "Verified"
                            ? "block"
                            : "hidden"
                            }`}
                        />
                        <MdOutlinePendingActions
                          className={`${recruiter?.companyWebsite?.status === "pending"
                            ? "block"
                            : "hidden"
                            }`}
                        />
                        {recruiter?.companyWebsite?.status || "Pending"}
                      </span>
                    </p>

                    {recruiter.companyWebsite?.status !== "Verified" ||
                      recruiter.companyWebsite?.status !== "Rejected" ? (
                      ""
                    ) : (
                      <div className="flex flex-col md:flex-row items-center gap-1 justify-center text-md font-semibold">
                        <p className="text-red-600">
                          We will verify your website shortly!
                        </p>
                        <p className="text-red-600 text-center">
                          (Estimated time-24hrs)
                        </p>
                      </div>
                    )}
                      
                  </div>
                )}
              </div>
              <div className="mt-5 text-right">
                <button
                  onClick={handleDetailsUpdate_2}
                  className="px-5 py-1 bg-blue-500 text-white rounded-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecProfile;
