import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../common/server_url';
import Spinner from '../common/Spinner';
// import { useRecruiter } from './context/recruiterContext';
import getUserIdFromToken from './auth/authUtilsRecr';

const ApplicationDetails = () => {
  const { studentId, internshipId } = useParams(); // Get studentId and internshipId from URL
  const [studentDetails, setStudentDetails] = useState(null);
  const [internshipDetails, setInternshipDetails] = useState(null);
  // const {recruiter}=useRecruiter();
  const recruiterId=getUserIdFromToken();
  console.log(recruiterId);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        // Make a GET request to your backend API
        const response = await axios.get(`${api}/recruiter/internship/${studentId}/${internshipId}/application-details`);
        // console.log(response.data);
        setStudentDetails(response.data);
        console.log(response.data);

        const secondResponse=await axios.get(`${api}/recruiter/internship/${recruiterId}/getDetails/${internshipId}`)
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
  const {assessment}=internshipDetails;

  return (
    <>
      <h1 className='mt-20 text-gray-600'>Dashboard &gt; Applications(shortlisted) &gt; {firstname} {lastname}</h1>
      <h1 className="text-2xl font-semibold mt-6 mx-auto w-[70%]">Application Details</h1>
      <div className="">


        <div className='border border-gray-300 mt-5 mx-auto p-6 w-[70%] rounded-lg shadow-md '>
          <div className="mb-4">
            <div className='flex justify-between'>
            <p className="capitalize text-2xl font-bold">{`${firstname} ${lastname}`}</p>
            <div className="mb-2">
                    <p className={`font-semibold ${calculateMatchPercentage(skills, internshipDetails.skills) < 20
                      ? 'text-red-500'
                      : calculateMatchPercentage(skills, internshipDetails.skills) >= 20 &&
                        calculateMatchPercentage(skills, internshipDetails.skills) <= 60
                        ? 'text-orange-300'
                        : calculateMatchPercentage(skills, internshipDetails.skills) > 60 &&
                          calculateMatchPercentage(skills, internshipDetails.skills) <= 90
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}>
                      {calculateMatchPercentage(skills, internshipDetails.skills)}% Matched
                    </p>
                  </div>
            </div>
            <p className='text-gray-600'>{homeLocation} ({availability === 'Yes! Will join Immediately' ? 'can join immediately' : 'not an immediate joiner'})</p>
            <p className='text-gray-600'>{yearsOfExp}</p>
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
                <p key={index} className="rounded-lg bg-blue-200 capitalize px-3 py-1">
                  {skill.skillName}
                </p>
              ))}
            </div>
          </div>
        </div>

        <h1 className='w-[70%] mx-auto mt-8 text-2xl font-semibold'>Availabilty & Assessment </h1>
        <div className='border border-gray-300 mx-auto p-6 w-[70%] rounded-lg shadow-md '>

          <div className="mb-4">
            <p className="text-lg font-medium">Cover Letter</p>
            <p className="text-gray-700">{aboutText}</p>
          </div>

          <div className="mb-4">
            <p className="text-lg font-medium">Assessment </p>
            <p className='text-gray-700'>Ques: {assessment}</p>
            <p className="text-gray-700 ">Ans: <span className='ml-3'>{assessmentAns}</span></p>
          </div>


        </div>
        <h1 className='w-[70%] mx-auto mt-8 text-2xl font-semibold'>Profile</h1>
        <div className='border border-gray-300  mx-auto p-6 w-[70%] rounded-lg shadow-md '>

          {/* Education Details */}

          <div className="mb-6">
            <p className="text-lg font-medium">Education:</p>
            {education.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {education.map((edu, index) => (
                  <li key={index}>
                    {edu.degree}, {edu.fieldOfStudy} - {edu.institution} ({edu.startYear} - {edu.endYear})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No education details provided</p>
            )}
          </div>

          {/* Work Experience */}
          <div className="mb-6">
            <p className="text-lg font-medium">Work Experience:</p>
            {workExperience.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {workExperience.map((exp, index) => (
                  <li key={index}>
                    {exp.role} at {exp.company} ({exp.startDate} - {exp.endDate})
                    <br />
                    <span className='ml-5'>Desc: {exp.description}</span>
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
                  <li key={index}>
                    {cert.title} - {cert.issuingOrganization} (Issued on: {cert.issueDate})
                    <br />
                    <span className='ml-5'>Desc: {cert.description}</span>
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
