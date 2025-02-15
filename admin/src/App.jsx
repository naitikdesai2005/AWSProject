import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Admindash from "./Pages/AdminDash";
import Bakers from "./Pages/Bakers/Bakers";
import Users from "./Pages/Users/Users";
import Messages from "./Pages/Contact/Messages"
import "primereact/resources/themes/saga-blue/theme.css"; // Or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import AdminLogin from "./Pages/Login/Login";
import Orders from "./Pages/Orders/Orders";
import MainLoader from "./Pages/MainLoader";

function App() {
  const [loading,setloading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setloading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {
      loading? (
        <MainLoader />
      ) : (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLogin/>}/>
          <Route path="/admindash" element={<Admindash />} />
          <Route path="/bakers" element={<Bakers />} />
          <Route path="/users" element={<Users />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/order" element={<Orders />} />
        </Routes>
      </BrowserRouter>
      )}
    </>
  );
}

export default App;
