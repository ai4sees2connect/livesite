import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../common/server_url';
import Spinner from '../common/Spinner';
import getUserIdFromToken from './auth/authUtilsRecr';
import TimeAgo from '../common/TimeAgo';
import { 
  FaChevronRight, FaClock, FaMapMarkerAlt, FaBriefcase, FaVenusMars, 
  FaClipboardCheck, FaEnvelope, FaQuestionCircle, FaCalendarCheck, 
  FaExclamationCircle, FaCheckCircle, FaUserCircle, FaGraduationCap, 
  FaAward, FaFileDownload, FaFileAlt, FaDownload, FaSpinner 
} from 'react-icons/fa';

const ApplicationDetails = () => {
  const { studentId, internshipId } = useParams();
  const [studentDetails, setStudentDetails] = useState(null);
  const [internshipDetails, setInternshipDetails] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [resumeFileName, setResumeFileName] = useState(null);
  const recruiterId = getUserIdFromToken();

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/internship/${studentId}/${internshipId}/application-details`);
        setStudentDetails(response.data);

        const secondResponse = await axios.get(`${api}/recruiter/internship/${recruiterId}/getDetails/${internshipId}`);
        setInternshipDetails(secondResponse.data);
      } catch (error) {
        console.error('Error fetching application details:', error);
      }
    };

    fetchApplicationDetails();
  }, [studentId, internshipId]);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${api}/student/resume/${studentId}`, {
          responseType: 'blob',
        });

        const filename = response.headers['content-disposition']
          .split('filename=')[1]
          .replace(/"/g, '');

        const fileURL = URL.createObjectURL(response.data);
        setResumeUrl(fileURL);
        setResumeFileName(filename);
        setResumeLoading(false);
      } catch (error) {
        console.log('Error fetching student resume:', error);
        setResumeLoading(false);
      }
    };

    fetchResume();
  }, [studentId]);

  const calculateMatchPercentage = (studentSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0;

    const sanitizeSkill = (skill) => {
      return skill
        .toLowerCase()
        .replace(/[\.\-]/g, '')
        .split(/\s+/);
    };

    const matchingSkills = studentSkills.filter(studentSkill => {
      return requiredSkills.some(requiredSkill => {
        const studentSkillWords = sanitizeSkill(studentSkill.skillName);
        const requiredSkillWords = sanitizeSkill(requiredSkill);

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
  } = studentDetails;

  const { aboutText, appliedAt, assessmentAns, availability } = studentDetails.appliedInternships[0];
  const { assessment } = internshipDetails;

  const handleDownload = (file) => {
    const byteCharacters = atob(file.data);
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
    
    URL.revokeObjectURL(url);
  };

  // Match Percentage Styling
  const matchPercentage = calculateMatchPercentage(skills, internshipDetails.skills);
  let matchColor = "bg-red-100 text-red-700 border border-red-200";
  if (matchPercentage >= 20 && matchPercentage <= 60) matchColor = "bg-orange-100 text-orange-700 border border-orange-200";
  else if (matchPercentage > 60 && matchPercentage <= 90) matchColor = "bg-yellow-100 text-yellow-700 border border-yellow-200";
  else if (matchPercentage > 90) matchColor = "bg-green-100 text-green-700 border border-green-200";

  return (
    <div className="min-h-screen bg-[var(--bg-light-color)] py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center flex-wrap gap-2 text-sm text-[var(--text-light)] mb-4 max-w-5xl mx-auto">
        <Link to={`/recruiter/dashboard/${recruiterId}`} className="hover:text-[var(--primary-color)] transition-colors font-medium">Dashboard</Link>
        <FaChevronRight className="text-xs" />
        <Link to={`/recruiter/dashboard/${recruiterId}/applicants/${internshipId}`} className="hover:text-[var(--primary-color)] transition-colors font-medium">Applications Received</Link>
        <FaChevronRight className="text-xs" />
        <Link to={`/recruiter/dashboard/${recruiterId}/applicants/${internshipId}`} className="hover:text-[var(--primary-color)] transition-colors font-medium truncate max-w-[150px]">{internshipDetails.internshipName}</Link>
        <FaChevronRight className="text-xs" />
        <span className="text-[var(--text-color)] font-semibold">{firstname} {lastname}</span>
      </nav>

      {/* Page Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] max-w-5xl mx-auto my-8">
        Application for <span className="text-[var(--primary-color)]">{internshipDetails.internshipName}</span>
      </h1>

      {/* Card 1: Basic Info & Match */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-color)] p-6 max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${matchColor}`}>
            {matchPercentage}% Matched
          </div>
          <p className="text-sm text-[var(--text-light)] flex items-center gap-1.5">
            <FaClock className="text-[var(--icon-color)]" /> Applied {TimeAgo(appliedAt)}
          </p>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--icon-bg-color)] flex items-center justify-center text-2xl font-bold text-[var(--primary-color)] flex-shrink-0">
            {firstname.charAt(0)}{lastname.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--text-color)] capitalize">{firstname} {lastname}</h2>
            <p className="text-[var(--text-light)] flex items-center gap-1.5 mt-1 flex-wrap">
              <FaMapMarkerAlt className="text-[var(--icon-color)] text-xs" /> 
              {homeLocation.city}, {homeLocation.state}, {homeLocation.country}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              <span className="flex items-center gap-1.5 text-[var(--text-light)] bg-[var(--bg-light-color)] px-2.5 py-1 rounded-lg">
                <FaBriefcase className="text-[var(--icon-color)] text-xs" /> {yearsOfExp} Years Exp
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-light)] bg-[var(--bg-light-color)] px-2.5 py-1 rounded-lg">
                <FaVenusMars className="text-[var(--icon-color)] text-xs" /> {gender || 'Not provided'}
              </span>
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${availability === 'Yes! Will join Immediately' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                {availability === 'Yes! Will join Immediately' ? <FaCheckCircle /> : <FaExclamationCircle />}
                {availability === 'Yes! Will join Immediately' ? 'Immediate Joiner' : 'Not Immediate'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border-color)]">
          <h3 className="text-sm font-semibold text-[var(--text-light)] uppercase tracking-wide mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-[var(--icon-bg-color)] text-[var(--primary-color)] text-xs font-semibold rounded-full">
                {skill.skillName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: Availability & Assessment */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-color)] p-6 max-w-5xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-[var(--text-color)] mb-6 flex items-center gap-2">
          <FaClipboardCheck className="text-[var(--primary-color)]" /> Availability & Assessment
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-light)] uppercase tracking-wide mb-2 flex items-center gap-2">
              <FaEnvelope className="text-[var(--icon-color)]" /> Cover Letter
            </h3>
            <p className="text-[var(--text-color)] bg-[var(--bg-light-color)] p-4 rounded-xl border border-[var(--border-color)] leading-relaxed">
              {aboutText}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-light)] uppercase tracking-wide mb-2 flex items-center gap-2">
              <FaQuestionCircle className="text-[var(--icon-color)]" /> Assessment
            </h3>
            <div className="bg-[var(--bg-light-color)] p-4 rounded-xl border border-[var(--border-color)] space-y-3">
              <p className="text-[var(--text-color)]"><span className="font-semibold">Ques:</span> {assessment}</p>
              <p className="text-[var(--text-color)] pt-3 border-t border-[var(--border-color)]"><span className="font-semibold">Ans:</span> {assessmentAns}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-light)] uppercase tracking-wide mb-2 flex items-center gap-2">
              <FaCalendarCheck className="text-[var(--icon-color)]" /> Availability
            </h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${availability !== 'Yes! Will join Immediately' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
              {availability !== 'Yes! Will join Immediately' ? <FaExclamationCircle /> : <FaCheckCircle />}
              {availability !== 'Yes! Will join Immediately' ? availability : 'Immediate Joiner'}
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Profile Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-color)] p-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-xl font-bold text-[var(--text-color)] mb-6 flex items-center gap-2">
          <FaUserCircle className="text-[var(--primary-color)]" /> Profile Details
        </h2>

        <div className="space-y-8">
          {/* Education */}
          <div>
            <h3 className="text-base font-bold text-[var(--text-color)] mb-3 flex items-center gap-2">
              <FaGraduationCap className="text-[var(--primary-color)]" /> Education
            </h3>
            {education.length > 0 ? (
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index} className="bg-[var(--bg-light-color)] p-4 rounded-xl border border-[var(--border-color)]">
                    <p className="font-semibold text-[var(--text-color)]">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-sm text-[var(--text-light)] mt-1">{edu.institution} ({edu.startYear} - {edu.endYear})</p>
                    <p className="text-sm font-medium text-[var(--primary-color)] mt-1">{edu.score} {edu.gradeType}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-light)] text-sm">No education details provided</p>
            )}
          </div>

          {/* Work Experience */}
          <div>
            <h3 className="text-base font-bold text-[var(--text-color)] mb-3 flex items-center gap-2">
              <FaBriefcase className="text-[var(--primary-color)]" /> Work Experience
            </h3>
            {workExperience.length > 0 ? (
              <div className="space-y-3">
                {workExperience.map((exp, index) => (
                  <div key={index} className="bg-[var(--bg-light-color)] p-4 rounded-xl border border-[var(--border-color)]">
                    <p className="font-semibold text-[var(--text-color)]">{exp.role} at {exp.company}</p>
                    <p className="text-sm text-[var(--text-light)] mt-1">{exp.startDate} - {exp.endDate}</p>
                    <p className="text-sm text-[var(--text-color)] mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-light)] text-sm">No work experience details provided</p>
            )}
          </div>

          {/* Certificates */}
          <div>
            <h3 className="text-base font-bold text-[var(--text-color)] mb-3 flex items-center gap-2">
              <FaAward className="text-[var(--primary-color)]" /> Certificates
            </h3>
            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert, index) => (
                  <div key={index} className="bg-[var(--bg-light-color)] p-4 rounded-xl border border-[var(--border-color)]">
                    <p className="font-semibold text-[var(--text-color)]">{cert.title}</p>
                    <p className="text-sm text-[var(--text-light)] mt-1">{cert.issuingOrganization} (Issued on: {cert.issueDate})</p>
                    <p className="text-sm text-[var(--text-color)] mt-2">{cert.description}</p>
                    {cert.fileUpload && (
                      <button
                        onClick={() => handleDownload(cert.fileUpload)}
                        className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--primary-color)] hover:text-[var(--button-hover-color)] font-semibold bg-white px-3 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--primary-color)] transition-colors"
                      >
                        <FaFileDownload /> Download Certificate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-light)] text-sm">No certificates provided</p>
            )}
          </div>

          {/* Resume & Email */}
          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-[var(--border-color)]">
            <div>
              <h3 className="text-base font-bold text-[var(--text-color)] mb-3 flex items-center gap-2">
                <FaFileAlt className="text-[var(--primary-color)]" /> Resume
              </h3>
              {resumeLoading ? (
                <div className="flex items-center gap-2 text-[var(--text-light)]">
                  <FaSpinner className="animate-spin text-[var(--primary-color)] h-5 w-5" />
                  <span className="text-sm">Loading Resume...</span>
                </div>
              ) : resumeUrl ? (
                <a
                  href={resumeUrl}
                  download={resumeFileName}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--button-color)] text-white rounded-lg font-semibold hover:bg-[var(--button-hover-color)] transition-colors shadow-sm text-sm"
                >
                  <FaDownload /> Download Resume
                </a>
              ) : (
                <p className="text-[var(--text-light)] text-sm">No resume found.</p>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-color)] mb-3 flex items-center gap-2">
                <FaEnvelope className="text-[var(--primary-color)]" /> Contact Email
              </h3>
              <p className="text-[var(--text-color)] bg-[var(--bg-light-color)] p-3 rounded-lg border border-[var(--border-color)] text-sm font-medium break-all">
                {email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;