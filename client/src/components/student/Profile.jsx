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
import { FaBuilding, FaPen, FaUser } from "react-icons/fa";
import Resume from "./Resume";
import statesAndCities from "../common/statesAndCities";
import { FaArrowLeft } from "react-icons/fa";
// country
import countryData from "../TESTJSONS/countries+states+cities.json";

const Profile = () => {
  const idFromToken = getUserIdFromToken();
  const fileInputRef = useRef(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, student, refreshData } = useStudent();
  const token = localStorage.getItem("token");
  const [skills, setSkills] = useState([]);
  // const [selectedSkills, setSelectedSkills] = useState([]);
  // const [selectedCity, setSelectedCity] = useState(null);
  const [cityEdit, setCityEdit] = useState(false);
  const [expEdit, setExpEdit] = useState(null);
  const [exp, setExp] = useState(null);
  const [genderEdit, setGenderEdit] = useState(false);
  const [gender, setGender] = useState(null);

  const [profPicture, setProfilePic] = useState(null);
  const [picUrl, setPicUrl] = useState(null);
  // state for country and state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const nums = [
    { value: "no experience", label: "no experience" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10+" },
  ];

  useEffect(() => {
    if (student) {
      if (!student.homeLocation.city)
        toast.info("Please add your current location");
      if (student.gender === "") toast.info("Please specify your gender");
      if (student.education.length === 0)
        toast.info("Please add your education");
      if (student.skills.length === 0)
        toast.info("Please add some of your skills");
      if (student.yearsOfExp === "")
        toast.info("Please specify years of experience");
      if (student.yearsOfExp === "")
        toast.info("Please specify years of experience");
    }
  }, [student]);

  useEffect(()=>{
  if(student?.homeLocation?.country) setSelectedCountry(student.homeLocation.country)
  if(student?.homeLocation?.state) setSelectedCountry(student.homeLocation.state)
  if(student?.homeLocation?.city) setSelectedCountry(student.homeLocation.city)
  },[student])

  useEffect(() => {
    if (!token) {
      navigate("/student/login");
      return;
    }
    console.log("id from token", idFromToken);
    console.log("id from params", userId);

    if (idFromToken !== userId) {
      logout(); //logout from studentContext to remove token and setToken to null in useeffect of context to trigger the useeffect of studentContext
      navigate("/student/login");
      return;
    }

    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${api}/student/api/get-skills`);
        const skillsData = response.data.map((skill) => ({
          label: skill.name, // Map 'name' field to 'label'
          value: skill.name, // Map 'name' field to 'value'
        }));
        setSkills(skillsData);
        // console.log(skillsData);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, [userId, idFromToken, token]);

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const response = await axios.get(
          `${api}/student/get-picture/${idFromToken}`,
          {
            responseType: "blob", // Fetching as a blob for image rendering
          }
        );
        console.log("response", response.status);

        const picBlob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const Url = URL.createObjectURL(picBlob);
        // console.log('picUrl', pic);
        // console.log('logo', logo)
        setPicUrl(Url);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Picture not found");
          setPicUrl(null); // Set the logo URL to null if not found
        } else {
          console.error("Error fetching Picture:", error);
        }
      }
    };
    fetchPicture();

    return () => {
      if (!picUrl) {
        URL.revokeObjectURL(picUrl);
        console.log("Blob URL revoked on cleanup:", picUrl); // Optional: Add a log to confirm revocation
      }
    };
  }, [profPicture]);

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handlePictureUpload = async (e) => {
    // if (!logo) return;
    const selectedPicture = e.target.files[0];
    if (!selectedPicture) {
      toast.error("Please select a Picture to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profPicture", selectedPicture);

    try {
      // setUploading(true);
      const response = await axios.post(
        `${api}/student/upload-picture/${idFromToken}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include token if needed for authorization
          },
        }
      );
      // setUploading(false);
      console.log("profPicture uploaded successfully", response.data);
      toast.success("Profile Picture uploaded successfully");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      // setUploading(false);
      console.error("Error uploading profPicture", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${api}/student/delete-picture/${idFromToken}`);

      if (picUrl) {
        URL.revokeObjectURL(picUrl);
        console.log("Blob URL revoked:", picUrl);
      }

      setProfilePic(null);
      setPicUrl(null);
      toast.error("picture deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting picture", error);
    }
  };

  const handleSave = async () => {

    try {
      await axios.put(`${api}/student/api/${idFromToken}/save-location`, {
        homeLocation: {
          country:selectedCountry,
          state: selectedState,
          city: selectedCity,
        }
      });
      toast.success("Home Location Updated");
      // refreshData();
      window.location.reload();
    } catch (error) {
      toast.error("Some error occured");
      console.error("Error saving location:", error);
    }
  };

  const handleSaveExp = async () => {
    const yearsOfExp = exp.value;

    // console.log('cityName',cityName);
    console.log("yearsOfExp", yearsOfExp);
    try {
      await axios.put(`${api}/student/api/${idFromToken}/save-exp`, {
        yearsOfExp,
      });
      toast.success("Experience Updated");
      window.location.reload();
    } catch (error) {
      toast.error("Some error occured");
      console.error("Error saving experience:", error);
    }
  };

  const handleSaveGender = async () => {
    const genderData = gender.value;
    console.log("gender", gender);

    try {
      await axios.put(`${api}/student/api/${idFromToken}/save-gender`, {
        genderData,
      });
      toast.success("gender Updated");
      window.location.reload();
    } catch (error) {
      toast.error("Some error occured");
      console.error("Error gender experience:", error);
    }
  };
console.log('this is country',selectedCountry);
console.log('this is state',selectedState);
console.log('this is city',selectedCity);
  // country state city Api

  // Get available states and cities based on selections
  const states = selectedCountry
    ? countryData.find((c) => c.name === selectedCountry)?.states
    : [];
  const cities = selectedState
    ? states.find((s) => s.name === selectedState)?.cities
    : [];

  return !student ? (
    <Spinner />
  ) : (
    <div className=" mx-auto p-4 mt-[48px] flex flex-col lg:flex-row lg:w-full  relative">
      <div className="absolute top-7 font-semibold  w-fit px-2 ">
        <button
          onClick={() => navigate(-1)}
          className="flex space-x-2 items-center text-blue-500"
        >
          <FaArrowLeft />
          <span>back</span>
        </button>
      </div>

      <div className="border-b  pb-3 mt-10 text-center border-2 p-5 rounded-lg h-full w-full lg:w-[380px]">
        <div className="flex justify-center ">
          <div className="max-w-20 max-h-28  flex items-center justify-center ">
            {picUrl ? (
              <img src={picUrl} className="w-fit h-fit" alt="" />
            ) : (
              <div className="w-14 h-14 rounded-full border flex items-center justify-center border-black">
                <FaUser className="w-9 h-9 " />
              </div>
            )}
          </div>
        </div>
        {!picUrl && (
          <button className="text-blue-500" onClick={handleFileClick}>
            Upload profile picture
          </button>
        )}
        <input
          ref={fileInputRef}
          onChange={handlePictureUpload}
          type="file"
          className="my-2 hover:cursor-pointer w-full hidden"
        />
        <div className="flex flex-col">
          {picUrl && (
            <button className="text-blue-500 " onClick={handleFileClick}>
              Change profile picture
            </button>
          )}
          {picUrl && (
            <button className="text-red-400 mb-3" onClick={handleDelete}>
              Delete picture
            </button>
          )}
        </div>
        {/* <h1 className="text-2xl font-bold mb-2 text-center">Your Profile</h1> */}
        <h1 className=" text-xl capitalize text-center ">
          {student.firstname} {student.lastname}
        </h1>
        <h1 className=" text-gray-600 text-center">{student.email}</h1>
        {!student.homeLocation && !cityEdit && (
          <h1
            onClick={() => setCityEdit(true)}
            className="text-blue-500 underline text-center hover:cursor-pointer"
          >
            Select Your Location
          </h1>
        )}
        {cityEdit && (
          <div className="flex justify-center space-x-3 my-2">
            {/* <Select
              options={statesAndCities}
              values={selectedCity}
              onChange={(value) => setSelectedCity(value)}
              placeholder="Select a location"
              searchable={true}
              className=" shadow-md w-[50%] lg:w-[70%]"
            /> */}
            <div className="flex flex-col gap-3 w-full">
              {/* Country Dropdown */}
              <select
                className="border-2 py-1 rounded-md px-2 w-full"
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
                className="border-2 py-1 rounded-md px-2 w-full"
                id="state"
                value={selectedState}
                onChange={(e) => {setSelectedState(e.target.value);setSelectedCity("")}}
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
            <div className="flex flex-col gap-3">
              {selectedCity && (
                <button
                  onClick={()=>{handleSave();setCityEdit(false)}}
                  className="bg-green-300 py-1 px-3 rounded-lg hover:bg-green-500 h-10 text-white"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => {
                  setCityEdit(false);
                  setSelectedCity(null);
                }}
                className="bg-red-300  md:py-1 px-2 md:px-3 rounded-lg hover:bg-red-500 h-10 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {!cityEdit && (
          <div className="flex space-x-3 justify-center items-center">
            {student?.homeLocation?.city ? (<h1 className="text-center text-gray-600">
              {student?.homeLocation?.country+ "," + student?.homeLocation?.state + "," + student?.homeLocation?.city}
            </h1>):(<h1 className="text-red-500">Location</h1>)}

            {student.homeLocation && (
              <FaPen
                onClick={() => {setCityEdit(true);}}
                className="w-3 h-3 hover:cursor-pointer hover:text-blue-400"
              />
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-center">
          {!expEdit && !student.yearsOfExp && (
            <h1
              onClick={() => setExpEdit(true)}
              className="text-blue-500 underline text-center hover:cursor-pointer"
            >
              Add Job experiences
            </h1>
          )}
          {!expEdit && student.yearsOfExp && (
            <div className="flex space-x-3 justify-center items-center">
              <h1 className="text-gray-600 text-center">
                {student.yearsOfExp === "no experience"
                  ? "no experience"
                  : `${student.yearsOfExp} years of Experience`}
              </h1>
              {student.yearsOfExp && (
                <FaPen
                  onClick={() => setExpEdit(true)}
                  className="w-3 h-3 hover:cursor-pointer hover:text-blue-400"
                />
              )}
            </div>
          )}
          {expEdit && (
            <div className="flex justify-center space-x-3 my-2 w-full">
              <Select
                options={nums}
                values={exp}
                onChange={(value) => setExp(value)}
                placeholder="Experience in years"
                searchable={true}
                className="shadow-md "
              />

              {exp && (
                <button
                  onClick={handleSaveExp}
                  className="bg-green-300 py-1 px-3 rounded-lg hover:bg-green-500"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => {
                  setExpEdit(false);
                  setExp(null);
                }}
                className="bg-red-300  md:py-1 px-2 md:px-3  rounded-lg hover:bg-red-500 mx-2"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          {!genderEdit && !student.gender && (
            <h1
              onClick={() => setGenderEdit(true)}
              className="text-blue-500 underline text-center hover:cursor-pointer"
            >
              Select Your gender
            </h1>
          )}
          {!genderEdit && (
            <div className="flex space-x-3 justify-center items-center">
              <h1 className="text-gray-600 text-center">{student.gender}</h1>
              {student.gender && (
                <FaPen
                  onClick={() => setGenderEdit(true)}
                  className="w-3 h-3 hover:cursor-pointer hover:text-blue-400"
                />
              )}
            </div>
          )}
          {genderEdit && (
            <div className="flex justify-center space-x-3 my-2 w-full">
              <Select
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
                values={gender}
                onChange={(value) => setGender(value)}
                placeholder="select gender"
                searchable={true}
                className="shadow-md "
              />

              {gender && (
                <button
                  onClick={handleSaveGender}
                  className="bg-green-300 py-1 px-3 rounded-lg hover:bg-green-500"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => {
                  setGenderEdit(false);
                  setGender(null);
                }}
                className="bg-red-300 md:py-1 px-2 md:px-3 rounded-lg hover:bg-red-500 mx-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
        <section className="mb-4">
          <Resume />
        </section>
      </div>

      <div className="flex-1 lg:w-[30%]  overflow-y-auto scrollbar-thin h-screen relative">
        <section className="mb-8 ">
          <Education />
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
          <Skills skillSet={skills} />
        </section>
        <section className="mb-8">
          <Portfolio />
        </section>
      </div>
    </div>
  );
};

export default Profile;
