import React, { useState, useContext } from "react";
import Navbar from "../pages/Navbar/Navbar.jsx";
import Menu from "../pages/menu/Menu.jsx";
import { Link } from "react-router-dom";
import Footer from "../pages/Footer/Footer.jsx";
import ProductDisplay from "../pages/ProductDisplay/ProductDisplay.jsx";
import { StoreContext } from "../../src/pages/context/StoreContext.jsx";
import UserNavbar from "../HomeUser/UserNavbar/UserNavbar.jsx";

function Homepage() {
  const [category, setCategory] = useState("All");
  const { isAuthenticated } = useContext(StoreContext);

  return (
    <div className="font-sans bg-white pt-40">
      {/* Navbar */}
      {isAuthenticated ? <UserNavbar /> : <Navbar />}

      {/* Mainpage Section with Text and Image */}
      <div className="mainpage flex justify-between items-center mb-12 mt-[-50px]">
        {/* Left Content Section */}
        <div className="mainpage-content text-center mx-8 md:mx-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#58231f] inline-block animate-fadeIn">
            Baked With Love
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-[#58231f] inline-block animate-fadeIn ml-2">
            Delivered With Care!
          </h2>
          <p className="mt-4 text-lg text-gray-800 max-w-4xl mx-auto animate-fadeIn">
            Indulge in the sweetness of home-baked goodness, crafted with love
            and passion by talented home bakers. Each treat is made to
            perfection, just for you, bringing warmth and joy to every bite.
            Discover the magic of homemade flavors delivered right to your
            doorstep!
          </p>
          <br />
          <a>
            <Link
              to="/aboutus"
              className="know-button mt-8 py-3 px-6 text-black bg-white border-2 border-[#58231f] rounded-full cursor-pointer transition duration-300 hover:bg-[#58231f] hover:text-white"
            >
              Learn More
            </Link>
          </a>
        </div>

        {/* Image Section */}
        <div className="mainpage-image hidden md:block mr-24">
          <img
            src="/images/home.jpg"
            alt="background"
            className="w-[750px] h-[500px] object-cover rounded-lg"
          />
        </div>
      </div>
      <br />
      <br />

      {/* Menu Section */}
      {/* <Menu category={category} setCategory={setCategory} /> */}

      {/* Product Display Section */}
      <ProductDisplay category={category} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Homepage;
