import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../common/server_url';
import Spinner from '../common/Spinner';
// import { useRecruiter } from './context/recruiterContext';
import getUserIdFromToken from './auth/authUtilsRecr';
import TimeAgo from '../common/TimeAgo'

const ApplicationDetails = () => {
  const { studentId, internshipId } = useParams(); // Get studentId and internshipId from URL
  const [studentDetails, setStudentDetails] = useState(null);
  const [internshipDetails, setInternshipDetails] = useState(null);
  // const {recruiter}=useRecruiter();
  const recruiterId = getUserIdFromToken();
  console.log(recruiterId);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        // Make a GET request to your backend API
        const response = await axios.get(`${api}/recruiter/internship/${studentId}/${internshipId}/application-details`);
        // console.log(response.data);
        setStudentDetails(response.data);
        console.log(response.data);

        const secondResponse = await axios.get(`${api}/recruiter/internship/${recruiterId}/getDetails/${internshipId}`)
        setInternshipDetails(secondResponse.data);

      } catch (error) {
        console.error('Error fetching application details:', error);
      }
    };

    // Fetch the application details when the component mounts
    fetchApplicationDetails();
  }, [studentId, internshipId]); // Run effect when studentId or internshipId changes

  const calculateMatchPercentage = (studentSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0;

    const sanitizeSkill = (skill) => {
      return skill
        .toLowerCase()
        .replace(/[\.\-]/g, '') // Remove dots and hyphens
        .split(/\s+/); // Split into words
    };

    const matchingSkills = studentSkills.filter(studentSkill => {
      return requiredSkills.some(requiredSkill => {
        const studentSkillWords = sanitizeSkill(studentSkill.skillName);
        const requiredSkillWords = sanitizeSkill(requiredSkill);

        // Check if all words in requiredSkill match any word in studentSkill
        return requiredSkillWords.every(word =>
          studentSkillWords.includes(word)
        );
      });
    });

    const matchPercentage = (matchingSkills.length / requiredSkills.length) * 100;
    return Math.round(matchPercentage);
  };


  if (!studentDetails || !internshipDetails) {
    return <Spinner />;
  }

  // Destructure the necessary details from studentDetails
  const {
    firstname,
    lastname,
    email,
    gender,
    homeLocation,
    yearsOfExp,
    education,
    workExperience,
    certificates,
    skills,
    resume
  } = studentDetails;

  const { aboutText, appliedAt, assessmentAns, availability, } = studentDetails.appliedInternships[0]
  const { assessment } = internshipDetails;

  const handleDownload = (file) => {
    console.log('this is file', file);
    
    // Decode base64 string to binary
    const byteCharacters = atob(file.data); // Decode base64 data
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.contentType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    link.click();
    
    // Clean up the URL object after download
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <h1 className='mt-20 text-sm sm:text-base text-gray-600 mx-auto w-[96%] sm:w-[70%] font-[500] capitalize'>Dashboard &gt; Applications Received &gt; <Link to={`/recruiter/dashboard/${recruiterId}/applicants/${internshipId}`}>{internshipDetails.internshipName}</Link> &gt; {firstname} {lastname}</h1>
      <h1 className="text-lg  sm:text-2xl font-semibold mt-6 mx-auto w-[95%] md:w-[70%] text-gray-700">Application for {internshipDetails.internshipName}</h1>
      <div className="">


        <div className='border border-gray-300 mt-5 mx-auto p-6 w-[90%] md:w-[70%] rounded-lg shadow-md '>
          <div className="mb-4">
          <div className="mb-2 flex justify-between relative">
            
                <div className={`font-semibold rounded-md p-2 w-full ${calculateMatchPercentage(skills, internshipDetails.skills) < 20
                  ? 'text-red-500 bg-gradient-to-r from-red-100 to-white'
                  : calculateMatchPercentage(skills, internshipDetails.skills) >= 20 &&
                    calculateMatchPercentage(skills, internshipDetails.skills) <= 60
                    ? 'text-orange-300 bg-gradient-to-r from-orange-100 to-white'
                    : calculateMatchPercentage(skills, internshipDetails.skills) > 60 &&
                      calculateMatchPercentage(skills, internshipDetails.skills) <= 90
                      ? 'text-yellow-600 bg-gradient-to-r from-yellow-100 to-white'
                      : 'text-green-500 bg-gradient-to-r from-green-100 to-white'
                  }`}>
                  {calculateMatchPercentage(skills, internshipDetails.skills)}% Matched
                </div>
                <div className=' absolute right-3 top-2 text-gray-600 text-sm font-[500]'>
                  Applied {TimeAgo(appliedAt)}
                </div>
                
              </div>

              <p className="capitalize text-2xl font-bold">{`${firstname} ${lastname}`}</p>

            <p className='text-gray-600'>{homeLocation} ({availability === 'Yes! Will join Immediately' ? 'can join immediately' : 'not an immediate joiner'})</p>
            <p className='text-gray-600'>Exp: {yearsOfExp}</p>
          </div>

          <div className="mb-4">
            <p className="text-lg font-medium">Gender:</p>
            <p className="text-gray-700">{gender || 'Not provided'}</p>
          </div>

          {/* Skills */}
          <div className='flex space-x-2 '>
            <span className='text-gray-600'>Skill(s): </span>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <p key={index} className="text-sm sm:text-base rounded-lg bg-blue-200 capitalize px-2 md:px-3 py-1">
                  {skill.skillName}
                </p>
              ))}
            </div>
          </div>
        </div>

        <h1 className='w-[90%] md:w-[70%] mx-auto mt-8 text-2xl font-semibold'>Availabilty & Assessment </h1>
        <div className='border border-gray-300 mx-auto p-6 w-[90%] md:w-[70%] rounded-lg shadow-md '>

          <div className="mb-4">
            <p className="text-lg font-medium">Cover Letter</p>
            <p className="text-sm sm:text-base text-gray-700">{aboutText}</p>
          </div>

          <div className="mb-4">
            <p className="text-lg font-medium">Assessment </p>
            <p className='text-sm sm:text-base text-gray-700'>Ques: {assessment}</p>
            <p className="text-sm sm:text-base text-gray-700 ">Ans: <span className='ml-2'>{assessmentAns}</span></p>
          </div>


        </div>
        <h1 className='w-[90%] md:w-[70%] mx-auto mt-8 text-2xl font-semibold'>Profile</h1>
        <div className='border border-gray-300  mx-auto p-6 w-[90%] md:w-[70%] rounded-lg shadow-md mb-10 '>

          {/* Education Details */}

          <div className="mb-6">
            <p className="text-lg font-medium">Education:</p>
            {education.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {education.map((edu, index) => (
                  <li key={index} className='text-sm sm:text-base'>
                    {edu.degree}, {edu.fieldOfStudy} - {edu.institution} ({edu.startYear} - {edu.endYear})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 text-sm sm:text-base">No education details provided</p>
            )}
          </div>

          {/* Work Experience */}
          <div className="mb-6">
            <p className="text-lg font-medium">Work Experience:</p>
            {workExperience.length > 0 ? (
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-700">
                {workExperience.map((exp, index) => (
                  <li key={index}>
                    {exp.role} at {exp.company} ({exp.startDate} - {exp.endDate})
                    <br />
                    <span className='ml-5 break-words'>Desc: {exp.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No work experience details provided</p>
            )}
          </div>

          {/* Certificates */}
          <div className="mb-6">
            <p className="text-lg font-medium">Certificates:</p>
            {certificates.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {certificates.map((cert, index) => (
                  <li key={index} className='text-sm sm:text-base'>
                    {cert.title} - {cert.issuingOrganization} (Issued on: {cert.issueDate})
                    <br />
                    <span className='ml-5'>Desc: {cert.description}</span>
                    <br />
                    {cert.fileUpload && (
                      <button
                        onClick={() => handleDownload(cert.fileUpload)}
                        className="text-blue-500 underline ml-5"
                      >
                        Download Certificate
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No certificates provided</p>
            )}
          </div>

          {/* Resume */}
          {resume && resume.filename && (
            <>
              <p className="text-lg font-medium">Resume:</p>
              <div className="mb-6">
                <a
                  href={`data:${resume.contentType};base64,${resume.data}`}
                  download={resume.filename}
                  className=" text-blue-500 px-4 py-2 hover:underline transition-all"
                >
                  Download Resume
                </a>
              </div>
            </>
          )}

          <div className="mb-4">
            <p className="text-lg font-medium">Email:</p>
            <p className="text-gray-700">{email}</p>
          </div>

        </div>




      </div>
    </>
  );
};

export default ApplicationDetails;
