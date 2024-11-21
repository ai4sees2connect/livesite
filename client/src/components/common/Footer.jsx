import React, { useState } from "react";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <footer className="h-[220px] bg-gray-700 text-white">
      <div className="text-xs sm:text-base flex flex-col space-y-9 items-center max-w-full ">
        <div className="flex text-center   space-x-1   sm:space-x-4 border-b py-1 my-3 ">
          <Link to="/about-us" className="  md:px-2 hover:text-blue-300">
            About us
          </Link>
          <Link to="/contact" className=" px-1 md:px-2 hover:text-blue-300">
            Contact us
          </Link>
          <Link
            to="/privacy-policy"
            className="px-1 md:px-2 hover:text-blue-300"
          >
            Privacy policy
          </Link>
          <Link
            to="/terms-conditions"
            className="px-1 md:px-2 hover:text-blue-300"
          >
            Terms and conditions
          </Link>
          <Link to="/cancellation" className="px-1 md:px-2 hover:text-blue-300">
            Cancellation policy
          </Link>
        </div>
        <div className="flex space-x-10">
  <a
    href="https://www.instagram.com/ai4seespvtltd/?next=%2F&hl=en"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaInstagram className="w-7 h-8 hover:text-pink-500 cursor-pointer" />
  </a>
  <a
    href=" https://www.facebook.com/profile.php?id=61565777621917 "
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaFacebook className="w-7 h-8 hover:text-blue-400 cursor-pointer" />
  </a>
  <a
    href="https://www.linkedin.com/company/ai4sees/?originalSubdomain=in"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaLinkedin className="w-7 h-8 hover:text-blue-500 cursor-pointer" />
  </a>
  <a
    href="https://twitter.com/uzzaman_al"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FontAwesomeIcon
      icon={faXTwitter}
      className="w-7 h-8 hover:text-black cursor-pointer"
    />
  </a>
</div>
      </div>
    </footer>
  );
};

export default Footer;
