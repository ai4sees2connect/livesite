import React, { useState, useEffect } from "react";
import axios from "axios";
import getUserIdFromToken from "./auth/authUtilsRecr";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../common/server_url";
import Select from "react-select";
import { useRecruiter } from "./context/recruiterContext";
import { 
  FaMoneyBillWave, FaGift, FaBriefcase, FaRocket, FaLaptopCode, 
  FaHome, FaBuilding, FaSyncAlt, FaCalendarAlt, FaBullseye, 
  FaClipboardList, FaFileAlt, FaEnvelope, FaCalendarCheck, 
  FaPlus, FaTimes 
} from "react-icons/fa";
import Spinner from "../common/Spinner";
import { Link, useNavigate } from "react-router-dom";
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

  const [skills, setSkills] = useState([]);
  const [jobProfiles, setJobProfiles] = useState([]);
  const [customProfile, setCustomProfile] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const userId = getUserIdFromToken();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [startQuesDays, setStartQuesDays] = useState(null);
  const { recruiter, refreshData } = useRecruiter();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const perks = [
    "Letter of recommendation",
    "Flexible work hours",
    "Certificate",
    "Informal dress code",
    "5 days a week",
    "Free snacks & beverages",
    "Job offer",
  ];

  // Custom styles for React-Select to match CSS variables
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "52px",
      height: "52px",
      borderRadius: "12px",
      border: "1px solid var(--border-color)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      paddingLeft: "8px",
      backgroundColor: "white",
      "&:hover": { borderColor: "var(--primary-color)" }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "var(--primary-color)" : state.isFocused ? "var(--icon-bg-color)" : "white",
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
    placeholder: (base) => ({
      ...base,
      color: "var(--text-light)",
      fontSize: "16px",
    }),
    singleValue: (base) => ({ ...base, color: "var(--text-color)" }),
  };

  useEffect(() => {
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
    getData();
  }, [recruiter]);

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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/api/get-profiles`);
        const profilesData = response.data.map((profile) => ({
          label: profile.name,
          value: profile.name,
        }));
        setJobProfiles(profilesData);
      } catch (error) {
        console.error("Error fetching Profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value < 0 || value === '-') {
      toast.error("Please give positive number!");
      return;
    }
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "This field is required" }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
    if (errors.description) {
      setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
    }
  };

  const handleDescriptionBlur = () => {
    if (!formData.description.trim() || formData.description === "<p><br></p>") {
      setErrors((prevErrors) => ({ ...prevErrors, description: "This field is required" }));
    }
  };

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  const capitalizeWords = (str) => {
    return str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const addCustomProfile = () => {
    if (!customProfile.trim()) return;
    const formattedProfile = capitalizeWords(customProfile);
    const newProfile = { label: formattedProfile, value: formattedProfile };
    if (!jobProfiles.some((profile) => profile.value === newProfile.value)) {
      setJobProfiles((prev) => [...prev, newProfile]);
      setSelectedProfile(newProfile);
    } else {
      toast.error("Profile already available");
    }
    setCustomProfile("");
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      const newSkillLabel = capitalizeWords(customSkill.trim());
      const skillExists = skills.some((skill) => skill.label.toLowerCase() === newSkillLabel.toLowerCase());
      if (skillExists) {
        toast.error("Skill is already available!");
        setCustomSkill("");
      } else {
        const newSkill = { label: newSkillLabel, value: newSkillLabel };
        setSkills((prevSkills) => [...prevSkills, newSkill]);
        setSelectedSkills((prevSelected) => [...prevSelected, newSkill]);
        setCustomSkill("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillSet = selectedSkills.map((skill) => skill.value);
    const perksSet = selectedPerks.map((perk) => perk.value);
    const newErrors = {};

    if (!formData.internshipName) newErrors.internshipName = "Internship Name is required";
    if (!formData.internshipType) newErrors.internshipType = "Internship Type is required";
    if (!formData.internshipStartQues) newErrors.internshipStartQues = "Start Date is required";
    if (!formData.stipendType) newErrors.stipendType = "Stipend Type is required";
    if (!formData.ppoCheck) newErrors.ppoCheck = "PPO option is required";
    if (selectedPerks.length === 0) newErrors.perksSet = "At least one perk must be selected";
    if (!selectedProfile?.value) newErrors.selectedProfile = "Profile selection is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.numberOfOpenings) newErrors.numberOfOpenings = "Number of openings is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (skillSet.length === 0) newErrors.skillSet = "At least one skill is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      window.scrollTo({ behavior: "smooth", top: 0 });
      return;
    }

    const postData = {
      internshipName: formData.internshipName,
      skills: skillSet,
      internshipType: formData.internshipType,
      internLocation: { country: selectedCountry || "", state: selectedState || "", city: selectedCity || "" },
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

    if (postData.internshipType === "Remote") {
      postData.internshipType = "Work From Home";
      postData.internLocation = { country: "", state: "", city: "" };
    } else if (postData.internshipType === "Office") {
      postData.internshipType = "Work From Office";
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

    try {
      const response = await axios.post(`${api}/recruiter/internship/post/${userId}`, postData);
      if (response.data.success) {
        toast.success("Internship posted successfully");
        navigate(`/recruiter/dashboard/${userId}`);
        return;
      } else {
        toast.error("some error occured");
      }
    } catch (error) {
      console.error("There was an error posting the internship:", error);
    }
  };

  let status = null;
  if (recruiter?.companyWebsite?.status !== "Verified" || recruiter?.companyCertificate?.status !== "Verified") {
    if (recruiter?.companyWebsite) status = recruiter.companyWebsite.status;
    else if (recruiter?.companyCertificate) status = recruiter.companyCertificate.status;

    if (status === "pending") {
      return (
        <div className="mt-[340px] text-center text-[var(--text-light)] text-lg font-semibold h-screen space-y-4">
          Please wait some time while we verify your details
        </div>
      );
    } else if (status === "Rejected") {
      return (
        <div className="mt-[340px] text-center text-[var(--text-light)] text-lg font-semibold h-screen space-y-4">
          We regret to inform you that your verification has failed
        </div>
      );
    }
  }

  if (!recruiter?.companyCertificate && !recruiter?.companyWebsite) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-xl font-semibold text-[var(--text-light)]">Complete your profile.</p>
        <Link to={`/recruiter/profile/${userId}`} className="px-4 py-2 bg-[var(--button-color)] text-white rounded-lg font-semibold hover:bg-[var(--button-hover-color)] transition-colors">
          Back to profile
        </Link>
      </div>
    );
  } else if (recruiter?.subscription.planType !== "Unlimited") {
    if (recruiter?.subscription.planType === "free" && recruiter?.subscription.postsRemaining < 1) {
      return (
        <div className="flex flex-col h-screen items-center justify-center space-y-3">
          <div className="text-center text-[var(--text-light)] text-lg font-semibold">You have used your monthly available free postings</div>
          <Link to={`/recruiter/${userId}/pricing`} className="w-fit mx-auto border bg-[var(--button-color)] px-4 py-2 font-semibold text-white rounded-lg hover:bg-[var(--button-hover-color)] transition-colors">
            Upgrade your plan
          </Link>
        </div>
      );
    } else if ((recruiter?.subscription.planType === "1-month" || recruiter?.subscription.planType === "3-month" || recruiter?.subscription.planType === "1-year") && recruiter?.subscription.postsRemaining < 1) {
      return (
        <div className="flex flex-col space-y-3 h-screen">
          <div className="mt-[350px] text-center text-[var(--text-light)] text-lg font-semibold">You have used your available postings</div>
          <Link to={`/recruiter/${userId}/pricing`} className="w-fit mx-auto border bg-[var(--button-color)] px-4 py-2 font-semibold text-white rounded-lg hover:bg-[var(--button-hover-color)] transition-colors">
            Upgrade your plan
          </Link>
        </div>
      );
    }
  }

  const states = selectedCountry ? countryData.find((c) => c.name === selectedCountry)?.states : [];
  const cities = selectedState ? states.find((s) => s.name === selectedState)?.cities : [];

  return (
    <div className="min-h-screen bg-[var(--bg-light-color)] py-10 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--button-hover-color)] rounded-3xl p-8 shadow-xl text-white">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4 gap-2">
            <FaRocket /> Internship Portal
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Create Internship</h2>
          <p className="text-white/90 mt-3 text-lg">Reach talented students and build your future workforce.</p>
        </div>
      </div>

      <form className="px-5">
        <div className="mx-auto w-full lg:w-[75%] bg-white rounded-[28px] border border-[var(--border-color)] p-8 md:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.05)]">
          
          {/* Internship Title */}
          <div className="bg-[var(--bg-light-color)] p-6 rounded-2xl border border-[var(--border-color)] mb-6">
            <label className="text-xl font-bold text-[var(--text-color)] mb-3 block">Internship Title</label>
            <input
              type="text"
              name="internshipName"
              value={formData.internshipName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-12 w-full px-4 border border-[var(--border-color)] rounded-xl bg-white shadow-sm text-[var(--text-color)] focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] transition-all"
              placeholder="e.g Angular Development"
              maxLength={30}
              required
            />
            {errors.internshipName && <span className="text-red-500 text-sm mt-2 block">{errors.internshipName}</span>}
          </div>

          {/* Skills Section */}
          <div className="my-8 bg-white border border-[var(--border-color)] rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--icon-bg-color)] flex items-center justify-center flex-shrink-0">
                <FaLaptopCode className="text-[var(--primary-color)] text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-color)]">Skills Required <span className="text-red-500 ml-1">*</span></h3>
            </div>
            <div className="grid lg:grid-cols-[1fr_1fr_140px] gap-5">
              <Select isMulti name="skillSet" value={selectedSkills} onChange={(selected) => { handleSkillsChange(selected); setErrors((prev) => { const { skillSet, ...rest } = prev; return rest; }); }} onBlur={() => { if (!selectedSkills || selectedSkills.length === 0) setErrors((prev) => ({ ...prev, skillSet: "Please select at least one skill." })); }} options={skills} placeholder="Select or type skills" className="w-full" styles={customSelectStyles} required />
              <input type="text" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} placeholder="Add custom skill" maxLength={12} className="h-[52px] w-full px-4 border border-[var(--border-color)] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] text-[var(--text-color)]" />
              <button type="button" onClick={() => { addCustomSkill(); setErrors((prev) => { const { skillSet, ...rest } = prev; return rest; }); }} className="h-[52px] rounded-xl bg-[var(--button-color)] text-white font-semibold shadow-md hover:bg-[var(--button-hover-color)] transition-all flex items-center justify-center gap-2">
                <FaPlus /> Add
              </button>
            </div>
            {errors.skillSet && <p className="text-red-500 mt-4 text-sm font-medium">{errors.skillSet}</p>}
          </div>

          {/* Internship Type */}
          <div className="my-8">
            <p className="font-semibold text-lg mb-4 text-[var(--text-color)] flex items-center gap-2">
              <FaBriefcase className="text-[var(--primary-color)]" /> Internship Type
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {["Remote", "Office", "Hybrid"].map((type) => (
                <label key={type} className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${formData.internshipType === type ? "border-[var(--primary-color)] bg-[var(--icon-bg-color)]" : "border-[var(--border-color)] bg-white hover:border-[var(--primary-color)]/50"}`}>
                  <input type="radio" name="internshipType" value={type} checked={formData.internshipType === type} onChange={handleChange} className="hidden" />
                  <div className="text-3xl mb-2 text-[var(--primary-color)] flex justify-center">
                    {type === "Remote" ? <FaHome /> : type === "Office" ? <FaBuilding /> : <FaSyncAlt />}
                  </div>
                  <div className="font-semibold text-[var(--text-color)] text-center">{type}</div>
                  <div className="text-sm text-[var(--text-light)] mt-1 text-center">
                    {type === "Remote" ? "Work from anywhere" : type === "Office" ? "On-site internship" : "Mix of remote & office"}
                  </div>
                </label>
              ))}
            </div>

            {/* Location Dropdowns */}
            {(formData.internshipType === "Office" || formData.internshipType === "Hybrid") && (
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <select className="h-12 rounded-xl border border-[var(--border-color)] px-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)]" id="country" name="country" value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(""); setSelectedCity(""); }}>
                  <option value="">-- Select Country --</option>
                  {countryData.map((country) => (<option key={country.id} value={country.name}>{country.name}</option>))}
                </select>
                <select className="h-12 rounded-xl border border-[var(--border-color)] px-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)] disabled:bg-gray-100" id="state" value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); }} disabled={!selectedCountry}>
                  <option value="">-- Select State --</option>
                  {states?.map((state) => (<option key={state.id} value={state.name}>{state.name}</option>))}
                </select>
                <select id="city" value={selectedCity} disabled={!selectedState} onChange={(e) => setSelectedCity(e.target.value)} className="h-12 rounded-xl border border-[var(--border-color)] px-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)] disabled:bg-gray-100">
                  <option value="">-- Select City --</option>
                  {cities?.map((city) => (<option key={city.id} value={city.name}>{city.name}</option>))}
                </select>
              </div>
            )}
          </div>

          {/* Internship Start Date */}
          <div className="my-8 p-6 bg-[var(--bg-light-color)] rounded-2xl border border-[var(--border-color)]">
            <p className="font-semibold text-lg mb-4 flex items-center gap-2 text-[var(--text-color)]">
              <FaCalendarAlt className="text-[var(--primary-color)]" /> Internship Start Date
            </p>
            <div className="flex flex-wrap gap-6 text-[var(--text-light)]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="internshipStartQues" value="Immediately" checked={formData.internshipStartQues === "Immediately"} onChange={handleChange} className="w-4 h-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" required />
                Immediately (within next 30 days)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="internshipStartQues" value="Later" checked={formData.internshipStartQues === "Later"} onChange={handleChange} className="w-4 h-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" required />
                Later
              </label>
            </div>
            {errors.internshipStartQues && <span className="text-red-500 text-sm mt-2 block">{errors.internshipStartQues}</span>}
          </div>

          {/* Openings & Duration */}
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="flex flex-col">
              <label className="mb-3 text-lg font-semibold text-[var(--text-color)]">No of Openings</label>
              <input type="number" name="numberOfOpenings" value={formData.numberOfOpenings} onChange={(e) => { let value = e.target.value; if (value === "" || (/^[1-9][0-9]?$/.test(value) && parseInt(value) <= 99)) handleChange(e); }} onKeyDown={(e) => { if (e.key === "-" || e.key === "." || e.key === "e" || e.key === "E" || e.key === "0") e.preventDefault(); }} onBlur={handleBlur} className="h-12 px-4 border border-[var(--border-color)] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)]" placeholder="max: 99 openings" required />
              {errors.numberOfOpenings && <span className="text-red-500 text-sm mt-2 block">{errors.numberOfOpenings}</span>}
            </div>
            <div className="flex flex-col">
              <label className="mb-3 text-lg font-semibold text-[var(--text-color)]">Internship Duration (in months)</label>
              <input type="number" name="duration" value={formData.duration} onChange={(e) => { let value = e.target.value; if (value === "" || (/^[1-9][0-9]?$/.test(value) && parseInt(value) <= 24)) handleChange(e); }} onKeyDown={(e) => { if (e.key === "-" || e.key === "." || e.key === "e" || e.key === "E" || e.key === "0") e.preventDefault(); }} onBlur={handleBlur} className="h-12 px-4 border border-[var(--border-color)] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)]" placeholder="max: 24 months" />
              {errors.duration && <span className="text-red-500 text-sm mt-2 block">{errors.duration}</span>}
            </div>
          </div>

          {/* Profile Section */}
          <div className="my-8 bg-white border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--icon-bg-color)] flex items-center justify-center flex-shrink-0">
                <FaBullseye className="text-[var(--primary-color)] text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-color)]">Internship Profile <span className="text-red-500 ml-1">*</span></h3>
            </div>
            <div className="grid lg:grid-cols-[1fr_1fr_140px] gap-5">
              <Select value={selectedProfile} name="selectedProfile" onChange={(values) => { setSelectedProfile(values); setErrors((prev) => { const { selectedProfile, ...rest } = prev; return rest; }); }} onBlur={() => { if (!selectedProfile) setErrors((prev) => ({ ...prev, selectedProfile: "Please select a profile." })); }} options={jobProfiles} placeholder="e.g Web development" className="w-full" styles={customSelectStyles} />
              <input type="text" value={customProfile} onChange={(e) => setCustomProfile(e.target.value)} placeholder="Add custom profile" maxLength={30} className="h-[52px] w-full px-4 border border-[var(--border-color)] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] text-[var(--text-color)]" />
              <button type="button" onClick={() => { addCustomProfile(); setErrors((prev) => { const { selectedProfile, ...rest } = prev; return rest; }); }} className="h-[52px] rounded-xl bg-[var(--button-color)] text-white font-semibold shadow-md hover:bg-[var(--button-hover-color)] transition-all flex items-center justify-center gap-2">
                <FaPlus /> Add
              </button>
            </div>
            {errors.selectedProfile && <p className="text-red-500 text-sm mt-2 font-medium">{errors.selectedProfile}</p>}
          </div>

          {/* Intern Responsibilities */}
          <div className="my-8 bg-white border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--icon-bg-color)] flex items-center justify-center flex-shrink-0">
                <FaClipboardList className="text-[var(--primary-color)] text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-color)]">Intern Responsibilities <span className="text-red-500 ml-1">*</span></h3>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-sm">
              <ReactQuill value={formData.description} onChange={(value) => { if (value.length <= 3011) handleDescriptionChange(value); else setErrors((prev) => ({ ...prev, description: "Description should be less than 3000 characters" })); }} onBlur={() => { if (formData.description.trim().length < 10) alert("Description must be at least 10 characters long."); handleDescriptionBlur(); }} theme="snow" placeholder="Enter the requirements...." className="responsibility-editor" />
            </div>
            <div className="mt-2 flex justify-end">
              <p className="text-sm text-[var(--text-light)]">{3011 - formData.description.length} characters left</p>
            </div>
            {errors.description && <p className="text-red-500 text-sm mt-2 font-medium">{errors.description}</p>}
          </div>
        </div>

        {/* Cover Letter, Availability & Assessment */}
        <div className="my-10 mx-auto w-full lg:w-[75%] bg-white rounded-3xl border border-[var(--border-color)] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-color)] bg-[var(--bg-light-color)]">
            <h3 className="text-xl font-bold text-[var(--text-color)] flex items-center gap-2">
              <FaFileAlt className="text-[var(--primary-color)]" /> Cover Letter, Availability & Assessment Question
            </h3>
            <p className="text-[var(--text-light)] text-sm mt-2">Cover letter and availability questions will be asked to every applicant by default. You may also add a customized assessment question.</p>
          </div>
          <div className="p-5">
            <div className="flex items-start gap-3 pb-4 border-b border-[var(--border-color)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--icon-bg-color)] flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-[var(--primary-color)]" />
              </div>
              <div>
                <h4 className="font-semibold text-base text-[var(--text-color)]">Cover Letter</h4>
                <p className="text-[var(--text-light)] text-sm mt-1">Tell us something about yourself and why should you be hired for this role.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-4 border-b border-[var(--border-color)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--icon-bg-color)] flex items-center justify-center flex-shrink-0">
                <FaCalendarCheck className="text-[var(--primary-color)]" />
              </div>
              <div>
                <h4 className="font-semibold text-base text-[var(--text-color)]">Availability</h4>
                <p className="text-[var(--text-light)] text-sm mt-1">Can you join Immediately?</p>
              </div>
            </div>
            <div className="pt-4">
              {!isAssessmentOpen ? (
                <button type="button" onClick={() => setIsAssessmentOpen(true)} className="bg-[var(--button-color)] hover:bg-[var(--button-hover-color)] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2">
                  <FaPlus /> Add Assessment Question
                </button>
              ) : (
                <div>
                  <button type="button" onClick={() => { setIsAssessmentOpen(false); setFormData({ ...formData, assessment: "" }); }} className="text-red-500 font-semibold mb-3 flex items-center gap-2 hover:text-red-700 transition-colors">
                    <FaTimes /> Remove Assessment
                  </button>
                  <textarea name="assessment" value={formData.assessment} onChange={handleChange} rows={4} maxLength={200} placeholder="Enter Question for applicant" className="w-full p-3 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)]" />
                  <p className="text-sm text-[var(--text-light)] mt-2">{200 - formData.assessment.length} characters left</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stipend, Perks & PPO */}
        <div className="my-10 mx-auto w-full lg:w-[75%] bg-white rounded-3xl border border-[var(--border-color)] shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="mb-10">
              <label className="block text-xl font-bold text-[var(--text-color)] mb-5 flex items-center gap-2">
                <FaMoneyBillWave className="text-[var(--primary-color)]" /> Stipend
              </label>
              <div className="flex flex-wrap gap-8 text-[17px] text-[var(--text-color)]">
                {["unpaid", "fixed", "negotiable", "performance-based"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer capitalize">
                    <input type="radio" name="stipendType" value={type} checked={formData.stipendType === type} onChange={handleChange} className="w-4 h-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                    {type === "performance-based" ? "Performance Based" : type}
                  </label>
                ))}
              </div>
              {errors.stipendType && <p className="text-red-500 mt-3">{errors.stipendType}</p>}
              {(formData.stipendType === "fixed" || formData.stipendType === "negotiable" || formData.stipendType === "performance-based") && (
                <div className="flex items-center gap-3 mt-6">
                  <select name="currency" value={formData.currency} onChange={handleChange} className="h-12 px-4 border border-[var(--border-color)] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)]">
                    <option value="₹">₹ INR</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                    <option value="£">£ GBP</option>
                    <option value="¥">¥ JPY</option>
                  </select>
                  <input type="number" name="stipend" value={formData.stipend} onChange={handleChange} onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+" || e.key === ".") e.preventDefault(); if (e.target.value === "" && e.key === "0") e.preventDefault(); const currentValue = e.target.value + e.key; if (parseInt(currentValue, 10) > 99999) e.preventDefault(); }} placeholder="e.g. 15000" min="1" className="h-12 w-44 px-4 border border-[var(--border-color)] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)]" />
                  <span className="font-medium text-[var(--text-light)]">/month</span>
                </div>
              )}
              {formData.stipendType === "performance-based" && (
                <div className="mt-6">
                  <label className="block font-semibold mb-2 text-[var(--text-color)]">Incentive Criteria</label>
                  <textarea name="incentiveDescription" value={formData.incentiveDescription} onBlur={handleBlur} onChange={handleChange} placeholder="Describe the performance-based incentive" className="w-full p-4 border border-[var(--border-color)] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--icon-bg-color)] focus:border-[var(--primary-color)] bg-white text-[var(--text-color)]" />
                  {errors.incentiveDescription && <p className="text-red-500 mt-2">{errors.incentiveDescription}</p>}
                </div>
              )}
            </div>

            <div className="border-t border-[var(--border-color)] my-8"></div>

            {/* Perks */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[var(--icon-bg-color)] flex items-center justify-center">
                  <FaGift className="text-[var(--primary-color)] text-xl" />
                </div>
                <label className="text-xl font-bold text-[var(--text-color)]">Perks & Benefits</label>
              </div>
              <Select isMulti value={selectedPerks} onChange={(values) => { setSelectedPerks(values); if (errors.perksSet) setErrors((prev) => ({ ...prev, perksSet: "" })); }} onBlur={() => { if (!selectedPerks || selectedPerks.length === 0) setErrors((prev) => ({ ...prev, perksSet: "Please select atleast one perk." })); }} options={perks.map((perk) => ({ value: perk, label: perk }))} placeholder="Select perks" styles={customSelectStyles} />
              {errors.perksSet && <p className="text-red-500 mt-2">{errors.perksSet}</p>}
            </div>

            <div className="border-t border-[var(--border-color)] my-8"></div>

            {/* PPO */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[var(--icon-bg-color)] flex items-center justify-center">
                  <FaBriefcase className="text-[var(--primary-color)] text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-color)]">Pre-Placement Offer (PPO)</h3>
              </div>
              <p className="text-[var(--text-light)] mb-4">Does this internship come with a PPO opportunity?</p>
              <div className="flex gap-8 text-[17px] text-[var(--text-color)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="ppoCheck" value="yes" checked={formData.ppoCheck === "yes"} onChange={handleChange} className="w-4 h-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" /> Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="ppoCheck" value="no" checked={formData.ppoCheck === "no"} onChange={handleChange} className="w-4 h-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" /> No
                </label>
              </div>
              {errors.ppoCheck && <p className="text-red-500 mt-3">{errors.ppoCheck}</p>}
            </div>
          </div>
        </div>
      </form>

      {/* Post Button */}
      <div className="w-full lg:w-[75%] mx-auto mt-10 mb-16 flex justify-center">
        <button type="button" onClick={handleSubmit} className="px-12 py-3 rounded-xl bg-[var(--button-color)] text-white font-semibold shadow-md hover:bg-[var(--button-hover-color)] hover:shadow-lg transition-all flex items-center gap-2">
          <FaRocket /> Post Internship
        </button>
      </div>
    </div>
  );
};

export default RecPosting;