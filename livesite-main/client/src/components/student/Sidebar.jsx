import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faFile } from "@fortawesome/free-solid-svg-icons";
import bannerImg from "../../images/about_image.jpeg";
import { Link } from "react-router-dom";

const Sidebar = ({ student }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  console.log("this student is inside sidebarrrr", student);
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyLargeScreen = window.innerWidth >= 770;
      setIsLargeScreen(isCurrentlyLargeScreen);
      console.log("Screen size changed:", isCurrentlyLargeScreen);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    return (
<section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">

  {/* Background Blurs */}
  <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl"></div>

  <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl"></div>

  {/* <div className="relative max-w-[1500px] mx-auto px-6 lg:px-12 py-20"> */}
    <div className="relative max-w-[98%] mx-auto py-20">

    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">

      {/* LEFT SIDE */}
      <div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-medium mb-8">
          🔥 500+ New Opportunities Added This Week
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-7xl md:text-7xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-gray-900">
          Find Your Dream
          <span className="block text-blue-600">
            Internship
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
          Discover internships, connect with top recruiters,
          and launch your career with opportunities from
          leading companies across India.
        </p>

        {/* Search Box */}
        <div className="mt-10 max-w-5xl bg-white rounded-3xl shadow-2xl border border-white overflow-hidden">

          <div className="flex flex-col md:flex-row">

            <input
              type="text"
              placeholder="Search internships, skills, companies..."
              className="flex-1 px-5 py-4 outline-none text-lg"
            />

            <input
              type="text"
              placeholder="Location"
              className="flex-1 px-5 py-4 outline-none md:border-l text-lg"
            />

            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 font-semibold hover:scale-105 transition-all duration-300">
              Search
            </button>

          </div>

        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mt-8">

          <button className="px-5 py-3 rounded-full bg-blue-100 text-blue-700 hover:scale-105 transition">
            🌍 Remote
          </button>

          <button className="px-5 py-3 rounded-full bg-orange-100 text-orange-700 hover:scale-105 transition">
            🏢 Work From Office
          </button>

          <button className="px-5 py-3 rounded-full bg-purple-100 text-purple-700 hover:scale-105 transition">
            ⚡ Hybrid
          </button>

        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-5 mt-10">

          <Link
            to="/internships/all-internships"
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:-translate-y-1 hover:bg-blue-700 transition-all"
          >
            Explore Opportunities →
          </Link>

          <Link
            to="/recruiter/signup"
            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 hover:-translate-y-1 transition-all"
          >
            Hire Talent →
          </Link>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="relative flex justify-center">

        <img
          src={bannerImg}
          alt="hero"
          className="w-full max-w-[650px] rounded-[20px] shadow-2xl"
        />

      </div>

</div>

    </div>

</section>
);
};

export default Sidebar;
