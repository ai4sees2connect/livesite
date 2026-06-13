import React, { useEffect, useRef, useState } from "react";
import Education from "./Education";
import getUserIdFromToken from "./auth/authUtils";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "./context/studentContext";
import Spinner from "../common/Spinner";
import WorkExp from "./WorkExp";
import Certificates from "./Certificates";
import PersonalProjects from "./PersonalProjects";
import Skills from "./Skills";
import Portfolio from "./Portfolio";
import axios from "axios";
import api from "../common/server_url";
import Select from "react-select";
import { toast } from "react-toastify";
import { FaPen, FaCamera, FaTrash, FaEdit } from "react-icons/fa";
import Resume from "./Resume";
import countryData from "../TESTJSONS/countries+states+cities.json";

const Profile = () => {
  const idFromToken = getUserIdFromToken();
  const fileInputRef = useRef(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, student, refreshData } = useStudent();
  const token = localStorage.getItem("token");
  const [skills, setSkills] = useState([]);
  const [cityEdit, setCityEdit] = useState(false);
  const [expEdit, setExpEdit] = useState(null);
  const [exp, setExp] = useState(null);
  const [genderEdit, setGenderEdit] = useState(false);
  const [gender, setGender] = useState(null);

  const [profPicture, setProfilePic] = useState(null);
  const [picUrl, setPicUrl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState({});

  const nums = [
    { value: "no experience", label: "0" },
    { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" },
    { value: "4", label: "4" }, { value: "5", label: "5" }, { value: "6", label: "6" },
    { value: "7", label: "7" }, { value: "8", label: "8" }, { value: "9", label: "9" },
    { value: "10", label: "10+" },
  ];

  // Custom styles for React-Select to match CSS variables
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#e5e7eb",
      boxShadow: "none",
      "&:hover": { borderColor: "var(--primary-color)" },
      borderRadius: "0.5rem",
      minHeight: "38px",
      fontSize: "0.875rem",
      backgroundColor: "white"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "var(--primary-color)" : state.isFocused ? "var(--icon-bg-color)" : "white",
      color: state.isSelected ? "white" : "var(--text-color)",
    }),
    singleValue: (base) => ({ ...base, color: "var(--text-color)" }),
    placeholder: (base) => ({ ...base, color: "var(--text-light)" })
  };

  useEffect(() => {
    if (student) {
      const newErrors = {};
      if (!student.homeLocation.city) newErrors.homeLocation = "Please add your current location";
      if (student.gender === "") newErrors.gender = "Please specify your gender";
      if (student.education.length === 0) newErrors.education = "* Please add your education";
      if (student.skills.length === 0) newErrors.skills = "* Please add some of your skills";
      if (student.yearsOfExp === "") newErrors.yearsOfExp = "Please specify years of experience";
      setErrors(newErrors);
    }
  }, [student]);

  const updateError = (field, message = null) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (message) updatedErrors[field] = message;
      else delete updatedErrors[field];
      return updatedErrors;
    });
  };

  useEffect(() => {
    if (student?.homeLocation?.country) setSelectedCountry(student.homeLocation.country);
    if (student?.homeLocation?.state) setSelectedState(student.homeLocation.state);
    if (student?.homeLocation?.city) setSelectedCity(student.homeLocation.city);
  }, [student]);

  useEffect(() => {
    if (!token) {
      navigate("/student/login");
      return;
    }
    if (idFromToken !== userId) {
      logout();
      navigate("/student/login");
      return;
    }

    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${api}/student/api/get-skills`);
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
  }, [userId, idFromToken, token]);

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const response = await axios.get(`${api}/student/get-picture/${idFromToken}`, { responseType: "blob" });
        const picBlob = new Blob([response.data], { type: response.headers["content-type"] });
        const Url = URL.createObjectURL(picBlob);
        setPicUrl(Url);
      } catch (error) {
        if (error.response && error.response.status === 404) setPicUrl(null);
        else console.error("Error fetching Picture:", error);
      }
    };
    fetchPicture();
    return () => { if (picUrl) URL.revokeObjectURL(picUrl); };
  }, [profPicture]);

  const handleFileChange = (e) => setProfilePic(e.target.files[0]);
  const handleFileClick = () => fileInputRef.current.click();

  const handlePictureUpload = async (e) => {
    const selectedPicture = e.target.files[0];
    if (!selectedPicture) return toast.error("Please select a Picture to upload.");
    const formData = new FormData();
    formData.append("profPicture", selectedPicture);
    try {
      await axios.post(`${api}/student/upload-picture/${idFromToken}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      toast.success("Profile Picture uploaded successfully");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error uploading profPicture", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${api}/student/delete-picture/${idFromToken}`);
      if (picUrl) URL.revokeObjectURL(picUrl);
      setProfilePic(null);
      setPicUrl(null);
      toast.error("Picture deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting picture", error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${api}/student/api/${idFromToken}/save-location`, {
        homeLocation: { country: selectedCountry, state: selectedState, city: selectedCity }
      });
      toast.success("Home Location Updated");
      window.location.reload();
    } catch (error) {
      toast.error("Some error occured");
    }
  };

  const handleSaveExp = async () => {
    try {
      await axios.put(`${api}/student/api/${idFromToken}/save-exp`, { yearsOfExp: exp.value });
      toast.success("Experience Updated");
      window.location.reload();
    } catch (error) {
      toast.error("Some error occured");
    }
  };

  const handleSaveGender = async () => {
    try {
      await axios.put(`${api}/student/api/${idFromToken}/save-gender`, { genderData: gender.value });
      toast.success("Gender Updated");
      window.location.reload();
    } catch (error) {
      toast.error("Some error occured");
    }
  };

  const states = selectedCountry ? countryData.find((c) => c.name === selectedCountry)?.states : [];
  const cities = selectedState ? states.find((s) => s.name === selectedState)?.cities : [];

  return !student ? (
    <Spinner />
  ) : (
    <div className="mx-auto p-4 md:p-6 lg:p-8 mt-[66px] flex flex-col lg:flex-row gap-8 max-w-7xl">
      
      {/* Left Side - Profile Card */}
      <div className="w-full lg:w-[380px] bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center h-fit lg:sticky lg:top-24">
        
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 flex items-center justify-center">
            {picUrl ? (
              <div
                className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  src={picUrl}
                  className={`w-full h-full object-cover transition-all duration-300 ${isHovered ? 'brightness-50 scale-105' : ''}`}
                  alt="Profile"
                />
                <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors" onClick={handleFileClick}>
                    <FaEdit size={18} />
                  </button>
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors" onClick={handleDelete}>
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="relative w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[var(--primary-color)] transition-colors cursor-pointer group bg-[var(--bg-light-color)]"
                onClick={handleFileClick}
              >
                <FaCamera className="w-10 h-10 text-gray-400 group-hover:text-[var(--primary-color)] transition-colors" />
              </div>
            )}
          </div>
        </div>

        <input ref={fileInputRef} onChange={handlePictureUpload} type="file" className="hidden" />

        {/* Name & Email */}
        <h1 className="text-2xl font-bold text-[var(--text-color)] capitalize mb-1">
          {student.firstname} {student.lastname}
        </h1>
        <h1 className="text-[var(--text-light)] text-sm mb-6">{student.email}</h1>

        {/* Location Section */}
        <div className="mb-5">
          {!student.homeLocation && !cityEdit && (
            <button onClick={() => setCityEdit(true)} className="text-[var(--primary-color)] font-medium hover:underline text-sm">
              + Select Your Location
            </button>
          )}
          {cityEdit && (
            <div className="flex flex-col gap-3 my-3 bg-[var(--bg-light-color)] p-4 rounded-xl border border-gray-100 text-left">
              <select className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white" value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(""); setSelectedCity(""); }}>
                <option value="">-- Select Country --</option>
                {countryData.map((country) => (<option key={country.id} value={country.name}>{country.name}</option>))}
              </select>
              <select className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white disabled:bg-gray-100" value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); }} disabled={!selectedCountry}>
                <option value="">-- Select State --</option>
                {states?.map((state) => (<option key={state.id} value={state.name}>{state.name}</option>))}
              </select>
              <select className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm text-[var(--text-color)] bg-white disabled:bg-gray-100" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState}>
                <option value="">-- Select City --</option>
                {cities?.map((city) => (<option key={city.id} value={city.name}>{city.name}</option>))}
              </select>
              <div className="flex gap-2 justify-end mt-2">
                <button onClick={() => { handleSave(); setCityEdit(false); }} disabled={!selectedCity} className="bg-[var(--button-color)] text-white py-2 px-4 rounded-lg hover:bg-[var(--button-hover-color)] text-sm font-medium disabled:opacity-50 transition-colors shadow-sm">Save</button>
                <button onClick={() => { setCityEdit(false); setSelectedCity(null); }} className="bg-gray-100 text-[var(--text-color)] py-2 px-4 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">Cancel</button>
              </div>
            </div>
          )}
          {!cityEdit && (
            <div className="flex items-center justify-center gap-2 hover:cursor-pointer group" onClick={() => setCityEdit(true)}>
              {student?.homeLocation?.city ? (
                <h1 className="text-[var(--text-light)] text-sm group-hover:text-[var(--primary-color)] transition-colors">
                  {student?.homeLocation?.country}, {student?.homeLocation?.state}, {student?.homeLocation?.city}
                </h1>
              ) : (
                <h1 className="text-red-500 font-semibold text-sm">Add Location</h1>
              )}
              <FaPen className="w-3 h-3 text-[var(--text-light)] group-hover:text-[var(--primary-color)] transition-colors" />
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="mb-5">
          {!expEdit && !student.yearsOfExp && (
            <button onClick={() => setExpEdit(true)} className="text-[var(--primary-color)] font-medium hover:underline text-sm">
              + Add Job Experience
            </button>
          )}
          {!expEdit && student.yearsOfExp && (
            <div className="flex items-center justify-center gap-2 hover:cursor-pointer group" onClick={() => setExpEdit(true)}>
              <h1 className="text-[var(--text-light)] text-sm group-hover:text-[var(--primary-color)] transition-colors">
                {student.yearsOfExp === "no experience" ? "No Experience" : `${student.yearsOfExp} Years Experience`}
              </h1>
              <FaPen className="w-3 h-3 text-[var(--text-light)] group-hover:text-[var(--primary-color)] transition-colors" />
            </div>
          )}
          {expEdit && (
            <div className="flex flex-col gap-3 my-3 bg-[var(--bg-light-color)] p-4 rounded-xl border border-gray-100 text-left">
              <Select options={nums} value={exp} onChange={(value) => setExp(value)} placeholder="Experience in years" styles={customSelectStyles} />
              <div className="flex gap-2 justify-end mt-2">
                <button onClick={handleSaveExp} disabled={!exp} className="bg-[var(--button-color)] text-white py-2 px-4 rounded-lg hover:bg-[var(--button-hover-color)] text-sm font-medium disabled:opacity-50 transition-colors shadow-sm">Save</button>
                <button onClick={() => { setExpEdit(false); setExp(null); }} className="bg-gray-100 text-[var(--text-color)] py-2 px-4 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Gender Section */}
        <div className="mb-5">
          {!genderEdit && !student.gender && (
            <button onClick={() => setGenderEdit(true)} className="text-red-500 font-semibold text-sm hover:underline">
              + Select Your Gender
            </button>
          )}
          {!genderEdit && student.gender && (
            <div className="flex items-center justify-center gap-2 hover:cursor-pointer group" onClick={() => setGenderEdit(true)}>
              <h1 className="text-[var(--text-light)] text-sm group-hover:text-[var(--primary-color)] transition-colors">{student.gender}</h1>
              <FaPen className="w-3 h-3 text-[var(--text-light)] group-hover:text-[var(--primary-color)] transition-colors" />
            </div>
          )}
          {genderEdit && (
            <div className="flex flex-col gap-3 my-3 bg-[var(--bg-light-color)] p-4 rounded-xl border border-gray-100 text-left">
              <Select
                options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]}
                value={gender}
                onChange={(value) => setGender(value)}
                placeholder="Select gender"
                styles={customSelectStyles}
              />
              <div className="flex gap-2 justify-end mt-2">
                <button onClick={handleSaveGender} disabled={!gender} className="bg-[var(--button-color)] text-white py-2 px-4 rounded-lg hover:bg-[var(--button-hover-color)] text-sm font-medium disabled:opacity-50 transition-colors shadow-sm">Save</button>
                <button onClick={() => { setGenderEdit(false); setGender(null); }} className="bg-gray-100 text-[var(--text-color)] py-2 px-4 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Resume Section */}
        <section className="mt-6 pt-6 border-t border-gray-100">
          <Resume />
        </section>
      </div>

      {/* Right Side - Scrollable Sidebar (Sticky) */}
      <div className="flex-1 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin pr-2">
        <section className="mb-8">
          <Education error={errors.education} clearError={() => updateError("education", null)} updateError={updateError} />
        </section>
        <section className="mb-8">
          <WorkExp />
        </section>
        <section className="mb-8">
          <Certificates />
        </section>
        <section className="mb-8">
          <PersonalProjects />
        </section>
        <section className="mb-8">
          <Skills skillSet={skills} error={errors.skills} clearError={() => updateError("skills", null)} updateError={updateError} />
        </section>
        <section className="mb-8">
          <Portfolio />
        </section>
      </div>
    </div>
  );
};

export default Profile;