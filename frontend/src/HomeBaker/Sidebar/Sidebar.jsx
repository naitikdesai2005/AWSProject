import React, { useState } from "react";
import { Home, ShoppingBag, Package, ChevronLeft, Menu } from "lucide-react";

const Sidebar = ({ setActiveComponent }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("add");

  const handleItemClick = (item) => {
    setActiveItem(item);
    setActiveComponent(item);
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 
      ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-[#773631]">Dashboard</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-[#fff0ed] transition-colors text-[#773631]"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-3 space-y-2 overflow-y-auto">
        <SidebarItem
          icon={<Home size={20} />}
          label="Add Items"
          isCollapsed={isCollapsed}
          isActive={activeItem === "add"}
          onClick={() => handleItemClick("add")}
        />
        <SidebarItem
          icon={<ShoppingBag size={20} />}
          label="List Items"
          isCollapsed={isCollapsed}
          isActive={activeItem === "list"}
          onClick={() => handleItemClick("list")}
        />
        <SidebarItem
          icon={<Package size={20} />}
          label="Orders"
          isCollapsed={isCollapsed}
          isActive={activeItem === "orders"}
          onClick={() => handleItemClick("orders")}
        />
      </nav>

      {/* Footer - Admin Info */}
      {/* <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#773631] to-[#a85751]" />
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-[#773631]">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          )}
        </div>
      </div> */}
    </aside>
  );
};

const SidebarItem = ({ icon, label, isActive, isCollapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-[#f79c3e] to-[#fab46e] text-white shadow-md hover:shadow-lg'
          : 'text-gray-600 hover:bg-[#fff0ed]'
        }
        ${isCollapsed ? 'justify-center' : 'justify-start'}
        group focus:outline-none focus:ring-2 focus:ring-[#fff0ed]`}
    >
      <div className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#f79c3e]'}`}>
        {icon}
      </div>
      
      {!isCollapsed && (
        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#773631]'}`}>
          {label}
        </span>
      )}
      
      {!isCollapsed && isActive && (
        <div className="ml-auto w-2 h-2 rounded-full bg-white" />
      )}
    </button>
  );
};

export default Sidebar;