import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import getUserIdFromToken from './auth/authUtilsRecr'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../common/server_url'
import Select from 'react-select';

const RecPosting = () => {
  const [formData, setFormData] = useState({
    internshipName: '',
    internshipType: '',
    internLocation: '',
    numberOfOpenings: '',
    stipend: '',
    duration: '',
    description: '',
    assessment:'',
    skills: [],
  });
  // const [Location,setLocation]=useState('');
  // const [mode, setMode]=useState('');

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const userId = getUserIdFromToken();
  const [formKey, setFormKey] = useState(0);
  const [selectedProfile,setSelectedProfile] = useState(null);
  const [selectedPerks,setSelectedPerks] = useState([]);
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
    "Web Development"
  ];

  const perks=["Letter of recommendation", "Flexible work hours", "Certificate", "Informal dress code","5 days a week", "Free snacks & beverages", "Job offer"];


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

  const handleAssessmentChange=(value)=>{
    setFormData({
      ...formData,
      assessment: value,
    });
    console.log(formData.assessment);
  }

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
    console.log('This is a skill set', selectedOptions);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillSet = selectedSkills.map(skill => {
      return skill.value;
    })
    const perksSet = selectedPerks.map(perk=>{
      return perk.value
    });

    const postData = {
      internshipName: formData.internshipName,
      internshipType: formData.internshipType,
      internLocation: formData.internLocation,
      numberOfOpenings: formData.numberOfOpenings,
      jobProfile:selectedProfile.value,
      stipend: formData.stipend,
      duration: formData.duration,
      description: formData.description,
      assessment:formData.assessment,
      skills: skillSet,
      perks: perksSet,

    }
    console.log(postData);
    if (!postData.internshipName || !postData.internshipType || !postData.assessment || postData.perks.length==0 || !postData.stipend || !postData.jobProfile || !postData.duration || !postData.numberOfOpenings || !postData.description || postData.skills.length == 0) {
      toast.error('Please enter all fields');
      return;
    }

    if (postData.internshipType === 'Remote') {
      // setFormData({...formData,internshipType: 'Work from Home'})
      postData.internshipType = 'Work from Home';
    }
    else if (postData.internshipType === 'Office') {
      postData.internshipType = 'Work from Office';
    }

    console.log('sending this data', postData)
    try {
      // Make the POST request to your backend
      const response = await axios.post(`${api}/recruiter/internship/post/${userId}`, postData);

      if (response.data.success) {
        toast.success('Internship posted successfully');
        console.log('Response:', response.data);
        setFormData({
          internshipName: '',
          internshipType: '',
          internLocation: '', // Reset internLocation
          numberOfOpenings: '',
          stipend: '',
          duration: '',
          description: '',
          assessment:'',
          skills: [],
        });
        // setSkill('');
        setSelectedProfile(null);
        setSelectedPerks([]);
        setFormKey(formKey + 1);
        console.log(formData);
        return;
      }
      else {
        toast.error('some error occured');
        return;
      }






    } catch (error) {
      // Handle errors
      console.error('There was an error posting the internship:', error);
    }
  };
console.log(selectedProfile)
console.log(selectedPerks);

  return (
    <div className="border border-gray-300 mt-24 w-[45%]  mx-auto bg-gray-100 p-6 rounded-lg shadow-lg mb-7 ">
      <h2 className="text-2xl font-bold mb-6 text-center">Post an Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium">Internship Name:</label> */}
          <input
            type="text"
            name="internshipName"
            value={formData.internshipName}
            onChange={handleChange}
            className="p-2 border shadow-md border-gray-300 rounded-md"
            placeholder='Internship Title'
          />
        </div>

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium">Internship Type:</label> */}
          <select
            name="internshipType"
            value={formData.internshipType}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md shadow-md"

          >
            <option value="">Type of Internship</option>
            <option value="Remote">Remote</option>
            <option value="Office">Office</option>
          </select>
        </div>

        {
          formData.internshipType === 'Office' && <div className='flex flex-col'>
            <input type="text"
              name="internLocation"
              value={formData.internLocation}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md shadow-md'
              placeholder='Enter Location e.g Delhi or Mumbai' />

          </div>
        }
        <div className="flex flex-col">
          <Select
            value={selectedProfile}
            onChange={(values) => setSelectedProfile(values)}
            options={jobProfiles.map(job => (
              {
                value: job,
                label: job
              }
            ))}
            placeholder="Category of Internship"
            className='w-full mb-3 shadow-md'
          />
        </div>

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium"></label> */}
          <input
            type="number"
            name="numberOfOpenings"
            value={formData.numberOfOpenings}
            onChange={handleChange}

            className="p-2 border border-gray-300 rounded-md shadow-md"
            placeholder='Number of Openings'
          />
        </div>

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium">Stipend</label> */}
          <input
            type="number"
            name="stipend"
            value={formData.stipend}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md shadow-md"
            placeholder='Stipend'
          />
        </div>
        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium">Stipend</label> */}
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md shadow-md"
            placeholder='Enter duration in months'
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium">Skills:</label>
          <div className="flex items-center">
            <Select
              isMulti
              value={selectedSkills}
              onChange={handleSkillsChange}
              options={skills}
              placeholder="Select or type skills "
              className='w-60 shadow-md'
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium">Perks and Benefits</label>
          <div className="flex items-center">
            <Select
              isMulti
              value={selectedPerks}
              onChange={(values)=>setSelectedPerks(values)}
              options={perks.map(perk=>({
                value:perk,
                label:perk
              }))}
              placeholder="Select perk"
              className='w-60 shadow-md'
            />
          </div>
        </div>

        

        <div className="flex flex-col  h-[320px]">
          <label className="mb-2 font-medium">Requirements</label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            className="p-2 rounded-md h-[200px]"
            theme="snow"
            placeholder='Enter the requirements....'

          />

        </div>

        <div className="flex flex-col   h-[400px]">
          <label className="mb-2 font-medium">Assessment Question</label>
          <input
            type="text"
            name="assessment"
            value={formData.assessment}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md shadow-md"
            placeholder='Enter Question for applicant'
          />

        </div>



        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Post Internship
        </button>
      </form>
    </div>
  );
};

export default RecPosting;
