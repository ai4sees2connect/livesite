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

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

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
  console.log('this is id',userId)


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
        console.log('internship fetched',response.data);

       



        setInternships(response.data);
      
        // console.log("internhsipswith logo", internshipsWithLogo);
        

        setLoading(false);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to fetch internships. Please try again later.");
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  useEffect(()=>{
  if(internships.length>0){
    const fetchLogos=async()=>{
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
  },[internships])

  console.log(internships);

  const settings = {
    dots: internships?.length > 1, // Show dots for navigation
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(internships.length, 3), // Number of slides to show at once
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

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
    <div className="">
      {/* <button className="fixed right-10 bottom-5 border border-black h-[46px] w-[220px] text-center bg-blue-400 rounded-md z-20 font-semibold hover:bg-green-600">
      <FontAwesomeIcon icon={faPhone} className="text-black mr-2" />
      Contact Us</button> */}
      {/* Trending Courses */}
      <div className="px-3 lg:px-5 ">
        {/* <h1 className="text-2xl font-bold py-5 text-center mb-5">
          Trending on InternsNest
          <FontAwesomeIcon
            icon={faFire}
            className="text-orange-600 ml-2 fa-beat"
          />
        </h1> */}

        {/* <div className="w-full overflow-hidden">
          <video
            src={vids2}
            autoPlay
            muted
            loop
            className="md:w-[50%] md:h-[30%] mx-auto  "
          >
            Your browser does not support the video tag.
          </video>
        </div> */}
      </div>
      {/* Quick Links */}
      <div className=" my-10 px-3 lg:px-0 rounded-md mx-auto lg:w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-center gap-5 justify-center">
          <Link to={userId ? `/student/internships/${userId}/Work-from-Home` : `/internships/Work-from-Home`
        } className="flex items-center px-5 py-2 rounded-md  border-2 border-blue-300 text-xl hover:scale-105 duration-300 hover:transition-0.5s  text-black font-semibold justify-between">
            <span > Remote</span> <FaLongArrowAltRight />
          </Link>
          <Link to={userId ? `/student/internships/${userId}/Work-from-Office` : `/internships/Work-from-Office`} className="flex items-center px-5 py-2 rounded-md  border-2 border-blue-300 text-xl hover:scale-105 duration-300 hover:transition-0.5s  text-black font-semibold justify-between">
            <span> Work At Office</span> <FaLongArrowAltRight />
          </Link>
          <Link to={userId ? `/student/internships/${userId}/Hybrid` : `/internships/Hybrid`} className="flex items-center px-5 py-2 rounded-md  border-2 border-blue-300 text-xl hover:scale-105 duration-300 hover:transition-0.5s  text-black font-semibold justify-between">
            <span> Hybrid</span> <FaLongArrowAltRight />
          </Link>
          <button className="px-5 py-2 rounded-md border-2  text-xl hover:scale-105 hover:transition-0.5s duration-300 text-white font-semibold  bg-[#475865] hover:bg-black border-1 border-white  transition-0.5s">
            <Link
              className="flex items-center justify-between"
              to={userId ? `/student/internships/All-Internships` : `/internships/All-Internships`}
            >
              <span> All Internships</span> <FaLongArrowAltRight />
            </Link>
          </button>
          <button className=" px-5 py-2 rounded-md border-2 text-xl hover:transition-0.5s  font-semibold  bg-blue-500 border-1 border-white hover:scale-105 hover:transition-0.5s duration-300 hover:bg-blue-600 text-white">
            <Link
              className="flex items-center justify-between"
              to="/recruiter/signup"
            >
              <span>Want To Hire</span> <FaLongArrowAltRight />
            </Link>
          </button>
        </div>
      </div>
      {/* Recommended jobs */}
      <div className="my-5 px-3 lg:px-5 py-10 bg-[#f0fbff] rounded-xl">
        <div className="text-center mb-10">
          <h1 className=" text-2xl lg:text-3xl font-bold px-9">
            Recommended For You
          </h1>
          <p className=" text-blue-600 ml-2 text-xl">Latest internships</p>
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
                    <Link
                      to={`/${token ? "student/" : ""}internships${
                        token ? `/${userId}` : ""
                      }`}
                      className="px-2 lg:px-4 py-1 border-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-500"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

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
                <Link to="/student/signup"> Get Job!</Link>
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="bg-footer  h-64 w-full bg-no-repeat bg-cover px-5 py-5 lg:py-0">
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
    </div>
  );
};

export default RightSide;
