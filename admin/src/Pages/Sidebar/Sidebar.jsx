import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Coffee,
  Users,
  ShoppingCart,
  MessageCircle,
  LogOut,
} from "lucide-react";

const Sidebar = ({ visible, totalMessages }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col py-8 space-y-6 transition-transform duration-300 ${
        visible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-center mb-8">
        <img
          src="../../Image/Logo.png"
          alt="Logo"
          className="h-20 w-60 rounded-lg"
        />
      </div>

      <nav className="flex flex-col space-y-4 w-full px-8">
        <a
          href="/admindash"
          className="flex items-center text-gray-700 font-semibold hover:text-[#a0522d] transition-colors px-4 py-2 rounded-lg"
        >
          <Home className="w-6 h-6 mr-4" />
          <span className="text-lg">Dashboard</span>
        </a>
        <a
          href="/bakers"
          className="flex items-center text-gray-700 hover:text-[#a0522d] transition-colors px-4 py-2 rounded-lg"
        >
          <Coffee className="w-6 h-6 mr-4" />
          <span className="text-lg">Bakers</span>
        </a>
        <a
          href="/users"
          className="flex items-center text-gray-700 hover:text-[#a0522d] transition-colors px-4 py-2 rounded-lg"
        >
          <Users className="w-6 h-6 mr-4" />
          <span className="text-lg">Users</span>
        </a>
        <a
          href="/order"
          className="flex items-center text-gray-700 hover:text-[#a0522d] transition-colors px-4 py-2 rounded-lg"
        >
          <ShoppingCart className="w-6 h-6 mr-4" />
          <span className="text-lg">Orders</span>
        </a>

        {/* <a
          href="/messages"
          className="flex items-center text-gray-700 hover:text-[#a0522d] transition-colors px-4 py-2 rounded-lg relative"
        >
          <MessageCircle className="w-6 h-6 mr-4" />
          <span className="text-lg">User's Messages</span>
          {totalMessages > 0 && (
            <span className="absolute right-4 bg-[#fafaf9] text-[#a0522d] text-xs rounded-full px-2 py-0.5">
              {totalMessages}
            </span>
          )}
        </a> */}
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-700 hover:text-[#a0522d] transition-colors px-4 py-2 rounded-lg"
        >
          <LogOut className="w-6 h-6 mr-4" />
          <span className="text-lg">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
