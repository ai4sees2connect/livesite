import React, { useState } from "react";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <footer className="bg-gray-800 text-white py-10">
      
      <div className="max-w-7xl mx-auto px-6">

        {/* TOP LINKS */}
        <div className="flex flex-wrap justify-center gap-10 border-b border-gray-600 pb-6 text-sm md:text-base">
          
          <Link to="/about-us" className="hover:text-blue-300 transition">
            About us
          </Link>

          <Link to="/contact" className="hover:text-blue-300 transition">
            Contact us
          </Link>

          <Link to="/privacy-policy" className="hover:text-blue-300 transition">
            Privacy policy
          </Link>

          <Link to="/terms-conditions" className="hover:text-blue-300 transition">
            Terms and conditions
          </Link>

          <Link to="/cancellation" className="hover:text-blue-300 transition">
            Cancellation policy
          </Link>

        </div>

        {/* SOCIAL ICONS */}
        <div className="flex justify-center gap-10 mt-6">
          
          <a href="https://www.instagram.com/ai4seespvtltd/?next=%2F&hl=en" target="_blank" rel="noreferrer">
            <FaInstagram className="w-7 h-7 hover:text-pink-500 transition" />
          </a>

          <a href="https://www.facebook.com/people/Mehaboob-Basha/pfbid0SKLzCLBMu9YapbLkU3iZJFZZQ3JNMuyynXN4ujMMswDEH9dvzf36f2929UaQMMr8l/" target="_blank">
            <FaFacebook className="w-7 h-7 hover:text-blue-400 transition" />
          </a>

          <a href="https://www.linkedin.com/company/ai4sees/?originalSubdomain=in" target="_blank">
            <FaLinkedin className="w-7 h-7 hover:text-blue-500 transition" />
          </a>

          <a href="https://x.com/Ai4See" target="_blank">
            <FontAwesomeIcon
              icon={faXTwitter}
              className="w-6 h-6 hover:text-black transition"
            />
          </a>

        </div>

        {/* BOTTOM SECTION (LEFT + RIGHT SPLIT) */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">

          {/* LEFT SIDE */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-sm">
              © Copyright 2024 Internsnest
            </p>

            <p className="text-sm text-gray-300">
              ( Powered by AI4SEE PRIVATE LIMITED )
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="text-center md:text-right text-sm text-gray-300 max-w-md leading-relaxed">
            9th Main Road, Vysya Bank Colony, New Gurappana Palya, 1st Stage,
            BTM 1st Stage, Bengaluru, Karnataka
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
