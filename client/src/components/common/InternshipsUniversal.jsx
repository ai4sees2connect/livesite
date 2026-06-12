import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import countryData from "../TESTJSONS/countries+states+cities.json";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTimes,
  FaClock,
  FaBuilding,
  FaRunning,
  FaStar,
  FaFilter,
  FaAngleRight,
  FaAngleLeft,
  FaSearch,
} from "react-icons/fa";
import Spinner from "../common/Spinner";
import getUserIdFromToken from "../student/auth/authUtils";
import TimeAgo from "../common/TimeAgo";
import api from "../common/server_url";
import StipendSlider from "../student/utils/StipendSlider";
import { useStudent } from "../student/context/studentContext";

const InternshipsUniversal = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInternships, setFilteredInternships] = useState([]);

  const { login } = useStudent();
  const userId = getUserIdFromToken();
  const navigate = useNavigate();
  const { type } = useParams();

  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [internshipsCount, setInternshipsCount] = useState(0);
  const scrollableRef = useRef(null);

  // Initialize workType from URL param
  const [workType, setWorkType] = useState(() => {
    if (type) {
      return type
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return "All Internships";
  });

  const [selectedStipend, setSelectedStipend] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

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

  // Redirect if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login();
      navigate(`/student/internships/${userId}`);
    }
  }, [navigate, userId, login]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update URL when workType changes
  useEffect(() => {
    const formattedType = workType.replace(/\s+/g, "-").toLowerCase();
    if (formattedType !== "all-internships") {
      navigate(`/internships/${formattedType}`, { replace: true });
    } else {
      navigate(`/internships`, { replace: true });
    }
  }, [workType, navigate]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    workType,
    selectedProfile,
    selectedStipend,
    selectedCountry,
    selectedState,
    selectedCity,
  ]);

  // Unified Fetch Internships Logic
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        let query = `page=${page}`;
        if (workType && workType !== "All Internships")
          query += `&workType=${workType}`;
        if (selectedProfile.length > 0)
          query += `&jobProfile=${selectedProfile.join(",")}`;
        if (selectedStipend !== 0) query += `&stipend=${selectedStipend}`;
        if (selectedCountry) query += `&country=${selectedCountry}`;
        if (selectedState) query += `&state=${selectedState}`;
        if (selectedCity) query += `&city=${selectedCity}`;

        const response = await axios.get(`${api}/student/internships?${query}`);
        setTotalPages(response.data.totalPages || 1);
        setInternshipsCount(response.data.numOfInternships || 0);

        const internshipsData = response.data.internships || [];
        const recruiterIds = [
          ...new Set(
            internshipsData.map((i) => i.recruiter?._id).filter(Boolean),
          ),
        ];

        let logoMap = {};
        if (recruiterIds.length > 0) {
          const logosResponse = await axios.post(
            `${api}/student/batch-get-logos`,
            { recruiterIds },
          );
          logoMap = logosResponse.data.logos || {};
        }

        const internshipsWithLogos = internshipsData.map((internship) => ({
          ...internship,
          logoUrl: logoMap[internship.recruiter?._id]
            ? `${api}${logoMap[internship.recruiter?._id]}`
            : null,
        }));

        setInternships(internshipsWithLogos);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to fetch internships. Please try again later.");
        setLoading(false);
      }
    };

    fetchInternships();
  }, [
    page,
    workType,
    selectedProfile,
    selectedStipend,
    selectedCountry,
    selectedState,
    selectedCity,
  ]);

  // Debounced local search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!searchQuery) {
        setFilteredInternships(internships);
      } else {
        setFilteredInternships(
          internships.filter(
            (internship) =>
              internship.internshipName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              internship.recruiter?.companyName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              internship.jobProfile
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              internship.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
          ),
        );
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, internships]);

  // Scroll to top when internships change
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [internships]);

  const handleRedirect = () => navigate("/student/login");
  const handleNextPage = () => setPage((p) => p + 1);
  const handlePreviousPage = () => setPage((p) => Math.max(1, p - 1));

  const handleReset = () => {
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setWorkType("All Internships");
    setSelectedStipend(0);
    setSelectedProfile([]);
    setSearchQuery("");
  };

  const states = selectedCountry
    ? countryData.find((c) => c.name === selectedCountry)?.states || []
    : [];
  const cities = selectedState
    ? states.find((s) => s.name === selectedState)?.cities || []
    : [];

  if (loading && internships.length === 0) return <Spinner />;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-light-color)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Toggle & Count */}
        <div className="lg:hidden flex justify-between items-center mb-2">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg text-[var(--primary-color)] font-semibold shadow-sm hover:bg-[var(--icon-bg-color)] transition-colors"
          >
            <FaFilter /> Filters
          </button>
          <h2 className="text-lg font-bold text-[var(--text-color)]">
            {internshipsCount} Internships
          </h2>
        </div>

        {/* Filter Sidebar */}
        <div
          className={`
          ${filterOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 fixed lg:sticky lg:top-20 lg:h-[calc(100vh-120px)]  top-0 left-0 h-full lg:h-auto w-80 lg:w-1/4 bg-white shadow-xl lg:shadow-md p-6 z-50 lg:z-0 transition-transform duration-300 ease-in-out overflow-y-auto
          rounded-none lg:rounded-xl border-r lg:border border-gray-100
        `}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[var(--text-color)]">
              Filters
            </h2>
            <button
              onClick={() => setFilterOpen(false)}
              className="lg:hidden text-[var(--text-light)] hover:text-[var(--primary-color)]"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="text-sm text-[var(--primary-color)] hover:underline mb-4 block"
          >
            Reset All Filters
          </button>

          {/* Search */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
            <input
              type="text"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent text-[var(--text-color)]"
            />
          </div>

          {/* Work Type */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-color)] mb-3 uppercase tracking-wide">
              Work Type
            </h3>
            <div className="flex flex-col gap-3">
              {[
                "All Internships",
                "Work From Home",
                "Work From Office",
                "Hybrid",
              ].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="workType"
                    value={type}
                    checked={workType === type}
                    onChange={() => setWorkType(type)}
                    className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300"
                  />
                  <span className="text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Stipend */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-color)] mb-3 uppercase tracking-wide">
              Min. Stipend
            </h3>
            <StipendSlider
              selectedStipend={selectedStipend}
              setSelectedStipend={setSelectedStipend}
            />
          </div>

          {/* Profile */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-color)] mb-3 uppercase tracking-wide">
              Profile
            </h3>
            <Select
              value={selectedProfile.map((profile) => ({
                value: profile,
                label: profile,
              }))}
              onChange={(values) =>
                setSelectedProfile(values.map((option) => option.value))
              }
              options={jobProfiles.map((job) => ({ value: job, label: job }))}
              isMulti
              placeholder="e.g. Marketing"
              classNamePrefix="custom-select-dropdown"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#e5e7eb",
                  boxShadow: "none",
                  "&:hover": { borderColor: "var(--primary-color)" },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? "var(--primary-color)"
                    : state.isFocused
                      ? "var(--icon-bg-color)"
                      : "white",
                  color: state.isSelected ? "white" : "var(--text-color)",
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "var(--icon-bg-color)",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "var(--primary-color)",
                }),
              }}
            />
          </div>

          {/* Location */}
          {(workType === "Work From Office" || workType === "Hybrid") && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-color)] mb-3 uppercase tracking-wide">
                Location
              </h3>
              <div className="flex flex-col gap-3">
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedState("");
                    setSelectedCity("");
                  }}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-color)]"
                >
                  <option value="">Select Country</option>
                  {countryData.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity("");
                  }}
                  disabled={!selectedCountry}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-color)] disabled:bg-gray-50"
                >
                  <option value="">Select State</option>
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
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-color)] disabled:bg-gray-50"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Overlay for mobile filter */}
        {filterOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setFilterOpen(false)}
          />
        )}

        {/* Internships List */}
        <div className="w-full lg:w-3/4">
          <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6 hidden lg:block">
            {internshipsCount} Internships Found
          </h2>

          <div ref={scrollableRef} className="flex flex-col gap-5">
            {filteredInternships.length > 0 ? (
              filteredInternships.map((internship) => (
                <div
                  key={internship._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[var(--text-color)] mb-1">
                        {internship.internshipName}
                      </h3>
                      <p className="text-[var(--text-light)] font-medium">
                        {internship.recruiter.companyName ||
                          `${internship.recruiter.firstname} ${internship.recruiter.lastname}`}
                      </p>
                    </div>
                    <div className="ml-4">
                      {internship.logoUrl ? (
                        <img
                          src={internship.logoUrl}
                          alt="Logo"
                          className="w-14 h-14 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-[var(--icon-bg-color)] rounded-lg flex items-center justify-center">
                          <FaBuilding className="text-2xl text-[var(--icon-color)]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-[var(--text-light)] mb-4">
                    <div className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-[var(--icon-color)]" />
                      <span>
                        {internship.internLocation.country
                          ? `${internship.internLocation.city}, ${internship.internLocation.country}`
                          : "Remote"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaClock className="text-[var(--icon-color)]" />
                      <span>{internship.duration} Months</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaMoneyBillWave className="text-[var(--icon-color)]" />
                      <span>
                        {internship.stipendType === "unpaid"
                          ? "Unpaid"
                          : `${internship.currency} ${internship.stipend}/mo`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        internship.studentCount < 20
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {internship.studentCount} Applicants
                    </span>
                    {internship.studentCount < 20 && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                        <FaRunning /> Early Applicant
                      </span>
                    )}
                    {internship.ppoCheck === "yes" && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        <FaStar /> PPO Available
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-[var(--text-light)]">
                      Posted <TimeAgo timestamp={internship.createdAt} />
                    </span>
                    <button
                      onClick={handleRedirect}
                      className="px-6 py-2 bg-[var(--button-color)] text-white font-semibold rounded-lg hover:bg-[var(--button-hover-color)] transition-colors shadow-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                <p className="text-[var(--text-light)] text-lg">
                  No internships found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {internships.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`p-3 rounded-lg transition-colors ${
                  page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[var(--button-color)] text-white hover:bg-[var(--button-hover-color)]"
                }`}
              >
                <FaAngleLeft />
              </button>
              <span className="text-[var(--text-color)] font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`p-3 rounded-lg transition-colors ${
                  page === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[var(--button-color)] text-white hover:bg-[var(--button-hover-color)]"
                }`}
              >
                <FaAngleRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipsUniversal;
