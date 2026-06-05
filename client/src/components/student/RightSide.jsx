import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import api from "../common/server_url";
import vids from "../../videos/vids.mp4";
import vids2 from "../../videos/vids2.mp4";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../student/utilscss/swiper.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import {
  FaRocket,
  FaBullseye,
  FaShieldAlt,
  FaChartLine,
  FaLaptopCode,
  FaServer,
  FaPalette,
  FaBullhorn,
  FaDatabase
} from "react-icons/fa";
import { SiReact, SiTensorflow } from "react-icons/si";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
// fontawesome
import {
  faChevronRight,
  faFire,
  faLocationDot,
  faWallet,
  faBusinessTime,
  faArrowRightLong,
  faBriefcase,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
// TEST Json
import jobs from "../TESTJSONS/jobs.json";
import courses from "../TESTJSONS/course.json";
import certificates from "../TESTJSONS/certificates.json";
//image
import google_pic from "../../images/google_pic.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBuilding,
  FaClock,
  FaMoneyBillWave,
  FaQuestion,
} from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Spinner from "../common/Spinner";
import getUserIdFromToken from "./auth/authUtils";
import { jwtDecode } from "jwt-decode";


const token = localStorage.getItem("token");



const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-[20%] md:right-[31%] xl:right-[40%] top-[104%] transform -translate-y-1/2 z-10 cursor-pointer bg-blue-600 rounded-full p-2 shadow-md transition-all hover:bg-blue-700"
    onClick={onClick}
  >
    <FaChevronRight className="text-white text-lg" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-[20%] md:left-[31%] xl:left-[40%] top-[104%] transform -translate-y-1/2 z-10 cursor-pointer bg-blue-600 rounded-full p-2 shadow-md transition-all hover:bg-blue-700"
    onClick={onClick}
  >
    <FaChevronLeft className="text-white text-lg" />
  </div>
);

const RightSide = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getUserIdFromToken();
  const [internshipFetched, setInternshipFetched] = useState(false);
  console.log('this is id', userId)


  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

  }, [token]);

  useEffect(() => {
    const fetchInternships = async () => {
      // const cachedInternships = localStorage.getItem("cachedInternships");

      try {
        // console.log("LocationName", selectedLocation);
        // console.log("WorkType:", workType);
        // console.log("profile", selectedProfile);
        console.log('hello')

        const response = await axios.get(`${api}/student/internships/top-15`);
        console.log('internship fetched', response.data);
        setInternships(response.data);

        setInternshipFetched(true);


        setLoading(false);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to fetch internships. Please try again later.");
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  useEffect(() => {
    if (internships.length > 0) {
      const fetchLogos = async () => {
        const internshipsWithLogo = await Promise.all(
          internships.map(async (internship) => {
            if (internship.recruiter && internship.recruiter._id) {
              try {
                // Kick off the logo fetch but don't await it here
                const logoPromise = axios.get(
                  `${api}/recruiter/internship/${internship._id}/${internship.recruiter._id}/get-logo`,
                  { responseType: "blob" }
                );

                // Once the promise resolves, process the logo
                const res = await logoPromise;
                const logoBlob = new Blob([res.data], {
                  type: res.headers["content-type"],
                });
                const logoUrl = URL.createObjectURL(logoBlob);

                // Return the internship with the logo URL
                return {
                  ...internship,
                  logoUrl,
                };
              } catch (error) {

                if (error.response && error.response.status === 404) {
                  console.warn(`Logo not found for recruiter ${internship.recruiter._id}`);
                  return {
                    ...internship,
                    logoUrl: null, // No logo found, default to null or a placeholder URL
                  };
                }

                console.error("Error fetching logo:", error);

                // Return internship with a default or null logo URL in case of an error
                return {
                  ...internship,
                  logoUrl: null, // Or use a default image URL here
                };
              }
            }

            // If no recruiter, return the internship as is
            return internship;
          })
        );
        setInternships(internshipsWithLogo);
      }

      fetchLogos();

    }
  }, [internshipFetched])

  console.log(internships);

  const settings = {
    dots: false, // Disable dots
    infinite: true, // Make it loop infinitely for a smooth effect
    speed: 500,
    slidesToShow: Math.min(internships.length, 3),
    slidesToScroll: 1,
    arrows: false, // Disable arrows
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Adjust speed in milliseconds
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: Math.min(internships.length, 3),
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: Math.min(internships.length, 2),
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: Math.min(internships.length, 1),
        },
      },
    ],
  };
  

  if (loading) {
    return <Spinner />;
  }

  return (
      <>
    

<section className="py-20 bg-gradient-to-r from-blue-400 to-sky-400 text-white mb-10">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h1 className="text-5xl lg:text-7xl font-bold mb-6">
      Find Your Dream Internship
    </h1>

    <p className="text-xl lg:text-2xl mb-10 text-blue-100">
      Connect with top recruiters and kickstart your career today.
    </p>

    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <Link
        to="/internships/all-internships"
        className="bg-white text-blue-700 px-8 py-4  font-bold shadow-lg"
      >
        Explore Internships
      </Link>

      <Link
        to="/student/signup"
        className="bg-blue-800 px-8 py-4 rounded-xl font-bold"
      >
        Join Free
      </Link>
    </div>

  </div>
</section>

      {/* Recommended jobs */} 
      <div className="my-5 px-3 lg:px-5 py-10 bg-white rounded-xl">
        <div className="text-center mb-10">
          <h1 className=" text-2xl lg:text-3xl font-bold px-9">
            Featured Internships
          </h1>
          <p className=" text-blue-600 ml-2 text-xl">Explore opportunities from top companies</p>
        </div>

        <div className="z-0 ">
          <Slider {...settings}>
            {internships?.map((intern, index) => (
              <div key={index} className="mx-0  md:mx-3 mb-6">
                <div
                  key={index}
                  className="shadow-lg border-2 p-4 rounded-lg max-h-[280px] bg-white mx-2"
                >
                  {/* Changed mx-3 to mx-2 */}
                  {/* Job company */}
                  <div className="flex justify-between items-start border-b">
                    <div className="min-h-[60px]">
                      <h2 className="text-sm md:text-lg text-left font-semibold">
                        {intern?.internshipName}
                      </h2>
                      <p className="text-sm text-gray-600 text-left">
                        {intern.recruiter.companyName !== ""
                          ? intern.recruiter.companyName
                          : intern.recruiter.firstname +
                          " " +
                          intern.recruiter.lastname}
                      </p>
                    </div>
                    <div>
                      {intern.logoUrl ? (
                        <img
                          src={intern.logoUrl}
                          alt={intern.logoUrl}
                          className="h-14"
                        />
                      ) : (
                        <FaBuilding className="text-3xl" />
                      )}
                    </div>
                  </div>
                  <button className="px-4 py-1 border-2 rounded-lg flex gap-2 items-center text-xs font-semibold text-gray-600 my-3">
                    <FontAwesomeIcon
                      icon={faArrowRightLong}
                      className="text-blue-600"
                    />
                    Actively Hiring
                  </button>
                  {/* Location, money, time */}
                  <div className="my-2 space-y-1 lg:space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {intern.internLocation.country
                          ? `${intern.internLocation.city}, ${intern.internLocation.state}, ${intern.internLocation.country}`
                          : "Remote"}
                      </span>
                    </div>

                    <div className="text-sm md:text-base flex items-center text-gray-700 mb-2">
                      <FaClock className="mr-1 text-blue-500 text-sm" />
                      <span>{intern.duration} Months</span>
                    </div>

                    {intern.stipendType === "unpaid" && (
                      <div className="flex items-center text-gray-700 mb-2">
                        <FaMoneyBillWave className="mr-1 text-blue-500" />
                        <span className="mb-2">Unpaid</span>
                      </div>
                    )}

                    {intern.stipendType !== "unpaid" && (
                      <div className="flex items-center space-x-0">
                        <div className="text-sm md:text-base text-gray-700 mb-2">
                          {/* <FaMoneyBillWave className="mr-1" /> */}
                          <span className="ml-0">
                            <span className="text-blue-500 ml-[2px]">
                              {intern.currency}
                            </span>{" "}
                            {intern.stipend} /month
                          </span>
                        </div>

                        {/* {intern.stipendType === "performance-based" && (
                        <div className="text-sm md:text-base flex items-center mb-2 text-gray-700">
                          <span>+ incentives</span>
                          <div className="relative group ">
                            <FaQuestion className="border border-black p-1 mx-1 rounded-full hover:cursor-pointer" />
                            <span className="absolute hidden group-hover:block bg-gray-700 text-white text-base rounded p-1 w-[250px]">
                              This is a Performance Based internship.{" "}
                              {intern.incentiveDescription}
                            </span>
                          </div>
                        </div>
                      )} */}
                      </div>
                    )}

                    {/* Other details... */}
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-blue-600 font-semibold bg-gray-300 rounded-md px-2 py-1 lg:px-3">
                      {intern?.internshipType}
                    </p>
                    {/* <Link
                      to={`/${token ? "student/" : ""}internships${
                        token ? `/${userId}` : ""
                      }`}
                      className="px-2 lg:px-4 py-1 border-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-500"
                    >
                      See Details
                    </Link> */}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="flex justify-center my-4">
      <Link
        to={userId ? `/student/internships/${userId}/All-Internships` : "/internships/all-internships"}
        className="text-blue-600 text-xl bg-transparent border-none"
      >
        Explore All Internships
      </Link>
      </div>
      <section className="py-20">

  {/* <h2 className="text-center text-4xl font-bold mb-12">
    Why Choose InternsNest?
  </h2> */}

  {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-white shadow-lg p-8 rounded-2xl text-center">
      <h3 className="text-2xl mb-2">🚀</h3>
      <h4 className="font-bold">Easy Apply</h4>
      <p className="text-gray-600 mt-2">
        Apply to internships in just a few clicks.
      </p>
    </div>

    <div className="bg-white shadow-lg p-8 rounded-2xl text-center">
      <h3 className="text-2xl mb-2">🎯</h3>
      <h4 className="font-bold">Smart Matching</h4>
      <p className="text-gray-600 mt-2">
        Find internships relevant to your skills.
      </p>
    </div>

    <div className="bg-white shadow-lg p-8 rounded-2xl text-center">
      <h3 className="text-2xl mb-2">🏢</h3>
      <h4 className="font-bold">Verified Companies</h4>
      <p className="text-gray-600 mt-2">
        Apply only to trusted recruiters.
      </p>
    </div>

    <div className="bg-white shadow-lg p-8 rounded-2xl text-center">
      <h3 className="text-2xl mb-2">📈</h3>
      <h4 className="font-bold">Career Growth</h4>
      <p className="text-gray-600 mt-2">
        Build experience and boost your career.
      </p>
    </div>

  </div> */} 
  <div className="py-20 bg-gradient-to-b from-white via-blue-50 to-white">

  <div className="text-center mb-14">
    <h2 className="text-4xl lg:text-5xl font-bold">
      Why Choose <span className="text-blue-600">InternsNest?</span>
    </h2>

    <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto mt-4"></div>

    <p className="text-gray-500 text-lg mt-5">
      Everything you need to kickstart your career
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-5">

    {/* Easy Apply */}
    <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-blue-100">

      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <FaRocket className="text-5xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-3">
        Easy Apply
      </h3>

      <p className="text-center text-gray-600">
        Apply to internships in just a few clicks without lengthy forms.
      </p>

    </div>

    {/* Smart Matching */}
    <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-cyan-100">

      <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-5">
        <FaBullseye className="text-5xl text-cyan-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-3">
        Smart Matching
      </h3>

      <p className="text-center text-gray-600">
        Find internships perfectly matched to your skills and interests.
      </p>

    </div>

    {/* Verified Companies */}
    <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-green-100">

      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <FaShieldAlt className="text-5xl text-green-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-3">
        Verified Companies
      </h3>

      <p className="text-center text-gray-600">
        Apply confidently to trusted recruiters and top companies.
      </p>

    </div>

    {/* Career Growth */}
    <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-purple-100">

      <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-5">
        <FaChartLine className="text-5xl text-purple-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-3">
        Career Growth
      </h3>

      <p className="text-center text-gray-600">
        Gain experience, build your resume, and launch your career.
      </p>

    </div>

  </div>

</div>

</section> 
<section className="py-20 bg-slate-50 rounded-2xl">

  <div className="text-center mb-14">
    <h2 className="text-4xl font-bold text-slate-900">
      Popular Categories
    </h2>
    <p className="text-gray-500 mt-3">
      Explore internships by domain
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-5">

    {/* Frontend */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <FaLaptopCode className="text-3xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2">
        Frontend Development
      </h3>

      <p className="text-gray-500 text-center mb-5">
        React, Next.js, Tailwind CSS
      </p>

      <div className="flex justify-center">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          1,200+ Internships
        </span>
      </div>

    </div>

    {/* React */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <SiReact className="text-3xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2">
        React.js
      </h3>

      <p className="text-gray-500 text-center mb-5">
        Hooks, Redux, Components
      </p>

      <div className="flex justify-center">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          850+ Internships
        </span>
      </div>

    </div>

    {/* Backend */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <FaServer className="text-3xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2">
        Backend Development
      </h3>

      <p className="text-gray-500 text-center mb-5">
        Node.js, APIs, Databases
      </p>

      <div className="flex justify-center">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          950+ Internships
        </span>
      </div>

    </div>

    {/* AI / ML */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <SiTensorflow className="text-3xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2">
        AI / ML
      </h3>

      <p className="text-gray-500 text-center mb-5">
        Machine Learning & AI
      </p>

      <div className="flex justify-center">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          500+ Internships
        </span>
      </div>

    </div>

    {/* UI UX */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <FaPalette className="text-3xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2">
        UI / UX Design
      </h3>

      <p className="text-gray-500 text-center mb-5">
        Figma, Adobe XD, Wireframes
      </p>

      <div className="flex justify-center">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          700+ Internships
        </span>
      </div>

    </div>

    {/* Digital Marketing */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <FaBullhorn className="text-3xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2">
        Digital Marketing
      </h3>

      <p className="text-gray-500 text-center mb-5">
        SEO, Ads, Social Media
      </p>

      <div className="flex justify-center">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          600+ Internships
        </span>
      </div>

    </div>

    {/* Data Science */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <FaDatabase className="text-3xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2">
        Data Science
      </h3>

      <p className="text-gray-500 text-center mb-5">
        Python, SQL, Analytics
      </p>

      <div className="flex justify-center">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          750+ Internships
        </span>
      </div>

    </div>

    {/* Business Dev */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">

      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
        <FaChartLine className="text-3xl text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2">
        Business Development
      </h3>

      <p className="text-gray-500 text-center mb-5">
        Sales, Growth & Strategy
      </p>

      <div className="flex justify-center">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          900+ Internships
        </span>
      </div>

    </div>

  </div>

  {/* Button */}
  <div className="flex justify-center mt-14">
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all">
      View All Categories →
    </button>
  </div>

</section>

  <section className="py-20">

  <h2 className="text-center text-4xl font-bold mb-12">
    How It Works
  </h2>

 <div className="grid md:grid-cols-3 gap-8">

  {/* Create Profile */}
  <div className="bg-white shadow-xl p-8 rounded-3xl text-center hover:-translate-y-2 transition-all duration-300">

    <div className="w-20 h-20 mx-auto mb-5 bg-blue-100 rounded-full flex items-center justify-center">
      <div className="text-4xl">📝</div>
    </div>

    <h3 className="font-bold text-xl mb-3">
      Create Profile
    </h3>

    <p className="text-gray-600">
      Build your professional profile in minutes.
    </p>

  </div>

  {/* Discover Opportunities */}
  <div className="bg-white shadow-xl p-8 rounded-3xl text-center hover:-translate-y-2 transition-all duration-300">

    <div className="w-20 h-20 mx-auto mb-5 bg-blue-100 rounded-full flex items-center justify-center">
      <div className="text-4xl">🔍</div>
    </div>

    <h3 className="font-bold text-xl mb-3">
      Discover Opportunities
    </h3>

    <p className="text-gray-600">
      Browse thousands of internships and jobs.
    </p>

  </div>

  {/* Get Hired */}
  <div className="bg-white shadow-xl p-8 rounded-3xl text-center hover:-translate-y-2 transition-all duration-300">

    <div className="w-20 h-20 mx-auto mb-5 bg-blue-100 rounded-full flex items-center justify-center">
      <div className="text-4xl">🚀</div>
    </div>

    <h3 className="font-bold text-xl mb-3">
      Get Hired
    </h3>

    <p className="text-gray-600">
      Apply and start your career journey.
    </p>

  </div>

</div>

</section>


      {/* Big Buttons */}
      {!token && (
        <div className="flex flex-col md:flex-row justify-center items-center py-0 md:py-10 px-3 lg:px-0 ">
          <div className="min-h-[350px] p-5 lg:p-10 bg-blue-500 text-white flex justify-center items-center w-full lg:w-[35%]">
            <div className="">
              <h2 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-5">
                WANT TO HIRE INTERN?
              </h2>
              <p className="text-xl mb-10">
                Hire Interns with ease - Get Job Easy
              </p>
              <button className="text-2xl font-bold  px-10 py-4 rounded-md bg-gray-800 hover:bg-[#475865] border-1 border-white hover:scale-105 transition-0.5s">
                <Link to="/recruiter/signup ">Hire Now!</Link>
              </button>
            </div>
          </div>
          <div className="min-h-[350px] p-5 lg:p-10 bg-[#252d40] text-white flex justify-center items-center w-full lg:w-[35%]">
            <div className="">
              <h2 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-5">
                WANT TO BE HIRED?
              </h2>
              <p className="text-xl mb-10">
                10,000 Job Openings all Over India
              </p>
              <button className="text-2xl font-bold px-10 py-4 rounded-md bg-blue-500 border-1 border-white hover:scale-105 hover:transition-0.5s hover:bg-blue-600">
                <Link to="/student/signup"> Get Hired!</Link>
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="py-20">

  <h2 className="text-center text-4xl font-bold mb-12">
    Success Stories
  </h2>

  <div className="grid lg:grid-cols-3 gap-6">

    <div className="bg-white shadow-lg p-8 rounded-2xl">
      ⭐⭐⭐⭐⭐

      <p className="mt-4">
        Got my first React Internship through InternsNest.
      </p>

      <h3 className="font-bold mt-4">
        Rahul Sharma
      </h3>
    </div>

    <div className="bg-white shadow-lg p-8 rounded-2xl">
      ⭐⭐⭐⭐⭐

      <p className="mt-4">
        Amazing platform to find remote internships.
      </p>

      <h3 className="font-bold mt-4">
        Priya Verma
      </h3>
    </div>

    <div className="bg-white shadow-lg p-8 rounded-2xl">
      ⭐⭐⭐⭐⭐

      <p className="mt-4">
        Easy application process and verified companies.
      </p>

      <h3 className="font-bold mt-4">
        Ankit Patel
      </h3>
    </div>

  </div>

  <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl">

  <h2 className="text-center text-4xl font-bold mb-12">
    Frequently Asked Questions
  </h2>

  <div className="max-w-4xl mx-auto space-y-5">

    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold text-lg">
        Is InternsNest free?
      </h3>
      <p className="text-gray-600 mt-2">
        Yes, students can create accounts and apply for internships free of cost.
      </p>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold text-lg">
        Are companies verified?
      </h3>
      <p className="text-gray-600 mt-2">
        We verify recruiters before listing opportunities.
      </p>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold text-lg">
        Can I apply for remote internships?
      </h3>
      <p className="text-gray-600 mt-2">
        Yes, many remote opportunities are available.
      </p>
    </div>

  </div>

</section>

</section>

      {/* customers */}
      <div className="px-3 lg:px-5 py-10 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t-2 bg-[#f0fbff]">
        <div className="border-r-2 flex flex-col  lg:gap-3 justify-center items-center mb-10 lg:mb-0">
          <h2 className="text-3xl lg:text-5xl font-bold text-blue-600">1K+</h2>
          <p className="text-xl text-gray-600 font-semibold">
            Companies Hiring
          </p>
        </div>
        <div className="border-r-2 flex flex-col  lg:gap-3 justify-center items-center mb-10 lg:mb-0">
          <h2 className="text-3xl lg:text-5xl font-bold text-blue-600">10K+</h2>
          <p className="text-xl text-gray-600 font-semibold">New Openings</p>
        </div>
        <div className="border-r-2 flex flex-col  lg:gap-3 justify-center items-center mb-10 lg:mb-0">
          <h2 className="text-3xl lg:text-5xl font-bold text-blue-600">21k+</h2>
          <p className="text-xl text-gray-600 font-semibold">Active students</p>
        </div>
        <div className="flex flex-col  lg:gap-3 justify-center items-center mb-10 lg:mb-0">
          <h2 className="text-3xl lg:text-5xl font-bold text-blue-600">5k+</h2>
          <p className="text-xl text-gray-600 font-semibold">Learners</p>
        </div>
      </div>
      {/* footer top */}
      {!token && (
        <div className="bg-footer  h-64 w-full bg-no-repeat bg-cover px-5 py-5 lg:py-0 ">
          <div className="flex flex-col lg:flex-row justify-center items-center h-full gap-5">
            <h2 className="lg:flex-1 text-3xl lg:text-5xl text-white font-bold">
              Boost your career with InternsNest today
            </h2>
            <div className="lg:flex-1 flex gap-5 lg:justify-end">
              <Link
                to="/student/login"
                className="px-4 lg:px-10 py-1 lg:py-3 rounded-lg bg-white font-semibold flex items-center justify-center gap-2"
              >
                <img src={google_pic} alt="" className="w-5 h-5 py-0 px-0 " />
                <span> Continue With Google</span>
              </Link>
              <Link
                to="/student/signup"
                className="px-10 py-3 rounded-lg bg-blue-800 text-white font-semibold"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
    
  );
};

export default RightSide;