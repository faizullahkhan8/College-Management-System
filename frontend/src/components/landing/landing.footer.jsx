import React from "react";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative mt-20 w-[70%] py-8 flex justify-center max-w-max-auto mx-auto rounded-2xl ">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left: Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-normal text-gray-500">
          <a href="#privacy" className="hover:text-blue-600 transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-blue-600 transition-colors duration-300">
            Terms of Service
          </a>
          <a href="#contact" className="hover:text-blue-600 transition-colors duration-300">
            Contact Us
          </a>
        </div>

        {/* Center: Social Icons */}
        <div className="flex gap-4 text-xl">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500 transition-all duration-300 hover:scale-110"
          >
            <FaTwitter />as
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            clsName="text-gray-500 hover:text-pink-500 transition-all duration-300 hover:scale-110"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-700 transition-all duration-300 hover:scale-110"
          >
            <FaLinkedin />
          </a>
          
        </div>

        {/* Right: Copyright */}
        <div className="text-xs text-center md:text-right text-gray-500">
          © {new Date().getFullYear()} <span className="font-semibold text-slate-800">campusConnect</span>. All rights reserved.
        </div>
      </div>

      {/* Subtle gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60" />
    </footer>
  );
};

export default Footer;
