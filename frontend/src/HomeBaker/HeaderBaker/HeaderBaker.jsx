import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../pages/context/StoreContext";
import { FaSignOutAlt } from "react-icons/fa";

const HeaderBaker = () => {
  const { logout } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="flex justify-between items-center p-4 px-16 bg-white shadow-md">
      <img
        className="block ml-2"
        src={"../../../images/Logo.png"}
        alt="Logo"
        height="80"
        width="250"
      />
      <button
        onClick={handleLogout}
        className="text-gray-800 flex items-center"
      >
        <FaSignOutAlt className="mt-2 h-8 w-8 text-gray-800" />
      </button>
    </div>
  );
};

export default HeaderBaker;
