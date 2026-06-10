/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faArrowRightLong,
  faClock,
  faMoneyBillWave,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FaRocket, FaBullseye, FaShieldAlt, FaChartLine, FaLaptopCode, FaServer, FaPalette, FaBullhorn, FaDatabase, FaGraduationCap, FaGlobe, FaChevronDown, FaClock, FaMoneyBillWave, FaBuilding } from "react-icons/fa";
import { SiReact, SiTensorflow } from "react-icons/si";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "../common/Spinner";
import api from "../common/server_url";
import bannerImg from "../../images/about_image.jpeg";

// Logos
import google from "../../images/google.png";
import microsoft from "../../images/microsoft.png";
import amazon from "../../images/amazon.png";
import adobe from "../../images/adobe.png";
import deloitte from "../../images/deloitte.png";
import infosys from "../../images/infosys.png";
import tcs from "../../images/tcs.png";
import wipro from "../../images/wipro.png";
import accenture from "../../images/accenture.png";
import capgemini from "../../images/capgemini.png";
import google_pic from "../../images/google_pic.png";

const HomeUniversal = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const token = localStorage.getItem("token");

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internshipFetched, setInternshipFetched] = useState(false);

  // Redirect if user is logged in
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userType = decoded?.userType;
        const idFromToken = decoded?.id || decoded?.userId;

        if (userType === "Student") {
          navigate(`/student/dashboard/${idFromToken}`);
        } else if (userType === "Recruiter") {
          navigate(`/recruiter/dashboard/${idFromToken}`);
        }
      } catch (err) {
        // Invalid token → stay on home
      }
    }
  }, [token, navigate]);

  // Fetch internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get(`${api}/student/internships/top-15`);
        setInternships(response.data);
        setInternshipFetched(true);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Attach logo URLs
  useEffect(() => {
    if (internships.length > 0) {
      const fetchLogos = async () => {
        const updated = await Promise.all(
          internships.map(async (intern) => {
            if (!intern.recruiter?._id) return intern;
            try {
              const res = await axios.get(
                `${api}/recruiter/internship/${intern._id}/${intern.recruiter._id}/get-logo`,
                { responseType: "blob" }
              );
              const logoUrl = URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }));
              return { ...intern, logoUrl };
            } catch (err) {
              return { ...intern, logoUrl: null };
            }
          })
        );
        setInternships(updated);
      };
      fetchLogos();
    }
  }, [internshipFetched]);

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(internships.length, 3),
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1100, settings: { slidesToShow: Math.min(internships.length, 3) } },
      { breakpoint: 1000, settings: { slidesToShow: Math.min(internships.length, 2) } },
      { breakpoint: 500, settings: { slidesToShow: Math.min(internships.length, 1) } },
    ],
  };

  if (loading && !token) return <Spinner />;

  return (
    <>
      {/* Hero Section (Former Sidebar) */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-cyan-200 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Find Internships that
              <span className="text-blue-600"> actually match you</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Discover verified internships, connect with recruiters, and start building your career in minutes.
            </p>

            <div className="mt-8 bg-white shadow-xl rounded-2xl p-4 border border-gray-100">
              <input
                type="text"
                placeholder="Search internships, roles, skills..."
                className="w-full outline-none text-gray-700"
              />
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">🌍 Remote</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">🏢 Office</span>
                <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full">⚡ Hybrid</span>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
                Search Internships
              </button>
            </div>

            <div className="flex gap-4 mt-6">
              <Link to="/internships/all-internships" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">
                Explore Internships
              </Link>
              <Link to="/recruiter/signup" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl font-semibold">
                Post Internship
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-40"></div>
            <img
              src={bannerImg}
              alt="hero"
              className="w-[420px] lg:w-[520px] object-contain rounded-3xl shadow-2xl relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-16 overflow-hidden bg-white">
        <h2 className="text-center text-3xl lg:text-4xl font-bold mb-3">Trusted By Top Companies</h2>
        <p className="text-center text-gray-500 mb-10">Opportunities from leading companies across India</p>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[google, microsoft, amazon, adobe, deloitte, infosys, tcs, wipro, accenture, capgemini].map((logo, i) => (
              <img key={`first-${i}`} src={logo} alt="" className="max-h-[100px] max-w-[200px] object-contain mx-4" />
            ))}
            {[google, microsoft, amazon, adobe, deloitte, infosys, tcs, wipro, accenture, capgemini].map((logo, i) => (
              <img key={`second-${i}`} src={logo} alt="" className="max-h-[100px] max-w-[200px] object-contain mx-4" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-400 to-sky-400 text-white mb-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">Find Your Dream Internship</h1>
          <p className="text-xl lg:text-2xl mb-10 text-blue-100">Connect with top recruiters and kickstart your career today.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/internships/all-internships" className="bg-white text-blue-700 px-8 py-4 font-bold shadow-lg">
              Explore Internships
            </Link>
            <Link to="/student/signup" className="bg-blue-800 px-8 py-4 rounded-xl font-bold">
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <div className="my-5 px-3 lg:px-5 py-10 bg-white rounded-xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl lg:text-3xl font-bold px-9">Featured Internships</h1>
          <p className="text-blue-600 ml-2 text-xl">Explore opportunities from top companies</p>
        </div>
        <Slider {...settings}>
          {internships.map((intern, index) => (
            <div key={index} className="mx-2 mb-6">
              <div className="shadow-lg border-2 p-4 rounded-lg max-h-[280px] bg-white">
                <div className="flex justify-between items-start border-b">
                  <div className="min-h-[60px]">
                    <h2 className="text-sm md:text-lg text-left font-semibold">{intern.internshipName}</h2>
                    <p className="text-sm text-gray-600 text-left">
                      {intern.recruiter.companyName || `${intern.recruiter.firstname} ${intern.recruiter.lastname}`}
                    </p>
                  </div>
                  {intern.logoUrl ? (
                    <img src={intern.logoUrl} alt="logo" className="h-14" />
                  ) : (
                    <FaBuilding className="text-3xl" />
                  )}
                </div>
                <button className="px-4 py-1 border-2 rounded-lg flex gap-2 items-center text-xs font-semibold text-gray-600 my-3">
                  <FontAwesomeIcon icon={faArrowRightLong} className="text-blue-600" />
                  Actively Hiring
                </button>
                <div className="my-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faLocationDot} className="text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {intern.internLocation.country
                        ? `${intern.internLocation.city}, ${intern.internLocation.state}, ${intern.internLocation.country}`
                        : "Remote"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <FaClock className="mr-1 text-blue-500" />
                    <span>{intern.duration} Months</span>
                  </div>
                  {intern.stipendType === "unpaid" ? (
                    <div className="flex items-center text-gray-700">
                      <FaMoneyBillWave className="mr-1 text-blue-500" />
                      <span>Unpaid</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-700">
                        <span className="text-blue-500">{intern.currency}</span> {intern.stipend} /month
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-blue-600 font-semibold bg-gray-300 rounded-md px-2 py-1">
                    {intern.internshipType}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        <div className="flex justify-center my-4">
          <Link
            to={userId ? `/student/internships/${userId}/All-Internships` : "/internships/all-internships"}
            className="text-blue-600 text-xl bg-transparent border-none"
          />
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="py-2 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Why Choose <span className="text-blue-600">InternsNest?</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto mt-4"></div>
          <p className="text-gray-500 text-lg mt-5">Everything you need to kickstart your career</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-5">
          {[
            { icon: <FaRocket className="text-5xl text-blue-600" />, title: "Easy Apply", desc: "Apply to internships in just a few clicks." },
            { icon: <FaBullseye className="text-5xl text-cyan-600" />, title: "Smart Matching", desc: "Find internships perfectly matched to your skills." },
            { icon: <FaShieldAlt className="text-5xl text-green-600" />, title: "Verified Companies", desc: "Apply confidently to trusted recruiters." },
            { icon: <FaChartLine className="text-5xl text-purple-600" />, title: "Career Growth", desc: "Gain experience and boost your resume." },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-blue-100">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">{item.icon}</div>
              <h3 className="text-xl font-bold text-center mb-3">{item.title}</h3>
              <p className="text-center text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-slate-50 rounded-2xl">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-900">Popular Categories</h2>
          <p className="text-gray-500 mt-3">Explore internships by domain</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-5">
          {[
            { icon: <FaLaptopCode className="text-3xl text-blue-600" />, title: "Frontend Development", tech: "React, Next.js, Tailwind CSS", count: "1,200+" },
            { icon: <SiReact className="text-3xl text-blue-600" />, title: "React.js", tech: "Hooks, Redux, Components", count: "850+" },
            { icon: <FaServer className="text-3xl text-blue-600" />, title: "Backend Development", tech: "Node.js, APIs, Databases", count: "950+" },
            { icon: <SiTensorflow className="text-3xl text-blue-600" />, title: "AI / ML", tech: "Machine Learning & AI", count: "500+" },
            { icon: <FaPalette className="text-3xl text-blue-600" />, title: "UI / UX Design", tech: "Figma, Adobe XD, Wireframes", count: "700+" },
            { icon: <FaBullhorn className="text-3xl text-blue-600" />, title: "Digital Marketing", tech: "SEO, Ads, Social Media", count: "600+" },
            { icon: <FaDatabase className="text-3xl text-blue-600" />, title: "Data Science", tech: "Python, SQL, Analytics", count: "750+" },
            { icon: <FaChartLine className="text-3xl text-blue-600" />, title: "Business Development", tech: "Sales, Growth & Strategy", count: "900+" },
          ].map((cat, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">{cat.icon}</div>
              <h3 className="text-xl font-bold text-center mb-2">{cat.title}</h3>
              <p className="text-gray-500 text-center mb-5">{cat.tech}</p>
              <div className="flex justify-center">
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  {cat.count} Internships
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-14">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all">
            View All Categories →
          </button>
        </div>
      </section>

      {/* Dual CTA (only for guests) */}
      {!token && (
        <section className="relative py-2 overflow-hidden bg-white">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-40"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
            <div className="group bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100 rounded-[32px] p-10 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-100 flex items-center justify-center text-4xl">🚀</div>
              <span className="inline-block mt-5 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">For Recruiters</span>
              <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Want To Hire<br />Interns?</h2>
              <p className="mt-5 text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Post internships, connect with talented students and hire the best candidates faster.
              </p>
              <div className="mt-6 text-blue-600 font-semibold">500+ Companies Hiring</div>
              <Link to="/recruiter/signup" className="inline-flex mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300">
                Hire Now →
              </Link>
            </div>
            <div className="group bg-gradient-to-br from-green-50 via-white to-emerald-100 border border-green-100 rounded-[32px] p-10 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-green-100 flex items-center justify-center text-4xl">🎓</div>
              <span className="inline-block mt-5 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">For Students</span>
              <h2 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Want To Be<br />Hired?</h2>
              <p className="mt-5 text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Explore verified internships, apply easily and start your professional journey.
              </p>
              <div className="mt-6 text-green-600 font-semibold">10,000+ Opportunities Available</div>
              <Link to="/student/signup" className="inline-flex mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300">
                Get Hired →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20">
        <h2 className="text-center text-4xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { emoji: "📝", title: "Create Profile", desc: "Build your professional profile in minutes." },
            { emoji: "🔍", title: "Discover Opportunities", desc: "Browse thousands of internships and jobs." },
            { emoji: "🚀", title: "Get Hired", desc: "Apply and start your career journey." },
          ].map((step, i) => (
            <div key={i} className="bg-white border border-gray-100 shadow-lg hover:shadow-2xl p-8 rounded-3xl text-center hover:-translate-y-3 transition-all duration-300 w-full max-w-sm mx-auto">
              <div className="w-20 h-20 mx-auto mb-5 bg-blue-100 rounded-full flex items-center justify-center text-4xl">{step.emoji}</div>
              <h3 className="font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-2 bg-white overflow-hidden">
        <div className="text-center mb-14">
          <h2 className="mt-5 text-4xl md:text-5xl font-bold text-gray-900">Success Stories</h2>
          <p className="mt-4 text-gray-500 text-lg">Hear from students who launched their careers through InternsNest</p>
        </div>
        <div className="testimonial-slider relative w-full py-10">
          <div className="absolute left-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
          <div className="testimonial-track gap-6">
            {Array(2)
              .fill([
                { name: "Rahul Sharma", role: "React Developer Intern", letter: "R", color: "bg-blue-600", text: "Got my first React Internship through InternsNest within 10 days." },
                { name: "Priya Verma", role: "Frontend Intern", letter: "P", color: "bg-pink-600", text: "Found a remote internship that perfectly matched my skills." },
                { name: "Ankit Patel", role: "Software Engineer Intern", letter: "A", color: "bg-green-600", text: "Verified companies and smooth application process." },
                { name: "Neha Gupta", role: "UI/UX Design Intern", letter: "N", color: "bg-purple-600", text: "Much better opportunities than many other platforms." },
                { name: "Rohit Kumar", role: "Backend Developer Intern", letter: "R", color: "bg-orange-600", text: "Received interview calls within the first week." },
                { name: "Sneha Joshi", role: "Data Analyst Intern", letter: "S", color: "bg-red-600", text: "Simple, fast and completely hassle-free experience." },
              ])
              .flat()
              .map((item, index) => (
                <div key={index} className="w-[340px] flex-shrink-0 bg-white rounded-3xl p-7 border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="text-yellow-400 text-lg mb-4">⭐⭐⭐⭐⭐</div>
                  <p className="text-gray-600 leading-relaxed min-h-[90px]">{item.text}</p>
                  <div className="flex items-center gap-4 mt-6">
                    <div className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center font-bold`}>{item.letter}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-10 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="mt-6 text-5xl md:text-6xl font-black tracking-tight text-slate-900">
              Questions?
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">We've Got Answers.</span>
            </h2>
            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
              Everything you need to know about InternsNest, internships, recruiters and launching your career successfully.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              {[
                { icon: <FaGraduationCap className="text-blue-600 text-xl" />, q: "Is InternsNest free for students?", a: "Yes. Students can create an account, build a profile, explore internships and apply completely free." },
                { icon: <FaShieldAlt className="text-green-600 text-xl" />, q: "Are recruiters verified?", a: "We review recruiter accounts and company info before publishing opportunities to maintain trust." },
                { icon: <FaGlobe className="text-purple-600 text-xl" />, q: "Can I apply for remote internships?", a: "Absolutely. InternsNest features work-from-home and remote opportunities across domains." },
              ].map((faq, i) => (
                <div key={i} className="group bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">{faq.icon}</div>
                      <h3 className="font-bold text-lg text-slate-900">{faq.q}</h3>
                    </div>
                    <FaChevronDown className="text-slate-400 group-hover:text-blue-600 group-hover:rotate-180 transition-all duration-500" />
                  </div>
                  <p className="mt-5 text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-200/40 rounded-full blur-3xl"></div>
              <div className="relative overflow-hidden rounded-[36px] bg-white/70 backdrop-blur-xl border border-white p-10 shadow-[0_20px_60px_rgba(59,130,246,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5"></div>
                <div className="relative text-center">
                  <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl">
                    <FaGraduationCap className="text-5xl" />
                  </div>
                  <h3 className="mt-8 text-3xl font-bold text-slate-900">Still Have Questions?</h3>
                  <p className="mt-4 text-slate-600 max-w-md mx-auto">
                    Explore opportunities, connect with recruiters and start building your future with confidence.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-10">
                    {[
                      { value: "21K+", label: "Students" },
                      { value: "1K+", label: "Companies" },
                      { value: "25K+", label: "Applications" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 shadow-md">
                        <h4 className="text-2xl font-bold text-blue-600">{stat.value}</h4>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <button className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300">
                    Explore Opportunities →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="px-3 lg:px-5 py-10 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t-2 bg-[#f0fbff]">
          {[
            { num: "1K+", label: "Companies Hiring" },
            { num: "21K+", label: "New Openings" },
            { num: "21k+", label: "Active students" },
            { num: "5k+", label: "Learners" },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col lg:gap-3 justify-center items-center mb-10 lg:mb-0 ${i < 3 ? 'border-r-2' : ''}`}>
              <h2 className="text-3xl lg:text-5xl font-bold text-blue-600">{item.num}</h2>
              <p className="text-xl text-gray-600 font-semibold">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Footer CTA (guest only) */}
        {!token && (
          <div className="bg-footer h-64 w-full bg-no-repeat bg-cover px-5 py-5 lg:py-0">
            <div className="flex flex-col lg:flex-row justify-center items-center h-full gap-5">
              <h2 className="lg:flex-1 text-3xl lg:text-5xl text-white font-bold">
                Boost your career with InternsNest today
              </h2>
              <div className="lg:flex-1 flex gap-5 lg:justify-end">
                <Link to="/student/login" className="px-4 lg:px-10 py-1 lg:py-3 rounded-lg bg-white font-semibold flex items-center justify-center gap-2">
                  <img src={google_pic} alt="" className="w-5 h-5" />
                  <span>Continue With Google</span>
                </Link>
                <Link to="/student/signup" className="px-10 py-3 rounded-lg bg-blue-800 text-white font-semibold">
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default HomeUniversal;