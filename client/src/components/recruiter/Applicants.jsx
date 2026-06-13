import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../common/Spinner";
import api from "../common/server_url";
import {
  FaTimes,
  FaFilter,
  FaAngleUp,
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
} from "react-icons/fa";
import Select from "react-select";
import ExperienceSlider from "./common/ExperienceSlider";
import MatchingSlider from "./common/MatchingSlider";
import PerformanceSlider from "./common/PerformanceSlider";
import { toast } from "react-toastify";
import countryData from "../TESTJSONS/countries+states+cities.json";

const Applicants = () => {
  const { recruiterId, internshipId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [skills, setSkills] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [locationFilter, setLocationFilter] = useState([]);
  const [expFilter, setExpFilter] = useState(0);
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [eduFilter, setEduFilter] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedGradYears, setSelectedGradYears] = useState([]);
  const [selectedPer, setSelectedPer] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("Applications Received");
  const [showOptions, setShowOptions] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [totalStudents, setTotalStudents] = useState(null);
  const scrollRef = useRef(null);
  const [isReset, setIsReset] = useState(false);
  const [isSkillsReady, setIsSkillsReady] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(null);
  const [shortlistedCount, setShortlistedCount] = useState(null);
  const [hiredCount, setHiredCount] = useState(null);

  const yearOptions = Array.from({ length: 31 }, (_, i) => {
    const year = 2000 + i;
    return { value: year.toString(), label: year.toString() };
  }).reverse();

  const cgpaToPercentage = (cgpa) => {
    const cgpaValue = parseFloat(cgpa);
    return (cgpaValue * 9.5).toFixed(2);
  };

  const toggleOptions = () => setShowOptions(!showOptions);

  const degreeOptions = [
    { value: "MBA", label: "MBA" }, { value: "B.Tech", label: "B.Tech" }, { value: "PhD", label: "PhD" },
    { value: "M.Tech", label: "M.Tech" }, { value: "B.Sc", label: "B.Sc" }, { value: "M.Sc", label: "M.Sc" },
    { value: "BBA", label: "BBA" }, { value: "B.Com", label: "B.Com" }, { value: "M.Com", label: "M.Com" },
    { value: "B.Arch", label: "B.Arch" }, { value: "LLB", label: "LLB" }, { value: "LLM", label: "LLM" },
    { value: "BCA", label: "BCA" }, { value: "MCA", label: "MCA" }, { value: "MBBS", label: "MBBS" },
    { value: "BDS", label: "BDS" }, { value: "B.Pharm", label: "B.Pharm" },
  ];
  const graduationDegrees = degreeOptions.map((option) => option.value);

  useEffect(() => {
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    setFilterOpen(isLargeScreen);
  }, []);

  const constructQueryStringApplicantFilters = (pageSent, status) => {
    let query = `page=${pageSent}`;
    if (searchName) query += `&searchName=${encodeURIComponent(searchName)}`;
    if (selectedCountry) query += `&country=${encodeURIComponent(selectedCountry)}`;
    if (selectedState) query += `&state=${encodeURIComponent(selectedState)}`;
    if (selectedCity) query += `&city=${encodeURIComponent(selectedCity)}`;
    if (expFilter) query += `&workExperience=${expFilter}`;
    if (skillsFilter.length > 0) query += `&skills=${skillsFilter.join(",")}`;
    if (eduFilter.length > 0) query += `&education=${eduFilter.join(",")}`;
    if (selectedMatch) query += `&match=${selectedMatch}`;
    if (selectedGenders.length > 0) query += `&genders=${selectedGenders.join(",")}`;
    if (selectedStatus) query += `&selectedStatus=${encodeURIComponent(status)}`;
    return query;
  };

  const fetchApplicantsAndInternship = async (pageSent, status) => {
    try {
      setLoading(true);
      const queryString = constructQueryStringApplicantFilters(pageSent, status);
      const applicantsResponse = await axios.get(
        `${api}/recruiter/internship/${recruiterId}/applicants/${internshipId}?${queryString}`
      );
      setApplicants(applicantsResponse.data.applicants);
      setTotalPages(applicantsResponse.data.totalPages);
      setTotalStudents(applicantsResponse.data.totalApplicants);
      setRejectedCount(applicantsResponse.data.rejectedCount);
      setHiredCount(applicantsResponse.data.hiredCount);
      setShortlistedCount(applicantsResponse.data.shortlistedCount);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching applicants or internship details:", err);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  const fetchInternships = async () => {
    const internshipResponse = await axios.get(
      `${api}/recruiter/internship/${recruiterId}/getDetails/${internshipId}`
    );
    setInternship(internshipResponse.data);
    return internshipResponse.data;
  };

  useEffect(() => {
    const internResponse = fetchInternships();
    const skillsArray = internResponse?.skills || [];
    setIsSkillsReady(true);
  }, [internshipId, recruiterId]);

  useEffect(() => {
    if (isSkillsReady) {
      fetchApplicantsAndInternship(page, selectedStatus);
    }
  }, [internshipId, recruiterId, page, isSkillsReady]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchApplicantsAndInternship(1, selectedStatus);
  };

  const handleStatusChange = (statusValue) => {
    setSelectedStatus(statusValue);
    setPage(1);
    fetchApplicantsAndInternship(1, statusValue);
  };

  const handleReset = () => {
    setSearchName("");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setExpFilter(0);
    setSkillsFilter([]);
    setEduFilter([]);
    setSelectedMatch(0);
    setSelectedGenders([]);
    setSelectedGradYears([]);
    setSelectedPer(0);
    setPage(1);
    setIsReset(true);
  };

  useEffect(() => {
    if (isReset) {
      fetchApplicantsAndInternship(1, selectedStatus);
      setIsReset(false);
    }
  }, [isReset]);

  const scrollToTop = () => {
    scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/api/get-skills`);
        const skillsData = response.data.map((skill) => ({
          label: skill.name,
          value: skill.name,
        }));
        setSkills(skillsData);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  const calculateMatchPercentage = (studentSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0;
    const sanitizeSkill = (skill) => skill.toLowerCase().replace(/[\.\-]/g, "").split(/\s+/);
    const matchingSkills = studentSkills.filter((studentSkill) => {
      return requiredSkills.some((requiredSkill) => {
        const studentSkillWords = sanitizeSkill(studentSkill.skillName);
        const requiredSkillWords = sanitizeSkill(requiredSkill);
        return requiredSkillWords.every((word) => studentSkillWords.includes(word));
      });
    });
    const matchPercentage = (matchingSkills.length / requiredSkills.length) * 100;
    return Math.round(matchPercentage);
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedGenders((prev) =>
      prev.includes(value) ? prev.filter((gender) => gender !== value) : [...prev, value]
    );
  };

  const handleViewProfile = async (studentId) => {
    try {
      await axios.put(`${api}/student/internship/${studentId}/${internshipId}/viewed`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleShortlistProfile = async (studentId) => {
    try {
      await axios.put(`${api}/student/internship/${studentId}/${internshipId}/${recruiterId}/shortlist`);
      toast.success("Applicant shortlisted");
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) => {
          if (applicant._id === studentId) {
            return {
              ...applicant,
              appliedInternships: {
                ...applicant.appliedInternships,
                internshipStatus: { ...applicant.appliedInternships.internshipStatus, status: "Shortlisted" },
              },
            };
          }
          return applicant;
        })
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Some error occured");
    }
  };

  const handleRejectProfile = async (studentId) => {
    try {
      await axios.put(`${api}/student/internship/${studentId}/${internshipId}/reject`);
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) => {
          if (applicant._id === studentId) {
            return {
              ...applicant,
              appliedInternships: {
                ...applicant.appliedInternships,
                internshipStatus: { ...applicant.appliedInternships.internshipStatus, status: "Rejected" },
              },
            };
          }
          return applicant;
        })
      );
      toast.success("Applicant Rejected");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Some error occured");
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
    scrollToTop();
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      scrollToTop();
    }
  };

  useEffect(() => {
    if (applicants?.length > 0) {
      scrollToTop();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [applicants]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--bg-light-color)]">
        <p className="text-xl font-semibold text-red-500 bg-red-50 px-6 py-3 rounded-lg border border-red-100">{error}</p>
      </div>
    );
  }

  const states = selectedCountry ? countryData.find((c) => c.name === selectedCountry)?.states : [];
  const cities = selectedState ? states.find((s) => s.name === selectedState)?.cities : [];

  const getApplicationStatus = (student) => {
    if (Array.isArray(student.appliedInternships)) {
      const application = student.appliedInternships.find((app) => app.internship === internshipId);
      return application?.internshipStatus?.status;
    }
    return student.appliedInternships?.internshipStatus?.status;
  };

  const getCurrentCount = () => {
    if (selectedStatus === "Shortlisted") return shortlistedCount;
    if (selectedStatus === "Applications Received") return totalStudents;
    if (selectedStatus === "Not Interested") return rejectedCount;
    if (selectedStatus === "Hired") return hiredCount;
    return applicants.length;
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "var(--border-color)",
      boxShadow: "none",
      "&:hover": { borderColor: "var(--primary-color)" },
      borderRadius: "0.5rem",
      minHeight: "42px",
      fontSize: "0.875rem",
      backgroundColor: "white"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "var(--primary-color)" : state.isFocused ? "var(--icon-bg-color)" : "white",
      color: state.isSelected ? "white" : "var(--text-color)",
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "var(--icon-bg-color)" }),
    multiValueLabel: (base) => ({ ...base, color: "var(--primary-color)" }),
    placeholder: (base) => ({ ...base, color: "var(--text-light)" })
  };

  return (
    <div className="py-10 px-5 mt-10 bg-white min-h-screen pb-24 lg:pb-10">
      {/* Top Section with Clickable Dashboard */}
      <div className="mb-5 max-w-7xl mx-auto">
        <h1 className="text-[var(--text-light)] text-sm md:text-base">
          <Link to={`/recruiter/dashboard/${recruiterId}`} className="hover:text-[var(--primary-color)] hover:underline font-medium">Dashboard</Link> -&gt; {selectedStatus}
        </h1>
        <h1 className="text-2xl md:text-3xl font-bold text-center my-5 text-[var(--text-color)]">
          {selectedStatus} for <span className="text-[var(--primary-color)]">{internship?.internshipName}</span>
        </h1>
        <h1 className="text-[var(--text-light)] text-lg font-semibold text-center">
          Showing <span className="text-[var(--text-color)] font-bold">{totalStudents}</span> results
        </h1>
      </div>

      {/* Bottom sticky bar for small devices */}
      <div className="fixed w-full h-fit bottom-0 left-0 lg:hidden bg-white border-t border-[var(--border-color)] z-20 shadow-lg">
        <div className="relative flex">
          <div className="w-[70%] border-r border-[var(--border-color)]">
            <button
              onClick={toggleOptions}
              className="px-4 py-3 bg-white text-[var(--primary-color)] w-full flex space-x-2 items-center justify-center font-bold"
            >
              <span>
                {selectedStatus} ({getCurrentCount()})
              </span>
              {showOptions ? <FaAngleDown className="w-4 h-4" /> : <FaAngleUp className="w-4 h-4" />}
            </button>

            <div
              className={`absolute z-10 mb-2 left-0 w-full bg-white border border-[var(--border-color)] rounded-t-lg shadow-xl transition-all duration-300 ease-in-out ${
                showOptions ? "bottom-[52px] opacity-100" : "-bottom-12 opacity-0 pointer-events-none"
              }`}
            >
              <ul className="text-left bg-white">
                {[
                  { label: "Applications Received", count: totalStudents, value: "Applications Received" },
                  { label: "Shortlisted", count: shortlistedCount, value: "Shortlisted" },
                  { label: "Not selected", count: rejectedCount, value: "Not Interested" },
                  { label: "Hired", count: hiredCount, value: "Hired" }
                ].map(item => (
                  <li
                    key={item.value}
                    onClick={() => { handleStatusChange(item.value); setShowOptions(false); }}
                    className={`py-3 px-4 hover:bg-[var(--icon-bg-color)] cursor-pointer border-b border-gray-100 ${
                      selectedStatus === item.value ? "text-[var(--primary-color)] font-semibold bg-[var(--icon-bg-color)]" : "text-[var(--text-color)]"
                    }`}
                  >
                    {item.label} ({item.count})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white w-[30%] py-2 text-[var(--primary-color)]">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex space-x-2 items-center justify-center font-semibold w-full"
            >
              <span>Filters</span>
              <FaFilter />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-5 relative max-w-7xl mx-auto">
        {/* Filter Sidebar */}
        <div
          className={`${filterOpen ? "block" : "hidden"} lg:block w-full lg:w-[300px] bg-white rounded-xl shadow-sm border border-[var(--border-color)] p-5 overflow-y-auto scrollbar-thin h-[80vh] sticky top-24`}
        >
          {/* Reset and Apply Filters at the VERY TOP */}
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-[var(--border-color)]">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              Reset filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-1.5 bg-[var(--button-color)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--button-hover-color)] transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </div>

          <h1 className="text-center font-extrabold text-xl tracking-widest text-[var(--text-color)] mb-4">
            Filters
          </h1>

          <div className="flex flex-col space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Search Name</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full p-2.5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Location</label>
              <div className="flex flex-col gap-2">
                <select className="w-full p-2.5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white" value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(""); setSelectedCity(""); }}>
                  <option value="">-- Select Country --</option>
                  {countryData.map((country) => (<option key={country.id} value={country.name}>{country.name}</option>))}
                </select>
                <select className="w-full p-2.5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white disabled:bg-gray-100" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} disabled={!selectedCountry}>
                  <option value="">-- Select State --</option>
                  {states?.map((state) => (<option key={state.id} value={state.name}>{state.name}</option>))}
                </select>
                <select className="w-full p-2.5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white disabled:bg-gray-100" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState}>
                  <option value="">-- Select City --</option>
                  {cities?.map((city) => (<option key={city.id} value={city.name}>{city.name}</option>))}
                </select>
              </div>
            </div>

            <ExperienceSlider expFilter={expFilter} setExpFilter={setExpFilter} />

            <div>
              <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Skills</label>
              <Select isMulti options={skills} value={skillsFilter.map((skill) => ({ value: skill, label: skill }))} onChange={(values) => setSkillsFilter(values.map((v) => v.value))} placeholder="Select the skills" styles={customSelectStyles} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-1.5">Academic background</label>
              <Select isMulti options={degreeOptions} value={eduFilter.map((education) => ({ value: education, label: education }))} onChange={(values) => setEduFilter(values.map((v) => v.value))} placeholder="e.g MBA" styles={customSelectStyles} />
            </div>

            <MatchingSlider selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} />

            <div>
              <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wide mb-2">Gender</label>
              <div className="flex space-x-5">
                {["Male", "Female", "Other"].map((gender) => (
                  <label key={gender} className="flex items-center text-sm text-[var(--text-color)] cursor-pointer">
                    <input type="checkbox" value={gender} checked={selectedGenders.includes(gender)} onChange={handleCheckboxChange} className="mr-1 w-4 h-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded" />
                    {gender}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row">
          {/* Applicants List */}
          <div className="flex flex-col w-full">
            <div className="bg-white shadow-sm rounded-xl border border-[var(--border-color)] p-5 w-full">
              {applicants.length === 0 ? (
                <p className="text-center text-[var(--text-light)] py-10 font-medium">No applicants for this internship yet.</p>
              ) : (
                <div ref={scrollRef} className="space-y-4 overflow-y-auto h-[80vh] scrollbar-thin pr-2">
                  {applicants.map((student) => (
                    <div key={student._id} className="p-5 border border-[var(--border-color)] rounded-xl shadow-sm bg-[var(--bg-light-color)] relative">
                      
                      {/* Name & Location */}
                      <h2 className="text-lg md:text-2xl font-semibold mb-1 capitalize text-[var(--text-color)]">
                        {student.firstname} {student.lastname}
                      </h2>
                      <div className="flex justify-between">
                        <h2 className="mb-2 text-sm text-[var(--text-light)]">
                          {student.homeLocation.country},{student.homeLocation.state},{student.homeLocation.city}
                        </h2>
                      </div>

                      {/* Availability */}
                      <p key={student.appliedInternships.internship} className="mb-3">
                        {student.appliedInternships.availability === "Yes! Will join Immediately" ? (
                          <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded-lg border border-green-100">Immediate Joiner</span>
                        ) : (
                          <span className="text-red-500 font-semibold text-sm bg-red-50 px-2 py-1 rounded-lg border border-red-100">Not an Immediate Joiner</span>
                        )}
                      </p>

                      {/* View Profile Button (Top Right) */}
                      {!isOpen && (getApplicationStatus(student) === "Applied" || getApplicationStatus(student) === "Viewed") && (
                        <button
                          onClick={() => { setIsOpen(student._id); handleViewProfile(student._id); }}
                          className="absolute right-4 top-4 underline text-[var(--primary-color)] font-semibold text-sm hover:text-[var(--button-hover-color)]"
                        >
                          View Profile
                        </button>
                      )}

                      {/* Shortlist/Reject Buttons (Bottom Right) */}
                      {!isOpen && (getApplicationStatus(student) === "Applied" || getApplicationStatus(student) === "Viewed") && (
                        <div className="absolute bottom-5 right-5 flex gap-3">
                          <button onClick={() => handleShortlistProfile(student._id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-semibold rounded-lg text-xs transition-all">
                            <FaCheck className="w-3 h-3" /> Shortlist
                          </button>
                          <button onClick={() => handleRejectProfile(student._id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-semibold rounded-lg text-xs transition-all">
                            <FaTimes className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      )}

                      {/* Status Badges (Top Right) */}
                      {getApplicationStatus(student) === "Shortlisted" && <h2 className="text-sm md:text-base font-semibold absolute right-4 top-4 text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">Shortlisted</h2>}
                      {getApplicationStatus(student) === "Rejected" && <h2 className="text-sm md:text-base absolute right-4 top-4 font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-100">Rejected</h2>}
                      {getApplicationStatus(student) === "Hired" && <h2 className="text-sm md:text-base absolute right-4 top-4 font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Hired</h2>}

                      {/* View Messages Link */}
                      {(getApplicationStatus(student) === "Shortlisted" || getApplicationStatus(student) === "Hired") && (
                        <Link to={`/recruiter/${recruiterId}/chatroom`} className="text-sm md:text-base text-[var(--primary-color)] font-semibold absolute right-4 bottom-5 hover:underline">
                          View messages
                        </Link>
                      )}

                      {/* Hide Profile Button */}
                      {isOpen === student._id && (
                        <div className="flex absolute right-4 top-4 space-x-4">
                          <button onClick={() => { setIsOpen(false); setSelectedStudent(null); }} className="underline text-[var(--primary-color)] font-semibold text-sm hover:text-[var(--button-hover-color)]">
                            Hide Profile
                          </button>
                        </div>
                      )}

                      {/* Match Percentage */}
                      <div className="mb-3 mt-4">
                        <p className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                          calculateMatchPercentage(student.skills, internship?.skills) < 20 ? "bg-red-100 text-red-700" :
                          calculateMatchPercentage(student.skills, internship?.skills) >= 20 && calculateMatchPercentage(student.skills, internship?.skills) <= 60 ? "bg-orange-100 text-orange-700" :
                          calculateMatchPercentage(student.skills, internship?.skills) > 60 && calculateMatchPercentage(student.skills, internship?.skills) <= 90 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                        }`}>
                          {calculateMatchPercentage(student.skills, internship?.skills)}% Matched
                        </p>
                      </div>

                      {/* Skills List */}
                      <div className="mb-3 hidden lg:block">
                        <h3 className="font-semibold text-[var(--text-color)] mb-2">Skills:</h3>
                        <div className="flex flex-wrap gap-2">
                          {student.skills.slice(0, 5).map((skill, index) => (
                            <p key={index} className="text-sm rounded-lg bg-white border border-[var(--border-color)] capitalize px-2 py-1 text-[var(--text-light)]">
                              {skill.skillName}
                            </p>
                          ))}
                          {student.skills.length > 5 && (
                            <p className="text-sm text-[var(--text-light)] font-medium self-center">+{student.skills.length - 5} more</p>
                          )}
                        </div>
                      </div>

                      {/* VIEW APPLICATION LINK (RESTORED) */}
                      <div className="mb-2 lg:mt-3 pt-3 border-t border-[var(--border-color)]">
                        <Link
                          to={`/recruiter/${student.appliedInternships.internship}/application-details/${student._id}`}
                          className="text-sm md:text-base text-[var(--primary-color)] font-semibold hover:underline"
                        >
                          View Application
                        </Link>
                      </div>

                      {/* Expanded Profile View */}
                      {isOpen === student._id && (
                        <div className="relative mt-5 pt-5 border-t border-[var(--border-color)] space-y-5">
                          {internship.assessment && (
                            <div className="bg-white p-4 rounded-xl border border-[var(--border-color)]">
                              <h3 className="font-bold text-[var(--text-color)] mb-2">Assessment Question</h3>
                              <p className="text-sm text-[var(--text-light)] mb-2">Ques: {internship.assessment}</p>
                              <p className="text-sm text-[var(--text-color)] bg-[var(--bg-light-color)] p-3 rounded-lg">Ans: {student.appliedInternships.assessmentAns}</p>
                            </div>
                          )}

                          <div className="bg-white p-4 rounded-xl border border-[var(--border-color)]">
                            <p className="font-bold text-[var(--text-color)] mb-2">About the student</p>
                            <p key={student.appliedInternships.internship} className="text-sm text-[var(--text-light)] leading-relaxed">
                              {student.appliedInternships.aboutText}
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-[var(--border-color)]">
                            <h3 className="font-bold text-[var(--text-color)] mb-3">Education:</h3>
                            {student.education.map((edu, index) => (
                              <p key={index} className="text-sm text-[var(--text-light)] mb-1">
                                <span className="font-semibold text-[var(--text-color)]">{edu.degree} in {edu.fieldOfStudy}</span> from {edu.institution} ({edu.startYear} - {edu.endYear}) ({edu.score} {edu.gradeType})
                              </p>
                            ))}
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-[var(--border-color)]">
                            <h3 className="font-bold text-[var(--text-color)] mb-3">Work Experience:</h3>
                            {student.workExperience.map((work, index) => (
                              <p key={index} className="text-sm text-[var(--text-light)] mb-1">
                                <span className="font-semibold text-[var(--text-color)]">{work.role}</span> at {work.company} ({work.startDate} - {work.endDate})
                              </p>
                            ))}
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-[var(--border-color)]">
                            <h3 className="font-bold text-[var(--text-color)] mb-3">Certificates:</h3>
                            {student.certificates.map((cert, index) => (
                              <p key={index} className="text-sm text-[var(--text-light)] mb-1">
                                <span className="font-semibold text-[var(--text-color)]">{cert.title}</span> - {cert.issuingOrganization} ({cert.issueDate})
                              </p>
                            ))}
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-[var(--border-color)]">
                            <h3 className="font-bold text-[var(--text-color)] mb-3">Personal Projects:</h3>
                            {student.personalProjects.map((project, index) => (
                              <p key={index} className="text-sm text-[var(--text-light)] mb-1">
                                <span className="font-semibold text-[var(--text-color)]">{project.title}</span> - {project.description}
                              </p>
                            ))}
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-[var(--border-color)]">
                            <h3 className="font-bold text-[var(--text-color)] mb-3">Portfolio Links:</h3>
                            {student.portfolioLink.map((link, index) => (
                              <p key={index} className="text-sm mb-1">
                                <span className="font-semibold text-[var(--text-color)]">{link.linkType}:</span>{" "}
                                <a href={link.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--primary-color)] hover:underline break-all">
                                  {link.linkUrl}
                                </a>
                              </p>
                            ))}
                            <p className="text-sm text-[var(--text-color)] mt-3 pt-3 border-t border-[var(--border-color)]">
                              <strong>Email:</strong> <span className="text-[var(--text-light)]">{student.email}</span>
                            </p>
                          </div>

                          {/* Shortlist/Reject inside expanded view */}
                          {(getApplicationStatus(student) === "Applied" || getApplicationStatus(student) === "Viewed") && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                              <button onClick={() => handleShortlistProfile(student._id)} className="px-4 py-2 rounded-lg font-semibold text-green-600 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors text-sm">
                                Shortlist
                              </button>
                              <button onClick={() => handleRejectProfile(student._id)} className="px-4 py-2 rounded-lg font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors text-sm">
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {applicants.length > 0 && (
              <div className="flex justify-center items-center gap-4 my-6">
                <button onClick={handlePreviousPage} disabled={page === 1} className={`p-3 rounded-lg transition-colors ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[var(--button-color)] text-white hover:bg-[var(--button-hover-color)]"}`}>
                  <FaAngleLeft />
                </button>
                <span className="text-[var(--text-color)] font-medium">Page {page} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={page === totalPages} className={`p-3 rounded-lg transition-colors ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[var(--button-color)] text-white hover:bg-[var(--button-hover-color)]"}`}>
                  <FaAngleRight />
                </button>
              </div>
            )}
          </div>

          {/* Right Status Board */}
          <div className="mb-5 hidden lg:flex lg:flex-col bg-white shadow-sm rounded-xl border border-[var(--border-color)] p-5 space-y-3 w-full lg:w-[250px] lg:ml-5 sticky top-24 h-fit">
            <h3 className="text-lg font-bold text-[var(--text-color)] mb-2">Application Status</h3>
            {[
              { label: "Applications Received", count: totalStudents, value: "Applications Received" },
              { label: "Shortlisted", count: shortlistedCount, value: "Shortlisted" },
              { label: "Not Interested", count: rejectedCount, value: "Not Interested" },
              { label: "Hired", count: hiredCount, value: "Hired" }
            ].map(item => (
              <div
                key={item.value}
                onClick={() => handleStatusChange(item.value)}
                className={`flex cursor-pointer justify-between p-3 rounded-lg transition-colors text-sm font-medium ${
                  selectedStatus === item.value
                    ? "bg-[var(--icon-bg-color)] text-[var(--primary-color)] border border-[var(--primary-color)]"
                    : "bg-[var(--bg-light-color)] text-[var(--text-color)] hover:bg-gray-100 border border-transparent"
                }`}
              >
                <p>{item.label}</p> <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;