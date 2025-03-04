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
import Spinner from "../common/Spinner";

import { Link, useNavigate } from "react-router-dom";
import statesAndCities from "../common/statesAndCities";

import countryData from "../TESTJSONS/countries+states+cities.json";

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
    <div>
      <h2 className="text-4xl font-semibold mb-6 text-center mt-24">
        Post Internship
      </h2>
      <form className="px-5">
        {/* <p className="text-center text-lg font-semibold my-5">
          Internship Details
        </p> */}
        <div className="border border-gray-300 mx-auto  p-6 rounded-lg shadow-lg mb-7 w-full lg:w-[70%]">

          {/* Internship name row */}
          <div className="flex flex-col my-5">
            {/* <label className="mb-2 font-medium">Internship Name:</label> */}
            <label className="font-medium">Internship Title</label>
            <input
              type="text"
              name="internshipName"
              value={formData.internshipName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-2 border text-gray-600 shadow-md border-gray-300 rounded-md"
              placeholder="e.g Angular Development"
              maxLength={30}
              required
            />
            {errors.internshipName && (
              <span className="text-red-400">{errors.internshipName}</span>
            )}
          </div>

          {/* Skills row */}
          <div className="flex flex-col my-5">
            <label className="mb-2 font-medium">Skills:</label>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <Select
                isMulti
                name="skillSet"
                value={selectedSkills}
                onChange={(selected) => {
                  handleSkillsChange(selected);

                  // Clear error if a skill is selected
                  setErrors((prevErrors) => {
                    const { skillSet, ...rest } = prevErrors;
                    return rest;
                  });
                }}
                onBlur={() => {
                  // Check if no skills are selected
                  if (!selectedSkills || selectedSkills.length === 0) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      skillSet: "Please select at least one skill.",
                    }));
                  }
                }}
                options={skills}
                placeholder="Select or type skills "
                className="w-60 shadow-md"
                required
              />

              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill"
                className="border rounded px-2 py-1 shadow-md w-60"
                maxLength={12}
              />
              <button
                onClick={() => {
                  addCustomSkill();

                  // Clear error if a custom skill is added
                  setErrors((prevErrors) => {
                    const { skillSet, ...rest } = prevErrors;
                    return rest;
                  });
                }}
                className="bg-blue-500 w-fit text-white px-4 py-1 rounded shadow-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            {errors.skillSet && (
              <span className="text-red-400">{errors.skillSet}</span>
            )}
          </div>

          {/* Internship type row */}
          <div className=" my-5">
            <div className="">
              <p className="my-2 font-medium">Internship Type</p>
              <label>
                <input
                  type="radio"
                  name="internshipType"
                  value="Hybrid"
                  checked={formData.internshipType === "Hybrid"}
                  onChange={handleChange}

                  className="w-4 h-4 mr-1" required
                />
                <span className="text-gray-600">Hybrid</span>
              </label>

              <label className="ml-4 text-gray-600">
                <input
                  type="radio"
                  name="internshipType"
                  value="Remote"
                  checked={formData.internshipType === "Remote"}
                  onChange={handleChange}

                  className="w-4 h-4 mr-1 "
                />
                Remote
              </label>

              <label className="ml-4 text-gray-600">
                <input
                  type="radio"
                  name="internshipType"
                  value="Office"
                  checked={formData.internshipType === "Office"}
                  onChange={handleChange}

                  className="w-4 h-4 mr-1"
                />
                Office
              </label>
            </div>

            {errors.internshipType && (
              <span className="text-red-400">{errors.internshipType}</span>
            )}
          </div>

          {(formData.internshipType === "Office" ||
            formData.internshipType === "Hybrid") && (
              <div className="flex flex-col gap-3">
                {/* Country Dropdown */}
                <select
                  className="border-2 py-1 rounded-md px-2"
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
            )}

          {/* Internship start ques */}
          <div className="flex flex-col my-5 space-y-2">
            <p className="font-medium">Internship Start date</p>
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
          <div className="flex flex-col my-5">
            <label className="mb-2 font-medium">No of Openings</label>
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
              className="p-2 border border-gray-300 rounded-md shadow-md"
              placeholder="max: 99 openings"
              required
            />

            {errors.numberOfOpenings && (
              <span className="text-red-400">{errors.numberOfOpenings}</span>
            )}
          </div>
          {/* Internship Duration */}
          <div className="flex flex-col my-5">
            <label className="mb-2 font-medium">
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
              className="p-2 border border-gray-300 rounded-md shadow-md"
              placeholder="max:24 months"
            />
            {errors.duration && (
              <span className="text-red-400">{errors.duration}</span>
            )}
          </div>

          {/* Profile */}
          <div className="flex flex-col my-5">
            <p className="my-2 font-medium">Type of internship</p>
            <Select
              value={selectedProfile}
              name="selectedProfile"
              onChange={(values) => {
                setSelectedProfile(values);

                // Clear error if a valid profile is selected
                setErrors((prevErrors) => {
                  const { selectedProfile, ...rest } = prevErrors;
                  return rest;
                });
              }}
              onBlur={() => {
                // Check if no profile is selected
                if (!selectedProfile || selectedProfile.length === 0) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    selectedProfile: "Please select a profile.",
                  }));
                }
              }}
              options={jobProfiles}
              placeholder="e.g Web development"
              className="w-full mb-3 shadow-md"
            />
            <input
              type="text"
              value={customProfile}
              onChange={(e) => setCustomProfile(e.target.value)}
              placeholder="Add custom profile"
              className="border rounded px-2 py-1 shadow-md w-60"
              maxLength={30}
            />
            {errors.selectedProfile && (
              <span className="text-red-400">{errors.selectedProfile}</span>
            )}
            <button
              onClick={() => {
                addCustomProfile();
                setErrors((prevErrors) => {
                  const { skillSet, ...rest } = prevErrors;
                  return rest;
                });
              }}
              className="bg-blue-500 w-fit text-white px-4 py-1 my-2 rounded shadow-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          {/* intern responsiblities */}
          <div className="flex flex-col my-5   ">
            <div className="">
              <label className="my-2 ml-2 font-medium">
                Intern's responsibilities
              </label>
              <ReactQuill

                value={formData.description}
                onChange={(value) => {

                  if (value.length <= 3011) {
                    handleDescriptionChange(value); // Update state only if within the limit
                  }
                  else setErrors(prevErrors => {
                    return { ...prevErrors, description: "Description should be less than 3000 characters" }
                  })
                }}
                className="p-2 rounded-md  "
                onBlur={() => {
                  // Ensure the minimum character requirement is met
                  if (formData.description.trim().length < 10) {
                    alert("Description must be at least 10 characters long.");
                  }
                  handleDescriptionBlur(); // Call your onBlur handler
                }}
                theme="snow"
                placeholder="Enter the requirements...."
              />
            </div>
            <p className=" ml-3 mt-3 text-gray-700 text-sm">{3011 - formData.description.length} characters left</p>

            {errors.description && (
              <span className="text-red-400 mt-1 ml-2">{errors.description}</span>
            )}
          </div>
        </div>

        <p className="text-center text-lg font-semibold py-5">
          Stipend & Perks
        </p>
        <div className="border border-gray-300 mx-auto p-6 rounded-lg shadow-lg mb-7 w-full lg:w-[70%]">
          {/* stipend */}
          <div className="flex flex-col my-4">
            <label className="mb-2 font-medium">Stipend</label>
            <div className="mb-4">
              <div>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="stipendType"
                    value="unpaid"
                    checked={formData.stipendType === "unpaid"}
                    onChange={handleChange}
                    className="mr-1"
                  />Unpaid
                </label>


                <label className="mr-4">
                  <input
                    type="radio"
                    name="stipendType"
                    value="fixed"
                    checked={formData.stipendType === "fixed"}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Fixed
                </label>

                <label className="mr-4">
                  <input
                    type="radio"
                    name="stipendType"
                    value="negotiable"
                    checked={formData.stipendType === "negotiable"}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Negotiable
                </label>

                <label>
                  <input
                    type="radio"
                    name="stipendType"
                    value="performance-based"
                    checked={formData.stipendType === "performance-based"}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Performance Based
                </label>
              </div>
              {errors.stipendType && (
                <span className="text-red-400">{errors.stipendType}</span>
              )}
            </div>

            {/* Conditionally render Stipend Input based on selected type */}
            {(formData.stipendType === "fixed" ||
              formData.stipendType === "negotiable" ||
              formData.stipendType === "performance-based") && (
                <div className="flex items-center mb-4">
                  {/* Currency Selector */}
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="p-1 border border-gray-300 rounded-md shadow-md mr-2"
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="¥">¥ (JPY)</option>
                  </select>
                  {/* Stipend Amount Input */}
                  <input
                    type="number"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      // Prevent 'e', 'E', '-', '+', and dot '.'
                      if (
                        e.key === 'e' ||
                        e.key === 'E' ||
                        e.key === '-' ||
                        e.key === '+' ||
                        e.key === '.'
                      ) {
                        e.preventDefault();
                      }

                      // Prevent '0' as the first character
                      if (e.target.value === '' && e.key === '0') {
                        e.preventDefault();
                      }

                      const currentValue = e.target.value + e.key; // Append the current key to the value
                      if (parseInt(currentValue, 10) > 99999) {
                        e.preventDefault();
                      }
                    }}
                    className="p-1 border w-28 border-gray-300 rounded-md shadow-md"
                    placeholder="e.g 4000"
                    required
                    min="1"
                  />
                  /month
                </div>
              )}

            {/* Conditionally render Incentive Description for Performance Based */}
            {formData.stipendType === "performance-based" && (
              <div className="flex flex-col my-4">
                <label className="font-medium">
                  Describe your incentive criteria
                </label>
                <textarea
                  name="incentiveDescription"
                  value={formData.incentiveDescription}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md shadow-md"
                  placeholder="Describe the performance-based incentive"
                />
                {errors.incentiveDescription && (<span className="text-red-400">{errors.incentiveDescription}</span>)}
              </div>
            )}
          </div>

          {/* perks */}
          <div className="flex flex-col mt-4 mb-2">
            <label className="mb-2 font-medium">Perks and Benefits</label>
            <div className="flex items-center">
              <Select
                isMulti
                value={selectedPerks}
                onChange={(values) => {
                  setSelectedPerks(values);

                  // Clear error if user selects a value
                  if (errors.perksSet) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      perksSet: "",
                    }));
                  }
                }}
                onBlur={() => {
                  // Check if no perk is selected
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
                placeholder="Select perk"
                className="w-60 shadow-md"
              />
            </div>
            {errors.perksSet && (
              <span className="text-red-400">{errors.perksSet}</span>
            )}
          </div>

          {/* ppo */}
          <div className="my-5 flex flex-col">
            <div>
              <p>Does this internship comes with pre-placement offer (PPO)</p>
              <input
                type="radio"
                name="ppoCheck"
                value="yes"
                checked={formData.ppoCheck === "yes"}
                onChange={handleChange}
                className=""
              />{" "}
              <label className="mr-5">Yes</label>
              <input
                type="radio"
                name="ppoCheck"
                value="no"
                checked={formData.ppoCheck === "no"}
                onChange={handleChange}
                className=""
              />{" "}
              <label>No</label>
            </div>
            {errors.ppoCheck && (
              <span className="text-red-400 ">{errors.ppoCheck}</span>
            )}
          </div>
        </div>

        <p className="text-center text-lg font-semibold py-5">
          Cover letter, Availability & Assessment Question
        </p>
        <div className="border relative border-gray-300  mx-auto p-6 rounded-lg shadow-lg mb-7 w-full lg:w-[70%]">
          <p className="text-gray-500 my-2">
            Cover letter and availability Question will be asked to every
            Applicant by default. If you wish you may ask a customized question
            as an assessment
          </p>
          <div className="my-2">
            <p>Cover Letter</p>
            <p className="text-gray-500 ">
              Tell us something about yourself and why should you be hired for
              this role.
            </p>
          </div>

          <div className="my-2">
            <p>Availability</p>
            <p className="text-gray-500 ">Can you join Immediately?</p>
          </div>

          <div className="my-5">
            {!isAssessmentOpen ? (
              <button
                className="text-blue-500 font-semibold"
                onClick={() => setIsAssessmentOpen(true)}
              >
                + Add Assessment question
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAssessmentOpen(false);
                  setFormData({
                    ...formData,
                    assessment: "",
                  });
                }}
                className="text-red-500 font-semibold"
              >
                - Remove Assessment
              </button>
            )}
          </div>

          {isAssessmentOpen && (
            <div className="flex flex-col h-[200px]">
              <label className="mb-2 font-medium">Assessment Question</label>
              <textarea
                type="text"
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md shadow-md"
                placeholder="Enter Question for applicant"
                rows={3}
                maxLength={200}
              />
              <span className="text-sm text-gray-700">{200 - formData.assessment.length} characters left</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full md:w-[20%] static md:absolute bottom-4 right-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Post Internship
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecPosting;
