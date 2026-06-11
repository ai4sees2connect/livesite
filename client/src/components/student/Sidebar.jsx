import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faFile } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

const bannerImg = "/backgrounds/about_image.jpeg";
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
<section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 overflow-hidden">

  {/* Background blobs */}
  <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl opacity-40"></div>
  <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-cyan-200 rounded-full blur-3xl opacity-40"></div>

  <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

    {/* LEFT CONTENT */}
    <div>
      <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
        Find Internships that
        <span className="text-blue-600"> actually match you</span>
      </h1>

      <p className="mt-6 text-lg text-gray-600">
        Discover verified internships, connect with recruiters, and start building your career in minutes.
      </p>

      {/* Search Card */}
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

      {/* CTA Buttons */}
      <div className="flex gap-4 mt-6">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">
          Explore Internships
        </button>

        <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl font-semibold">
          Post Internship
        </button>
      </div>

    </div>

    {/* RIGHT VISUAL */}
    {/* RIGHT VISUAL */}
<div className="relative flex justify-center items-center">

  {/* background glow */}
  <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
  <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-40"></div>

  {/* IMAGE */}
  <img
    src={bannerImg}
    alt="hero"
    className="w-[420px] lg:w-[520px] object-contain rounded-3xl shadow-2xl relative z-10"
  />

</div>

      </div>

</section>
);
};

export default Sidebar;