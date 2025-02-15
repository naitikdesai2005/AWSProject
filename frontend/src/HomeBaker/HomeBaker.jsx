import React, { useState } from "react";
import HeaderBaker from "./HeaderBaker/HeaderBaker";
import Sidebar from "./Sidebar/Sidebar";
import "./HomeBaker.css";
import AddItems from "./AddItems/AddItems";
import ListItems from "./ListItems/ListItems";
import Orders from "./Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeBaker = () => {
  const [activeComponent, setActiveComponent] = useState("add");

  const renderComponent = () => {
    switch (activeComponent) {
      case "add":
        return <AddItems />;
      case "list":
        return <ListItems />;
      case "orders":
        return <Orders />;
      default:
        return <AddItems />;
    }
  };

  return (
    <div>
      <ToastContainer />
      <HeaderBaker />
      <hr />
      <div className="app-content">
        <Sidebar setActiveComponent={setActiveComponent} />
        <div className="content">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default HomeBaker;
