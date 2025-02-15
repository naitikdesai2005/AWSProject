import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Verify.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Verify = () => {
  const url = "http://localhost:3000";
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const navigate = useNavigate();

  const verifyPayment = async () => {
    const response = await axios.post(url + "/api/order/verifyOrder", {
      success,
      orderId,
    });
    if (response.data.success) {
      navigate("/myorders");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <>
      <Navbar />
      <div className="verify">
        <div className="spinner"></div>
      </div>
      <Footer />
    </>
  );
};

export default Verify;
