import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../common/Spinner';
import api from '../common/server_url';
import { FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import ExperienceSlider from './common/ExperienceSlider';

const Applicants = () => {
  const { recruiterId, internshipId } = useParams(); // Get recruiterId and internshipId from URL
  const [applicants, setApplicants] = useState([]);
  const [skills, setSkills] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [locationFilter, setLocationFilter] = useState([]);
  const [expFilter, setExpFilter] = useState(0);
  const [skillsFilter, setSkillsFilter] = useState([]);
  // const [locationFilter,setLocationFilter]=useState([]);
  const statesAndUTs = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'Lakshadweep', label: 'Lakshadweep' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Puducherry', label: 'Puducherry' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Ladakh', label: 'Ladakh' }
  ];

  useEffect(() => {
    const fetchApplicantsAndInternship = async () => {
      try {
        // Fetch the internship details
        const internshipResponse = await axios.get(`${api}/recruiter/internship/${recruiterId}/getDetails/${internshipId}`);
        setInternship(internshipResponse.data);

        // Fetch the applicants
        const applicantsResponse = await axios.get(`${api}/recruiter/internship/${recruiterId}/applicants/${internshipId}`);
        setApplicants(applicantsResponse.data);

        setLoading(false);
        console.log(applicantsResponse.data);
      } catch (err) {
        console.error('Error fetching applicants or internship details:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchApplicantsAndInternship();
  }, [recruiterId, internshipId]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/api/get-skills`);
        const skillsData = response.data.map(skill => ({
          label: skill.name, // Map 'name' field to 'label'
          value: skill.name  // Map 'name' field to 'value'
        }));
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

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

  const filteredApplicants = applicants.filter((student) => {
    const matchesName = `${student.firstname} ${student.lastname}`.toLowerCase().includes(searchName.toLowerCase());

    // Check if any selected location matches student's homeLocation
    const matchesLocation =
      locationFilter.length === 0 || // If no location is selected, show all applicants
      locationFilter.some((location) => location.value.toLowerCase() === student.homeLocation.toLowerCase());

    let studentExperience;
    if (student.yearsOfExp === "fresher") {
      studentExperience = 0;
    } else if (student.yearsOfExp === "10+") {
      studentExperience = 10;
    } else {
      studentExperience = parseInt(student.yearsOfExp);
    }

    const matchesExperience = studentExperience >= expFilter;

    // Return true if all filters match
    const matchesSkills = skillsFilter.length === 0 || 
    skillsFilter.some((selectedSkill) =>
      student.skills.some((skill) => 
        skill.skillName.toLowerCase() === selectedSkill.value.toLowerCase()
      )
    );

// Return true if all filters match
return matchesName && matchesLocation && matchesExperience && matchesSkills;
  });



  // console.log(internship);
  // console.log(filteredApplicants);
  console.log('expFilter', expFilter);
  // console.log(locationFilter);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-5 mt-10 bg-gray-100 min-h-screen ">
      <h1 className="text-3xl font-bold text-center mb-8">Applicants for {internship.internshipName}</h1>
      <div className='flex'>
        <div className="bg-white shadow-md rounded-lg p-6 w-[60%] my-3 ml-20">
          {filteredApplicants.length === 0 ? (
            <p className="text-center text-gray-500">No applicants for this internship yet.</p>
          ) : (
            <div className="space-y-4 ">

              {filteredApplicants.map((student) => (
                <div key={student._id} className="p-4 border rounded-lg shadow-sm bg-gray-50 max-h-[400px] relative overflow-y-auto ">
                  <h2 className="text-2xl font-semibold mb-1 capitalize">
                    {student.firstname} {student.lastname}
                  </h2>
                  <h2 className='mb-2'>{student.homeLocation}</h2>

                  {!isOpen && <button onClick={() => setIsOpen(true)} className='absolute right-3 top-2 underline text-blue-400'>View Profile</button>}
                  {isOpen &&
                    <>
                      <button onClick={() => setIsOpen(false)} className='absolute right-3 top-2 underline text-blue-400'>Hide Profile</button>
                      <button className='absolute right-3 top-10 underlin rounded-lg bg-green-200 hover:bg-green-500 px-2 py-1'>Shortlist</button>
                    </>
                  }


                  {/* Skills */}


                  {/* Match Percentage */}
                  <div className="mb-2">
                    <p className={`font-semibold ${calculateMatchPercentage(student.skills, internship?.skills) < 20
                      ? 'text-red-500'
                      : calculateMatchPercentage(student.skills, internship?.skills) >= 20 &&
                        calculateMatchPercentage(student.skills, internship?.skills) <= 60
                        ? 'text-orange-300'
                        : calculateMatchPercentage(student.skills, internship?.skills) > 60 &&
                          calculateMatchPercentage(student.skills, internship?.skills) <= 90
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}>
                      {calculateMatchPercentage(student.skills, internship?.skills)}% Matched
                    </p>
                  </div>

                  <div className="mb-2">
                    <h3 className="font-semibold">Skills:</h3>
                    <div className="flex flex-wrap gap-3">
                      {student.skills.map((skill, index) => (
                        <p key={index} className="rounded-lg bg-gray-200 capitalize px-3 py-1">
                          {skill.skillName}
                        </p>
                      ))}
                    </div>
                  </div>

                  {isOpen &&
                    <div className='relative'>






                      {/* Education */}
                      <div className="mb-2">
                        <h3 className="font-semibold">Education:</h3>
                        {student.education.map((edu, index) => (
                          <p key={index} className='text-gray-600'>
                            {edu.degree} in {edu.fieldOfStudy} from {edu.institution} ({edu.startYear} - {edu.endYear})
                          </p>
                        ))}
                      </div>


                      {/* Work Experience */}
                      <div className="mb-2">
                        <h3 className="font-semibold">Work Experience:</h3>
                        {student.workExperience.map((work, index) => (
                          <p key={index} className='text-gray-600'>
                            {work.role} at {work.company} ({work.startDate} - {work.endDate})
                          </p>
                        ))}
                      </div>



                      {/* Certificates */}
                      <div className="mb-2">
                        <h3 className="font-semibold">Certificates:</h3>
                        {student.certificates.map((cert, index) => (
                          <p key={index} className='text-gray-600'>
                            {cert.title} - {cert.issuingOrganization} ({cert.issueDate})
                          </p>
                        ))}
                      </div>

                      {/* Personal Projects */}
                      <div className="mb-2">
                        <h3 className="font-semibold">Personal Projects:</h3>
                        {student.personalProjects.map((project, index) => (
                          <p key={index} className='text-gray-600'>
                            {project.title} - {project.description}
                          </p>
                        ))}
                      </div>

                      {/* Portfolio Links */}
                      <div className="mb-2">
                        <h3 className="font-semibold">Portfolio Links:</h3>
                        {student.portfolioLink.map((link, index) => (
                          <p key={index}>
                            {link.linkType}: <a href={link.linkUrl} className="text-blue-500 hover:underline">{link.linkUrl}</a>
                          </p>
                        ))}
                        <p className="text-gray-700 mb-1"><strong>Email:</strong> {student.email}</p>
                      </div>
                      {/* Resume Link */}
                      <div className="mb-2">
                        <h3 className="font-semibold">Resume:</h3>
                        <a
                          href={`data:${student.resume.contentType};base64,${btoa(
                            String.fromCharCode(...new Uint8Array(student.resume.data.data))
                          )}`}
                          download={student.resume.filename}
                          className="text-blue-500 hover:underline"
                        >
                          Download Resume
                        </a>
                      </div>
                      {/* <div>
                        <h3 className="font-semibold">Current Location : <span className='text-gray-600 font-normal'>{student.homeLocation}</span></h3>
                      </div> */}
                    </div>
                  }
                </div>
              ))}
            </div>
          )}
        </div>

        <div className=' w-[20%] mt-0 px-6 h-screen fixed right-20 shadow-xl border-t py-6 overflow-y-hidden bg-white'>

          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
          />
          <h1 className='text-center font-extrabold text-xl tracking-widest'>Filters</h1>


          <button className='absolute right-4 top-20 text-blue-400 underline'>Reset filters</button>
          <div className="flex flex-col space-y-4">


            <Select
              isMulti
              options={statesAndUTs}
              values={locationFilter}
              onChange={(values) => setLocationFilter(values)}
              placeholder="Select a location"
              searchable={true}
              className='w-full shadow-md '

            />



            <div>
              <ExperienceSlider expFilter={expFilter} setExpFilter={setExpFilter} />
            </div>

            <Select
              isMulti
              options={skills}
              values={skillsFilter}
              onChange={(values) => setSkillsFilter(values)}
              placeholder="Select the skills"
              searchable={true}
              className='w-full shadow-md '

            />

            <label className="flex items-center space-x-2">
              <input type="text" placeholder='e.g MBA' />
              <span className="">Academic Background</span>
            </label>

            <div>
              slide for matching
            </div>

            <div>
              Graduation year
            </div>

            <div>
              Gender
            </div>
          </div>

        </div>
      </div>



    </div>
  );
};

export default Applicants;
