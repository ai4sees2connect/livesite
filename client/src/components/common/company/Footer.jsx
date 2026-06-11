import React, { useState } from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaMapMarkerAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const internsnestLogo3 = "/logos/INTERNSNEST LOGO.png";
const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Social Media Links with their specific brand hover colors
  const socialLinks = [
    { name: 'instagram', href: "https://www.instagram.com/ai4seespvtltd/?next=%2F&hl=en", icon: FaInstagram, hoverColor: '#E4405F' },
    { name: 'facebook', href: "https://www.facebook.com/people/Mehaboob-Basha/pfbid0SKLzCLBMu9YapbLkU3iZJFZZQ3JNMuyynXN4ujMMswDEH9dvzf36f2929UaQMMr8l/", icon: FaFacebookF, hoverColor: '#1877F2' },
    { name: 'linkedin', href: "https://www.linkedin.com/company/ai4sees/?originalSubdomain=in", icon: FaLinkedinIn, hoverColor: '#0A66C2' },
    { name: 'twitter', href: "https://x.com/Ai4See", icon: FontAwesomeIcon, iconProp: faXTwitter, hoverColor: '#000000' },
  ];

  // Quick Navigation Links
  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/internships/All-Internships", label: "Browse Internships" },
    { to: "/student/login", label: "Student Login" },
    { to: "/recruiter/login", label: "Recruiter Login" },
  ];

  // Company & Policy Links
  const policyLinks = [
    { to: "/about-us", label: "About us" },
    { to: "/contact", label: "Contact us" },
    { to: "/privacy-policy", label: "Privacy policy" },
    { to: "/terms-conditions", label: "Terms and conditions" },
    { to: "/Cancellation", label: "Cancellation policy" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 text-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Logo, Description, and Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-100">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block">
              <img src={internsnestLogo3} alt="InternsNest Logo" className="h-12 object-contain" />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              InternsNest is a premier platform connecting ambitious students with top-tier internship opportunities and helping recruiters discover emerging talent. Build your future with us.
            </p>
            
            {/* Social Icons (Black by default, Brand Colors on Hover) */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => {
                const isHovered = hoveredIcon === social.name;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-transparent"
                    style={{
                      backgroundColor: isHovered ? social.hoverColor : 'transparent',
                      color: isHovered ? '#ffffff' : '#000000', // Black icon default
                    }}
                    onMouseEnter={() => setHoveredIcon(social.name)}
                    onMouseLeave={() => setHoveredIcon(null)}
                  >
                    {social.name === 'twitter' ? (
                      <social.icon icon={social.iconProp} className="w-4 h-4" />
                    ) : (
                      <social.icon className="w-4 h-4" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-base font-bold text-gray-900 mb-5 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-600 hover:text-[var(--primary-color)] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[var(--primary-color)] transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h4 className="text-base font-bold text-gray-900 mb-5 uppercase tracking-wide">Company</h4>
            <ul className="space-y-3 text-sm">
              {policyLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-600 hover:text-[var(--primary-color)] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[var(--primary-color)] transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Address */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} InternsNest. All rights reserved. 
            <span className="hidden md:inline mx-2">|</span>
            <br className="md:hidden" />
            <span className="text-gray-400">Powered by AI4SEE PRIVATE LIMITED</span>
          </p>
          
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-[var(--primary-color)] text-base" />
            <span>BTM Layout, Bengaluru, Karnataka</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;