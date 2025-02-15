import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import UserNavbar from "../../HomeUser/UserNavbar/UserNavbar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const PlaceOrder = () => {
  const { getTotalCartAmount, isAuthenticated, token, food_list, cartItems } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const decode = jwtDecode(token);
  const u_id = decode.id;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    zipcode: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];

    food_list.forEach((item) => {
      if (cartItems[item._id]) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      userId: u_id,
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      address: data.street,
      phone: data.phone,
      items: orderItems,
    };

    try {
      let response = await axios.post(
        "http://localhost:3000/api/order/create",
        orderData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.href = session_url;
      } else {
        alert("Error creating order: " + response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order.");
    }
  };

  return (
    <>
      {isAuthenticated ? <UserNavbar /> : <Navbar />}
      <form
        onSubmit={placeOrder}
        className="flex flex-col md:flex-row mt-[170px] mb-[20px] gap-[30px] md:justify-around"
      >
        {/* Delivery Information Section */}
        <div className="max-w-[480px] w-full">
          <p className="text-[30px] font-semibold mb-[50px]">Delivery Information</p>
          <div className="flex flex-col md:flex-row gap-[10px] mb-[15px]">
            <input
              name="firstName"
              onChange={onChangeHandler}
              value={data.firstName}
              type="text"
              placeholder="First Name"
              required
              className="w-full md:w-[478px] p-[10px] border border-[#c5c5c5] rounded-[4px] outline-gray-500 mb-[15px]"
            />
            <input
              name="lastName"
              onChange={onChangeHandler}
              value={data.lastName}
              type="text"
              placeholder="Last Name"
              required
              className="w-full md:w-[478px] p-[10px] border border-[#c5c5c5] rounded-[4px] outline-gray-500 mb-[15px]"
            />
          </div>
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email address"
            required
            className="w-full md:w-[478px] p-[10px] border border-[#c5c5c5] rounded-[4px] outline-gray-500 mb-[15px]"
          />
          <input
            onChange={onChangeHandler}
            value={data.street}
            name="street"
            type="text"
            placeholder="Street"
            required
            className="w-full md:w-[478px] p-[10px] border border-[#c5c5c5] rounded-[4px] outline-gray-500 mb-[15px]"
          />
          <input
            onChange={onChangeHandler}
            value={data.phone}
            name="phone"
            type="text"
            placeholder="Phone"
            required
            className="w-full md:w-[478px] p-[10px] border border-[#c5c5c5] rounded-[4px] outline-gray-500 mb-[15px]"
          />
        </div>

        {/* Cart Totals Section */}
        <div className="max-w-[550px] w-full mt-10">
          <div className="p-[20px] rounded-[8px] bg-white">
            <h1 className="text-[24px] font-semibold mb-[20px]">Cart Totals</h1>

            <div className="flex justify-between text-lg mb-[10px]">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-bold text-gray-800">
                Rs. {getTotalCartAmount()}
              </p>
            </div>

            <div className="flex justify-between text-lg mb-[10px]">
              <p className="text-gray-600">Delivery Fee</p>
              <p className="font-bold text-gray-800">
                Rs. {getTotalCartAmount() === 0 ? 0 : 40}
              </p>
            </div>

            <div className="flex justify-between text-lg font-semibold mb-[20px] border-t pt-[10px]">
              <p>Total</p>
              <p>
                Rs. {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}
              </p>
            </div>

            <button
              type="submit"
              className="w-full mt-[20px] bg-orange-500 text-white p-[12px] rounded-[4px] hover:bg-orange-600 transition duration-300 ease-in-out"
            >
              PROCEED TO PAY
            </button>
          </div>
        </div>
      </form>

      <Footer />
    </>
  );
};

export default PlaceOrder;
