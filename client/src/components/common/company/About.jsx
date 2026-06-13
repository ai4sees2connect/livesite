import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import getUserIdFromToken from '../../student/auth/authUtils.js';
import {
  FaArrowRight,
  FaBriefcase,
  FaSearchTalent,
  FaRocket,
  FaEye,
  FaBullseye,
  FaUsers,
  FaBuilding,
  FaGraduationCap,
  FaChartLine,
  FaCheckCircle,
  FaChevronRight,
} from 'react-icons/fa';

const aboutImage = "/backgrounds/about_image.jpeg";

const About = () => {
  const [activeSection, setActiveSection] = useState('mission');
  const navigate = useNavigate();
  const idFromToken = getUserIdFromToken();
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const stats = [
    { number: "21K+", label: "Active Students", icon: <FaGraduationCap /> },
    { number: "500+", label: "Partner Companies", icon: <FaBuilding /> },
    { number: "25K+", label: "Success Stories", icon: <FaChartLine /> },
    { number: "98%", label: "Satisfaction Rate", icon: <FaCheckCircle /> },
  ];

  const values = [
    {
      title: "Student First",
      description: "Every decision we make prioritizes student success and career growth.",
      icon: <FaGraduationCap />,
    },
    {
      title: "Quality Opportunities",
      description: "We partner only with verified companies offering genuine internships.",
      icon: <FaCheckCircle />,
    },
    {
      title: "Transparency",
      description: "Clear communication, honest reviews, and complete process visibility.",
      icon: <FaEye />,
    },
    {
      title: "Continuous Innovation",
      description: "Constantly improving our platform to serve you better.",
      icon: <FaRocket />,
    },
  ];

  const offerings = [
    {
      title: "Internships",
      description: "Explore a wide range of internships designed to provide you with hands-on experience and help you develop the skills needed to succeed in your career.",
      icon: <FaBriefcase />,
      color: "var(--primary-color)",
      link: "/internships/all-internships",
    },
    {
      title: "Jobs",
      description: "Discover job opportunities that align with your interests and career goals, and take the next step towards achieving professional success.",
      icon: <FaBullseye />,
      color: "var(--primary-color)",
      link: "/internships/all-internships",
    },
    {
      title: "Find Talent",
      description: "Connect with top-tier professionals and discover exceptional talent to help your organization achieve its goals and grow to new heights.",
      icon: <FaUsers />,
      color: "var(--primary-color)",
      link: "/recruiter/signup",
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
              <button onClick={handleUserNavigate} className="text-gray-600 hover:text-primary transition-colors">
                Home
              </button>
            )}
            {!token && (
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
            )}
            <button className="text-primary font-semibold border-b-2 border-primary pb-1">
              About Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                Bridging Education & 
                <span style={{ color: 'var(--primary-color)' }}> Professional Success</span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'var(--text-light)' }}>
                Empowering the next generation of professionals with real-world skills, 
                hands-on opportunities, and the confidence to pursue fulfilling careers.
              </p>
              <div className="flex gap-4">
                {!token && (
                  <>
                    <Link
                      to="/student/signup"
                      className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                      style={{ backgroundColor: 'var(--button-color)', color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-color)'}
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/internships/all-internships"
                      className="px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300"
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
                      Explore Internships
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl"></div>
              <img
                src={aboutImage}
                alt="About InternsNest"
                className="w-full rounded-2xl shadow-2xl object-cover"
                style={{ maxHeight: '460px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-1" style={{ color: 'var(--primary-color)' }}>
                  {stat.number}
                </h3>
                <p style={{ color: 'var(--text-light)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                <FaRocket className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>Our Mission</h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>
                To empower students with real-world skills, hands-on opportunities, and the confidence 
                to pursue fulfilling careers. We bridge the gap between academic learning and professional success.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                <FaEye className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>Our Vision</h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-light)' }}>
                A world where every student can discover their passion, gain meaningful experience, 
                and seamlessly transition from learning to professional success with purpose and confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
              Our Core Values
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
            <p className="mt-4" style={{ color: 'var(--text-light)' }}>
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300" style={{ backgroundColor: 'var(--bg-light-color)' }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-color)' }}>{value.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
              What We Offer
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
            <p className="mt-4" style={{ color: 'var(--text-light)' }}>
              Comprehensive solutions for students and recruiters
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'var(--icon-bg-color)', color: 'var(--primary-color)' }}>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>{item.title}</h3>
                <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-light)' }}>{item.description}</p>
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-2 font-semibold transition-all duration-300 group-hover:gap-3"
                  style={{ color: 'var(--primary-color)' }}
                >
                  Learn More <FaChevronRight className="text-sm" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="rounded-3xl p-12 text-center" style={{ backgroundColor: 'var(--icon-bg-color)' }}>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-light)' }}>
                Join thousands of students who have already discovered their dream internships through InternsNest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/student/signup"
                  className="px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                  style={{ backgroundColor: 'var(--button-color)', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-color)'}
                >
                  Join as Student
                </Link>
                <Link
                  to="/recruiter/signup"
                  className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-300"
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
                  Post an Internship
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;