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
<section className="min-h-[650px] py-20 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 mb-10">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">

    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">

      {/* LEFT CONTENT */}
      <div className="lg:pr-10">

        <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold text-black leading-tight">
          Find. Apply. Get Hired.
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mt-2">
          All in One Place
        </h2>

        <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-2xl leading-relaxed">
          Discover internships, connect with recruiters, and kickstart your
          career with InternsNest.
        </p>

        {/* Search Box */}
        <div className="mt-10 bg-white rounded-2xl shadow-xl border overflow-hidden max-w-4xl">

          <div className="flex flex-col md:flex-row">

            <input
              type="text"
              placeholder="Search internships, roles or skills"
              className="flex-1 px-6 py-5 outline-none"
            />

            <input
              type="text"
              placeholder="Location"
              className="flex-1 px-6 py-5 outline-none md:border-l"
            />

            <button className="bg-blue-600 text-white px-10 py-5 font-semibold hover:bg-blue-700 transition">
              Search
            </button>

          </div>

        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">

          <button className="bg-blue-100 text-blue-700 border border-blue-200 px-6 py-3 rounded-xl font-medium hover:bg-blue-200 transition duration-300">
            🌍 Remote
          </button>

          <button className="bg-orange-100 text-orange-700 border border-orange-200 px-6 py-3 rounded-xl font-medium hover:bg-orange-200 transition duration-300">
            🏢 Work From Office
          </button>

          <button className="bg-purple-100 text-purple-700 border border-purple-200 px-6 py-3 rounded-xl font-medium hover:bg-purple-200 transition duration-300">
            ⚡ Hybrid
          </button>

        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mt-10">

          <Link
            to="/internships/all-internships"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Explore Internships
          </Link>

          <Link
            to="/recruiter/signup"
            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition duration-300"
          >
            Post Internship
          </Link>

        </div>

      </div>

      {/* RIGHT IMAGE */}
      <div className="relative flex justify-center">

        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-20"></div>

        <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-indigo-300 rounded-full blur-3xl opacity-20"></div>

        <img
          src={bannerImg}
          alt="hero"
          className="w-full max-w-[520px] rounded-[30px] shadow-2xl relative z-10"
        />

        <div className="absolute bottom-6 left-6 bg-white shadow-xl rounded-2xl p-4 z-20">
          <h3 className="font-bold text-lg text-gray-800">
            🔥 500+ New Internships
          </h3>
          <p className="text-gray-500 text-sm">
            Added this week
          </p>
        </div>

      </div>

    </div>

  </div>
</section>
);
};

export default Sidebar;