import React, { useContext } from "react";
import Navbar from "../Navbar/Navbar";
import UserNavbar from "../../HomeUser/UserNavbar/UserNavbar";
import { StoreContext } from "../context/StoreContext";

const Aboutus = () => {
  const { isAuthenticated } = useContext(StoreContext);

  return (
    <>
      {isAuthenticated ? <UserNavbar /> : <Navbar />}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="about-us-container mt-30 mx-auto px-4 md:px-16 text-center">
        <div className="about-us-content flex flex-wrap justify-center items-center">
          <div className="about-us-text max-w-2xl mx-4 text-left animate-fadeInLeft">
            <h2 className="text-3xl text-gray-700 mb-6 relative">
              Our Story
              <span className="absolute left-0 bottom-[-10px] w-12 h-1 bg-[#ff7e5f]"></span>
            </h2>
            <p className="text-lg leading-7 mb-5">
              Our journey began with a love for good, homemade food. What
              started as a small bakery in the heart of the town has now
              blossomed into a beloved community hub. At Happy Bakes, we craft
              each treat with passion and care, from the first crack of an egg
              to the final sprinkle of sugar.
            </p>
            <p className="text-lg leading-7 mb-5">
              We believe in the magic of a warm cookie, the joy of a beautifully
              frosted cake, and the community that food can bring together.
              Every bite tells a story, and we are proud to be part of so many
              special moments in our customers' lives.
            </p>
            <p className="text-lg leading-7 mb-5">
              Whether it's a morning muffin with coffee or a custom cake for a
              special celebration, we are here to make every moment a bit
              sweeter. Join us at Happy Bakes, where every visit is a treat, and
              every treat is a story.
            </p>
            <p className="italic text-gray-700 mt-5">
              Saloni, Rishee, Roshni, Naitik
            </p>
          </div>
          <div className="about-us-image max-w-xs mx-4 animate-fadeInRight">
            <img
              src="../../images/cake.jpg"
              className="w-full rounded-xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutus;
