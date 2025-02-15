import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="containerf">
        <div className="section">
          <h2>BakeNest</h2>
          <p>
            Home Bakery Platform
          </p>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        {/* <div className="section">
          <h3>Company</h3>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#product">Products</a>
            </li>
            <li>
              <a href="#Aboutus">About Us</a>
            </li>
            <li>
              <a href="#Contact">Contact Us</a>
            </li>
          </ul>
        </div> */}
        <div className="section">
          <h3>Contact</h3>
          <p>+91 9316281115</p>
          <p>
            <a href="http://localhost:5173/contact">http://localhost:5173/contact</a>
          </p>
          <p>
            <a href="mailto:bakenest9@gmail.com">
            bakenest9@gmail.com</a>
          </p>
          <p>139, CHARUSAT Campus, Highway, Off, Nadiad - Petlad Rd, Changa, Gujarat 388421</p>
        </div>
        {/* <div className="section">
          <h3>Get the latest information</h3>
          <div className="newsletter">
            <input type="email" placeholder="Email address" />
            <button>&gt;</button>
          </div>
        </div> */}
      </div>
      <div className="bottom-bar">
        <p>Copyright © 2024 HomeMakerBakery App. All Rights Reserved.</p>
        <p>
          <a href="#">User Terms & Conditions</a> |{" "}
          <a href="#">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
