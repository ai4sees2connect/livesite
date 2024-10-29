import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import api from '../common/server_url'
import vids from '../../videos/vids.mp4'
import vids2 from '../../videos/vids2.mp4'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import '../student/utilscss/swiper.css'

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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaClock, FaMoneyBillWave, FaQuestion } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Spinner from "../common/Spinner";

// const images = [
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
//   "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
// ];

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

  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token])

  useEffect(() => {
    const fetchInternships = async () => {
      // const cachedInternships = localStorage.getItem("cachedInternships");

      try {
        // console.log("LocationName", selectedLocation);
        // console.log("WorkType:", workType);
        // console.log("profile", selectedProfile);


        const response = await axios.get(`${api}/student/internships/top-15`);

        // setAppliedInternships(appliedResponse.data);
        const sortedInternships = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const internshipsWithLogo = await Promise.all(
          sortedInternships.map(async (internship) => {
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
        // localStorage.setItem('cachedInternships', JSON.stringify(internshipsWithLogo));
        console.log("internhsipswith logo", internshipsWithLogo);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to fetch internships. Please try again later.");
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const settings = {
    dots: true, // Show dots for navigation
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Number of slides to show at once
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 712,
        settings: {
          slidesToShow: 3, // Adjust based on screen size
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 467,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if(!internships){
    return <Spinner/>
  }

  return (
    <div className="">
      {/* <button className="fixed right-10 bottom-5 border border-black h-[46px] w-[220px] text-center bg-blue-400 rounded-md z-20 font-semibold hover:bg-green-600">
      <FontAwesomeIcon icon={faPhone} className="text-black mr-2" />
      Contact Us</button> */}
      {/* Trending Courses */}
      <div className="px-3 lg:px-5 ">
        <h1 className="text-2xl font-bold py-5 text-center mb-5">
          Trending on InternsNest
          <FontAwesomeIcon
            icon={faFire}
            className="text-orange-600 ml-2 fa-beat"
          />
        </h1>

        <div className="w-full overflow-hidden">
          <video src={vids2} autoPlay muted loop className="md:w-[50%] md:h-[30%] mx-auto  ">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      {/* Recommended jobs */}
      <div className="my-10 px-3 lg:px-5 py-10 bg-[#f0fbff] rounded-xl">
        <div className="text-center mb-10">
          <h1 className=" text-2xl font-bold px-9">Recommended for you</h1>
          <p className="text-black">
            as per your<span className="text-blue-600 ml-2">preferences</span>
          </p>
        </div>



        <div className="z-0 ">
          <Slider {...settings}>
            {internships?.map((intern, index) => (
               <div key={index} className="mx-0 md:mx-3 mb-6">
              <div key={index} className="shadow-lg border-2 p-4 rounded-lg max-h-[350px] bg-white mx-2"> {/* Changed mx-3 to mx-2 */}
                
                {/* Job company */}
                <div className="flex justify-between items-start border-b">
                  <div className="min-h-[100px]">
                    <h2 className="text-sm md:text-lg text-left font-semibold">{intern?.internshipName}</h2>
                    <p className="text-sm text-gray-600 text-left">{intern?.recruiter.companyName}</p>
                  </div>
                  <div>
                    {intern.logoUrl ? (
                      <img src={intern.logoUrl} alt={intern.logoUrl} className="md:min-w-20 md:min-h-20 min-w-14 max-h-14" />
                    ) : (
                      <FaBuilding />
                    )}
                  </div>
                </div>

                <button className="px-4 py-1 border-2 rounded-lg flex gap-2 items-center text-xs font-semibold text-gray-600 my-3">
                  <FontAwesomeIcon icon={faArrowRightLong} className="text-blue-600" />
                  Actively Hiring
                </button>

                {/* Location, money, time */}
                <div className="my-2 space-y-1 lg:space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faLocationDot} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {intern.internLocation ? `${intern.internLocation}` : "Remote"}
                    </span>
                  </div>

                  <div className="text-sm md:text-base flex items-center text-gray-700 mb-2">
                    <FaClock className="mr-1" />
                    <span>{intern.duration} Months</span>
                  </div>

                  {intern.stipendType === "unpaid" && (
                    <div className="flex items-center text-gray-700 mb-2">
                      <FaMoneyBillWave className="mr-1" />
                      <span>Unpaid</span>
                    </div>
                  )}

                  {intern.stipendType !== "unpaid" && (
                    <div className="flex items-center space-x-0">
                      <div className="text-sm md:text-base text-gray-700 mb-2">
                        {/* <FaMoneyBillWave className="mr-1" /> */}
                        <span className="ml-0">
                          
                          {intern.currency} {intern.stipend} /month
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
                <div className="flex flex-col lg:flex-row space-y-3 justify-between items-center mt-5">
                  <p className="text-xs text-gray-600 bg-gray-300 rounded-md px-2 py-1 lg:px-3">{intern?.internshipType}</p>
                  <button className="px-2 lg:px-4 py-1 border-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-500">
                    See Details
                  </button>
                </div>
              </div>
              </div>
            ))}
          </Slider>

        </div>
      </div>



      {/* Placement */}
      <div className="my-10 px-3 lg:px-5">
        <h1 className="text-2xl font-bold py-5 px-9 text-center">
          Placement Guarantee Courses
        </h1>
        <div className="">
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            freeMode={true}
            pagination={{
              clickable: true,
            }}
            navigation={{
              clickable: true,
            }}
            modules={[FreeMode, Pagination, Navigation]}
            breakpoints={{
              1200: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              280: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
            }}
            className="mySwiper"
          >
            {courses?.map((job, index) => (
              <SwiperSlide key={index}>
                <div className="mx-3 lg:mx-0 shadow-xl border-2 rounded-lg min-h-[420px]">
                  <img
                    src={job?.image}
                    alt=""
                    className="w-full max-h-[180px] hover:cursor-pointer"
                  />
                  <div className="p-5 h-[270px] space-y-3">
                    <h1 className="text-lg font-semibold">
                      {job?.courseTitle}
                    </h1>
                    <button className="text-sm px-3 bg-orange-200 rounded-lg font-semibold text-gray-600">
                      Course With Guaranteed Job
                    </button>
                    {/* location money time */}
                    <div className="my-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FontAwesomeIcon
                          icon={faBriefcase}
                          className="text-gray-500"
                        />

                        <span className="text-sm text-gray-600">
                          {job?.totalOpportunities} Opportunities
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FontAwesomeIcon
                          icon={faWallet}
                          className="text-gray-500"
                        />
                        <span className="text-sm text-gray-600">
                          Expected {job?.expectedSalary} /Month
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FontAwesomeIcon
                          icon={faBusinessTime}
                          className="text-gray-500"
                        />
                        <span className="text-sm text-gray-600">
                          {job?.courseTime}
                        </span>
                      </div>
                    </div>
                    <h1 className="text-blue-500 pt-5 hover:underline cursor-pointer">
                      Know More <FontAwesomeIcon icon={faChevronRight} />
                    </h1>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Certification */}
      <div className="my-10 px-3 lg:px-5 py-10 bg-[#f0fbff] rounded-xl">
        <h1 className="text-2xl font-bold py-5 px-9 text-center">
          Certification courses for you
        </h1>
        <div className="">
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            freeMode={true}
            pagination={{
              clickable: true,
            }}
            navigation={{
              clickable: true,
            }}
            modules={[FreeMode, Pagination, Navigation]}
            breakpoints={{
              1200: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              280: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
            }}
            className="mySwiper"
          >
            {certificates.map((course, index) => (
              <SwiperSlide key={index}>
                <div className="mx-3 lg:mx-0 shadow-xl border-2 rounded-lg min-h-[260px]">
                  <img
                    src={course?.image}
                    alt=""
                    className="w-full h-full hover:cursor-pointer max-h-[200px]"
                  />
                  <div className="p-5 h-[120px]">
                    <p className="text-sm text-gray-600">{course?.time}</p>
                    <h1 className="text-lg font-semibold">
                      {course?.courseName}
                    </h1>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="pr-2 border-r-2">
                        {course?.star}
                        <FontAwesomeIcon
                          className="text-orange-400 ml-1"
                          icon={faStar}
                        />
                      </p>
                      <p>{course?.totalLearner}Learner</p>
                    </div>
                  </div>
                  <h1 className="text-blue-500 pt-5 hover:underline cursor-pointer pl-5 pb-5">
                    Know More <FontAwesomeIcon icon={faChevronRight} />
                  </h1>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* customers */}
      <div className="px-3 lg:px-5 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t-2">
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
      <div className="bg-footer  h-64 w-full bg-no-repeat bg-cover px-5 py-5 lg:py-0">
        <div className="flex flex-col lg:flex-row justify-center items-center h-full gap-5">
          <h2 className="lg:flex-1 text-3xl lg:text-5xl text-white font-bold">
            Boost your career with InternsNest today
          </h2>
          <div className="lg:flex-1 flex gap-5 lg:justify-end">
            <button className="px-2 lg:px-10 py-1 lg:py-3 rounded-lg bg-white font-semibold flex items-center gap-3">
              <img src={google_pic} alt="" className="w-5 h-5 py-0 px-0 ml-5" />
              <span> Continue With Google</span>
            </button>
            <button className="px-10 py-3 rounded-lg bg-blue-800 text-white font-semibold">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
