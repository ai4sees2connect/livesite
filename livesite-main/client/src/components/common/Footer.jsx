import React from "react";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">

      {/* Top Gradient Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-10">

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 text-center mb-10">

          <Link
            to="/about-us"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Contact Us
          </Link>

          <Link
            to="/privacy-policy"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms-conditions"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Terms & Conditions
          </Link>

          <Link
            to="/cancellation"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Cancellation Policy
          </Link>

        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-10">

          <a
            href="https://www.instagram.com/ai4seespvtltd/?next=%2F&hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-pink-600 transition-all duration-300">
              <FaInstagram className="text-xl" />
            </div>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61565777621917"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-blue-500 transition-all duration-300">
              <FaFacebook className="text-xl" />
            </div>
          </a>

          <a
            href="https://www.linkedin.com/company/ai4sees/?originalSubdomain=in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-sky-500 transition-all duration-300">
              <FaLinkedin className="text-xl" />
            </div>
          </a>

          <a
            href="https://x.com/Ai4See"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-black transition-all duration-300">
              <FontAwesomeIcon
                icon={faXTwitter}
                className="text-xl"
              />
            </div>
          </a>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">

            <div>
              <p className="text-gray-300">
                © Copyright 2024 Internsnest
              </p>

              <p className="text-lg font-medium text-white mt-1">
                Powered by AI4SEE PRIVATE LIMITED
              </p>
            </div>

            <div className="text-gray-300 text-sm max-w-md md:text-right">
              9th Main Road, Vysya Bank Colony, New Gurappana Palya,
              1st Stage, BTM 1st Stage, Bengaluru, Karnataka
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;