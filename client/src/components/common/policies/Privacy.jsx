import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import getUserIdFromToken from '../../student/auth/authUtils.js';
import { FaHome, FaShieldAlt, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Privacy = () => {
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

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect personal information (name, email, contact details), usage data (IP addresses, browser types), and course data (progress, quiz results) to provide and improve our services."
    },
    {
      title: "2. How We Use Your Information",
      content: "Your information helps us deliver services, personalize learning experiences, send important updates, improve our platform, and process payments securely."
    },
    {
      title: "3. Sharing Your Information",
      content: "We never sell your data. We may share it with trusted service providers, for legal compliance, or during business transfers. All partners are contractually obligated to protect your information."
    },
    {
      title: "4. Your Rights Under Indian Law",
      content: "Under DPDP Act 2023, you have the right to access, correct, delete, or transfer your data. You can withdraw consent or lodge grievances anytime.",
      isRights: true
    },
    {
      title: "5. Data Security",
      content: "We use encryption, access controls, and regular security audits to protect your data from unauthorized access or disclosure."
    },
    {
      title: "6. Data Retention",
      content: "We keep your data only as long as needed for the purposes outlined, including legal compliance and dispute resolution."
    },
    {
      title: "7. Cookies & Tracking",
      content: "We use cookies to enhance your experience. You can control cookie preferences through your browser settings."
    },
    {
      title: "8. Cross-border Data Transfers",
      content: "Your data may be transferred outside India but will always be protected according to this policy and applicable laws."
    },
    {
      title: "9. Third-Party Links",
      content: "Our platform may link to external sites. Please review their privacy policies before sharing your information."
    },
    {
      title: "10. Children's Privacy",
      content: "Our services are not for children under 13. We will delete any child's data if discovered."
    },
    {
      title: "11. Changes to This Policy",
      content: "We may update this policy periodically. Check back for any changes to our practices."
    },
    {
      title: "12. Grievance Redressal",
      content: "For questions or complaints, contact our Grievance Officer.",
      isContact: true
    }
  ];

  const rightsList = [
    "Right to Access your personal data",
    "Right to Correction of inaccurate data",
    "Right to Erasure when data is no longer needed",
    "Right to Data Portability in machine-readable format",
    "Right to Withdraw Consent anytime",
    "Right to Grievance Redressal"
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
              <FaShieldAlt className="text-sm" /> Privacy Policy
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
            <FaShieldAlt style={{ color: 'var(--primary-color)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>Your Privacy Matters</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            Privacy <span style={{ color: 'var(--primary-color)' }}>Policy</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-light)' }}>
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>
            Internsnest is committed to protecting the privacy of its users and ensuring the confidentiality 
            of personal data collected through our platform. This Privacy Policy outlines how we collect, use, 
            share, and protect your personal information in compliance with the Information Technology Act, 2000, 
            and the Digital Personal Data Protection Act (DPDP), 2023.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl lg:text-2xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>
                {section.title}
              </h2>
              
              {section.isRights ? (
                <>
                  <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-light)' }}>
                    {section.content}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    {rightsList.map((right, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                        <span style={{ color: 'var(--text-light)' }}>{right}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 pt-3 border-t" style={{ color: 'var(--text-light)' }}>
                    To exercise these rights, contact us at{' '}
                    <a href="mailto:connect@ai4sees.com" className="font-semibold" style={{ color: 'var(--primary-color)' }}>
                      connect@ai4sees.com
                    </a>
                  </p>
                </>
              ) : section.isContact ? (
                <>
                  <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-light)' }}>
                    {section.content}
                  </p>
                  <div className="mt-4 p-5 rounded-xl" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FaEnvelope style={{ color: 'var(--primary-color)' }} />
                          <a href="mailto:connect@ai4sees.com" style={{ color: 'var(--primary-color)' }} className="hover:underline">
                            connect@ai4sees.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt style={{ color: 'var(--primary-color)' }} />
                          <span style={{ color: 'var(--text-light)' }}>8867583329</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt style={{ color: 'var(--primary-color)' }} />
                          <span style={{ color: 'var(--text-light)' }} className="text-sm">
                            9th Main Road, Vysya Bank Colony, BTM Layout, Bengaluru
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => window.location.href = '/contact'}
                        className="px-5 py-2 rounded-lg font-semibold transition-all duration-300"
                        style={{ backgroundColor: 'var(--button-color)', color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover-color)'}
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Privacy;