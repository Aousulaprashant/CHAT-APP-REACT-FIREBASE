import React, { useEffect, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import "./Footer.css"; // Make sure to import the CSS file

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Check if the user has scrolled to the bottom of the page
    if (scrollTop + windowHeight >= docHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`footer ${isVisible ? "visible" : ""}`}>
      <h4>
        Designed & developed by <span>PRASHANTH</span>
      </h4>

      <div className="icons">
        <a href="https://aousulaprashanth-portfolio.netlify.app/">
          <MdContactMail />
        </a>
        <a
          href="https://www.linkedin.com/in/prashanth-aousula-161b19224/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/Aousulaprashant"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
      </div>
    </div>
  );
};

export default Footer;
