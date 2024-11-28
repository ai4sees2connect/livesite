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
  FaAudible,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import Select from "react-select";
import ExperienceSlider from "./common/ExperienceSlider";
import MatchingSlider from "./common/MatchingSlider";
import PerformanceSlider from "./common/PerformanceSlider";
import { toast } from "react-toastify";
// country
import countryData from "../TESTJSONS/countries+states+cities.json";

const Applicants = () => {
  const { recruiterId, internshipId } = useParams(); // Get recruiterId and internshipId from URL
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
  // state for country and state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStudent,setSelectedStudent]=useState(null);
  const [page, setPage] = useState(1);
  const [totalPages,setTotalPages]=useState(null);
  const [totalStudents,setTotalStudents]=useState(null);
  const scrollRef=useRef(null);

  // console.log('this is selected student', selectedStudent);
  const yearOptions = [
    { value: "2024", label: "2024" },
    { value: "2024 & before", label: "2024 & before" },
    { value: "2023", label: "2023" },
    { value: "2023 & before", label: "2023 & before" },
    { value: "2022", label: "2022" },
    { value: "2022 & before", label: "2022 & before" },
    { value: "2021", label: "2021" },
    { value: "2021 & before", label: "2021 & before" },
    { value: "2020", label: "2020" },
    { value: "2020 & before", label: "2020 & before" },
    { value: "2019", label: "2019" },
    { value: "2019 & before", label: "2019 & before" },
    { value: "2018", label: "2018" },
    { value: "2018 & before", label: "2018 & before" },
    { value: "2017", label: "2017" },
    { value: "2017 & before", label: "2017 & before" },
    { value: "2016", label: "2016" },
    { value: "2016 & before", label: "2016 & before" },
    { value: "2015", label: "2015" },
    { value: "2015 & before", label: "2015 & before" },
    { value: "2014", label: "2014" },
    { value: "2014 & before", label: "2014 & before" },
    { value: "2013", label: "2013" },
    { value: "2013 & before", label: "2013 & before" },
    { value: "2012", label: "2012" },
    { value: "2012 & before", label: "2012 & before" },
    { value: "2011", label: "2011" },
    { value: "2011 & before", label: "2011 & before" },
    { value: "2010", label: "2010" },
    { value: "2010 & before", label: "2010 & before" },
    { value: "2009", label: "2009" },
    { value: "2009 & before", label: "2009 & before" },
    { value: "2008", label: "2008" },
    { value: "2008 & before", label: "2008 & before" },
    { value: "2007", label: "2007" },
    { value: "2007 & before", label: "2007 & before" },
    { value: "2006", label: "2006" },
    { value: "2006 & before", label: "2006 & before" },
    { value: "2005", label: "2005" },
    { value: "2005 & before", label: "2005 & before" },
    { value: "2004", label: "2004" },
    { value: "2004 & before", label: "2004 & before" },
    { value: "2003", label: "2003" },
    { value: "2003 & before", label: "2003 & before" },
    { value: "2002", label: "2002" },
    { value: "2002 & before", label: "2002 & before" },
    { value: "2001", label: "2001" },
    { value: "2001 & before", label: "2001 & before" },
    { value: "2000", label: "2000" },
    { value: "2000 & before", label: "2000 & before" },
  ];


  const cgpaToPercentage = (cgpa) => {
    const cgpaValue = parseFloat(cgpa);
    return (cgpaValue * 9.5).toFixed(2); // Convert CGPA to percentage
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const degreeOptions = [
    { value: "MBA", label: "MBA" },
    { value: "B.Tech", label: "B.Tech" },
    { value: "PhD", label: "PhD" },
    { value: "M.Tech", label: "M.Tech" },
    { value: "B.Sc", label: "B.Sc" },
    { value: "M.Sc", label: "M.Sc" },
    { value: "BBA", label: "BBA" },
    { value: "B.Com", label: "B.Com" },
    { value: "M.Com", label: "M.Com" },
    { value: "B.Arch", label: "B.Arch" },
    { value: "LLB", label: "LLB" },
    { value: "LLM", label: "LLM" },
    { value: "BCA", label: "BCA" },
    { value: "MCA", label: "MCA" },
    { value: "MBBS", label: "MBBS" },
    { value: "BDS", label: "BDS" },
    { value: "B.Pharm", label: "B.Pharm" },
  ];
  const graduationDegrees = degreeOptions.map((option) => option.value);

  useEffect(() => {
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    setFilterOpen(isLargeScreen);
  }, []);

  const constructQueryString = () => {
    let query = `page=${page}`;
   
    return query;
  };

  useEffect(() => {
    const fetchApplicantsAndInternship = async () => {
      try {
        // Fetch the internship details
        setLoading(true);
        const internshipResponse = await axios.get(
          `${api}/recruiter/internship/${recruiterId}/getDetails/${internshipId}`
        );
        setInternship(internshipResponse.data);

        // Fetch the applicants
        const queryString=constructQueryString();
        const applicantsResponse = await axios.get(
          `${api}/recruiter/internship/${recruiterId}/applicants/${internshipId}?${queryString}`
        );
        setApplicants(applicantsResponse.data.applicants);
        setTotalPages(applicantsResponse.data.totalPages);
        setTotalStudents(applicantsResponse.data.totalApplicants);
        console.log('this is student list',applicantsResponse.data.applicants);

        setLoading(false);
        // console.log("this is list of applicants", applicantsResponse.data);
      } catch (err) {
        console.error("Error fetching applicants or internship details:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchApplicantsAndInternship();
  }, [recruiterId, internshipId,page]);


  const scrollToTop = () => {
    scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };



  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/api/get-skills`);
        const skillsData = response.data.map((skill) => ({
          label: skill.name, // Map 'name' field to 'label'
          value: skill.name, // Map 'name' field to 'value'
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

    const sanitizeSkill = (skill) => {
      return skill
        .toLowerCase()
        .replace(/[\.\-]/g, "") // Remove dots and hyphens
        .split(/\s+/); // Split into words
    };

    const matchingSkills = studentSkills.filter((studentSkill) => {
      return requiredSkills.some((requiredSkill) => {
        const studentSkillWords = sanitizeSkill(studentSkill.skillName);
        const requiredSkillWords = sanitizeSkill(requiredSkill);

        // Check if all words in requiredSkill match any word in studentSkill
        return requiredSkillWords.every((word) =>
          studentSkillWords.includes(word)
        );
      });
    });

    const matchPercentage =
      (matchingSkills.length / requiredSkills.length) * 100;
    return Math.round(matchPercentage);
  };

  // const filteredApplicants = applicants.filter((student) => {
  //   const matchesName = `${student.firstname} ${student.lastname}`
  //     .toLowerCase()
  //     .includes(searchName.toLowerCase());

  //   // Check if any selected location matches student's homeLocation
  //   const matchesLocation =
  //     locationFilter.length === 0 || // If no location is selected, show all applicants
  //     locationFilter.some(
  //       (location) =>
  //         location.value.toLowerCase() === student.homeLocation.toLowerCase()
  //     );

  //   let studentExperience;
  //   if (
  //     student.yearsOfExp === "no experience" ||
  //     student.yearsOfExp === "fresher"
  //   ) {
  //     studentExperience = 0;
  //   } else if (student.yearsOfExp === "10+") {
  //     studentExperience = 10;
  //   } else {
  //     studentExperience = parseInt(student.yearsOfExp);
  //   }

  //   const matchesExperience = studentExperience >= expFilter;

  //   // Return true if all filters match
  //   const matchesSkills =
  //     skillsFilter.length === 0 ||
  //     skillsFilter.some((selectedSkill) =>
  //       student.skills.some(
  //         (skill) =>
  //           skill.skillName.toLowerCase() === selectedSkill.value.toLowerCase()
  //       )
  //     );

  //   const matchesEducation =
  //     eduFilter.length === 0 || // If no education filter is selected, show all applicants
  //     eduFilter.some((selectedDegree) =>
  //       student.education.some(
  //         (edu) =>
  //           edu.degree.toLowerCase() === selectedDegree.value.toLowerCase()
  //       )
  //     );

  //   const matchPercentage = calculateMatchPercentage(
  //     student.skills,
  //     internship.skills
  //   );

  //   // Matching logic based on selectedMatch value
  //   let matchesMatching;
  //   if (selectedMatch === 0) {
  //     matchesMatching = true; // Return all applicants regardless of match percentage
  //   } else if (selectedMatch === 1) {
  //     matchesMatching = matchPercentage >= 50; // Return applicants with 50% match or above
  //   } else if (selectedMatch === 2) {
  //     matchesMatching = matchPercentage >= 80; // Return applicants with 80% match or above
  //   }

  //   const matchesGender =
  //     selectedGenders.length === 0 || selectedGenders.includes(student.gender);

  //   const matchesGraduationYear =
  //     selectedGradYears.length === 0 ||
  //     selectedGradYears.some((selectedYear) => {
  //       // Find the graduation degree
  //       const graduationEducation = student.education.find((edu) =>
  //         graduationDegrees.includes(edu.degree)
  //       );
  //       if (!graduationEducation) return false;

  //       // Check if the graduation year matches the filter
  //       const studentGraduationYear = graduationEducation.endYear;
  //       // console.log(typeof(studentGraduationYear))
  //       return (
  //         studentGraduationYear === selectedYear.value ||
  //         (selectedYear.value.includes("before") &&
  //           parseInt(studentGraduationYear) <=
  //             parseInt(selectedYear.value.split(" ")[0]))
  //       );
  //     });

  //   const scoreFilterThreshold = {
  //     0: 0,
  //     1: 60,
  //     2: 70,
  //     3: 80,
  //     4: 90,
  //   };

  //   const performanceThreshold = scoreFilterThreshold[selectedPer];

  //   const convertScoreToPercentage = (score) => {
  //     if (score.endsWith("%")) {
  //       return parseFloat(score);
  //     } else if (score.includes("CGPA")) {
  //       return cgpaToPercentage(score.split(" ")[0]);
  //     }
  //     return 0; // Default case, assuming other formats are not expected
  //   };

  //   const matchesPerformance =
  //     selectedPer === 0 ||
  //     student.education.some((edu) => {
  //       const degree = edu.degree;
  //       const isGraduationDegree = graduationDegrees.includes(degree);
  //       if (!isGraduationDegree) return false;
  //       const score = edu.score;
  //       const percentage = convertScoreToPercentage(score);
  //       // console.log(percentage);
  //       return percentage >= performanceThreshold;
  //     });

  //   // Return true if all filters match
  //   return (
  //     matchesName &&
  //     matchesLocation &&
  //     matchesExperience &&
  //     matchesSkills &&
  //     matchesEducation &&
  //     matchesMatching &&
  //     matchesGender &&
  //     matchesGraduationYear &&
  //     matchesPerformance
  //   );
  // });

  // const shortlistedApplicants = filteredApplicants.filter((applicant) =>
  //   applicant.appliedInternships.some(
  //     (internship) => internship.internshipStatus.status === "Shortlisted"
  //   )
  // );
  // const rejectedApplicants = filteredApplicants.filter((applicant) =>
  //   applicant.appliedInternships.some(
  //     (internship) => internship.internshipStatus.status === "Rejected"
  //   )
  // );
  const filteredApplicants=applicants
  const shortlistedApplicants=applicants
  const rejectedApplicants=applicants

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedGenders((prev) =>
      prev.includes(value)
        ? prev.filter((gender) => gender !== value)
        : [...prev, value]
    );
  };

  const handleViewProfile = async (studentId) => {
    try {
      await axios.put(
        `${api}/student/internship/${studentId}/${internshipId}/viewed`
      );
      // Optionally handle success (e.g., show a message or update state)
      // console.log("worked");
    } catch (error) {
      console.error("Error updating status:", error);
      // Optionally handle error (e.g., show an error message)
    }
  };

  const handleShortlistProfile = async (studentId) => {
    try {
      await axios.put(
        `${api}/student/internship/${studentId}/${internshipId}/${recruiterId}/shortlist`
      );
      // Optionally handle success (e.g., show a message or update state)
      // console.log("worked shortlisting");
      toast.success("Applicant shortlisted");
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Some error occured");
    }
  };

  const handleRejectProfile = async (studentId) => {
    try {
      await axios.put(
        `${api}/student/internship/${studentId}/${internshipId}/reject`
      );
      // Optionally handle success (e.g., show a message or update state)
      // console.log("worked reject");
      toast.success("Applicant Rejected");
      window.location.reload();
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

  console.log('this is searched name',searchName);
  console.log('this is country',selectedCountry)
  console.log('this is state',selectedState)
  console.log('this is city',selectedCity)
  console.log('this is work exp',expFilter);
  console.log('this is skills filter',skillsFilter);
  console.log('this is education filter',eduFilter);
  console.log('this is selected match',selectedMatch);
  console.log('this is list of genders',selectedGenders);
  console.log('this is list of graduation years',selectedGradYears);
  console.log('this is percentage',selectedPer);
 

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
    <div className="py-10 px-5 mt-10 bg-gray-100 min-h-screen ">
      {/* Top Section */}
      <div className="mb-5">
        <h1 className="text-gray-600">Dashboard -&gt; {selectedStatus}</h1>
        <h1 className="text-3xl font-bold text-center my-5  ">
          {selectedStatus} for {internship.internshipName}
        </h1>
        <h1 className="text-gray-600 text-lg font-semibold text-center">
          Showing {totalStudents} results
        </h1>
      </div>

      {/* bottom sticky bar for small devices */}
      <div className="fixed w-full h-fit bottom-0 left-0 lg:hidden  bg-gray-200 z-20">
        <div className="relative flex border-t ">
          <div className="w-[70%] border-2 shadow-lg">
            <button
              onClick={toggleOptions}
              className="px-4 py-2 bg-white text-blue-500 rounded w-full flex space-x-2 items-center justify-center font-bold"
            >
              <span>
                {selectedStatus} ({filteredApplicants.length})
              </span>
              {showOptions ? (
                <FaAngleDown className="w-5 h-5" />
              ) : (
                <FaAngleUp className="w-5 h-5" />
              )}
            </button>

            <div
              className={`absolute z-10 mb-2 left-0 h-full w-full  bg-white border rounded shadow-lg transition-all duration-300 ease-in-out ${
                showOptions
                  ? "bottom-[138px] opacity-100"
                  : "-bottom-12 opacity-0"
              } `}
            >
              <ul className="text-left bg-white">
                <li
                  onClick={() => {
                    setSelectedStatus("Applications Received");
                    setShowOptions(false);
                  }}
                  className={`py-3 px-2 hover:text-blue-300 cursor-pointer  ${
                    selectedStatus === "Applications Received"
                      ? "text-blue-500 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  Applications Received ({filteredApplicants.length})
                </li>
                <li
                  onClick={() => {
                    setSelectedStatus("Shortlisted");
                    setShowOptions(false);
                  }}
                  className={`py-3 px-2 hover:text-blue-300 cursor-pointer  ${
                    selectedStatus === "Shortlisted"
                      ? "text-blue-500 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  Shortlisted ({shortlistedApplicants.length})
                </li>
                <li
                  onClick={() => {
                    setSelectedStatus("Not Interested");
                    setShowOptions(false);
                  }}
                  className={`py-3 px-2 hover:text-blue-300 cursor-pointer ${
                    selectedStatus === "Not Interested"
                      ? "text-blue-500 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  Not selected ({rejectedApplicants.length})
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white w-[30%] border-2 py-2 text-blue-500 rounded shadow-lg">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex space-x-1 items-center justify-center font-semibold w-full"
            >
              <span>Filters</span>
              <FaFilter />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/*filter  */}
        <div
          className={`${
            filterOpen ? "block opacity-100" : "hidden opacity-0"
          } lg:block w-full mt-0 px-6 transition-all duration-300 ease-in-out rounded-md border right-2 shadow-xl border-t py-6 overflow-y-scroll scrollbar-thin h-[65vh] bg-white lg:max-w-[300px]`}
        >
        <button className="mb-4 text-blue-400 underline">
            Reset filters
          </button>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
          />
          <h1 className="text-center font-extrabold text-xl tracking-widest">
            Filters
          </h1>

          
          <div className="flex flex-col space-y-4">
            <label>Location:</label>
           
            <div className="flex flex-col gap-3 w-full">
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
            <div>
              <ExperienceSlider
                expFilter={expFilter}
                setExpFilter={setExpFilter}
              />
            </div>
            <label>
              Skills
              <Select
                isMulti
                options={skills}
                values={skillsFilter}
                onChange={(values) => setSkillsFilter(values.map((v) => v.value))}
                placeholder="Select the skills"
                searchable={true}
                className="w-full shadow-md mb-3"
              />
            </label>

            <label>
              Academic background
              <Select
                isMulti
                options={degreeOptions}
                values={eduFilter}
                onChange={(values) => setEduFilter(values.map(v=>v.value))}
                placeholder="e.g MBA"
                searchable={true}
                className="w-full shadow-md "
              />
            </label>

            <div>
              <MatchingSlider
                selectedMatch={selectedMatch}
                setSelectedMatch={setSelectedMatch}
              />
            </div>

            <label>
              Graduation year
              <Select
                isMulti
                options={yearOptions}
                values={selectedGradYears}
                onChange={(values) => setSelectedGradYears(values.map(v=>v.value))}
                placeholder="e.g 2024, 2022"
                searchable={true}
                className="w-full shadow-md mt-2 mb-4"
              />
            </label>

            <div className="flex space-x-5 mx-auto">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Male"
                  checked={selectedGenders.includes("Male")}
                  onChange={handleCheckboxChange}
                  className="mr-1 w-5 h-5"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Female"
                  checked={selectedGenders.includes("Female")}
                  onChange={handleCheckboxChange}
                  className="mr-1 w-5 h-5"
                />
                Female
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="Other"
                  checked={selectedGenders.includes("Other")}
                  onChange={handleCheckboxChange}
                  className="mr-1 w-5 h-5"
                />
                Other
              </label>
            </div>

            <div>
              <PerformanceSlider
                selectedPer={selectedPer}
                setSelectedPer={setSelectedPer}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row">
          {/* applicants */}
          <div className="flex flex-col w-full">
          <div className="overflow-y-auto   ">

            {selectedStatus === "Applications Received" && (
              <div className="bg-white shadow-md rounded-lg p-6 w-full">
                {applicants.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No applicants for this internship yet.
                  </p>
                ) : (
                  <div ref={scrollRef} className="space-y-4 overflow-y-auto h-screen scrollbar-thin">
                    {applicants.map((student) => (
                      <div
                        key={student._id}
                        className="p-4 border rounded-lg shadow-sm bg-gray-50  relative  "
                      >
                        <h2 className="text-lg md:text-2xl font-semibold mb-1 capitalize">
                          {student.firstname} {student.lastname}
                        </h2>
                        <div className="flex justify-between">
                          <h2 className="mb-2">{student.homeLocation.country+ ","+ student.homeLocation.state + ","+ student.homeLocation.city}</h2>
                        </div>

                        <p key={student.appliedInternships.internship}>
                          {student.appliedInternships.availability ===
                          "Yes! Will join Immediately" ? (
                            <span className="text-green-600">
                              Immediate Joiner
                            </span>
                          ) : (
                            <span className="text-red-500">
                              Not an Immediate Joiner
                            </span>
                          )}
                        </p>

                        {!isOpen &&
                          (student.appliedInternships.internshipStatus
                            .status === "Applied" ||
                            student.appliedInternships.internshipStatus
                              .status === "Viewed") && (
                            <button
                              onClick={() => {
                                setIsOpen(student._id);
                                handleViewProfile(student._id);
                                // setSelectedStudent(student);
                              }}
                              className="absolute right-3 top-2 underline text-blue-400"
                            >
                              View Profile
                            </button>
                          )}

                        {student.appliedInternships.internshipStatus
                          .status === "Shortlisted" && (
                          <h2 className="text-sm md:text-base font-semibold absolute right-3 top-2  text-green-500">
                            Shortlisted
                          </h2>
                        )}
                        {student.appliedInternships.internshipStatus
                          .status === "Rejected" && (
                          <h2 className="text-sm md:text-base absolute right-3 top-2  text-red-500">
                            Rejected
                          </h2>
                        )}

                        {student.appliedInternships.internshipStatus
                          .status === "Shortlisted" && (
                          <Link
                            to={`/recruiter/${recruiterId}/chatroom`}
                            className="text-sm md:text-base text-blue-400 font-semibold underline absolute right-3 top-10"
                          >
                            View messages
                          </Link>
                        )}

                        {isOpen===student._id && (
                          <div className="flex absolute right-3 top-2 space-x-4">
                            <button
                              onClick={() => {setIsOpen(false); setSelectedStudent(null)}}
                              className=" right-3 top-2 underline text-blue-400"
                            >
                              Hide Profile
                            </button>
                          </div>
                        )}

                        {/* Skills */}

                        {/* Match Percentage */}
                        <div className="mb-2">
                          <p
                            className={`font-semibold ${
                              calculateMatchPercentage(
                                student.skills,
                                internship?.skills
                              ) < 20
                                ? "text-red-500"
                                : calculateMatchPercentage(
                                  student.skills,
                                    internship?.skills
                                  ) >= 20 &&
                                  calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) <= 60
                                ? "text-orange-300"
                                : calculateMatchPercentage(
                                  student.skills,
                                    internship?.skills
                                  ) > 60 &&
                                  calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) <= 90
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {calculateMatchPercentage(
                              student.skills,
                              internship?.skills
                            )}
                            % Matched
                          </p>
                        </div>

                        <div className="mb-2">
                          <h3 className="font-semibold">Skills:</h3>
                          <div className="flex flex-wrap gap-3">
                            {student.skills.slice(0, 5).map((skill, index) => (
                              <p
                                key={index}
                                className="text-sm md:text-base rounded-lg bg-gray-100 border capitalize px-1 md:px-2 py-1"
                              >
                                {skill.skillName}
                              </p>
                            ))}
                            {student.skills.length > 5 && (
                              <p className="text-sm md:text-base text-gray-500">
                                +{student.skills.length - 5} more
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mb-2 mt-2">
                          <Link
                            to={`/recruiter/${student.appliedInternships.internship}/application-details/${student._id}`}
                            className="text-sm md:text-base text-blue-400 font-semibold underline "
                          >
                            View Application
                          </Link>
                        </div>

                        {isOpen===student._id && (
                          <div className="relative">
                            {internship.assessment && (
                              <div className="mb-2">
                                <h3 className="font-semibold">
                                  Assessment Question
                                </h3>
                                <p>Ques: {internship.assessment}</p>
                                {student.appliedInternships.map(
                                  (appliedInternship) =>
                                    appliedInternship.internship ===
                                    internship._id ? (
                                      <p
                                        key={appliedInternship.internship}
                                        className="text-gray-600"
                                      >
                                        Ans: {appliedInternship.assessmentAns}
                                      </p>
                                    ) : null
                                )}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold">About the student</p>
                              
                                    <p
                                      key={student.appliedInternships.internship}
                                      className="text-gray-600"
                                    >
                                      {" "}
                                      {student.appliedInternships.aboutText}
                                    </p>
                                  
                              
                            </div>

                            {/* Education */}
                            <div className="mb-2">
                              <h3 className="font-semibold">Education:</h3>
                              {student.education.map((edu, index) => (
                                <p key={index} className="text-gray-600">
                                  {edu.degree} in {edu.fieldOfStudy} from{" "}
                                  {edu.institution} ({edu.startYear} -{" "}
                                  {edu.endYear}) ({edu.score})
                                </p>
                              ))}
                            </div>

                            {/* Work Experience */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Work Experience:
                              </h3>
                              {student.workExperience.map((work, index) => (
                                <p key={index} className="text-gray-600">
                                  {work.role} at {work.company} (
                                  {work.startDate} - {work.endDate})
                                </p>
                              ))}
                            </div>

                            {/* Certificates */}
                            <div className="mb-2">
                              <h3 className="font-semibold">Certificates:</h3>
                              {student.certificates.map((cert, index) => (
                                <p key={index} className="text-gray-600">
                                  {cert.title} - {cert.issuingOrganization} (
                                  {cert.issueDate})
                                </p>
                              ))}
                            </div>

                            {/* Personal Projects */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Personal Projects:
                              </h3>
                              {student.personalProjects.map(
                                (project, index) => (
                                  <p key={index} className="text-gray-600">
                                    {project.title} - {project.description}
                                  </p>
                                )
                              )}
                            </div>

                            {/* Portfolio Links */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Portfolio Links:
                              </h3>
                              {student.portfolioLink.map((link, index) => (
                                <p key={index}>
                                  {link.linkType}:{" "}
                                  <a
                                    href={link.linkUrl}
                                    className="text-blue-500 hover:underline"
                                  >
                                    {link.linkUrl}
                                  </a>
                                </p>
                              ))}
                              <p className="text-gray-700 mb-1">
                                <strong>Email:</strong> {student.email}
                              </p>
                            </div>
                            {/* Resume Link */}
                            {/* <div className="mb-2">
                              <h3 className="font-semibold">Resume:</h3>
                              <a
                                href={`data:${
                                  student.resume.contentType
                                };base64,${btoa(
                                  String.fromCharCode(
                                    ...new Uint8Array(student.resume.data.data)
                                  )
                                )}`}
                                download={student.resume.filename}
                                className="text-blue-500 hover:underline"
                              >
                                Download Resume
                              </a>
                            </div> */}
                            {(student.appliedInternships.internshipStatus
                              .status === "Applied" ||
                              student.appliedInternships.internshipStatus
                                .status === "Viewed") && (
                              <div className="absolute bottom-5 right-5 space-x-4">
                                <button
                                  onClick={() =>
                                    handleShortlistProfile(student._id)
                                  }
                                  className=" rounded-lg font-semibold text-green-600 shadow-md hover:scale-105 duration-300 px-2 py-1"
                                >
                                  Shortlist
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectProfile(student._id)
                                  }
                                  className=" rounded-lg font-semibold text-red-600 shadow-md hover:scale-105 duration-300 px-2 py-1"
                                >
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
            )}

            {selectedStatus === "Shortlisted" && (
              <div className="bg-white shadow-md rounded-lg p-6 min-w-full">
                {shortlistedApplicants.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No one shortlisted for this internship yet.
                  </p>
                ) : (
                  <div className="space-y-4 ">
                    {shortlistedApplicants.map((student) => (
                      <div
                        key={student._id}
                        className="p-4 border rounded-lg shadow-sm bg-gray-50 max-h-[400px] relative overflow-y-auto "
                      >
                        <h2 className="text-2xl font-semibold mb-1 capitalize">
                          {student.firstname} {student.lastname}
                        </h2>
                        <h2 className="mb-2">{student.homeLocation}</h2>

                        <p key={student.appliedInternships.internship}>
                          {student.appliedInternships[0].availability ===
                          "Yes! Will join Immediately" ? (
                            <span className="text-green-500">
                              Immediate Joiner
                            </span>
                          ) : (
                            <span className="text-red-500">
                              Not an Immediate Joiner
                            </span>
                          )}
                        </p>

                        {!isOpen && (
                          <button className="absolute right-3 top-2 underline text-blue-400">
                            View Messages
                          </button>
                        )}

                        {isOpen && (
                          <div className="flex absolute right-3 top-2 space-x-4">
                            <button
                              onClick={() => setIsOpen(false)}
                              className=" right-3 top-2 underline text-blue-400"
                            >
                              Hide Profile
                            </button>
                          </div>
                        )}

                        {/* Skills */}

                        {/* Match Percentage */}
                        <div className="mb-2">
                          <p
                            className={`font-semibold ${
                              calculateMatchPercentage(
                                student.skills,
                                internship?.skills
                              ) < 20
                                ? "text-red-500"
                                : calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) >= 20 &&
                                  calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) <= 60
                                ? "text-orange-300"
                                : calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) > 60 &&
                                  calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) <= 90
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {calculateMatchPercentage(
                              student.skills,
                              internship?.skills
                            )}
                            % Matched
                          </p>
                        </div>

                        <div className="mb-2">
                          <h3 className="font-semibold">Skills:</h3>
                          <div className="flex flex-wrap gap-3">
                            {student.skills.map((skill, index) => (
                              <p
                                key={index}
                                className="rounded-lg bg-gray-200 capitalize px-3 py-1"
                              >
                                {skill.skillName}
                              </p>
                            ))}
                          </div>
                        </div>

                        {isOpen && (
                          <div className="relative">
                            {internship.assessment && (
                              <div className="mb-2">
                                <h3 className="font-semibold">
                                  Assessment Question
                                </h3>
                                <p>Ques: {internship.assessment}</p>
                                {student.appliedInternships.map(
                                  (appliedInternship) =>
                                    appliedInternship.internship ===
                                    internship._id ? (
                                      <p
                                        key={appliedInternship.internship}
                                        className="text-gray-600"
                                      >
                                        Ans: {appliedInternship.assessmentAns}
                                      </p>
                                    ) : null
                                )}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold">About the student</p>
                              {student.appliedInternships.map(
                                (appliedInternship) =>
                                  appliedInternship.internship ===
                                  internship._id ? (
                                    <p
                                      key={appliedInternship.internship}
                                      className="text-gray-600"
                                    >
                                      {" "}
                                      {appliedInternship.aboutText}
                                    </p>
                                  ) : null
                              )}
                            </div>

                            {/* Education */}
                            <div className="mb-2">
                              <h3 className="font-semibold">Education:</h3>
                              {student.education.map((edu, index) => (
                                <p key={index} className="text-gray-600">
                                  {edu.degree} in {edu.fieldOfStudy} from{" "}
                                  {edu.institution} ({edu.startYear} -{" "}
                                  {edu.endYear}) ({edu.score})
                                </p>
                              ))}
                            </div>

                            {/* Work Experience */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Work Experience:
                              </h3>
                              {student.workExperience.map((work, index) => (
                                <p key={index} className="text-gray-600">
                                  {work.role} at {work.company} (
                                  {work.startDate} - {work.endDate})
                                </p>
                              ))}
                            </div>

                            {/* Certificates */}
                            <div className="mb-2">
                              <h3 className="font-semibold">Certificates:</h3>
                              {student.certificates.map((cert, index) => (
                                <p key={index} className="text-gray-600">
                                  {cert.title} - {cert.issuingOrganization} (
                                  {cert.issueDate})
                                </p>
                              ))}
                            </div>

                            {/* Personal Projects */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Personal Projects:
                              </h3>
                              {student.personalProjects.map(
                                (project, index) => (
                                  <p key={index} className="text-gray-600">
                                    {project.title} - {project.description}
                                  </p>
                                )
                              )}
                            </div>

                            {/* Portfolio Links */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Portfolio Links:
                              </h3>
                              {student.portfolioLink.map((link, index) => (
                                <p key={index}>
                                  {link.linkType}:{" "}
                                  <a
                                    href={link.linkUrl}
                                    className="text-blue-500 hover:underline"
                                  >
                                    {link.linkUrl}
                                  </a>
                                </p>
                              ))}
                              <p className="text-gray-700 mb-1">
                                <strong>Email:</strong> {student.email}
                              </p>
                            </div>
                            {/* Resume Link */}
                            <div className="mb-2">
                              <h3 className="font-semibold">Resume:</h3>
                              <a
                                href={`data:${
                                  student.resume.contentType
                                };base64,${btoa(
                                  String.fromCharCode(
                                    ...new Uint8Array(student.resume.data.data)
                                  )
                                )}`}
                                download={student.resume.filename}
                                className="text-blue-500 hover:underline"
                              >
                                Download Resume
                              </a>
                            </div>
                            {/* {(student.appliedInternships[0].internshipStatus.status==='Applied' || student.appliedInternships[0].internshipStatus.status==='Viewed') && <div className='absolute bottom-5 right-5 space-x-4'>
                        <button onClick={()=>handleShortlistProfile(student._id)} className=' rounded-lg font-semibold text-green-600 shadow-md hover:scale-105 duration-300 px-2 py-1'>Shortlist</button>
                        <button onClick={handleRejectProfile} className=' rounded-lg font-semibold text-red-600 shadow-md hover:scale-105 duration-300 px-2 py-1'>Reject</button>
                      </div>} */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedStatus === "Not Interested" && (
              <div className="bg-white shadow-md rounded-lg p-6 w-full">
                {rejectedApplicants.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No one rejected for this internship yet.
                  </p>
                ) : (
                  <div className="space-y-4 ">
                    {rejectedApplicants.map((student) => (
                      <div
                        key={student._id}
                        className="p-4 border rounded-lg shadow-sm bg-gray-50 max-h-[400px] relative overflow-y-auto "
                      >
                        <h2 className="text-2xl font-semibold mb-1 capitalize">
                          {student.firstname} {student.lastname}
                        </h2>
                        <h2 className="mb-2">{student.homeLocation}</h2>

                        <p key={student.appliedInternships.internship}>
                          {student.appliedInternships[0].availability ===
                          "Yes! Will join Immediately" ? (
                            <span className="text-green-500">
                              Immediate Joiner
                            </span>
                          ) : (
                            <span className="text-red-500">
                              Not an Immediate Joiner
                            </span>
                          )}
                        </p>

                        {
                          <div className="absolute text-red-600 right-3 top-2">
                            {
                              student.appliedInternships[0].internshipStatus
                                .status
                            }
                          </div>
                        }
                        {/* {!isOpen && <button className='absolute right-3 top-2 underline text-blue-400'>View Messages</button>} */}

                        {/* {isOpen &&
                    <div className='flex absolute right-3 top-2 space-x-4'>
                      <button onClick={() => setIsOpen(false)} className=' right-3 top-2 underline text-blue-400'>Hide Profile</button>

                    </div>
                  } */}

                        {/* Skills */}

                        {/* Match Percentage */}
                        <div className="mb-2">
                          <p
                            className={`font-semibold ${
                              calculateMatchPercentage(
                                student.skills,
                                internship?.skills
                              ) < 20
                                ? "text-red-500"
                                : calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) >= 20 &&
                                  calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) <= 60
                                ? "text-orange-300"
                                : calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) > 60 &&
                                  calculateMatchPercentage(
                                    student.skills,
                                    internship?.skills
                                  ) <= 90
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {calculateMatchPercentage(
                              student.skills,
                              internship?.skills
                            )}
                            % Matched
                          </p>
                        </div>

                        <div className="mb-2">
                          <h3 className="font-semibold">Skills:</h3>
                          <div className="flex flex-wrap gap-3">
                            {student.skills.map((skill, index) => (
                              <p
                                key={index}
                                className="rounded-lg bg-gray-200 capitalize px-3 py-1"
                              >
                                {skill.skillName}
                              </p>
                            ))}
                          </div>
                        </div>

                        {isOpen && (
                          <div className="relative">
                            {internship.assessment && (
                              <div className="mb-2">
                                <h3 className="font-semibold">
                                  Assessment Question
                                </h3>
                                <p>Ques: {internship.assessment}</p>
                                {student.appliedInternships.map(
                                  (appliedInternship) =>
                                    appliedInternship.internship ===
                                    internship._id ? (
                                      <p
                                        key={appliedInternship.internship}
                                        className="text-gray-600"
                                      >
                                        Ans: {appliedInternship.assessmentAns}
                                      </p>
                                    ) : null
                                )}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold">About the student</p>
                              {student.appliedInternships.map(
                                (appliedInternship) =>
                                  appliedInternship.internship ===
                                  internship._id ? (
                                    <p
                                      key={appliedInternship.internship}
                                      className="text-gray-600"
                                    >
                                      {" "}
                                      {appliedInternship.aboutText}
                                    </p>
                                  ) : null
                              )}
                            </div>

                            {/* Education */}
                            <div className="mb-2">
                              <h3 className="font-semibold">Education:</h3>
                              {student.education.map((edu, index) => (
                                <p key={index} className="text-gray-600">
                                  {edu.degree} in {edu.fieldOfStudy} from{" "}
                                  {edu.institution} ({edu.startYear} -{" "}
                                  {edu.endYear}) ({edu.score})
                                </p>
                              ))}
                            </div>

                            {/* Work Experience */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Work Experience:
                              </h3>
                              {student.workExperience.map((work, index) => (
                                <p key={index} className="text-gray-600">
                                  {work.role} at {work.company} (
                                  {work.startDate} - {work.endDate})
                                </p>
                              ))}
                            </div>

                            {/* Certificates */}
                            <div className="mb-2">
                              <h3 className="font-semibold">Certificates:</h3>
                              {student.certificates.map((cert, index) => (
                                <p key={index} className="text-gray-600">
                                  {cert.title} - {cert.issuingOrganization} (
                                  {cert.issueDate})
                                </p>
                              ))}
                            </div>

                            {/* Personal Projects */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Personal Projects:
                              </h3>
                              {student.personalProjects.map(
                                (project, index) => (
                                  <p key={index} className="text-gray-600">
                                    {project.title} - {project.description}
                                  </p>
                                )
                              )}
                            </div>

                            {/* Portfolio Links */}
                            <div className="mb-2">
                              <h3 className="font-semibold">
                                Portfolio Links:
                              </h3>
                              {student.portfolioLink.map((link, index) => (
                                <p key={index}>
                                  {link.linkType}:{" "}
                                  <a
                                    href={link.linkUrl}
                                    className="text-blue-500 hover:underline"
                                  >
                                    {link.linkUrl}
                                  </a>
                                </p>
                              ))}
                              <p className="text-gray-700 mb-1">
                                <strong>Email:</strong> {student.email}
                              </p>
                            </div>
                            {/* Resume Link */}
                            <div className="mb-2">
                              <h3 className="font-semibold">Resume:</h3>
                              <a
                                href={`data:${
                                  student.resume.contentType
                                };base64,${btoa(
                                  String.fromCharCode(
                                    ...new Uint8Array(student.resume.data.data)
                                  )
                                )}`}
                                download={student.resume.filename}
                                className="text-blue-500 hover:underline"
                              >
                                Download Resume
                              </a>
                            </div>
                            {/* {(student.appliedInternships[0].internshipStatus.status==='Applied' || student.appliedInternships[0].internshipStatus.status==='Viewed') && <div className='absolute bottom-5 right-5 space-x-4'>
                        <button onClick={()=>handleShortlistProfile(student._id)} className=' rounded-lg font-semibold text-green-600 shadow-md hover:scale-105 duration-300 px-2 py-1'>Shortlist</button>
                        <button onClick={handleRejectProfile} className=' rounded-lg font-semibold text-red-600 shadow-md hover:scale-105 duration-300 px-2 py-1'>Reject</button>
                      </div>} */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {filteredApplicants.length > 0 && (
                <div className="flex justify-center my-4 space-x-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${
                      page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
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
                    className={`px-4 py-2 rounded-md ${
                      page === totalPages
                        ? "bg-gray-300"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <FaAngleRight />
                  </button>
                </div>
              )}

              </div>

          {/* board */}
          <div className="mb-5 hidden lg:flex lg:flex-col bg-white shadow-md rounded-lg p-6 left-2  space-y-7 w-full lg:w-[300px] lg:ml-5">
            <div
              onClick={() => setSelectedStatus("Applications Received")} // Click handler
              className={`flex cursor-pointer justify-between ${
                selectedStatus === "Applications Received"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-800"
              }`}
            >
              <p>Applications Received</p>{" "}
              <span>{filteredApplicants.length}</span>
            </div>

            <div
              onClick={() => setSelectedStatus("Shortlisted")} // Click handler
              className={`flex cursor-pointer justify-between ${
                selectedStatus === "Shortlisted"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-800"
              }`}
            >
              <p>Shortlisted</p>
              <span>{shortlistedApplicants.length}</span>
            </div>

            <div
              onClick={() => setSelectedStatus("Not Interested")} // Click handler
              className={`flex cursor-pointer justify-between ${
                selectedStatus === "Not Interested"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-800"
              }`}
            >
              <p>Not Interested</p>
              <span>{rejectedApplicants.length}</span>
            </div>

            <div
              onClick={() => setSelectedStatus("Hired")} // Click handler
              className={`flex cursor-pointer justify-between ${
                selectedStatus === "Hired"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-800"
              }`}
            >
              <p>Hired</p>
              <span>0</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Applicants;
