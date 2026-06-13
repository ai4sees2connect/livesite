import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import getUserIdFromToken from '../../student/auth/authUtils.js';
import api from '../server_url.js';
import Spinner from '../Spinner.jsx';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaUser,
  FaMobileAlt,
  FaCommentDots,
  FaCheckCircle,
  FaHome,
  FaBuilding,
} from 'react-icons/fa';

const contact_pic = "/people/contact_pic.jpeg";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    query: '',
  });
  const [formMessage, setFormMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage('');
    
    try {
      const response = await fetch(`${api}/send-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormMessage('Your query has been sent successfully!');
        setMessageType('success');
        setFormData({ name: '', phone: '', email: '', query: '' });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormMessage('');
          setMessageType('');
        }, 5000);
      } else {
        setFormMessage('Failed to send your query. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setFormMessage('An error occurred. Please try again later.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

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

  const contactInfo = [
    {
      icon: <FaPhoneAlt />,
      title: "Phone",
      details: "+91 88675 83329",
      subDetail: "Mon-Fri, 10 AM - 6 PM",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: "connect@ai4sees.com",
      subDetail: "We reply within 24 hours",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Office Address",
      details: "9th Main Road, Vysya Bank Colony",
      subDetail: "BTM 1st Stage, Bengaluru, Karnataka",
    },
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
              <FaCommentDots className="text-sm" /> Contact Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                Get in <span style={{ color: 'var(--primary-color)' }}>Touch</span>
              </h1>
              <p className="text-lg mb-6" style={{ color: 'var(--text-light)' }}>
                Have questions about internships, partnerships, or anything else? 
                We're here to help and would love to hear from you.
              </p>
              <div className="flex flex-col gap-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--text-color)' }}>{info.title}</h3>
                      <p style={{ color: 'var(--text-light)' }}>{info.details}</p>
                      {info.subDetail && (
                        <p className="text-sm" style={{ color: 'var(--text-light)' }}>{info.subDetail}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl"></div>
              <img
                src={contact_pic}
                alt="Contact InternsNest"
                className="w-full rounded-2xl shadow-2xl object-cover"
                style={{ maxHeight: '460px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
              Send Us a <span style={{ color: 'var(--primary-color)' }}>Message</span>
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
            <p className="mt-4" style={{ color: 'var(--text-light)' }}>
              Have a question or feedback? Fill out the form and we'll get back to you soon.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Success/Error Message */}
            {formMessage && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {messageType === 'success' && <FaCheckCircle className="text-green-500 text-xl" />}
                <p className={messageType === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {formMessage}
                </p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
                        <FaUser />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{ borderColor: 'var(--border-color)', outlineColor: 'var(--primary-color)' }}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
                        <FaMobileAlt />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{ borderColor: 'var(--border-color)', outlineColor: 'var(--primary-color)' }}
                        required
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: 'var(--border-color)', outlineColor: 'var(--primary-color)' }}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Query Field */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
                    Your Query / Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-4" style={{ color: 'var(--text-light)' }}>
                      <FaCommentDots />
                    </div>
                    <textarea
                      name="query"
                      value={formData.query}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                      style={{ borderColor: 'var(--border-color)', outlineColor: 'var(--primary-color)' }}
                      rows="5"
                      required
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--button-color)', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-color)'}
                >
                  <FaPaperPlane />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ / Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
            <FaBuilding style={{ color: 'var(--primary-color)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>Quick Support</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            Need Immediate Assistance?
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-light)' }}>
            For urgent inquiries, please call us directly during business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+918867583329"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{ backgroundColor: 'var(--button-color)', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover-color)'}
            >
              <FaPhoneAlt />
              Call Now: +91 88675 83329
            </a>
            <a
              href="mailto:connect@ai4sees.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300"
              style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--primary-color)';
              }}
            >
              <FaEnvelope />
              Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;