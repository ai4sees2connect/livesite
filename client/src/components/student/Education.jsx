import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import getUserIdFromToken from "./auth/authUtils";
import { useStudent } from "./context/studentContext";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../common/server_url";
import Select from "react-select";

const Education = () => {
  const [clicked, setClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState(null);
  const [otherField, setOtherField] = useState(null);
  const [institution, setInstitution] = useState("");

  const [score, setScore] = useState("");
  const [educationDetails, setEducationDetails] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [gradeType, setGradeType] = useState("CGPA");
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(currentYear);
  const [endYear, setEndYear] = useState(currentYear);
  const startYears = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const [scoreError, setScoreError] = useState('');

  // const endYears = Array.from(
  //   { length: 50 },
  //   (_, i) => currentYear - 40 + i
  // ).reverse();

  const endYears = Array.from(
    { length: 11 },
    (_, i) => parseInt(startYear) + i
  ).reverse();

  const degreeOptions = [
    { value: "B.Tech", label: "B.Tech" },
    { value: "M.Tech", label: "M.Tech" },
    { value: "B.Sc", label: "B.Sc" },
    { value: "M.Sc", label: "M.Sc" },
    { value: "BCA", label: "BCA" },
    { value: "B.Com", label: "B.Com" },
    { value: "MCA", label: "MCA" },
    { value: "BBA", label: "BBA" },
    { value: "MBA", label: "MBA" },
    { value: "X Standard", label: "X Standard" },
    { value: "XII Standard", label: "XII Standard" },
    { value: "Diploma", label: "Diploma" },
  ];

  const fieldOfStudyMapping = {
    "B.Tech": [
      { value: "Telecommunication", label: "Telecommunication" },
      { value: "Agriculture", label: "Agriculture" },
      { value: "Automobile", label: "Automobile" },
      { value: "Aviation", label: "Aviation" },
      {
        value: "Bio-Chemistry/Bio-Technology",
        label: "Bio-Chemistry/Bio-Technology",
      },
      { value: "Biomedical", label: "Biomedical" },
      { value: "Ceramics", label: "Ceramics" },
      { value: "Chemical", label: "Chemical" },
      { value: "Civil", label: "Civil" },
      { value: "Computers", label: "Computers" },
      { value: "Electrical", label: "Electrical" },
      {
        value: "Electrical and Electronics",
        label: "Electrical and Electronics",
      },
      {
        value: "Electronics/Telecommunication",
        label: "Electronics/Telecommunication",
      },
      { value: "Energy", label: "Energy" },
      { value: "Environmental", label: "Environmental" },
      { value: "Information Technology", label: "Information Technology" },
      { value: "Instrumentation", label: "Instrumentation" },
      { value: "Marine", label: "Marine" },
      { value: "Mechanical", label: "Mechanical" },
      { value: "Metallurgy", label: "Metallurgy" },
      { value: "Mineral", label: "Mineral" },
      { value: "Mining", label: "Mining" },
      { value: "Nuclear", label: "Nuclear" },
      { value: "Paint/Oil", label: "Paint/Oil" },
      { value: "Petroleum", label: "Petroleum" },
      { value: "Plastics", label: "Plastics" },
      { value: "Production/Industrial", label: "Production/Industrial" },
      { value: "Textile", label: "Textile" },
      { value: "Other", label: "Other" },
    ],
    "B.Com": [
      { value: "Commerce", label: "Commerce" },
      { value: "Other", label: "Other" },
    ],
    "M.Tech": [
      { value: "Agriculture", label: "Agriculture" },
      { value: "Automobile", label: "Automobile" },
      { value: "Aviation", label: "Aviation" },
      {
        value: "Bio-Chemistry/Bio-Technology",
        label: "Bio-Chemistry/Bio-Technology",
      },
      { value: "Biomedical", label: "Biomedical" },
      { value: "VLSI", label: "VLSI" },
      { value: "Ceramics", label: "Ceramics" },
      { value: "Chemical", label: "Chemical" },
      { value: "Civil", label: "Civil" },
      { value: "Computers", label: "Computers" },
      { value: "Electrical", label: "Electrical" },
      {
        value: "Electronics/Telecommunication",
        label: "Electronics/Telecommunication",
      },
      { value: "Energy", label: "Energy" },
      { value: "Environmental", label: "Environmental" },
      { value: "Instrumentation", label: "Instrumentation" },
      { value: "Marine", label: "Marine" },
      { value: "Mechanical", label: "Mechanical" },
      { value: "Metallurgy", label: "Metallurgy" },
      { value: "Mineral", label: "Mineral" },
      { value: "Mining", label: "Mining" },
      { value: "Nuclear", label: "Nuclear" },
      { value: "Paint/Oil", label: "Paint/Oil" },
      { value: "Petroleum", label: "Petroleum" },
      { value: "Plastics", label: "Plastics" },
      { value: "Production/Industrial", label: "Production/Industrial" },
      { value: "Textile", label: "Textile" },
      { value: "Other", label: "Other" },
    ],
    "B.Sc": [
      { value: "Agriculture", label: "Agriculture" },
      { value: "Zeology", label: "Zeology" },
      { value: "Anthropology", label: "Anthropology" },
      { value: "Bio-Chemistry", label: "Bio-Chemistry" },
      { value: "Biology", label: "Biology" },
      { value: "Botany", label: "Botany" },
      { value: "Chemistry", label: "Chemistry" },
      { value: "Computers", label: "Computers" },
      { value: "Dairy Technology", label: "Dairy Technology" },
      { value: "Electronics", label: "Electronics" },
      { value: "Environmental Science", label: "Environmental Science" },
      { value: "Food Technology", label: "Food Technology" },
      { value: "General", label: "General" },
      { value: "Geology", label: "Geology" },
      { value: "Home Science", label: "Home Science" },
      {
        value: "Hospitality and Hotel Management",
        label: "Hospitality and Hotel Management",
      },
      { value: "Maths", label: "Maths" },
      { value: "Microbiology", label: "Microbiology" },
      { value: "Nursing", label: "Nursing" },
      { value: "Optometry", label: "Optometry" },
      { value: "Physics", label: "Physics" },
      { value: "Statistics", label: "Statistics" },
      { value: "Zoology", label: "Zoology" },
      { value: "Other", label: "Other" },
    ],
    "M.Sc": [
      { value: "Zeology", label: "Zeology" },
      {
        value: "Aerospace & Mechanical Engineering",
        label: "Aerospace & Mechanical Engineering",
      },
      { value: "Agriculture", label: "Agriculture" },
      { value: "Anthropology", label: "Anthropology" },
      {
        value: "Astronautical Engineering",
        label: "Astronautical Engineering",
      },
      { value: "Bio-Chemistry", label: "Bio-Chemistry" },
      { value: "Biology", label: "Biology" },
      { value: "Biotechnology", label: "Biotechnology" },
      { value: "Botany", label: "Botany" },
      {
        value: "Chemical Engineering & Materials Science",
        label: "Chemical Engineering & Materials Science",
      },
      { value: "Chemistry", label: "Chemistry" },
      {
        value: "Civil & Environmental Engineering",
        label: "Civil & Environmental Engineering",
      },
      { value: "Computers", label: "Computers" },
      {
        value: "Cyber Security Engineering",
        label: "Cyber Security Engineering",
      },
      { value: "Dairy Technology", label: "Dairy Technology" },
      { value: "Data Informatics", label: "Data Informatics" },
      { value: "Electrical Engineering", label: "Electrical Engineering" },
      { value: "Electronics", label: "Electronics" },
      {
        value: "Electronics & Embedded Technology",
        label: "Electronics & Embedded Technology",
      },
      { value: "Environmental Science", label: "Environmental Science" },
      { value: "Food Technology", label: "Food Technology" },
      { value: "Geology", label: "Geology" },
      { value: "Home Science", label: "Home Science" },
      {
        value: "Hospitality Administration",
        label: "Hospitality Administration",
      },
      {
        value: "Industrial & Systems Engineering",
        label: "Industrial & Systems Engineering",
      },
      { value: "Marine Engineering", label: "Marine Engineering" },
      { value: "Maths", label: "Maths" },
      { value: "Mechanical Engineering", label: "Mechanical Engineering" },
      { value: "Mechatronics", label: "Mechatronics" },
      { value: "Microbiology", label: "Microbiology" },
      { value: "Nursing", label: "Nursing" },
      { value: "Optometry", label: "Optometry" },
      { value: "Organic Chemistry", label: "Organic Chemistry" },
      { value: "Petroleum Engineering", label: "Petroleum Engineering" },
      { value: "Physics", label: "Physics" },
      { value: "Statistics", label: "Statistics" },
      {
        value: "Systems Architecting and Engineering",
        label: "Systems Architecting and Engineering",
      },
      { value: "Veterinary Science", label: "Veterinary Science" },
      { value: "Zoology", label: "Zoology" },
      { value: "Other", label: "Other" },
    ],
    BCA: [
      { value: "Computers", label: "Computers" },
      { value: "Other", label: "Other" },
    ],
    MCA: [
      { value: "Computers", label: "Computers" },
      { value: "Other", label: "Other" },
    ],
    BBA: [
      { value: "Marketing", label: "Marketing" },
      { value: "Management", label: "Management" },
      { value: "Other", label: "Other" },
    ],
    MBA: [
      {
        value: "Advertising/Mass Communication",
        label: "Advertising/Mass Communication",
      },
      { value: "Tourism and Hospitality", label: "Tourism and Hospitality" },
      { value: "Finance", label: "Finance" },
      { value: "Hospitality Management", label: "Hospitality Management" },
      { value: "HR/Industrial Relations", label: "HR/Industrial Relations" },
      { value: "Information Technology", label: "Information Technology" },
      { value: "International Business", label: "International Business" },
      { value: "Marketing", label: "Marketing" },
      { value: "Operations", label: "Operations" },
      { value: "Systems", label: "Systems" },
      { value: "Other", label: "Other" },
    ],
    "XII Standard": [
      { value: "Science", label: "Science" },
      { value: "Medical", label: "Medical" },
      { value: "Commerce", label: "Commerce" },
      { value: "Arts", label: "Arts" },
      { value: "Humanities", label: "Humanities" },
    ],
    "X Standard": [{ value: "Core", label: "Core" }],
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await axios.get(
          `${api}/student/profile/${userId}/education`
        );
        if (!response.data) {
          toast.error("sorry no details found");
          return;
        }
        setEducationDetails(response.data);

        console.log(degree);
        // console.log('useeffect');
        setClicked(false);
      } catch (error) {
        console.error("Error fetching education detailsvcc:", error);
      }
    };
    fetchEducation();
  }, [userId, clicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(score+gradeType)
    const educationData = {
      degree,
      fieldOfStudy:
        fieldOfStudy?.value !== "Other" ? fieldOfStudy?.value : otherField,
      institution,
      startYear,
      endYear,
      score: score + " " + gradeType,
    };

    console.log("educationData", educationData);

    if (
      !degree ||
      !fieldOfStudy ||
      !institution ||
      !startYear ||
      !endYear ||
      !score
    ) {
      toast.error("Please enter all fields");
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing education entry
        const response = await axios.put(
          `${api}/student/profile/${userId}/education/${editIndex}`,
          educationData
        );
        const updatedDetails = [...educationDetails];
        updatedDetails[editIndex] = response.data;
        setEducationDetails(updatedDetails);
        setIsEditing(false);
        toast.success("Details updated");
      } else {
        // Add new education entry
        const response = await axios.post(
          `${api}/student/profile/${userId}/education`,
          educationData
        );
        setEducationDetails([...educationDetails, response.data]);
        toast.success("Details added");
      }

      setClicked(true);
      setDegree("");
      setFieldOfStudy(null);
      setInstitution("");
      setStartYear("");
      setEndYear("");
      setScore("");
      setEditIndex(null);
      setIsEditing(false);
      // refreshData();
    } catch (error) {
      console.error("Error saving the education details:", error);
      toast.error("Failed to update details");
    }
  };

  const handleReset = () => {
    setDegree("");
    setFieldOfStudy(null);
    setInstitution("");
    setStartYear("");
    setEndYear("");
    setScore("");
    setEditIndex(null);
    setIsEditing(false);
  };

  const handleDegreeChange = (e) => {
    setDegree(e.target.value);
    setFieldOfStudy(null); // Clear field of study when degree changes
  };

  const handleDelete = async (index) => {
    try {
      console.log(educationDetails[index]);
      await axios.delete(`${api}/student/profile/${userId}/education/${index}`);
      setEducationDetails(educationDetails.filter((_, i) => i !== index));

      toast.success("Education details deleted");
    } catch (error) {
      console.error("Error deleting education details:", error);
      toast.error("Failed to delete details");
    }
  };

  const handleEdit = (index) => {
    const edu = educationDetails[index];
    console.log(edu);
    setIsEditing(true);
    setDegree(edu.degree);
    setFieldOfStudy({ value: edu.fieldOfStudy, label: edu.fieldOfStudy });
    setInstitution(edu.institution);
    setStartYear(edu.startYear);
    setEndYear(edu.endYear);
    setScore(edu.score);

    setEditIndex(index);
  };

  const handleGradeChange = (event) => {
    setGradeType(event.target.value);
  };

  const handleChangeScore = (e) => {
    const value = e.target.value;

    if (gradeType === "CGPA") {
      // Allow up to 10.00 with 2 decimal places
      if (/^\d{0,2}(\.\d{0,2})?$/.test(value)) {
        if (parseFloat(value) <= 10) {
          setScore(value);
          setScoreError(''); // Clear error if value is valid
        } else {
          setScore(''); // Reset the field
          setScoreError('CGPA should not exceed 10.00');
        }
      } else {
        setScore(''); // Reset the field for invalid input
        setScoreError('Enter a valid CGPA up to 2 decimal places');
      }
    } else if (gradeType === "%") {
      // Allow up to 100.00 with 2 decimal places
      if (/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
        if (parseFloat(value) <= 100) {
          setScore(value);
          setScoreError(''); // Clear error if value is valid
        } else {
          setScore(''); // Reset the field
          setScoreError('Percentage should not exceed 100');
        }
      } else {
        setScore(''); // Reset the field for invalid input
        setScoreError('Enter a valid percentage up to 2 decimal places');
      }
    }
  };

  console.log(degree);
  console.log(fieldOfStudy);

  return (
    <div className="container mx-auto p-4 border shadow-md mt-[68px] w-full lg:w-[80%]">
      <h2 className="text-xl font-outfit font-semibold flex justify-between">
        Education
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500  flex items-center space-x-1"
        >
          <span>Add</span> <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Form Fields for Education */}
          <select
            id="degree"
            value={degree}
            onChange={handleDegreeChange}
            className="border p-2 mb-2 w-full"
            required
          >
            <option value="">Select your degree / Course</option>
            {degreeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* <input
            type="text"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            placeholder="Field of study"
            className="border p-2 mb-2 w-full"
          /> */}
          {degree && (
            <Select
              options={fieldOfStudyMapping[degree] || []}
              value={fieldOfStudy}
              onChange={(selectedOption) => setFieldOfStudy(selectedOption)}
              placeholder="Select field of study"
              className="mb-2 w-full"
              required
            />
          )}
          {fieldOfStudy?.value === "Other" && (
            <input
              type="text"
              value={otherField}
              onChange={(e) => setOtherField(e.target.value)}
              placeholder="Please Specify Other"
              className="border p-2 mb-2 w-full"
              required
            />
          )}

          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="Institution"
            className="border p-2 mb-2 w-full"
            required
          />
          <div className="flex space-x-3 px-2 items-center mb-2 w-[50%] md:w-[40%]">
            <label htmlFor="" className="">
              Start Year
            </label>
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="border p-2  w-fit"
              required
            >
              <option value="">Select</option>
              {startYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4 md:space-x-4 px-2 items-center mb-2 w-[50%] md:w-[40%]">
            <label htmlFor="" className="">
              End Year
            </label>
            <select
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="border p-2 w-fit "
              required
            >
              <option value="">Select</option>
              {endYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4 md:space-x-4 px-2 items-center mb-2 w-[50%] md:w-[40%]">
            <label htmlFor="gradeSelect">Select Grade Type:</label>
            <select
              id="gradeSelect"
              value={gradeType}
              onChange={handleGradeChange}
              className="mx-3 border p-2 w-fit"
            >
              <option value="CGPA">CGPA</option>
              <option value="%">Percentage</option>
            </select>
          </div>
          <input
            type="text"
            placeholder={`Enter ${gradeType} scored`}
            value={score}
            onChange={handleChangeScore}
            className="border p-2 mb-2 w-full"
            required
          />
          {scoreError && <p className="text-red-500 text-sm mt-1">{scoreError}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              handleReset();
            }}
            className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-5  items-center mt-10">
          {educationDetails.length > 0 ? (
            educationDetails.map((edu, index) => (
              <div key={index} className="border p-5  ">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{edu?.degree}</h3>
                    <div className="space-x-5">
                      <FontAwesomeIcon
                        icon={faPen}
                        onClick={() => handleEdit(index)}
                        className="hover:scale-125 duration-300 text-blue-500 hover:cursor-pointer"
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDelete(index)}
                        className="hover:scale-125 duration-300 text-red-600 hover:cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="text-gray-600">
                    <p>{edu?.fieldOfStudy}</p>
                    <p>{edu?.institution}</p>
                    <p>Start Year: {edu?.startYear}</p>
                    <p>Year of Completion: {edu?.endYear}</p>
                    <p>Score: {edu?.score}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No details added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Education;
