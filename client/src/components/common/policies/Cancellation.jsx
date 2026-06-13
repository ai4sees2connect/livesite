import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import getUserIdFromToken from '../../student/auth/authUtils.js';
import { FaHome, FaMoneyBillWave, FaBuilding, FaShieldAlt, FaClock, FaTimesCircle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const Cancellation = () => {
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

  const refundPoints = [
    {
      icon: <FaClock />,
      title: "Refund Requests",
      description: "Employers may request a full refund within 30 days of purchase if they have not hired any candidates.",
      timeline: "Processed within 15 working days after request",
      color: "green"
    }
  ];

  const importantNotes = [
    {
      icon: <FaTimesCircle />,
      title: "Refund Denial",
      description: "Refunds may be denied for violations of terms and conditions.",
      type: "warning"
    },
    {
      icon: <FaBuilding />,
      title: "Premium & Bulk Plans",
      description: "No refunds are allowed for Premium Plans or bulk plans. Refunds can only be claimed once by a company.",
      type: "info"
    },
    {
      icon: <FaShieldAlt />,
      title: "Advertisers",
      description: "No refunds are available after the campaign begins or payment is received.",
      note: "If Internsnest cancels the campaign, a pro-rata refund will be issued for unserved deliverables.",
      type: "info"
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
              <FaMoneyBillWave className="text-sm" /> Refund Policy
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
            <FaMoneyBillWave style={{ color: 'var(--primary-color)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>Money Back Guarantee</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            Refund & <span style={{ color: 'var(--primary-color)' }}>Cancellation Policy</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-light)' }}>
            Clear, transparent, and fair policies for all our users
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-light)' }}>
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
              <FaCheckCircle className="text-2xl" />
            </div>
          </div>
          <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>
            At InternsNest, we believe in complete transparency. This refund and cancellation policy outlines 
            when and how refunds are processed for our services.
          </p>
        </div>
      </section>

      {/* Jobs and Internships Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
            <FaBuilding style={{ color: 'var(--primary-color)' }} />
            <span className="font-semibold" style={{ color: 'var(--primary-color)' }}>For Employers</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
            Jobs & <span style={{ color: 'var(--primary-color)' }}>Internships</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-1 gap-6">
          {refundPoints.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                     style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text-color)' }}>{item.title}</h3>
                  <p className="leading-relaxed mb-3" style={{ color: 'var(--text-light)' }}>{item.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm" 
                       style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                    <FaClock className="text-xs" />
                    <span>{item.timeline}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
            <FaInfoCircle style={{ color: 'var(--primary-color)' }} />
            <span className="font-semibold" style={{ color: 'var(--primary-color)' }}>Important Information</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
            Key <span style={{ color: 'var(--primary-color)' }}>Notes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {importantNotes.map((note, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" 
                     style={{ backgroundColor: note.type === 'warning' ? '#FEF2F2' : 'var(--icon-bg-color)', 
                              color: note.type === 'warning' ? '#DC2626' : 'var(--primary-color)' }}>
                  {note.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-color)' }}>{note.title}</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>{note.description}</p>
                  {note.note && (
                    <p className="mt-2 text-sm pt-2 border-t" style={{ color: 'var(--primary-color)', borderColor: 'var(--border-color)' }}>
                      {note.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Request Refund Section */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
          <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--text-color)' }}>How to Request a Refund?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" 
                   style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>1</div>
              <p style={{ color: 'var(--text-light)' }}>Contact our support team at <a href="mailto:connect@ai4sees.com" className="font-semibold" style={{ color: 'var(--primary-color)' }}>connect@ai4sees.com</a></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" 
                   style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>2</div>
              <p style={{ color: 'var(--text-light)' }}>Provide your transaction details and reason for refund</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" 
                   style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>3</div>
              <p style={{ color: 'var(--text-light)' }}>Our team will review your request within 5-7 business days</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cancellation;