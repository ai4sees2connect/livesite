import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import getUserIdFromToken from "./auth/authUtilsRecr";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../common/server_url";
import Select from "react-select";
import { useRecruiter } from "./context/recruiterContext";
import { FaMoneyBillWave, FaGift, FaBriefcase } from "react-icons/fa"
import Spinner from "../common/Spinner";
import { Link, useNavigate } from "react-router-dom";
import statesAndCities from "../common/statesAndCities";

import countryData from "../TESTJSONS/countries+states+cities.json";

import {
  FaLaptopCode,
   FaGlobe,
  FaBullseye,
  FaClipboardList,
  FaCalendarAlt,
  FaPenNib,
  FaFileAlt,
  FaEnvelope,
  FaUserClock,
} from "react-icons/fa";

const RecPosting = () => {
  const [formData, setFormData] = useState({
    internshipName: "",
    internshipType: "",
    internLocation: {},
    internshipStartQues: "",
    stipendType: "",
    incentiveDescription: "",
    currency: "₹",
    ppoCheck: "",
    numberOfOpenings: "",
    stipend: "",
    duration: "",
    description: "",
    assessment: "",
    skills: [],
  });
  // const [Location,setLocation]=useState('');
  // const [mode, setMode]=useState('');

  const [skills, setSkills] = useState([]);
  const [jobProfiles, setJobProfiles] = useState([]);
  const [customProfile, setCustomProfile] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const userId = getUserIdFromToken();
  // const [formKey, setFormKey] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const [startQuesDays, setStartQuesDays] = useState(null);
  const { recruiter, refreshData } = useRecruiter();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  let len;


  // const [internshipNameError, setInternshipNameError] = useState("");
  // const [stipendError, setStipendError] = useState("");
  // const [skillsError, setSkillsError] = useState("");
  const [errors, setErrors] = useState({});

  console.log(formData);
  const perks = [
    "Letter of recommendation",
    "Flexible work hours",
    "Certificate",
    "Informal dress code",
    "5 days a week",
    "Free snacks & beverages",
    "Job offer",
  ];

  console.log("this is recruite data", recruiter);

  useEffect(() => {
    // refreshData();
    const getData = () => {
      if (
        recruiter?.orgDescription === "" ||
        recruiter?.companyCity === "" ||
        recruiter?.industryType === "" ||
        recruiter?.numOfEmployees === ""
      ) {
        toast.info("Please complete your profile");
        navigate(`/recruiter/profile/${userId}`);
        return;
      }
    };
    // setTimeout(() => {
    //   getData();
    // }, 1000);
    getData();
  }, [recruiter]);

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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/api/get-profiles`);
        const profilesData = response.data.map((profile) => ({
          label: profile.name, // Map 'name' field to 'label'
          value: profile.name, // Map 'name' field to 'value'
        }));
        setJobProfiles(profilesData);
      } catch (error) {
        console.error("Error fetching Profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  // console.log(jobProfiles)

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure the value is not negative
    if (value < 0 || value === '-') {
      toast.error("Please give positive number!");
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // If the field is empty, set an error message
    if (!value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "This field is required",
      }));
    }


  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value, // This will capture the HTML content from React Quill
    });

    if (errors.description) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "",
      }));
    }

  };

  const handleDescriptionBlur = () => {
    // Validate the description field when the user leaves the editor
    if (!formData.description.trim() || formData.description === "<p><br></p>") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "This field is required",
      }));
    }
  };

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
    // if(selectedOptions.length === 0) setSkillsError("Please provide atleast one Skill");
    // else setSkillsError("");
    console.log("This is a skill set", selectedOptions);
  };

  console.log('this is selected skills', selectedSkills)

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  const addCustomProfile = () => {
    if (!customProfile.trim()) return; // Prevent empty or whitespace-only entries

    const formattedProfile = capitalizeWords(customProfile); // Capitalize each word
    const newProfile = {
      label: formattedProfile,
      value: formattedProfile, // Make value and label the same
    };

    // Check if the custom profile already exists
    if (!jobProfiles.some((profile) => profile.value === newProfile.value)) {
      setJobProfiles((prev) => [...prev, newProfile]); // Add to jobProfiles
      setSelectedProfile(newProfile);
    }
    else {
      toast.error("Profile already avaialble");
    }

    // Set the custom profile as the selected value
    setCustomProfile(""); // Clear the input field
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      const capitalizeWords = (str) =>
        str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Only capitalize the first letter, leave the rest unchanged
          .join(" ");

      const newSkillLabel = capitalizeWords(customSkill.trim());
      const newSkillValue = newSkillLabel;

      // Check if the skill already exists
      const skillExists = skills.some(
        (skill) => skill.label.toLowerCase() === newSkillLabel.toLowerCase()
      );

      if (skillExists) {
        toast.error("Skill is already available!");
        setCustomSkill("");
      } else {
        const newSkill = { label: newSkillLabel, value: newSkillValue };
        setSkills((prevSkills) => [...prevSkills, newSkill]);
        setSelectedSkills((prevSelected) => [...prevSelected, newSkill]);
        setCustomSkill("");
      }
    }
  };




  console.log("this is country", selectedCountry);
  console.log("this is state", selectedState);
  console.log("this is city", selectedCity);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillSet = selectedSkills.map((skill) => skill.value);
    const perksSet = selectedPerks.map((perk) => perk.value);

    // Initialize an empty errors object
    const newErrors = {};

    // Check all required fields and add corresponding errors if empty
    if (!formData.internshipName) {
      newErrors.internshipName = "Internship Name is required";
    }
    if (!formData.internshipType) {
      newErrors.internshipType = "Internship Type is required";
    }
    if (!formData.internshipStartQues) {
      newErrors.internshipStartQues = "Start Date is required";
    }
    if (!formData.stipendType) {
      newErrors.stipendType = "Stipend Type is required";
    }
    if (!formData.ppoCheck) {
      newErrors.ppoCheck = "PPO option is required";
    }
    if (selectedPerks.length === 0) {
      newErrors.perksSet = "At least one perk must be selected";
    }
    if (!selectedProfile?.value) {
      newErrors.selectedProfile = "Profile selection is required";
    }
    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    }
    if (!formData.numberOfOpenings) {
      newErrors.numberOfOpenings = "Number of openings is required";
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
    }
    if (skillSet.length === 0) {
      newErrors.skillSet = "At least one skill is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Update the errors state
      toast.error("Please fill in all required fields");
      window.scrollTo({
        behavior: "smooth",
        top: 0
      });
      return;
    }

    const postData = {
      internshipName: formData.internshipName,
      skills: skillSet,
      internshipType: formData.internshipType,
      internLocation: {
        country: selectedCountry || "",
        state: selectedState || "",
        city: selectedCity || "",
      },
      internshipStartQues: formData.internshipStartQues,
      numberOfOpenings: formData.numberOfOpenings,
      duration: formData.duration,
      jobProfile: selectedProfile.value,
      description: formData.description,
      stipendType: formData.stipendType,
      stipend: formData.stipend,
      currency: formData.currency,
      incentiveDescription: formData.incentiveDescription,
      perks: perksSet,
      ppoCheck: formData.ppoCheck,
      assessment: formData.assessment,
    };
    console.log(postData);

    if (postData.internshipType === "Remote") {
      postData.internshipType = "Work From Home";
      postData.internLocation = { country: "", state: "", city: "" }; // Clear all location fields
    } else if (postData.internshipType === "Office") {
      postData.internshipType = "Work From Office";
      if (
        !postData.internLocation.country ||
        !postData.internLocation.state ||
        !postData.internLocation.city
      ) {
        toast.info(
          "Please provide a valid country, state, and city for 'Work from Office' internships."
        );
        return;
      }
    } else if (postData.internshipType === "Hybrid") {
      postData.internshipType = "Hybrid";
      if (
        !postData.internLocation.country ||
        !postData.internLocation.state ||
        !postData.internLocation.city
      ) {
        toast.info(
          "Please provide country, state, and city for 'Hybrid' internships."
        );
        return;
      }
    }

    console.log("sending this data", postData);
    try {
      // Make the POST request to your backend
      const response = await axios.post(
        `${api}/recruiter/internship/post/${userId}`,
        postData
      );

      if (response.data.success) {
        toast.success("Internship posted successfully");
        console.log("Response:", response.data);
        navigate(`/recruiter/dashboard/${userId}`);
        return;
      } else {
        toast.error("some error occured");
        return;
      }
    } catch (error) {
      // Handle errors
      console.error("There was an error posting the internship:", error);
    }
  };
  // console.log(selectedProfile)
  // console.log(selectedPerks);
  console.log("this is assessment question", formData.assessment);
  console.log("this is my location", formData.internLocation);
  console.log("this is my currency", formData.currency);

  console.log('this is custom profile', customProfile);
  console.log('this is selected profile', selectedProfile);

  let status = null;

  if (
    recruiter?.companyWebsite?.status !== "Verified" ||
    recruiter?.companyCertificate?.status !== "Verified"
  ) {
    if (recruiter?.companyWebsite) {
      status = recruiter.companyWebsite.status;
    } else if (recruiter?.companyCertificate) {
      status = recruiter.companyCertificate.status;
    }

    if (status === "pending") {
      return (
        <div className="mt-[340px] text-center text-gray-700 text-lg font-semibold h-screen space-y-4">
          Please wait some time while we verify your details
        </div>
      );
    } else if (status === "Rejected") {
      return (
        <div className="mt-[340px] text-center text-gray-700 text-lg font-semibold h-screen space-y-4">
          We regret to inform you that your verification has failed
        </div>
      );
    }
  }

  if (!recruiter?.companyCertificate && !recruiter?.companyWebsite) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-xl font-semibold text-gray-500">
          Complete your profile.
        </p>
        <Link
          to={`/recruiter/profile/${userId}`}
          className="px-2 py-1 bg-blue-500 text-white rounded-md"
        >
          Back to profile
        </Link>
      </div>
    );
  } else if (recruiter?.subscription.planType !== "Unlimited") {
    if (
      recruiter?.subscription.planType === "free" &&
      recruiter?.subscription.postsRemaining < 1
    ) {
      return (
        <div className="flex flex-col   h-screen items-center justify-center space-y-3">
          <div className=" text-center text-gray-700 text-lg font-semibold">
            You have used your monthly available free postings
          </div>
          <Link
            to={`/recruiter/${userId}/pricing`}
            className="w-fit mx-auto border bg-blue-400 px-2 py-1 font-semibold text-white rounded-md "
          >
            Upgrade your plan
          </Link>
        </div>
      );
    } else if (
      (recruiter?.subscription.planType === "1-month" ||
        recruiter?.subscription.planType === "3-month" ||
        recruiter?.subscription.planType === "1-year") &&
      recruiter?.subscription.postsRemaining < 1
    ) {
      return (
        <div className="flex flex-col space-y-3 h-screen">
          <div className="mt-[350px] text-center text-gray-700 text-lg font-semibold">
            You have used your available postings
          </div>
          <Link
            to={`/recruiter/${userId}/pricing`}
            className="w-fit mx-auto border bg-blue-400 px-2 py-1 font-semibold text-white rounded-md "
          >
            Upgrade your plan
          </Link>
        </div>
      );
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-10">
      <div className="max-w-5xl mx-auto mb-8">
  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 rounded-3xl p-8 shadow-xl text-white">

     <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4 gap-2">
  <FaGlobe />
  Internship Portal
</div>

    <h2 className="text-4xl md:text-5xl font-bold">
      Create Internship
    </h2>

    <p className="text-white/90 mt-3 text-lg">
      Reach talented students and build your future workforce.
    </p>

  </div>
</div>

      <form className="px-5">
        {/* <p className="text-center text-lg font-semibold my-5">
          Internship Details
        </p> */}
        <div
  className="
  mx-auto
  w-full
  lg:w-[75%]
  bg-white
  rounded-[28px]
  border
  border-slate-200
  p-8
  md:p-10
  shadow-[0_15px_60px_rgba(0,0,0,0.08)]
  backdrop-blur-sm
"
>

          {/* Internship name row */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">

            {/* <label className="mb-2 font-medium">Internship Name:</label> */}
             <label className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
  <FaPenNib className="text-indigo-600" />
  Internship Title
</label>

            <input
              type="text"
              name="internshipName"
              value={formData.internshipName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="
h-12
w-full
px-4
border
border-slate-200
rounded-xl
bg-white
shadow-sm
text-slate-700
focus:outline-none
focus:ring-4
focus:ring-indigo-100
focus:border-indigo-500
transition-all
"
              placeholder="e.g Angular Development"
              maxLength={30}
              required
            />
            {errors.internshipName && (
              <span className="text-red-500 text-sm mt-2 block">{errors.internshipName}</span>
            )}
          </div>

          {/* Skills Section */}
<div className="my-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

  {/* Heading */}
  <div className="flex items-center gap-3 mb-3">
    <div
  className="
  w-6
  h-6
  rounded-lg
  bg-violet-100
  flex
  items-center
  justify-center
  flex-shrink-0
  "
>
  <FaLaptopCode className="text-violet-600 text-lg" />
</div>

    <h3 className="text-xl font-semibold text-slate-800">
      Skills Required
      <span className="text-red-500 ml-1">*</span>
    </h3>
  </div>

  {/* Inputs Row */}
  <div className="grid lg:grid-cols-[1fr_1fr_140px] gap-5">

    <Select
      isMulti
      name="skillSet"
      value={selectedSkills}
      onChange={(selected) => {
        handleSkillsChange(selected);

        setErrors((prevErrors) => {
          const { skillSet, ...rest } = prevErrors;
          return rest;
        });
      }}
      onBlur={() => {
        if (!selectedSkills || selectedSkills.length === 0) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            skillSet: "Please select at least one skill.",
          }));
        }
      }}
      options={skills}
      placeholder="Select or type skills"
      className="w-full"
      required
      styles={{
  control: (base) => ({
    ...base,
    minHeight: "52px",
    height: "52px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    paddingLeft: "8px",
  }),

  valueContainer: (base) => ({
    ...base,
    height: "52px",
    padding: "0 12px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#64748b",
    fontSize: "16px",
  }),
}}
    />

    <input
      type="text"
      value={customSkill}
      onChange={(e) => setCustomSkill(e.target.value)}
      placeholder="Add custom skill"
      maxLength={12}
      className="
      h-[52px]
      w-full
      px-4
      border
      border-slate-200
      rounded-xl
      shadow-sm
      focus:outline-none
      focus:ring-4
      focus:ring-violet-100
      focus:border-violet-500
      "
    />

    <button
      onClick={() => {
        addCustomSkill();

        setErrors((prevErrors) => {
          const { skillSet, ...rest } = prevErrors;
          return rest;
        });
      }}
      className="
      h-[52px]
      rounded-xl
      bg-gradient-to-r
      from-violet-600
      to-indigo-600
      text-white
      font-semibold
      shadow-md
      hover:shadow-lg
      transition-all
      "
    >
      Add
    </button>
  </div>

  {/* Error */}
  {errors.skillSet && (
    <p className="text-red-500 mt-4 text-sm font-medium">
      {errors.skillSet}
    </p>
  )}
</div>

          {/* Internship type row */}
          <div className="my-8">
  <p className="font-semibold text-lg mb-4 text-slate-800">
    💼 Internship Type
  </p>

  <div className="grid md:grid-cols-3 gap-4">

    {["Remote", "Office", "Hybrid"].map((type) => (
      <label
        key={type}
        className={`
        cursor-pointer
        rounded-2xl
        border-2
        p-5
        transition-all
        ${
          formData.internshipType === type
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-200 bg-white"
        }
        `}
      >
        <input
          type="radio"
          name="internshipType"
          value={type}
          checked={formData.internshipType === type}
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-3xl mb-2">
  {type === "Remote" ? (
    <FaGlobe className="text-indigo-600" />
  ) : type === "Office" ? (
    <FaBriefcase className="text-indigo-600" />
  ) : (
    <FaClipboardList className="text-indigo-600" />
  )}
</div>

        <div className="font-semibold">{type}</div>

        <div className="text-sm text-slate-500 mt-1">
          {type === "Remote"
            ? "Work from anywhere"
            : type === "Office"
            ? "On-site internship"
            : "Mix of remote & office"}
        </div>
      </label>
    ))}
  </div>


                {/* Country Dropdown */}
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                <select
                  className="
h-12
rounded-xl
border
border-slate-200
px-4
shadow-sm
focus:ring-4
focus:ring-indigo-100
focus:border-indigo-500
"
                  id="country"
                  name="country"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedState(""); // Reset state and cities dropdowns

                    setSelectedCity("");
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
                  className="
h-12
rounded-xl
border
border-slate-200
px-4
shadow-sm
focus:ring-4
focus:ring-indigo-100
focus:border-indigo-500
"
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
                  className="
h-12
rounded-xl
border
border-slate-200
px-4
shadow-sm
focus:ring-4
focus:ring-indigo-100
focus:border-indigo-500
"
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
          

          {/* Internship start ques */}
          <div className="my-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="font-semibold text-lg mb-4 flex items-center gap-2">
  <FaCalendarAlt className="text-indigo-600" />
  Internship Start Date
</p>
            <div className="flex space-x-16 text-gray-600">
              <label className=" flex items-center">
                <input
                  type="radio"
                  name="internshipStartQues"
                  value="Immediately"
                  checked={formData.internshipStartQues === "Immediately"}
                  onChange={handleChange}
                  className="w-4 h-4 mr-1"
                  required
                />
                Immediately (within next 30 days)
              </label>

              <label className="ml-4 flex items-center">
                <input
                  type="radio"
                  name="internshipStartQues"
                  value="Later"
                  checked={formData.internshipStartQues === "Later"}
                  onChange={handleChange}
                  className="w-4 h-4 mr-1"
                  required
                />
                Later
              </label>
            </div>

            {errors.internshipStartQues && (
              <span className="text-red-400">{errors.internshipStartQues}</span>
            )}
          </div>

          {/* no of openings */}
          <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="flex flex-col my-5">
            <label className="mb-3 text-lg font-semibold text-slate-800">
  No of Openings
</label>
            <input
              type="number"
              name="numberOfOpenings"
              value={formData.numberOfOpenings}
              onChange={(e) => {
                let value = e.target.value;

                // Ensure the value is a positive integer between 1 and 99
                if (value === "" || (/^[1-9][0-9]?$/.test(value) && parseInt(value) <= 99)) {
                  handleChange(e); // Only update if valid
                }
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "-" || // Prevent hyphen
                  e.key === "." || // Prevent dot
                  e.key === "e" || // Prevent 'e'
                  e.key === "E" || // Prevent 'E'
                  e.key === "0" // Prevent '0' as the first character
                ) {
                  e.preventDefault();
                }
              }}
              onBlur={(e) => {
                // const value = parseInt(e.target.value, 10);

                // // Clear the input field if value exceeds 99 or is invalid
                // if (value > 99 || isNaN(value)) {
                //   e.target.value = "";
                //   handleChange({ target: { name: e.target.name, value: "" } });
                // }
                handleBlur(e);
              }}
              className="
h-12
px-4
border
border-slate-200
rounded-xl
shadow-sm
focus:ring-4
focus:ring-indigo-100
focus:border-indigo-500
"
              placeholder="max: 99 openings"
              required
            />

            {errors.numberOfOpenings && (
              <span className="text-red-500 text-sm mt-2 block">{errors.numberOfOpenings}</span>
            )}
          </div>
          {/* Internship Duration */}
          <div className="flex flex-col my-5">
            <label className="mb-3 text-lg font-semibold text-slate-800">
  Internship Duration (in months)
</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={(e) => {
                let value = e.target.value;

                // Ensure the value is a positive integer between 1 and 99
                if (value === "" || (/^[1-9][0-9]?$/.test(value) && parseInt(value) <= 24)) {
                  handleChange(e); // Only update if valid
                }
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "-" || // Prevent hyphen
                  e.key === "." || // Prevent dot
                  e.key === "e" || // Prevent 'e'
                  e.key === "E" || // Prevent 'E'
                  e.key === "0" // Prevent '0' as the first character
                ) {
                  e.preventDefault();
                }
              }}
              onBlur={handleBlur}
              className="
h-12
px-4
border
border-slate-200
rounded-xl
shadow-sm
focus:ring-4
focus:ring-indigo-100
focus:border-indigo-500
"
              placeholder="max:24 months"
            />
            {errors.duration && (
              <span className="text-red-500 text-sm mt-2 block">{errors.duration}</span>
            )}
            </div>
          </div>

          {/* Profile Section */}
<div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

  {/* Heading */}
  <div className="flex items-center gap-3 mb-3">
    <div
      className="
      w-10
      h-10
      rounded-lg
      bg-amber-100
      flex
      items-center
      justify-center
      flex-shrink-0
      "
    >
      <FaBullseye className="text-amber-600 text-lg" />
    </div>

    <h3 className="text-xl font-semibold text-slate-800">
      Internship Profile
      <span className="text-red-500 ml-1">*</span>
    </h3>
  </div>

  {/* Inputs */}
  <div className="grid lg:grid-cols-[1fr_1fr_140px] gap-5">

    <Select
      value={selectedProfile}
      name="selectedProfile"
      onChange={(values) => {
        setSelectedProfile(values);

        setErrors((prevErrors) => {
          const { selectedProfile, ...rest } = prevErrors;
          return rest;
        });
      }}
      onBlur={() => {
        if (!selectedProfile) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            selectedProfile: "Please select a profile.",
          }));
        }
      }}
      options={jobProfiles}
      placeholder="e.g Web development"
      className="w-full"
      styles={{
  control: (base) => ({
    ...base,
    minHeight: "52px",
    height: "52px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    paddingLeft: "8px",
  }),
}}
    />

    <input
      type="text"
      value={customProfile}
      onChange={(e) => setCustomProfile(e.target.value)}
      placeholder="Add custom profile"
      maxLength={30}
      className="
      h-[52px]
      w-full
      px-4
      border
      border-slate-200
      rounded-xl
      shadow-sm
      focus:outline-none
      focus:ring-4
      focus:ring-amber-100
      focus:border-amber-500
      "
    />

    <button
      onClick={() => {
        addCustomProfile();

        setErrors((prevErrors) => {
          const { selectedProfile, ...rest } = prevErrors;
          return rest;
        });
      }}
      className="
      h-[52px]
rounded-xl
bg-gradient-to-r
from-indigo-600
to-purple-600
text-white
font-semibold
shadow-md
hover:shadow-lg
hover:scale-[1.02]
transition-all
duration-300
"
    >
      Add
    </button>

  </div>

  {/* Error */}
  {errors.selectedProfile && (
    <p className="text-red-500 text-sm mt-2 font-medium">
      {errors.selectedProfile}
    </p>
  )}

</div>

          {/* Intern Responsibilities */}
<div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

  {/* Heading */}
  <div className="flex items-center gap-3 mb-3">
    <div
      className="
      w-10
      h-10
      rounded-lg
      bg-indigo-100
      flex
      items-center
      justify-center
      flex-shrink-0
      "
    >
      <FaClipboardList className="text-indigo-600 text-lg" />
    </div>

    <h3 className="text-xl font-semibold text-slate-800">
      Intern Responsibilities
      <span className="text-red-500 ml-1">*</span>
    </h3>
  </div>

  {/* Editor */}
  <div
    className="
    bg-white
    rounded-2xl
    overflow-hidden
    border
    border-slate-200
    shadow-sm
    "
  >
    <ReactQuill
      value={formData.description}
      onChange={(value) => {
        if (value.length <= 3011) {
          handleDescriptionChange(value);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            description:
              "Description should be less than 3000 characters",
          }));
        }
      }}
      onBlur={() => {
        if (formData.description.trim().length < 10) {
          alert("Description must be at least 10 characters long.");
        }
        handleDescriptionBlur();
      }}
      theme="snow"
      placeholder="Enter the requirements...."
      className="responsibility-editor"
    />
  </div>

  {/* Character Count */}
  <div className="mt-2 flex justify-end">
    <p className="text-sm text-slate-500">
      {3011 - formData.description.length} characters left
    </p>
  </div>

  {/* Error */}
  {errors.description && (
    <p className="text-red-500 text-sm mt-2 font-medium">
      {errors.description}
    </p>
  )}
  </div>
</div>
        
        {/* Cover Letter, Availability & Assessment */}
       <div className="
  my-10
  mx-auto
  w-full
  lg:w-[75%]
  bg-white
  rounded-3xl
  border
  border-slate-200
  shadow-sm
  overflow-hidden
">

  {/* Header */}
  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
  <FaFileAlt className="text-blue-600" />
  Cover Letter, Availability & Assessment Question
</h3>

    <p className="text-slate-500 text-sm mt-2">
      Cover letter and availability questions will be asked to every applicant by default.
      You may also add a customized assessment question.
    </p>
  </div>

  {/* Body */}
  <div className="p-5">

    {/* Cover Letter */}
    <div className="flex items-start gap-3 pb-4 border-b border-slate-200">

      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
  <FaEnvelope className="text-blue-600 text-lg" />
</div>

      <div>
        <h4 className="font-semibold text-base text-slate-800">
          Cover Letter
        </h4>

        <p className="text-slate-500 text-sm mt-1">
          Tell us something about yourself and why should you be hired for this role.
        </p>
      </div>

    </div>

    {/* Availability */}
    <div className="flex items-start gap-3 py-4 border-b border-slate-200">

      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
  <FaCalendarAlt className="text-green-600 text-lg" />
</div>

      <div>
        <h4 className="font-semibold text-base text-slate-800">
          Availability
        </h4>

        <p className="text-slate-500 text-sm mt-1">
          Can you join Immediately?
        </p>
      </div>

    </div>

    {/* Assessment */}
    <div className="pt-4">

      {!isAssessmentOpen ? (
        <button
          type="button"
          onClick={() => setIsAssessmentOpen(true)}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-2.5
            rounded-xl
            font-semibold
            transition-all
            shadow-sm
          "
        >
          + Add Assessment Question
        </button>
      ) : (
        <div>

          <button
            type="button"
            onClick={() => {
              setIsAssessmentOpen(false);
              setFormData({
                ...formData,
                assessment: "",
              });
            }}
            className="text-red-500 font-semibold mb-3"
          >
            Remove Assessment
          </button>

          <textarea
            name="assessment"
            value={formData.assessment}
            onChange={handleChange}
            rows={4}
            maxLength={200}
            placeholder="Enter Question for applicant"
            className="
              w-full
              p-3
              border
              border-slate-200
              rounded-xl
              focus:ring-4
              focus:ring-blue-100
              focus:border-blue-500
              outline-none
            "
          />

          <p className="text-sm text-slate-500 mt-2">
            {200 - formData.assessment.length} characters left
          </p>

        </div>
      )}

    </div>

  </div>

</div>
        

    {/* ===================== STIPEND ===================== */}
  
    <div
  className="
  my-10
  mx-auto
  w-full
  lg:w-[75%]
  bg-white
  rounded-3xl
  border
  border-slate-200
  shadow-sm
  overflow-hidden
"
>
  <div className="p-8">
    <div className="mb-10">
      <label className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-5">
  <FaMoneyBillWave className="text-green-600" />
  Stipend
</label>

      <div className="flex flex-wrap gap-8 text-[17px]">

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="stipendType"
            value="unpaid"
            checked={formData.stipendType === "unpaid"}
            onChange={handleChange}
          />
          Unpaid
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="stipendType"
            value="fixed"
            checked={formData.stipendType === "fixed"}
            onChange={handleChange}
          />
          Fixed
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="stipendType"
            value="negotiable"
            checked={formData.stipendType === "negotiable"}
            onChange={handleChange}
          />
          Negotiable
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="stipendType"
            value="performance-based"
            checked={formData.stipendType === "performance-based"}
            onChange={handleChange}
          />
          Performance Based
        </label>
      </div>

      {errors.stipendType && (
        <p className="text-red-500 mt-3">
          {errors.stipendType}
        </p>
      )}

      {(formData.stipendType === "fixed" ||
        formData.stipendType === "negotiable" ||
        formData.stipendType === "performance-based") && (
        <div className="flex items-center gap-3 mt-6">

          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="
            h-12
            px-4
            border
            border-slate-200
            rounded-xl
            shadow-sm
            "
          >
            <option value="₹">₹ INR</option>
            <option value="$">$ USD</option>
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
            <option value="¥">¥ JPY</option>
          </select>

          <input
            type="number"
            name="stipend"
            value={formData.stipend}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (
                e.key === "e" ||
                e.key === "E" ||
                e.key === "-" ||
                e.key === "+" ||
                e.key === "."
              ) {
                e.preventDefault();
              }

              if (e.target.value === "" && e.key === "0") {
                e.preventDefault();
              }

              const currentValue = e.target.value + e.key;

              if (parseInt(currentValue, 10) > 99999) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. 15000"
            min="1"
            className="
            h-12
            w-44
            px-4
            border
            border-slate-200
            rounded-xl
            shadow-sm
            focus:ring-4
            focus:ring-blue-100
            focus:border-blue-500
            "
          />

          <span className="font-medium text-slate-600">
            /month
          </span>
        </div>
      )}

      {formData.stipendType === "performance-based" && (
        <div className="mt-6">
          <label className="block font-semibold mb-2">
            Incentive Criteria
          </label>

          <textarea
            name="incentiveDescription"
            value={formData.incentiveDescription}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Describe the performance-based incentive"
            className="
            w-full
            p-4
            border
            border-slate-200
            rounded-xl
            shadow-sm
            "
          />

          {errors.incentiveDescription && (
            <p className="text-red-500 mt-2">
              {errors.incentiveDescription}
            </p>
          )}
        </div>
      )}
    </div>

    {/* Divider */}

    <div className="border-t border-slate-200 my-8"></div>

    {/* ===================== PERKS ===================== */}

    <div className="mb-10">

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <FaGift className="text-green-600" />
        </div>

        <label className="text-xl font-bold text-slate-800">
          Perks & Benefits
        </label>
      </div>

      <Select
        isMulti
        value={selectedPerks}
        onChange={(values) => {
          setSelectedPerks(values);

          if (errors.perksSet) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              perksSet: "",
            }));
          }
        }}
        onBlur={() => {
          if (!selectedPerks || selectedPerks.length === 0) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              perksSet: "Please select atleast one perk.",
            }));
          }
        }}
        options={perks.map((perk) => ({
          value: perk,
          label: perk,
        }))}
        placeholder="Select perks"
      />

      {errors.perksSet && (
        <p className="text-red-500 mt-2">
          {errors.perksSet}
        </p>
      )}
    </div>

    {/* Divider */}

    <div className="border-t border-slate-200 my-8"></div>

    {/* ===================== PPO ===================== */}

    <div>

      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <FaBriefcase className="text-indigo-600" />
        </div>

        <h3 className="text-xl font-bold text-slate-800">
          Pre-Placement Offer (PPO)
        </h3>
      </div>

      <p className="text-slate-600 mb-4">
        Does this internship come with a PPO opportunity?
      </p>

      <div className="flex gap-8 text-[17px]">

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="ppoCheck"
            value="yes"
            checked={formData.ppoCheck === "yes"}
            onChange={handleChange}
          />
          Yes
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="ppoCheck"
            value="no"
            checked={formData.ppoCheck === "no"}
            onChange={handleChange}
          />
          No
        </label>

      </div>

      {errors.ppoCheck && (
        <p className="text-red-500 mt-3">
          {errors.ppoCheck}
        </p>
      )}
    </div>

  </div>
</div>
          
      </form>
      {/* Post Button */}

{/* Post Button */}

<div className="w-full lg:w-[75%] mx-auto mt-10 mb-16 flex justify-center">

  <button
    type="button"
    onClick={handleSubmit}
    className="
      px-12
      py-3
      rounded-xl
      bg-blue-600
      text-white
      font-semibold
      shadow-md
      hover:bg-blue-700
      hover:shadow-lg
      transition-all
    "
  >
    Post Internship
  </button>

</div>

  
    </div>
    
  );
};

export default RecPosting;
