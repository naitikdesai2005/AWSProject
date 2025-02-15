import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingBasket, FaUserCircle } from "react-icons/fa";
import { StoreContext } from "../../pages/context/StoreContext";
import { assets } from "../../../images/assets";

const UserNavbar = () => {
  const [menu, setMenu] = useState("home");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { getTotalCartItems, logout } = useContext(StoreContext);
  const cartItemCount = getTotalCartItems();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center bg-white py-4 px-4 md:px-16">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" onClick={() => setMenu("home")}>
          <img src="../../images/Logo.png" alt="Logo" className="h-20 w-60" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center w-80">
        <input
          type="text"
          placeholder="Search..."
          className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:w-96 transition-all duration-300"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-8 text-gray-800">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={`hover:text-[#f79c3e] ${
            menu === "home" ? "text-[#f79c3e]" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/aboutus"
          onClick={() => setMenu("About")}
          className={`hover:text-[#f79c3e] ${
            menu === "About" ? "text-[#f79c3e]" : ""
          }`}
        >
          About
        </Link>
        {/* <Link
          to="/products"
          onClick={() => setMenu("Product")}
          className={`hover:text-[#f79c3e] ${
            menu === "Product" ? "text-[#f79c3e]" : ""
          }`}
        >
          Products
        </Link> */}
        <Link
          to="/contact"
          onClick={() => setMenu("Contact")}
          className={`hover:text-[#f79c3e] ${
            menu === "Contact" ? "text-[#f79c3e]" : ""
          }`}
        >
          Contact
        </Link>
      </div>

      {/* Cart Icon with Badge and Profile Icon */}
      <div className="flex items-center space-x-4">
        {/* Cart Icon */}
        <div className="relative">
          <Link to="/cart">
            <FaShoppingBasket className="h-8 w-8 text-gray-800 hover:text-[#f79c3e]" />
          </Link>
          {cartItemCount > 0 && (
            <span className="absolute top-[-20px] right-[-10px] bg-black text-white text-xs font-bold rounded-full px-2 py-1">
              {cartItemCount}
            </span>
          )}
        </div>

        {/* Profile Button and Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="text-gray-800">
            <FaUserCircle className="mt-2 h-8 w-8 text-gray-800" />{" "}
          </button>
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/myorders"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Orders
              </Link>
              <a
                onClick={logout}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
