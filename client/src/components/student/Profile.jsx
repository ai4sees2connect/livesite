import React, { useEffect, useState } from "react";
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
import { FaPen } from "react-icons/fa";
import Resume from "./Resume";

const Profile = () => {
  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, student } = useStudent();
  const token = localStorage.getItem("token");
  const [skills, setSkills] = useState([]);
  // const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityEdit, setCityEdit] = useState(false);
  const [expEdit, setExpEdit] = useState(null);
  const [exp, setExp] = useState(null);
  const [genderEdit, setGenderEdit] = useState(false);
  const [gender, setGender] = useState(null);
  const nums = [
    { value: "fresher", label: "fresher" },
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
  const statesAndUTs = [
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Chennai", label: "Chennai" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
    {
      value: "Andaman and Nicobar Islands",
      label: "Andaman and Nicobar Islands",
    },
    { value: "Chandigarh", label: "Chandigarh" },
    {
      value: "Dadra and Nagar Haveli and Daman and Diu",
      label: "Dadra and Nagar Haveli and Daman and Diu",
    },
    { value: "Lakshadweep", label: "Lakshadweep" },
    { value: "Delhi", label: "Delhi" },
    { value: "Puducherry", label: "Puducherry" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
    { value: "Ladakh", label: "Ladakh" },
  ];

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

  const handleSave = async () => {
    const cityName = selectedCity.value;

    console.log("cityName", cityName);
    try {
      await axios.put(`${api}/student/api/${idFromToken}/save-location`, {
        homeLocation: cityName,
      });
      toast.success("Home Location Updated");
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

  console.log("this is exp", exp);
  console.log("this is student", student);

  return !student ? (
    <Spinner />
  ) : (
    <div className=" mx-auto p-4 mt-[68px] flex flex-col lg:flex-row max-w-[1170px]">
      <div className="border-b pb-3 mt-10 text-center border-2 p-5 rounded-lg h-full w-full lg:w-[280px]">
        <div className="flex justify-center">
          <img
            className="h-14 w-14 rounded-full bg-green-300 border-2 mb-3"
            src=""
            alt=""
          />
        </div>
        {/* <h1 className="text-2xl font-bold mb-2 text-center">Your Profile</h1> */}
        <h1 className=" text-xl capitalize text-center text-gray-600">
          {student.firstname} {student.lastname}
        </h1>
        <h1 className=" text-gray-600 text-center">{student.email}</h1>
        {!student.homeLocation && !cityEdit && (
          <h1
            onClick={() => setCityEdit(true)}
            className="text-blue-500 underline text-center hover:cursor-pointer"
          >
            Select Your City
          </h1>
        )}
        {cityEdit && (
          <div className="flex justify-center space-x-3 my-2 ">
            <Select
              options={statesAndUTs}
              values={selectedCity}
              onChange={(value) => setSelectedCity(value)}
              placeholder="Select a location"
              searchable={true}
              className=" shadow-md "
            />
            {selectedCity && (
              <button
                onClick={handleSave}
                className="bg-green-300 py-1 px-3 rounded-lg hover:bg-green-500"
              >
                Save
              </button>
            )}
            <button
              onClick={() => {
                setCityEdit(false);
                setSelectedCity(null);
              }}
              className="bg-red-300  md:py-1 px-2 md:px-3 rounded-lg hover:bg-red-500"
            >
              Close
            </button>
          </div>
        )}
        {!cityEdit && (
          <div className="flex space-x-3 justify-center items-center">
            <h1 className="text-center text-gray-600">
              {student.homeLocation}
            </h1>
            {student.homeLocation && (
              <FaPen
                onClick={() => setCityEdit(true)}
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
                {student.yearsOfExp === "fresher"
                  ? "Fresher"
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
        <section className="mb-8">
          <Resume />
        </section>
      </div>

      <div className="flex-1">
        <section className="mb-8">
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
