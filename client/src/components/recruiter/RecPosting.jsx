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
  const [jobProfiles,setJobProfiles] = useState([]);
  const [customProfile,setCustomProfile] = useState("");
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
    setTimeout(() => {
      getData();
    }, 1000);
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
    if (value < 0 || value ==='-') {
      toast.error("Please give positive number!");
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value, // This will capture the HTML content from React Quill
    });
  };

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
    console.log("This is a skill set", selectedOptions);
  };

  console.log('this is selected skills',selectedSkills)

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
    else{
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
    const skillSet = selectedSkills.map((skill) => {
      return skill.value;
    });
    const perksSet = selectedPerks.map((perk) => {
      return perk.value;
    });

    if (
      !formData.internshipName ||
      !formData.internshipType ||
      !formData.internshipStartQues ||
      !formData.stipendType ||
      !formData.ppoCheck ||
      perksSet.length == 0 ||
      !selectedProfile.value ||
      !formData.duration ||
      !formData.numberOfOpenings ||
      !formData.description ||
      skillSet.length == 0
    ) {
      toast.error("Please enter all fields");
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
        window.location.reload();
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

  console.log('this is custom profile',customProfile);
  console.log('this is selected profile',selectedProfile);

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
      <div className="px-5">
        {/* <p className="text-center text-lg font-semibold my-5">
          Internship Details
        </p> */}
        <div className="border border-gray-300 mx-auto  p-6 rounded-lg shadow-lg mb-7 w-full lg:w-[70%]">
          <div className="flex flex-col my-5">
            {/* <label className="mb-2 font-medium">Internship Name:</label> */}
            <label className="font-medium">Internship Title</label>
            <input
              type="text"
              name="internshipName"
              value={formData.internshipName}
              onChange={handleChange}
              className="p-2 border text-gray-600 shadow-md border-gray-300 rounded-md"
              placeholder="e.g Angular Development"
              required
            />
          </div>

          <div className="flex flex-col my-5">
            <label className="mb-2 font-medium">Skills:</label>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <Select
                isMulti
                value={selectedSkills}
                onChange={handleSkillsChange}
                options={skills}
                placeholder="Select or type skills "
                className="w-60 shadow-md"
                required
              />
              
              <input
                type="text"
                value={customSkill}
                onChange={(e)=>setCustomSkill(e.target.value)}
                placeholder="Add custom skill"
                className="border rounded px-2 py-1 shadow-md w-60"
              />
              <button
                onClick={addCustomSkill}
                className="bg-blue-500 w-fit text-white px-4 py-1 rounded shadow-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>

          <div className="p-2 my-5">
            <p className="my-2 font-medium">Internship Type</p>
            <label>
              <input
                type="radio"
                name="internshipType"
                value="Hybrid"
                checked={formData.internshipType === "Hybrid"}
                onChange={handleChange}
                className="w-4 h-4 mr-1"
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

          {(formData.internshipType === "Office" ||
            formData.internshipType === "Hybrid") && (
              <div className="flex flex-col gap-3">
                {/* Country Dropdown */}
                <select
                  className="border-2 py-1 rounded-md px-2"
                  id="country"
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

          <div className="flex flex-col my-5 space-y-3">
            <p className="font-medium">Internship Start date</p>
            <div className="flex space-x-16 text-gray-600">
              <label className="ml-4 flex items-center">
                <input
                  type="radio"
                  name="internshipStartQues"
                  value="Immediately"
                  checked={formData.internshipStartQues === "Immediately"}
                  onChange={handleChange}
                  className="w-4 h-4 mr-1"
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
                />
                Later
              </label>
            </div>
          </div>

          <div className="flex flex-col my-5">
            <label className="mb-2 font-medium">No of Openings</label>
            <input
              type="number"
              name="numberOfOpenings"
              value={formData.numberOfOpenings}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md shadow-md"
              placeholder="e.g. 4"
            />
          </div>

          <div className="flex flex-col my-5">
            <label className="mb-2 font-medium">
              Internship Duration (in months)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md shadow-md"
              placeholder="e.g. 5"
            />
          </div>

          <div className="flex flex-col my-5">
            <p className="my-2 font-medium">Type of internship</p>
            <Select
              value={selectedProfile}
              onChange={(values) => setSelectedProfile(values)}
              options={jobProfiles}
              placeholder="e.g Web development"
              className="w-full mb-3 shadow-md"
            />
            <input
                type="text"
                value={customProfile}
                onChange={(e)=>setCustomProfile(e.target.value)}
                placeholder="Add custom profile"
                className="border rounded px-2 py-1 shadow-md w-60"
              />
              <button
                onClick={addCustomProfile}
                className="bg-blue-500 w-fit text-white px-4 py-1 my-2 rounded shadow-md hover:bg-blue-600"
              >
                Add
              </button>
          </div>

          <div className="flex flex-col my-5 h-[320px]">
            <label className="my-2 ml-2 font-medium">
              Intern's responsibilities
            </label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              className="p-2 rounded-md h-[200px]"
              theme="snow"
              placeholder="Enter the requirements...."
            />
          </div>
        </div>

        <p className="text-center text-lg font-semibold py-5">
          Stipend & Perks
        </p>
        <div className="border border-gray-300 mx-auto p-6 rounded-lg shadow-lg mb-7 w-full lg:w-[70%]">
          <div className="flex flex-col my-4">
            <label className="mb-2 font-medium">Stipend</label>
            <div className="mb-4">
              <input
                type="radio"
                name="stipendType"
                value="unpaid"
                checked={formData.stipendType === "unpaid"}
                onChange={handleChange}
                className="mr-1"
              />
              <label className="mr-4">Unpaid</label>

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
                      if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                        e.preventDefault();
                      }
                    }}
                    className="p-1 border w-28 border-gray-300 rounded-md shadow-md"
                    placeholder="e.g 4000"
                    required
                    min="0"
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
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md shadow-md"
                  placeholder="Describe the performance-based incentive"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col mt-4 mb-2">
            <label className="mb-2 font-medium">Perks and Benefits</label>
            <div className="flex items-center">
              <Select
                isMulti
                value={selectedPerks}
                onChange={(values) => setSelectedPerks(values)}
                options={perks.map((perk) => ({
                  value: perk,
                  label: perk,
                }))}
                placeholder="Select perk"
                className="w-60 shadow-md"
              />
            </div>
          </div>

          <div className="my-5">
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
              <input
                type="text"
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md shadow-md"
                placeholder="Enter Question for applicant"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full md:w-[20%] static md:absolute bottom-4 right-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Post Internship
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecPosting;
