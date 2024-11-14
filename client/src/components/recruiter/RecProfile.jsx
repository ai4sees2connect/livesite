import React, { useEffect, useState, useRef } from "react";
import {
  FaBuilding,
  FaPlus,
  FaTimes,
  FaPen,
  FaPaperclip,
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    if (recruiter?.phone) {
      setPhoneNumber(recruiter.phone); // Set phoneNumber once recruiter data is loaded
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

  // const handleFileChange = (e) => {
  //   setLogo(e.target.files[0]);
  // };

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

  const handleDetailsUpdate = async () => {
    try {
      // const [contactResponse, nameResponse, companyResponse] = await Promise.all([
      //   axios.put(`${api}/recruiter/update-Contact/${idFromToken}`, {
      //     phoneNumber,
      //     countryCode,
      //   }),
      //   axios.put(`${api}/recruiter/update-name/${idFromToken}`, {
      //     firstname: firstName,
      //     lastnaem: lastName,
      //   }),
      //   axios.put(`${api}/recruiter/update-company/${idFromToken}`, {
      //     companyName: company,
      //   })
      // ]);

      const response = await axios.put(
        `${api}/recruiter/update-details/${idFromToken}`,
        {
          phone: phoneNumber,
          countryCode,
          firstname: firstName,
          lastname: lastName,
          companyName: company,
        }
      );

      // Handle success response (e.g., show success message, update UI, etc.)
      console.log("Details updated:", response.data);
      toast.success("Details updated successfully");
      window.location.reload();
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error updating Details:", error);
      toast.error("Failed to update Details. Please try again.");
    }
  };

  console.log(recruiter);
  console.log(firstName);
  console.log(lastName);
  console.log(company);

  // new recruiter profile  functionalities*******
  const [activeTab, setActiveTab] = useState("Tab1");
  // State for the checkbox
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

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
  const handleCloseManualInput = () => {
    setShowManualInput(false);
    setDesignation("");
  };
  // Handle changes to the company name input
  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
    if (e.target.value) {
      setIsCheckboxChecked(false);
    }
  };

  // Handle changes to the checkbox
  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
    if (e.target.checked) {
      setCompanyName("");
    }
  };

  // Industry functions
  const [industry, setIndustry] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [suggestions, setSuggestions] = useState([
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
  ]);

  // Handle industry change to filter suggestions
  const handleIndustryChange = (e) => {
    setIndustry(e.target.value);
  };

  // Add an industry to the selected list
  const handleSelectIndustry = (industry) => {
    if (!selectedIndustries.includes(industry)) {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
    setIndustry(""); // Clear input field after selecting
  };

  // Remove an industry from the selected list
  const handleRemoveIndustry = (industryToRemove) => {
    setSelectedIndustries(
      selectedIndustries.filter((ind) => ind !== industryToRemove)
    );
  };

  // Filter suggestions based on the input
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(industry.toLowerCase()) &&
      !selectedIndustries.includes(suggestion)
  );
  // company employee numbers
  const [totalEmployees, setTotalEmployees] = useState();
  const handleCompanySizeChange = (e) => {
    setTotalEmployees(e.target.value);
  };
  return !recruiter ? (
    <Spinner />
  ) : (
    // <div className="max-w-[1170px] mx-auto py-10 mt-[68px] min-h-screen px-3">
    //   <div className="border-2 rounded-lg flex flex-col items-center space-y-3 py-5">
    //     <h1 className="text-3xl font-bold mb-2 text-center">Profile</h1>
    // <div className=" w-40 h-auto my-10 flex flex-col space-y-4 items-center">
    //   {!logoUrl ? (
    //     <FaBuilding className="text-gray-400 w-full h-full" />
    //   ) : (
    //     <img
    //       src={logoUrl}
    //       alt="Company Logo"
    //       className="w-full h-40 my-2 rounded-full"
    //     />
    //   )}

    //   {!logoUrl && !logo && (
    //     <>
    //       <div className="text-gray-500">Upload Company logo</div>
    //       <button
    //         onClick={handleSelect}
    //         className="w-[70%] inline-block mx-auto bg-gray-300 rounded-lg py-1 px-2 hover:bg-blue-200 hover:scale-105 duration-300"
    //       >
    //         Select Logo
    //       </button>
    //       <input
    //         ref={fileInputRef}
    //         onChange={handleFileUpload}
    //         type="file"
    //         className="my-2 hover:cursor-pointer w-full hidden"
    //       />
    //     </>
    //   )}
    //   {logo && (
    //     <button
    //       type="submit"
    //       onClick={handleFileUpload}
    //       className={`  bg-gray-300 rounded-lg py-0 mt-4 px-2 hover:bg-green-200 hover:scale-105 duration-300  `}
    //     >
    //       UPLOAD
    //     </button>
    //   )}
    //   {logoUrl && (
    //     <button
    //       className="text-blue-500 underline w-full"
    //       onClick={handleDelete}
    //     >
    //       Change Logo
    //     </button>
    //   )}
    // </div>
    //     {/* box */}
    //     {/* firstname and lastname */}
    //     <div className="flex flex-col md:flex-row gap-5 w-full  lg:w-[70%] px-3 lg:px-0">
    //       {/* first name */}
    //       <div className="relative w-full">
    //         <div className="flex flex-col">
    //           <label>First Name</label>
    //           <input
    //             className="border-2 rounded-lg px-3 py-1"
    //             defaultValue={firstName}
    //             type="text"
    //             onChange={(e) => setFirstName(e.target.value)}
    //           />
    //         </div>
    //         {/* change button for first name */}
    //         {/* <div className="p-2 bg-green-200 absolute right-3 top-[27px] rounded-lg">
    //           <FaPen className="text-sm text-gray-600 hover:cursor-pointer " />
    //         </div> */}
    //       </div>
    //       {/* Last Name */}
    //       <div className="relative w-full">
    //         <div className="flex flex-col w-full">
    //           <label>Last Name</label>
    //           <input
    //             onChange={(e) => setLastName(e.target.value)}
    //             className="border-2 rounded-lg px-3 py-1"
    //             defaultValue={lastName}
    //             type="text"
    //           />
    //         </div>
    //         {/* chnage button for last name */}
    //         {/* <div className="p-2 bg-green-200 absolute right-3 top-[27px] rounded-lg">
    //           <FaPen className="text-sm text-gray-600 hover:cursor-pointer " />
    //         </div> */}
    //       </div>
    //     </div>

    //     {/* recruiter email & company name */}
    //     <div className="flex flex-col items-end md:flex-row gap-5 w-full  lg:w-[70%] px-3 lg:px-0">
    //       {/* Recruiter email */}
    //       <div className="relative w-full">
    //         <div className="flex flex-col">
    //           <label>Recruiter Email</label>
    //           <input
    //             className="border-2 rounded-lg px-3 py-1"
    //             defaultValue={recruiter?.email}
    //             type="text"
    //             readOnly
    //           />
    //         </div>
    //         {/* change button for recruiter email */}
    //         {/* <div className="p-2 bg-green-200 absolute right-3 top-[27px] rounded-lg">
    //           <FaPen className="text-sm text-gray-600 hover:cursor-pointer " />
    //         </div> */}
    //       </div>

    //       {/* company name */}
    //       <div className="w-full">
    //         {recruiter.companyName && (
    //           <div className="relative">
    //             <div className="flex flex-col">
    //               <label>Company Name</label>
    //               <input
    //                 onChange={(e) => setCompany(e.target.value)}
    //                 className="border-2 rounded-lg px-3 py-1"
    //                 defaultValue={recruiter?.companyName}
    //                 type="text"
    //               />
    //             </div>

    //           </div>
    //         )}
    //         {!isCompanyEdit && !recruiter.companyName && (
    //           <button
    //             onClick={() => setIsCompanyEdit(true)}
    //             className="bg-blue-500 text-white px-2 py-1"
    //           >
    //             Add Company Name
    //           </button>
    //         )}
    //         {isCompanyEdit && (
    //           <>
    //             <div className=" flex space-x-3 items-center mt-3 relative">
    //               <input
    //                 type="text"
    //                 value={companyName}
    //                 onChange={(e) => setCompanyName(e.target.value)}
    //                 className="border-2 border-gray-400 px-3 py-1 rounded-lg w-full text-center"
    //               />
    //               <FaTimes
    //                 onClick={() => {
    //                   setIsCompanyEdit(false);
    //                   setCompanyName("");
    //                 }}
    //                 className="hover:cursor-pointer w-5 h-5 absolute right-2"
    //               />
    //             </div>
    //             <button
    //               onClick={handleCompanySave}
    //               className="px-3 py-1 rounded-lg bg-green-300 hover:bg-green-500 my-2"
    //             >
    //               Save
    //             </button>
    //           </>
    //         )}
    //       </div>
    //     </div>

    //     {/* phone number */}
    //     {/* <h1 className=" text-gray-600 ">Ph no- {recruiter.phone}</h1> */}
    //     {/* country code */}

    //     <div className="bg-white rounded-lg w-full lg:w-[70%]">
    //       <div className="flex flex-col justify-center md:flex-row gap-2 mt-2 px-3 md:px-0 border-2 md:border-0 py-2 md:py-0 mx-3 rounded-lg">
    //         {/* Country Code Dropdown */}
    //         <div className="flex items-center">
    //           <label className="text-gray-500 mr-2">Country Code</label>
    //           <select
    //             value={countryCode}
    //             onChange={(e) => {
    //               setCountryCode(e.target.value);
    //               setPhoneNumber(phoneNumber); // Triggers a re-render
    //             }}
    //             className="text-sm outline-none rounded-lg h-full border border-gray-300 p-2"
    //           >
    //             <option value="+1">US (+1)</option>
    //             <option value="+91">IND (+91)</option>
    //             <option value="+44">EU (+44)</option>
    //           </select>
    //         </div>

    //         {/* Phone Number */}
    //         <div className="flex items-center">
    //           <label className="text-gray-500 mr-2">Phone</label>
    //           <input
    //             type="number"
    //             defaultValue={recruiter?.phone}
    //             onChange={(e) => setPhoneNumber(e.target.value)}
    //             className="w-full p-2 border border-gray-300 rounded-lg outline-none"
    //             placeholder="Phone number"
    //           />
    //         </div>

    //       </div>
    //     </div>

    //     <div>
    //           <button
    //             onClick={handleDetailsUpdate}
    //             disabled={phoneNumber?.length < 10 || !phoneNumber}
    //             className={`px-6 py-2 rounded-lg font-semibold text-white transition duration-200 w-full mt-3 md:mt-0
    //             ${phoneNumber?.length < 10
    //                 ? "bg-gray-300 cursor-not-allowed"
    //                 : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
    //               }`}
    //           >
    //             Update
    //           </button>
    //         </div>

    // {!recruiter.companyWebsite && !recruiter.companyCertificate && (
    //   <div className="flex flex-col space-y-3  justify-center">
    //     {/* Trigger button to open popup */}
    //     <p className="text-red-400">
    //       Upload company's incorporation certificate or Official website
    //       link
    //     </p>
    //     <button
    //       onClick={() => setIsModalOpen(true)}
    //       className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
    //     >
    //       Upload PDF or Enter URL
    //     </button>

    //     {/* Modal Popup */}
    //     {isModalOpen && (
    //       <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-50 z-50 mt-10">
    //         <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] flex flex-col space-y-4 justify-between relative">
    //           {/* File Upload Section */}
    //           <FaTimes
    //             className="absolute right-3 top-3 text-red-500 hover:cursor-pointer"
    //             onClick={() => {
    //               setIsModalOpen(false);
    //               setSelectedFile(null);
    //               setCompanyUrl("");
    //             }}
    //           />
    //           <div className="flex justify-center items-center">
    //             {!companyUrl && (
    //               <div className="w-[45%] flex flex-col items-center justify-center">
    //                 <input
    //                   id="fileinput"
    //                   type="file"
    //                   onChange={handleFileInput}
    //                   className="hidden"
    //                   accept=".pdf"
    //                 />
    //                 <label
    //                   htmlFor="fileinput"
    //                   className="text-blue-500 text-lg hover:cursor-pointer hover:scale-105 duration-300"
    //                 >
    //                   <span>Upload PDF</span>
    //                 </label>
    //                 {selectedFile && <p>{selectedFile.name}</p>}
    //               </div>
    //             )}

    //             {/* OR Divider */}
    //             {!selectedFile && !companyUrl && (
    //               <div className="w-[10%] flex items-center justify-center">
    //                 <span className="text-gray-400">OR</span>
    //               </div>
    //             )}

    //             {/* URL Input Section */}
    //             {!selectedFile && (
    //               <div className="w-[45%] flex flex-col items-center">
    //                 <input
    //                   type="text"
    //                   placeholder="Enter company's website URL"
    //                   onChange={handleUrlInputChange}
    //                   className="border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-blue-500"
    //                 />
    //               </div>
    //             )}
    //           </div>
    //           <button
    //             onClick={() => {
    //               setIsModalOpen(false);
    //               handleSubmit();
    //             }}
    //             className="bg-green-500 text-white mt-2 py-2 px-4 rounded hover:bg-green-700 "
    //           >
    //             Submit
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // )}

    // {pdfUrl && (
    //   <>
    //     <a
    //       href={pdfUrl}
    //       download={recruiter.companyCertificate.filename}
    //       className="text-blue-500"
    //     >
    //       Download Company Incorporation Certificate
    //     </a>
    //     <p className="text-gray-600">
    //       (
    //       {`Uploaded ${TimeAgo(recruiter.companyCertificate.uploadedDate)}`}
    //       )
    //     </p>
    //     <p className="text-gray-600">
    //       Verification:
    //       <span
    //         className={`${recruiter.companyCertificate.status === "pending"
    //             ? "text-yellow-500"
    //             : recruiter.companyCertificate.status === "Verified"
    //               ? "text-green-500"
    //               : recruiter.companyCertificate.status === "Rejected"
    //                 ? "text-red-500"
    //                 : ""
    //           }`}
    //       >
    //         {recruiter.companyCertificate.status}
    //       </span>
    //     </p>
    //     {recruiter.companyCertificate.status !== "Verified" && (
    //       <>
    //         <p className="text-red-400">
    //           We will verify your certificate shortly!
    //         </p>
    //         <p className="text-red-400 text-center">
    //           (Estimated time-24hrs)
    //         </p>
    //       </>
    //     )}
    //   </>
    // )}

    //     {recruiter.companyWebsite && (
    //       <div className="my-4">
    //         <p className="text-blue-500 text-center">
    //           {recruiter.companyWebsite.link}
    //         </p>
    //         <p className="text-gray-700 text-center">
    //           Verification: {recruiter.companyWebsite.status}
    //         </p>
    //         {recruiter?.companyWebsite.status !== "Verified" && (
    //           <>
    //             <p className="text-red-400">
    //               We will verify your provided link shortly!
    //             </p>
    //             <p className="text-red-400 text-center">
    //               (Estimated time-24hrs)
    //             </p>
    //           </>
    //         )}
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="min-h-screen mt-20">
      <div className="w-full lg:w-[50%] mx-auto p-4">
        {/* Tab Buttons */}
        <div className="flex space-x-4 justify-center items-center">
          {/* tab 1 */}
          <button
            className={`py-2 px-4 flex flex-col justify-center items-center ${
              activeTab === "Tab1"
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
            className={`py-2 px-4 flex flex-col justify-center items-center  ${
              activeTab === "Tab2"
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
                        className={`border-2 rounded-md px-3 py-1 w-full ${
                          showManualInput ? "appearance-none" : ""
                        }`}
                        value={showManualInput ? "notAvailable" : designation}
                        onChange={handleDesignationChange}
                      >
                        <option value="">Select Designation</option>
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
                    <div className="flex gap-2 items-center">
                      <input
                        className="border-2 rounded-md px-3 py-1 w-[60px] md:w-[100px]"
                        defaultValue={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        type="text"
                      />
                      <input
                        className="border-2 rounded-md px-3 py-1 w-full lg:w-[50%]"
                        defaultValue={recruiter?.phone}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type="number"
                      />
                      <p className="text-gray-600 ml-2 md:ml-5">
                        <span
                          className={`flex items-center gap-[2px] ${
                            recruiter?.companyCertificate?.status === "pending"
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
                            className={`${
                              recruiter?.companyCertificate?.status ===
                              "Rejected"
                                ? "block"
                                : "hidden"
                            }`}
                          />
                          <MdVerifiedUser
                            className={`${
                              recruiter?.companyCertificate?.status ===
                              "Verified"
                                ? "block"
                                : "hidden"
                            }`}
                          />
                          <MdOutlinePendingActions
                            className={`${
                              recruiter?.companyCertificate?.status ===
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
                      defaultValue={recruiter?.companyName}
                      type="text"
                      onChange={handleCompanyNameChange}
                      disabled={isCheckboxChecked}
                    />
                  </div>
                  {/* Checkbox below the input */}
                  <div className="flex items-start mt-3">
                    <input
                      id="checkbox"
                      type="checkbox"
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded mt-[3px]"
                      checked={isCheckboxChecked}
                      onChange={handleCheckboxChange}
                      disabled={!!companyName}
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
                  <textarea
                    className="border-2 rounded-md px-3 py-1"
                    defaultValue={recruiter?.description}
                    type="text"
                    rows={5}
                  />
                </div>
                {/* Organization city */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 ml-1">
                    Organization City
                  </label>
                  <input
                    className="border-2 rounded-md px-3 py-1"
                    type="text"
                  />
                </div>
                {/* Industry */}
                <div className="flex flex-col">
                  {/* Display selected industries */}
                  <div className="flex flex-wrap mb-2">
                    {selectedIndustries.map((ind, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 mr-2 mb-2 flex items-center"
                      >
                        {ind}
                        <button
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          onClick={() => handleRemoveIndustry(ind)}
                          aria-label="Remove industry"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input field for typing industry */}
                  <div className="flex flex-col relative">
                    <label className="text-sm text-gray-600 mb-1 ml-1">
                      Industry
                    </label>
                    <input
                      className="border-2 rounded-md px-3 py-1"
                      type="text"
                      value={industry}
                      onChange={handleIndustryChange}
                      placeholder="Type industry name"
                    />

                    {/* Display suggestions */}
                    {industry && filteredSuggestions.length > 0 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                        {filteredSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectIndustry(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* number of employees */}
                <div className="flex flex-col w-full lg:w-1/2">
                  <label className="text-sm text-gray-600 mb-1 ml-1">
                    Number Of Employees
                  </label>
                  <select
                    className="border-2 rounded-md px-3 py-1"
                    onChange={handleCompanySizeChange}
                    disabled={isCheckboxChecked}
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
                          className="border-2 border-dashed border-green-400 bg-green-100 rounded-sm py-1 px-5 hover:bg-green-200 hover:scale-105 duration-300"
                        >
                          Upload Logo
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
                {!recruiter.companyWebsite && !recruiter.companyCertificate && (
                  <div className="flex flex-col space-y-3  justify-center">
                    {/* Trigger button to open popup */}
                    <p className="text-red-400">
                      Upload company's incorporation certificate or Official
                      website link
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
                      {`Uploaded ${TimeAgo(
                        recruiter.companyCertificate.uploadedDate
                      )}`}
                      )
                    </p>
                    <p className="text-gray-600">
                      Verification:
                      <span
                        className={`${
                          recruiter.companyCertificate?.status === "pending"
                            ? "text-yellow-500"
                            : recruiter.companyCertificate?.status ===
                              "Verified"
                            ? "text-green-500"
                            : recruiter.companyCertificate?.status ===
                              "Rejected"
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {recruiter.companyCertificate?.status}
                      </span>
                    </p>
                    {recruiter.companyCertificate?.status !== "Verified" && (
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
              </div>
              <div className="mt-5 text-right">
                <button className="px-5 py-1 bg-blue-500 text-white rounded-sm">
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
