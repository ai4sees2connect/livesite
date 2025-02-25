import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardList,
  FaTimes,
  FaClock,
  FaCheck,
  FaBuilding,
  FaArrowLeft,
  FaRunning,
  FaStar,
  FaQuestion,
  FaFilter,
  FaAngleRight,
  FaAngleLeft,
} from "react-icons/fa";
import Spinner from "../common/Spinner";
import getUserIdFromToken from "./auth/authUtils";
import TimeAgo from "../common/TimeAgo";
import api from "../common/server_url";
import { toast } from "react-toastify";
// import CustomDropdown from './utils/CustomDropdown';
import Select from "react-select";
import CustomRadio from "./utils/CustomRadio";
import StipendSlider from "./utils/StipendSlider";
import { useStudent } from "./context/studentContext";
// import CustomRadio from './utils/CustomRadio';
import statesAndCities from "../common/statesAndCities";
// country
import countryData from "../TESTJSONS/countries+states+cities.json";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState([]);
  const { logout, student, refreshData } = useStudent();
  const userId = getUserIdFromToken();
  const [filterOpen, setFilterOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 9;
  const scrollableRef = useRef(null);
  const navigate = useNavigate();
  // state for country and state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [internshipsCount, setInternshipsCount] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null)
  const [resumeName, setResumeName] = useState(null)
  const location = useLocation(); // Access state
  const internshipId = location.state?.internshipId;

  console.log("Location state:", location.state); // Log the entire state
  console.log("Internship ID:", internshipId);

  if(internshipId){
    openModal(internshipId);
  }

  console.log('this is selected internship', selectedInternship);

  const jobProfiles = [
    "3D Animation",
    "Account Management",
    "Accounting & Auditing",
    "Acting/Performing Arts",
    "Administrative Assistant",
    "Advertising Specialist",
    "Aerospace Engineering",
    "AI (Artificial Intelligence)",
    "Android Development",
    "Animation Design",
    "App Developer",
    "Application Support Engineer",
    "Architecture",
    "Art Director",
    "Asset Management",
    "Assistant Producer",
    "Audio Engineer",
    "Automation Engineer",
    "Automotive Engineering",
    "AWS Development",
    "Back-End Development",
    "Bank Teller",
    "Banking Operations",
    "Big Data Engineer",
    "Bioinformatics Researcher",
    "Biomedical Engineering",
    "Blockchain Development",
    "Brand Management",
    "Broadcast Engineering",
    "Budget Analyst",
    "Building Inspector",
    "Business Analyst",
    "Business Consultant",
    "Business Development",
    "Business Intelligence Analyst",
    "Call Center Agent",
    "Cartography",
    "Chemical Engineering",
    "Civil Engineering",
    "Claims Adjuster",
    "Cloud Architect",
    "Cloud Computing",
    "Cloud Security Engineer",
    "Communications Specialist",
    "Compliance Officer",
    "Computer Hardware Engineer",
    "Construction Manager",
    "Content Creation",
    "Content Editor",
    "Content Management",
    "Content Marketing",
    "Content Strategist",
    "Content Writing",
    "Corporate Law Intern",
    "Corporate Trainer",
    "Cost Estimator",
    "Creative Director",
    "CRM Development",
    "Customer Success Manager",
    "Cybersecurity",
    "Data Analytics",
    "Data Architect",
    "Data Engineering",
    "Data Entry Clerk",
    "Data Governance Specialist",
    "Data Quality Analyst",
    "Data Science",
    "Database Administration",
    "Debt Collection Officer",
    "Dental Assistant",
    "Dentist",
    "Design Engineer",
    "Desktop Support Technician",
    "DevOps Engineer",
    "Digital Illustrator",
    "Digital Marketing",
    "Digital Product Designer",
    "E-Commerce Management",
    "Electrical Engineering",
    "Elementary School Teacher",
    "Embedded Systems Development",
    "Environmental Engineer",
    "ERP Development",
    "Event Coordination",
    "Event Management",
    "Exhibition Designer",
    "Fashion Design",
    "Fashion Marketing",
    "Fashion Stylist",
    "Film Director",
    "Film Editor",
    "FinTech Development",
    "Financial Analyst",
    "Financial Planner",
    "Fitness Trainer",
    "Flutter Development",
    "Food Technology",
    "Forensic Scientist",
    "Front-End Development",
    "Full-Stack Development",
    "Fundraising Coordinator",
    "Game Design",
    "Game Development",
    "General Practitioner (Doctor)",
    "Genetic Counselor",
    "Geologist",
    "Graphic Design",
    "Green Energy Consultant",
    "Hair Stylist",
    "Hardware Development",
    "Healthcare Administration",
    "Healthcare Management",
    "Hotel Management",
    "HR Business Partner",
    "HR Generalist",
    "HR Management",
    "HVAC Engineer",
    "Illustrator",
    "Industrial Designer",
    "Industrial Engineering",
    "Information Security Analyst",
    "Information Systems Manager",
    "Interior Design",
    "International Trade Specialist",
    "Investment Banking",
    "IT Consultant",
    "IT Security Specialist",
    "IT Support",
    "IT Systems Administrator",
    "Java Development",
    "Journalism",
    "Lab Technician",
    "Language Translation",
    "Law/Legal Intern",
    "Litigation Assistant",
    "Logistics Coordinator",
    "Machine Learning Engineer",
    "Maintenance Engineer",
    "Manufacturing Engineering",
    "Marine Biologist",
    "Market Research",
    "Marketing Analyst",
    "Marketing Manager",
    "Materials Engineer",
    "Mechanical Engineering",
    "Medical Assistant",
    "Medical Coding",
    "Medical Equipment Technician",
    "Medical Laboratory Scientist",
    "Medical Research",
    "Microbiologist",
    "Mobile App Development (Android)",
    "Mobile App Development (iOS)",
    "Motion Graphics Design",
    "Museum Curator",
    "Music Producer",
    "Network Administrator",
    "Network Engineer",
    "Nutritionist/Dietician",
    "Occupational Therapist",
    "Office Administrator",
    "Oil and Gas Engineer",
    "Operations Analyst",
    "Operations Management",
    "Packaging Design",
    "Paralegal",
    "Patent Analyst",
    "Payroll Specialist",
    "Performance Marketing Specialist",
    "Personal Assistant",
    "Petroleum Engineer",
    "Pharmacist",
    "Photographer",
    "PHP Development",
    "Physical Therapist",
    "Physiotherapist",
    "Pilates Instructor",
    "Policy Analyst",
    "Political Campaign Manager",
    "Portfolio Manager",
    "PR (Public Relations) Specialist",
    "Private Equity Analyst",
    "Product Design",
    "Product Management",
    "Production Assistant",
    "Production Engineer",
    "Project Management",
    "Property Manager",
    "Python Development",
    "Quality Assurance (QA)",
    "Quality Control Analyst",
    "React Native Development",
    "Real Estate Development",
    "Recruiter",
    "Renewable Energy Engineer",
    "Research Analyst",
    "Respiratory Therapist",
    "Restaurant Manager",
    "Risk Management Analyst",
    "Ruby on Rails Development",
    "Travels",
    "Tourism",
    "Web Development",
  ];

  useEffect(() => {
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    setFilterOpen(isLargeScreen);
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${api}/student/resume/${userId}`, {
          responseType: 'blob', // Set to 'blob' to handle file downloads
        });

        const filename = response.headers['content-disposition']
          .split('filename=')[1]
          .replace(/"/g, ''); // Clean up any surrounding quotes

        // If you need to create a URL for the resume file (for example, to display it in a link or a button)
        const fileURL = URL.createObjectURL(response.data);

        // Set the URL to the state
        setResumeUrl(fileURL);
        setResumeName(filename);
        // setResumeLoading(false);
      } catch (error) {
        console.log('Error fetching student resume:', error);
        // setResumeLoading(false);
      }
    };

    fetchResume();
  }, [userId]);

  const { type } = useParams();
  const [selectedLocation, setSelectedLocation] = useState([]);
  // const [workType, setWorkType] = useState('All Internships')
  const [workType, setWorkType] = useState(() => {
    return type
      ? type
        .replace(/-/g, " ") // Replace dashes with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
      : "All Internships";
  });
  const [selectedStipend, setSelectedStipend] = useState(0);
  // const [isInterestedModalOpen, setIsInterestedModalOpen] = useState(false);
  const [availability, setAvailability] = useState(
    "Yes! Will join Immediately"
  );
  // const [resumeUrl, setResumeUrl] = useState(null);
  // const [resumeFilename, setResumeFilename] = useState(null);
  const [aboutText, setAboutText] = useState("");
  const [assessmentAns, setAssessmentAns] = useState("");
  const [detailedAvailability, setDetailedAvailability] = useState("");
  // const [cachedInternships, setCachedInternships] = useState(null);
  console.log(workType);
  console.log("this student is from context", student);




  useEffect(() => {
    refreshData();
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const formattedType =
      workType.replace(/\s+/g, "-").toLowerCase();

    navigate(`/student/internships/${userId}/${formattedType}`, { replace: true });
  }, [workType, navigate]);



  const constructQueryStringReset = () => {
    let query = `page=${1}`;
    if (workType && workType !== "All Internships")
      query += `&workType=${workType}`;
    if (selectedProfile.length > 0)
      query += `&jobProfile=${selectedProfile.join(",")}`;
    if (selectedStipend !== 0) query += `&stipend=${selectedStipend}`;
    if (selectedCountry) query += `&country=${selectedCountry}`;
    if (selectedState) query += `&state=${selectedState}`;
    if (selectedCity) query += `&city=${selectedCity}`;
    return query;
  };

  const constructQueryStringPageUpdation = () => {
    let query = `page=${page}`;
    if (workType && workType !== "All Internships")
      query += `&workType=${workType}`;
    if (selectedProfile.length > 0)
      query += `&jobProfile=${selectedProfile.join(",")}`;
    if (selectedStipend !== 0) query += `&stipend=${selectedStipend}`;
    if (selectedCountry) query += `&country=${selectedCountry}`;
    if (selectedState) query += `&state=${selectedState}`;
    if (selectedCity) query += `&city=${selectedCity}`;
    return query;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInternships, setFilteredInternships] = useState([]);
  const fetchInternships = async () => {
    try {
      setLoading(true);
      const queryString = constructQueryStringPageUpdation(); // Include filters
      const response = await axios.get(`${api}/student/${userId}/internships?${queryString}`);
  
      setTotalPages(response.data.totalPages);
      setInternshipsCount(response.data.numOfInternships);
      
      let internships = response.data.internships;
  
      // 🔹 Filter out internships the user has already applied to
      internships = internships.filter(internship => !internship.isApplied);
  
      const recruiterIds = [...new Set(internships.map(internship => internship.recruiter?._id).filter(Boolean))];
  
      // 🔹 Fetch recruiter logos
      let logoMap = {};
      if (recruiterIds.length > 0) {
        try {
          const logosResponse = await axios.post(`${api}/student/batch-get-logos`, { recruiterIds });
          logoMap = logosResponse.data.logos || {};
        } catch (logoErr) {
          console.error("Error fetching recruiter logos:", logoErr);
        }
      }
  
      // 🔹 Assign logos to internships
      const internshipsWithLogos = internships.map(internship => ({
        ...internship,
        logoUrl: logoMap[internship.recruiter?._id] || null, // Default to null if logo not found
      }));
  
      setInternships(internshipsWithLogos);
      setFilteredInternships(internshipsWithLogos); // Initialize filtered list
      setLoading(false);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to fetch internships. Please try again later.");
      setLoading(false);
    }
  };
  
  
  const fetchAllInternships = async () => {
    try {
      setLoading(true);
      let allInternships = new Map(); // Use a Map to store only unique internships
      let currentPage = 1;
      let totalPages = 1;
  
      const baseQuery = constructQueryStringReset(); // Reset filters for page 1
  
      while (currentPage <= totalPages) {
        const queryString = baseQuery.replace(/page=\d+/, `page=${currentPage}`);
        const response = await axios.get(`${api}/student/internships?${queryString}`);
  
        if (currentPage === 1) {
          totalPages = response.data.totalPages; // Set total pages on the first request
        }
  
        response.data.internships.forEach((internship) => {
          if (!allInternships.has(internship._id)) {
            allInternships.set(internship._id, internship); // Store unique internships only
          }
        });
  
        currentPage++;
      }
  
      const uniqueInternships = Array.from(allInternships.values());
  
      // Fetch recruiter logos
      const recruiterIds = [...new Set(uniqueInternships.map(internship => internship.recruiter?._id).filter(Boolean))];
  
      let logoMap = {};
      if (recruiterIds.length > 0) {
        try {
          const logosResponse = await axios.post(`${api}/student/batch-get-logos`, { recruiterIds });
          logoMap = logosResponse.data.logos || {};
        } catch (logoErr) {
          console.error("Error fetching recruiter logos:", logoErr);
        }
      }
  
      // Assign logos to internships
      const internshipsWithLogos = uniqueInternships.map(internship => ({
        ...internship,
        logoUrl: logoMap[internship.recruiter?._id] || null, // Default to null if logo not found
      }));
  
      setInternships(internshipsWithLogos);
      setFilteredInternships(internshipsWithLogos);
      setTotalPages(totalPages);
      setInternshipsCount(internshipsWithLogos.length);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to fetch internships. Please try again later.");
      setLoading(false);
    }
  };
  
  
  
  
  

  useEffect(() => {
    fetchInternships();
  }, [workType, selectedProfile, selectedStipend, selectedCountry, selectedState, selectedCity, page]);
  
  
  

  // Filter internships based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInternships(internships);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = internships.filter(internship =>
        internship.internshipName.toLowerCase().includes(lowerCaseSearchTerm) ||
        internship.recruiter.companyName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        internship.jobProfile.toLowerCase().includes(lowerCaseSearchTerm) ||
        internship.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredInternships(filtered);
    }
  }, [searchTerm, internships]);

  //fetching resume in below useEffect
  useEffect(() => {
    // Fetch the resume from the backend
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${api}/student/resume/${userId}`, {
          responseType: "blob", // Set response type to blob for binary data
        });

        // Create a URL for the blob data
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResumeUrl(url);
        console.log(resumeUrl);

        const contentDisposition = response.headers["content-disposition"];
        // console.log('contentDisposition:', contentDisposition);
        // console.log(Object.keys(response.headers));
        // console.log('response.headers:', response.headers);
        if (contentDisposition) {
          console.log("yattttaaa");
          const matches = /filename="([^"]*)"/.exec(contentDisposition);
          if (matches) setResumeName(matches[1]);
        }

        // setResumeCreatedAt(createdAt);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    if (student?.resume) {
      fetchResume();
    }
  }, [userId]);
  console.log("this is resume", resumeUrl);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const scrollToTop = () => {
    scrollableRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (internships?.length > 0) {
      scrollToTop();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [internships]);

  const openModal = async (internship) => {
    setSelectedInternship(internship);
    console.log("selected internship", internship);
    try {
      const response = await axios.put(
        `${api}/student/internship/${internship._id}/view`
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  console.log("this is about text", aboutText);

  const applyToInternship = async (internshipId) => {
    try {
        console.log("this is student", student);
        if (
            student.education.length == 0 ||
            student.skills.length == 0 ||
            !student.gender ||
            !student.homeLocation.city ||
            !student.resume
        ) {
            navigate(`/student/profile/${userId}`);
            return;
        }

        if (!availability || !aboutText) {
            toast.error("Please Enter all fields");
            return;
        }

        if (availability === 'No! Cannot Join immediately' && !detailedAvailability) {
            toast.error("Please provide date of joining");
            return;
        }

        const formData = {
            availability: availability === 'Yes! Will join Immediately' ? availability : detailedAvailability,
            aboutText,
            assessmentAns,
        };

        const response = await axios.post(
            `${api}/student/internship/${userId}/apply/${internshipId}`,
            formData
        );

        if (response.status === 200) {
            if (response.data.success) {
                toast.success("You have already applied for this Internship");
            } else {
                toast.success("Successfully applied to the internship");
            }

            setTimeout(() => {
                setSelectedInternship(null);
                navigate(`/student/myApplications/${userId}`);
            }, 1000);

            return;
        } else {
            toast.error("Failed to apply");
        }
    } catch (error) {
        toast.error("Error applying to internship");
    }
};


  const handleChange = (value) => {
    setSelectedLocation(value);
  };

  const handleReset = () => {
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setWorkType("All Internships");
    setSelectedStipend(0);
    setSelectedProfile([]);
    setSearchTerm("");
  };

  const isAlreadyApplied = (internshipId) => {
    return appliedInternships.some(
      (applied) => applied.internship._id === internshipId
    );
  };

  const handleRadioChange = (e) => {
    if (e.target.value === "Yes"){
      setAvailability("Yes! Will join Immediately");
      setDetailedAvailability("");
    }
    else if (e.target.value === "No")
      setAvailability("No! Cannot Join immediately");
  };

  // console.log(selectedStipend);
  // console.log(aboutText);
  console.log(assessmentAns);
  console.log(userId);
  console.log('this is availability',availability);
  console.log('this is detailed availability',detailedAvailability);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }
  // country state city Api

  // Get available states and cities based on selections
  const states = selectedCountry
    ? countryData.find((c) => c.name === selectedCountry)?.states
    : [];
  const cities = selectedState
    ? states.find((s) => s.name === selectedState)?.cities
    : [];

  return (
    <div className="py-5 px-5 mt-16 lg:mt-2 min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row w-full lg:w-[90%] mx-auto  gap-10 ">
        {/* this below div is filter button */}
        <div
          className={`lg:hidden flex space-x-1 border-2 px-3 py-1 rounded-lg w-fit items-center bg-white hover:cursor-pointer hover:border-blue-400  ${filterOpen && "border-blue-400"
            }`}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <span>Filters</span>
          <FaFilter className="hover:cursor-pointer text-blue-500" />
        </div>

        {/* this below div is filter div */}
        <div
          className={` ${filterOpen ? "block" : "hidden"
            } w-[84%] md:w-[90%]  lg:ml-10 mx-auto lg:w-[40%] xl:w-[30%] h-full lg:max-h-screen lg:mt-24 px-6 shadow-xl rounded-md border-t py-6 overflow-y-auto scrollbar-thin bg-white  relative`}
        >
          <h1 className="text-center font-extrabold text-xl tracking-widest">
            Filters
          </h1>
          <input
        type="text"
        placeholder="Search internships..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      />
          <FaTimes
            onClick={() => setFilterOpen(false)}
            className="absolute right-3 top-5 lg:hidden text-blue-500 hover:cursor-pointer"
          />

          <p className="mb-4 mt-6">Type of Internship:</p>
          <button
            onClick={handleReset}
            className="absolute right-5 top-[76px] text-blue-400 underline"
          >
            Reset filters
          </button>
          <div className="flex flex-col space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="work-type"
                value="All Internships"
                checked={workType === "All Internships"}
                onChange={(e) => setWorkType(e.target.value)}
                className="form-radio text-blue-600 h-6 w-6 "
              />
              <span className="text-[17px]">All Internships</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="work-type"
                value="Work From Home"
                checked={workType === "Work From Home"}
                onChange={(e) => setWorkType(e.target.value)}
                className="form-radio text-green-600 h-6 w-6"
              />
              <span className="">Work from Home</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="work-type"
                value="Work From Office"
                checked={workType === "Work From Office"}
                onChange={(e) => setWorkType(e.target.value)}
                className="form-radio text-blue-600 h-6 w-6"
              />
              <span className="">Work from Office</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="work-type"
                value="Hybrid"
                checked={workType === "Hybrid"}
                onChange={(e) => setWorkType(e.target.value)}
                className="form-radio text-blue-600 h-6 w-6"
              />
              <span className="">Hybrid</span>
            </label>
          </div>
          <StipendSlider
            selectedStipend={selectedStipend}
            setSelectedStipend={setSelectedStipend}
          />
          <div className="my-4">
            <p>Profile</p>
            <Select
              value={selectedProfile.map((profile) => ({
                value: profile,
                label: profile,
              }))}
              onChange={(values) =>
                setSelectedProfile(values.map((option) => option.value))
              }
              options={jobProfiles.map((job) => ({
                value: job,
                label: job,
              }))}
              isMulti
              placeholder="e.g Marketing"
              className="w-full mb-3 shadow-md"
              classNamePrefix="custom-select-dropdown"
            />
          </div>

          {(workType === "Work From Office" || workType === "Hybrid") && (
            <div className="mt-7">
              <p className="mt-6 mb-2 font-bold">Location</p>

              <div className="flex flex-col gap-3">
                {/* Country Dropdown */}
                <select
                  className="border-2 py-1 rounded-md px-2"
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
                  className="border-2 py-1 rounded-md px-2"
                  id="state"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity("");
                  }}
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
                  value={selectedCity}
                  disabled={!selectedState}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="border-2 py-1 rounded-md px-2"
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
          )}
        </div>

        <h1 className="text-3xl font-bold mb-1 mt-1 text-center lg:hidden">
          {internshipsCount} Total Internships
        </h1>

        {/* internships div */}
        <div className="w-full  lg:w-[79%] mt-5">
          <h1 className="text-3xl font-bold mb-8 mt-8 text-center hidden lg:block">
            {internshipsCount} Total Internships
          </h1>

          {/* list of internships */}
          <div className="flex-1 lg:mt-0  h-screen scrollbar-thin relative">
            <div className="flex flex-col justify-center bg-gray-100">
              {/* this below div is list of internships */}
              <div
                ref={scrollableRef}
                className="overflow-scroll scrollbar-thin h-[90vh] overflow-x-hidden flex flex-col gap-5"
              >
                {loading && <p>Loading internships...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {filteredInternships.length === 0 ? (
        <p>No internships found</p>
      ) : (
        <div className="space-y-4">
          {filteredInternships.map((internship) => (
            <div
              key={internship._id}
              className="bg-white shadow-md rounded-lg p-5 w-full lg:w-[90%] mx-auto relative space-y-1 hover:cursor-pointer hover:scale-105 duration-300 border"
              onClick={() => openModal(internship)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg lg:text-xl font-bold">
                    {internship.internshipName}
                  </h2>
                  <p className="text-gray-600 text-lg font-semibold">
                    {internship.recruiter.companyName !== ""
                      ? internship.recruiter.companyName
                      : internship.recruiter.firstname + " " + internship.recruiter.lastname}
                  </p>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => openModal(internship)}
                    className="md:w-auto hidden md:block bg-blue-500 text-sm md:text-base rounded-md text-white px-2 py-1 hover:bg-green-500"
                  >
                    Apply
                  </button>
                  {internship.logoUrl ? (
                    <img
                      src={internship.logoUrl}
                      alt="Company Logo"
                      className="w-16 h-16 ml-3"
                    />
                  ) : (
                    <FaBuilding className="w-16 h-16 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="flex flex-col text-sm md:text-base md:space-x-3 md:flex-row">
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>
                    {internship.internLocation.country ||
                    internship.internLocation.state ||
                    internship.internLocation.city
                      ? `${internship.internLocation.country}, ${internship.internLocation.state}, ${internship.internLocation.city}`
                      : "Remote"}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <FaClock className="mr-2" />
                  <span>{internship.duration} Months</span>
                </div>

                {internship.stipendType === "unpaid" && (
                  <div className="flex items-center text-gray-700">
                    <FaMoneyBillWave className="mr-1" />
                    <span>Unpaid</span>
                  </div>
                )}

                {internship.stipendType !== "unpaid" && (
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center text-gray-700">
                      <FaMoneyBillWave className="mr-1" />
                      <span>
                        {internship.currency} {internship.stipend} /month
                      </span>
                    </div>

                    {internship.stipendType === "performance-based" && (
                      <div className="flex items-center mb-2 text-gray-700">
                        <span>+ incentives</span>
                        <div className="relative group">
                          <FaQuestion className="border border-black p-1 mx-1 rounded-full hover:cursor-pointer" />
                          <span className="absolute hidden group-hover:block bg-gray-700 text-white text-base rounded p-1 w-[250px]">
                            This is a Performance Based internship.
                            {internship.incentiveDescription}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isAlreadyApplied(internship._id) && (
                <p className="text-green-500 text-sm md:text-base inline-flex rounded-xl border-green-500">
                  <span className="text-gray-700 mr-1">Status:</span> Applied
                  <FaCheck className="ml-2 mt-1" />
                </p>
              )}

              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm md:text-base">
                  Posted:
                  <span className="text-sm font-bold">{TimeAgo(internship.createdAt)}</span>
                </p>

                {!isAlreadyApplied(internship._id) ? (
                  <button
                    onClick={() => openModal(internship)}
                    className="underline block md:hidden w-auto mb-1 text-sm md:text-base rounded-md text-blue-500"
                  >
                    View details
                  </button>
                ) : (
                  <Link
                    to={`/student/myApplications/${userId}`}
                    className="underline block md:hidden mb-1 text-sm md:text-base rounded-md text-blue-500"
                  >
                    Check Status
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
              </div>

              {/* pagination */}
              {internships.length > 0 && (
                <div className="flex justify-center my-4 space-x-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                      }`}
                  >
                    <FaAngleLeft />
                  </button>

                  <span>
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-md ${page === totalPages
                        ? "bg-gray-300"
                        : "bg-blue-500 text-white"
                      }`}
                  >
                    <FaAngleRight />
                  </button>
                </div>
              )}

              {selectedInternship && (
                  <>
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-40 "
                      
                    >
                    <div className="fixed inset-0 flex items-center justify-center z-50 " >
                      <div className="bg-white border border-gray-600 rounded-lg shadow-3xl w-[90%] lg:w-[60%] h-[90%] p-6 relative overflow-auto">
                        <div className="border-b">
                          <h2 className=" text-lg lg:text-2xl font-semibold lg:mb-4">
                            Applying for {selectedInternship.internshipName}
                          </h2>
                          <button
                            onClick={closeModal}
                            className="absolute top-7 right-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            <FaTimes />
                          </button>
                          <div>
                            <p className="text-gray-600 mb-1 lg:mb-4">
                              {selectedInternship.recruiter.companyName}
                            </p>
                            {/* <button
                        onClick={openInterestedModal}
                        className="text-sm lg:text-base font-semibold px-2 py-2 bg-blue-100  lg:py-2 lg:px-5 rounded-lg text-blue-500 mb-2"
                      >
                        I'm Interested
                      </button> */}
                          </div>
                        </div>

                        <div className="flex items-center text-gray-700 mb-1 lg:mb-2">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>
                            {selectedInternship.internLocation.country
                              ? `${selectedInternship.internLocation.country +
                              "," +
                              selectedInternship.internLocation.state +
                              "," +
                              selectedInternship.internLocation.city
                              }`
                              : "Remote"}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-700 mb-1 lg:mb-2">
                          <FaMoneyBillWave className="mr-2" />
                          <span>₹ {selectedInternship.stipend}</span>
                        </div>
                        <div className="flex items-center text-gray-700 mb-1 lg:mb-2">
                          <FaClock className="mr-2" />
                          <span>{selectedInternship.duration} Months</span>
                        </div>

                        <div className="flex items-center text-gray-700 mb-1 lg:mb-2">
                          <FaUsers className="mr-2" />
                          <span>
                            {selectedInternship.numberOfOpenings} Openings
                          </span>
                        </div>

                        {selectedInternship.internLocation && (
                          <div className="flex items-center text-gray-700 mb-1 lg:mb-2">
                            <FaClipboardList className="mr-2" />
                            <span>{selectedInternship.internshipType}</span>
                          </div>
                        )}

                        <h3 className=" text-base lg:text-lg font-medium mb-2">
                          Skills Required:
                        </h3>
                        <div className="flex flex-wrap mb-4">
                          {selectedInternship.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-base lg:text-lg font-medium mb-2">
                          Description:
                        </h3>
                        <div
                          className="text-sm lg:text-base text-gray-700 mb-4"
                          dangerouslySetInnerHTML={{
                            __html: selectedInternship.description,
                          }}
                        ></div>

                        <h3 className="text-lg font-medium mb-2">
                          Perks and Benefits
                        </h3>
                        <div className="flex flex-wrap mb-4">
                          {selectedInternship.perks.map((perk, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                            >
                              {perk}
                            </span>
                          ))}
                        </div>

                        <div>
                          {resumeUrl && (
                            <div className="resume-box mt-4">
                              <h1 className="text-lg sm:text-xl font-semibold">
                                Your Resume
                              </h1>

                              <div className="flex flex-col sm:flex-row sm:space-x-2">
                                <h1 className="text-gray-600">
                                  This Resume will be submitted along with you
                                  application
                                </h1>

                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500"
                                  download={resumeName}
                                >
                                  Click to view
                                </a>
                              </div>
                            </div>
                          )}

                          {!resumeUrl && (
                            <div className="flex space-x-3 items-center">
                              <span className="text-red-500">
                                Upload resume
                              </span>
                              <Link
                                to={`/student/profile/${userId}`}
                                className="bg-blue-500 text-white px-2
                            py-1 rounded-md"
                              >
                                Go to profile
                              </Link>
                            </div>
                          )}

                          <div className="about-yourself-box mt-9">
                            <h1 className="text-lg sm:text-xl font-semibold">
                              Tell us about yourself
                            </h1>
                            <textarea
                              value={aboutText}
                              onChange={(e) => setAboutText(e.target.value)}
                              className="my-3 w-[90%] sm:w-[80%] p-2 border-2"
                              placeholder="Mention your skills, your interests, your previous experience in my company, achievements and Why do you want to work with us."
                              rows={4}
                            ></textarea>
                          </div>

                          <div className="availability-check mt-4">
                            <h1>Can you join Immediately?</h1>
                            <div className="flex flex-col text-gray-600 my-2">
                              <label>
                                <input
                                  type="radio"
                                  value="Yes"
                                  checked={
                                    availability ===
                                    "Yes! Will join Immediately"
                                  }
                                  onChange={handleRadioChange}
                                />
                                <span className="mx-1">Yes</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="No"
                                  checked={
                                    availability ===
                                    "No! Cannot Join immediately"
                                  }
                                  onChange={handleRadioChange}
                                />
                                <span className="mx-1">No</span>
                              </label>

                            </div>

                            {availability === "No! Cannot Join immediately" && (
                              <div className="detailed-availability flex flex-col text-gray-600 my-2">
                                <h2>When can you join?</h2>
                                <label>
                                  <input
                                    type="radio"
                                    value="Within a week"
                                    checked={detailedAvailability === "Within a week"}
                                    onChange={(e)=>setDetailedAvailability(e.target.value)}
                                  />
                                  <span className="mx-1">Within a week</span>
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    value="Within 1-3 weeks"
                                    checked={detailedAvailability === "Within 1-3 weeks"}
                                    onChange={(e)=>setDetailedAvailability(e.target.value)}
                                  />
                                  <span className="mx-1">Within 1-3 weeks</span>
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    value="More than a month"
                                    checked={detailedAvailability === "More than a month"}
                                    onChange={(e)=>setDetailedAvailability(e.target.value)}
                                  />
                                  <span className="mx-1">More than a month</span>
                                </label>
                              </div>
                            )}
                          </div>

                          {selectedInternship.assessment && (
                            <div className="assessment-box mt-4">
                              <h1 className="text-lg sm:text-xl font-semibold mb-2">
                                Assessment
                              </h1>
                              <div className="text-gray-600 mb-2">
                                Q {selectedInternship.assessment}
                              </div>
                              <textarea
                                value={assessmentAns}
                                onChange={(e) =>
                                  setAssessmentAns(e.target.value)
                                }
                                className="w-[90%] sm:w-[80%] border-2 p-2"
                                rows={4}
                                name=""
                                id=""
                                placeholder="Write your answer here..."
                              ></textarea>
                            </div>
                          )}

                          <button
                            onClick={() =>
                              applyToInternship(selectedInternship._id)
                            }
                            className="bg-blue-400 hover:bg-blue-500 rounded-lg px-3 py-2 mt-7 text-white"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                  </>
                )}

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Internships;
