import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

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
import { useEffect } from "react";

const images = [
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
  "https://i.ibb.co.com/Gnxqh7p/2151003702.jpg",
];



const RightSide = () => {

  const token=localStorage.getItem('token');
  const navigate=useNavigate();
useEffect(() => {
  if(!token){
    navigate('/');
  }
}, [token])

  return (
    <div className="">
      {/* <button className="fixed right-10 bottom-5 border border-black h-[46px] w-[220px] text-center bg-blue-400 rounded-md z-20 font-semibold hover:bg-green-600">
      <FontAwesomeIcon icon={faPhone} className="text-black mr-2" />
      Contact Us</button> */}
      {/* Trending Courses */}
      <div className="px-3 lg:px-5">
        <h1 className="text-2xl font-bold py-5 text-center mb-5">
          Trending on InternsNest
          <FontAwesomeIcon
            icon={faFire}
            className="text-orange-600 ml-2 fa-beat"
          />
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
                slidesPerView: 3,
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
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt=""
                  className="px-3 lg:px-0 min-h-[260px] hover:cursor-pointer w-full h-full object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
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
                spaceBetween: 20,
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
            {jobs?.map((job, index) => (
              <SwiperSlide key={index}>
                <div className="mx-3 lg:mx-0 shadow-xl border-2 p-4 rounded-lg min-h-[330px]">
                  <button className="px-4 py-1 border-2 rounded-lg flex gap-2 items-center text-xs font-semibold text-gray-600 mb-3">
                    <FontAwesomeIcon
                      icon={faArrowRightLong}
                      className="text-blue-600"
                    />
                    Actively Hiring
                  </button>
                  {/* job company */}
                  <div className="flex justify-between items-center border-1 border-b">
                    <div className="min-h-[100px]">
                      <h2 className="text-lg font-semibold">{job?.jobTitle}</h2>
                      <p className="text-sm text-gray-600">
                        {job?.companyName}
                      </p>
                    </div>
                    <div>
                      <img src={job?.logo} alt="" className="h-[50px] w-full" />
                    </div>
                  </div>
                  {/* location money time */}
                  <div className="my-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-gray-500"
                      />
                      <span className="text-sm text-gray-600">
                        {job?.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon
                        icon={faWallet}
                        className="text-gray-500"
                      />
                      <span className="text-sm text-gray-600">
                        {job?.salary} /Month
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon
                        icon={faBusinessTime}
                        className="text-gray-500"
                      />
                      <span className="text-sm text-gray-600">{job?.time}</span>
                    </div>
                  </div>
                  {/* buttons */}
                  <div className="flex justify-between items-center mt-16">
                    <p className="text-xs text-gray-600 bg-gray-300 rounded-md px-3">
                      {job?.jobType}
                    </p>
                    <button className="px-4 py-1 border-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-0.5s">
                      See Details
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
