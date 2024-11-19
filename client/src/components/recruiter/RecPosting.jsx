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
    internLocation:{},
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
  const [selectedSkills, setSelectedSkills] = useState([]);
  const userId = getUserIdFromToken();
  const [formKey, setFormKey] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [startQuesDays, setStartQuesDays] = useState(null);
  const { recruiter, refreshData } = useRecruiter();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
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

  const states = selectedCountry
? countryData.find((c) => c.name === selectedCountry)?.states
: [];
const cities = selectedState
? states.find((s) => s.name === selectedState)?.cities
: [];


  // const statesAndUTs = [
  //   { value: "All Locations", label: "All Locations" },
  //   { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  //   { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  //   { value: "Assam", label: "Assam" },
  //   { value: "Bihar", label: "Bihar" },
  //   { value: "Chhattisgarh", label: "Chhattisgarh" },
  //   { value: "Chennai", label: "Chennai" },
  //   { value: "Goa", label: "Goa" },
  //   { value: "Gujarat", label: "Gujarat" },
  //   { value: "Haryana", label: "Haryana" },
  //   { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  //   { value: "Jharkhand", label: "Jharkhand" },
  //   { value: "Karnataka", label: "Karnataka" },
  //   { value: "Kerala", label: "Kerala" },
  //   { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  //   { value: "Maharashtra", label: "Maharashtra" },
  //   { value: "Manipur", label: "Manipur" },
  //   { value: "Meghalaya", label: "Meghalaya" },
  //   { value: "Mizoram", label: "Mizoram" },
  //   { value: "Nagaland", label: "Nagaland" },
  //   { value: "Odisha", label: "Odisha" },
  //   { value: "Punjab", label: "Punjab" },
  //   { value: "Rajasthan", label: "Rajasthan" },
  //   { value: "Sikkim", label: "Sikkim" },
  //   { value: "Tamil Nadu", label: "Tamil Nadu" },
  //   { value: "Telangana", label: "Telangana" },
  //   { value: "Tripura", label: "Tripura" },
  //   { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  //   { value: "Uttarakhand", label: "Uttarakhand" },
  //   { value: "West Bengal", label: "West Bengal" },
  //   {
  //     value: "Andaman and Nicobar Islands",
  //     label: "Andaman and Nicobar Islands",
  //   },
  //   { value: "Chandigarh", label: "Chandigarh" },
  //   {
  //     value: "Dadra and Nagar Haveli and Daman and Diu",
  //     label: "Dadra and Nagar Haveli and Daman and Diu",
  //   },
  //   { value: "Lakshadweep", label: "Lakshadweep" },
  //   { value: "Delhi", label: "Delhi" },
  //   { value: "Puducherry", label: "Puducherry" },
  //   { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  //   { value: "Ladakh", label: "Ladakh" },
  // ];

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

      if (recruiter?.orgDescription === '' || recruiter?.companyCity === '' || recruiter?.industryType === '' || recruiter?.numOfEmployees === '') {
        toast.info('Please complete your profile');
        navigate(`/recruiter/profile/${userId}`)
        return;
      }
    }
    setTimeout(() => {
      getData();
    }, 1000);

  }, [recruiter])


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

  const handleChange = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);
    const { name, value } = e.target;
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

  console.log('this is country', selectedCountry)
  console.log('this is state', selectedState)
  console.log('this is city', selectedCity)

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
      postData.internshipType = "Work from Home";
      postData.internLocation = { country: "", state: "", city: "" }; // Clear all location fields
    } else if (postData.internshipType === "Office") {
      postData.internshipType = "Work from Office";
      if (!postData.internLocation.country || !postData.internLocation.state || !postData.internLocation.city) {
        toast.info("Please provide a valid country, state, and city for 'Work from Office' internships.");
        return;
      }
    } else if (postData.internshipType === "Hybrid") {
      postData.internshipType = "Hybrid";
      if (!postData.internLocation.country || !postData.internLocation.state || !postData.internLocation.city) {
        toast.info("Please provide country, state, and city for 'Hybrid' internships.");
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
        <div className="mt-[350px] text-center text-gray-700 text-lg font-semibold">
          Please wait some time while we verify your details
        </div>
      );
    } else if (status === "Rejected") {
      return (
        <div className="mt-[350px] text-center text-gray-700 text-lg font-semibold">
          We regret to inform you that your verification has failed
        </div>
      );
    }
  }

  if (!recruiter?.companyCertificate && !recruiter?.companyWebsite) {
    return (
      <div className="flex items-center justify-center  text-gray-700 text-lg font-semibold h-screen">
        Verification pending in profile section
      </div>
    );
  } else if (recruiter?.subscription.planType !== "Unlimited") {
    if (
      recruiter?.subscription.planType === "free" &&
      recruiter?.subscription.postsRemaining < 1
    ) {
      return (
        <div className="flex flex-col  items-center justify-center space-y-3 h-screen">
          <div className="text-center text-gray-700 text-lg font-semibold">
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
        <div className="flex flex-col space-y-3 h-screen items-center justify-center">
          <div className="text-center text-gray-700 text-lg font-semibold">
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
            <div className="flex items-center">
              <Select
                isMulti
                value={selectedSkills}
                onChange={handleSkillsChange}
                options={skills}
                placeholder="Select or type skills "
                className="w-60 shadow-md"
                required
              />
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
                  onChange={(e) => { setSelectedState(e.target.value); setSelectedCity("") }}
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
          {formData.internshipStartQues === "Later" && (
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="startTime"
                  value="within a week"
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="mx-1"
                />
                Within a week
              </label>

              <label>
                <input
                  type="radio"
                  name="startTime"
                  value="within 15 days"
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
                Within 15 days
              </label>

              <label>
                <input
                  type="radio"
                  name="startTime"
                  value="more than 15 days"
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
                More than 15 days
              </label>
            </div>
          )}

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
              options={jobProfiles.map((job) => ({
                value: job,
                label: job,
              }))}
              placeholder="e.g Web development"
              className="w-full mb-3 shadow-md"
            />
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
                    className="p-1 border w-28 border-gray-300 rounded-md shadow-md"
                    placeholder="e.g 4000"
                    required
                  />{" "}
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
