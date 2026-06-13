import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import getUserIdFromToken from '../../student/auth/authUtils.js';
import { FaHome, FaFileContract, FaUserGraduate, FaBuilding, FaCheckCircle, FaShieldAlt, FaClock, FaEnvelope } from 'react-icons/fa';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const idFromToken = getUserIdFromToken();
  const token = localStorage.getItem("token");

  const handleUserNavigate = async () => {
    const decoded = jwtDecode(token);
    const userType = decoded.userType;
    if (userType === 'Student') {
      navigate(`/student/dashboard/${idFromToken}`);
      return;
    }
    if (userType === 'Recruiter') {
      navigate(`/recruiter/dashboard/${idFromToken}`);
      return;
    }
  };

  const studentTerms = [
    {
      icon: <FaCheckCircle />,
      title: "Accuracy Matters",
      description: "Provide accurate and complete information in your profile and applications. Misrepresentation can lead to account suspension."
    },
    {
      icon: <FaClock />,
      title: "Timely Responses",
      description: "If you receive communication from an employer, respond within 72 hours. Accepting an offer means committing to join the role on time."
    },
    {
      icon: <FaShieldAlt />,
      title: "Professional Conduct",
      description: "Maintain professionalism in all communications. Offensive content or behavior is not tolerated."
    },
    {
      icon: <FaFileContract />,
      title: "Job Details",
      description: "Read job descriptions thoroughly before applying. Irrelevant applications may result in penalties."
    },
    {
      icon: <FaShieldAlt />,
      title: "Data Usage",
      description: "Your information may be shared with employers to facilitate the hiring process. We'll keep your data secure!"
    },
    {
      icon: <FaEnvelope />,
      title: "Report Suspicious Activity",
      description: "If you notice anything unusual, report it to us immediately."
    },
    {
      icon: <FaEnvelope />,
      title: "Account Notifications",
      description: "By registering, you agree to receive updates via email and SMS, but you can opt out at any time."
    }
  ];

  const employerTerms = [
    {
      icon: <FaCheckCircle />,
      title: "Authorization Required",
      description: "Ensure you're authorized to post jobs for your organization. You're responsible for any unauthorized postings."
    },
    {
      icon: <FaFileContract />,
      title: "Accurate Listings",
      description: "Provide complete and truthful job descriptions. Misleading information can lead to account suspension."
    },
    {
      icon: <FaBuilding />,
      title: "Job Visibility",
      description: "Your job listings may be shared on our social media and partner sites to increase visibility."
    },
    {
      icon: <FaClock />,
      title: "Professional Communication",
      description: "Interact with applicants professionally and respond to inquiries promptly. Address any complaints within 72 hours."
    },
    {
      icon: <FaShieldAlt />,
      title: "Data Protection",
      description: "Use applicant data solely for hiring purposes. Sharing or selling this data is strictly prohibited."
    },
    {
      icon: <FaFileContract />,
      title: "Payment Terms",
      description: "All payments for services must be made in advance. Refund policies apply as per our guidelines."
    },
    {
      icon: <FaCheckCircle />,
      title: "Policy Compliance",
      description: "Familiarize yourself with our prohibited job types and ensure compliance to maintain your account."
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-light-color)' }}>
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
            InternsNest
          </div>
          <div className="flex space-x-6">
            {token && (
              <button onClick={handleUserNavigate} className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                <FaHome className="text-sm" /> Home
              </button>
            )}
            {!token && (
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                <FaHome className="text-sm" /> Home
              </Link>
            )}
            <button className="text-primary font-semibold border-b-2 border-primary pb-1 flex items-center gap-1">
              <FaFileContract className="text-sm" /> Terms & Conditions
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
            <FaFileContract style={{ color: 'var(--primary-color)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>Legal Agreement</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            Terms & <span style={{ color: 'var(--primary-color)' }}>Conditions</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-light)' }}>
            Please read these terms carefully before using our platform
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-light)' }}>
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>
            By using InternsNest, you agree to these terms. Please read them carefully as they govern your use of our platform 
            and services, whether you're a student seeking opportunities or an employer looking for talent.
          </p>
        </div>
      </section>

      {/* Student Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
            <FaUserGraduate style={{ color: 'var(--primary-color)' }} />
            <span className="font-semibold" style={{ color: 'var(--primary-color)' }}>For Students</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
            Terms for <span style={{ color: 'var(--primary-color)' }}>Job Seekers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {studentTerms.map((term, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" 
                     style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                  {term.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-color)' }}>{term.title}</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>{term.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Employer Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
            <FaBuilding style={{ color: 'var(--primary-color)' }} />
            <span className="font-semibold" style={{ color: 'var(--primary-color)' }}>For Employers</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
            Terms for <span style={{ color: 'var(--primary-color)' }}>Recruiters</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {employerTerms.map((term, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" 
                     style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                  {term.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-color)' }}>{term.title}</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>{term.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Acknowledgment Section */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" 
                 style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
              <FaCheckCircle className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text-color)' }}>Acknowledgment</h3>
              <p className="leading-relaxed mb-3" style={{ color: 'var(--text-light)' }}>
                By using InternsNest, you acknowledge that you have read, understood, and agree to be bound by these terms. 
                We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance 
                of any changes.
              </p>
              <p className="text-sm" style={{ color: 'var(--text-light)' }}>
                For questions about these terms, contact us at{' '}
                <a href="mailto:connect@ai4sees.com" className="font-semibold hover:underline" style={{ color: 'var(--primary-color)' }}>
                  connect@ai4sees.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;