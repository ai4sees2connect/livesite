import React, { useState } from 'react';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const Footer = () => {

  const [hoveredIcon, setHoveredIcon] = useState(null);

  return (
    <footer className='h-[220px] bg-gray-700 text-white'>
      <div className='text-xs sm:text-base flex flex-col space-y-9 items-center max-w-full '>
        <div className='flex text-center   space-x-1   sm:space-x-4 border-b py-1 my-3 '>
          <Link to='/about-us' className='  md:px-2 hover:text-blue-300'>About us</Link>
          <Link to='/contact' className=' px-1 md:px-2 hover:text-blue-300'>Contact us</Link>
          <Link to='/privacy-policy' className='px-1 md:px-2 hover:text-blue-300'>Privacy policy</Link>
          <Link to='/terms-conditions' className='px-1 md:px-2 hover:text-blue-300'>Terms and conditions</Link>
          <Link to='/cancellation' className='px-1 md:px-2 hover:text-blue-300'>Cancellation policy</Link>
        </div>
        <div className="flex space-x-10">
          <FaInstagram className='w-7 h-7 hover:text-pink-500'/>
          <FaFacebook className='w-7 h-7 hover:text-blue-400'/>
          <FaLinkedin className='w-7 h-7 hover:text-blue-500'/>
          <FontAwesomeIcon icon={faXTwitter} className='w-7 h-7 hover:text-black'/>
          

        </div>
        <div>
        © 2024 InternsNest. All rights reserved. A project by AI4SEE PVT LTD.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
