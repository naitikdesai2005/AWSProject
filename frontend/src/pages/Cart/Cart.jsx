import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import UserNavbar from "../../HomeUser/UserNavbar/UserNavbar.jsx";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { assets } from "../../../images/assets";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; // Add this import at the top

const Cart = () => {
  const {
    cartItems = {},
    removeFromCart,
    addToCart,
    deleteFromCart,
    getTotalCartAmount,
    isAuthenticated,
    food_list = [],
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const url = "http://localhost:3000";
  const [emptyCartMessage, setEmptyCartMessage] = useState(false);

  const handleCheckout = async () => {
    const storedToken = localStorage.getItem("token"); // Retrieve the token
    if (getTotalCartAmount() === 0) {
      setEmptyCartMessage(true);
    } else {
      setEmptyCartMessage(false);
      const decode = jwtDecode(storedToken);
      const u_id = decode.id;

      await axios.post(
        url + "/api/order/create",
        { userId: u_id },
        { headers: { token } }
      );

      navigate("/order");
    }
  };

  return (
    <>
      {isAuthenticated ? <UserNavbar /> : <Navbar />}
      <div className="mt-36 mx-24 mb-8">
        <div className="space-y-4">
          <div className="grid grid-cols-6 text-gray-500 text-sm">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <hr className="border-gray-300" />
          {food_list.map((item, index) => {
            const quantity = cartItems[item._id] || 0;
            if (quantity > 0) {
              return (
                <div key={index} className="space-y-4">
                  <div className="grid grid-cols-6 items-center">
                    <img
                      src={`${url}/uploads/${item.image}`}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md mr-3"
                    />
                    <p>{item.name}</p>
                    <p>Rs. {item.price}</p>
                    <div className="flex items-center gap-3 -mt-5">
                      <button
                        onClick={() => addToCart(item._id)}
                        className="p-2 bg-gray-200 rounded-full hover:scale-110 transition"
                      >
                        <AiOutlinePlus className="text-lg" />
                      </button>
                      <p className="font-semibold w-8 text-center">
                        {quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 bg-gray-200 rounded-full hover:scale-110 transition"
                      >
                        <AiOutlineMinus className="text-lg" />
                      </button>
                    </div>

                    <p>Rs. {item.price * quantity}</p>
                    <button
                      onClick={() => deleteFromCart(item._id)}
                      className="cursor-pointer ml-4"
                    >
                      <img
                        src={assets.cross_icon}
                        alt="Remove item"
                        className="h-5 w-5"
                      />
                    </button>
                  </div>
                  <hr className="border-gray-300" />
                </div>
              );
            }
          })}
        </div>
        <div className="flex justify-end gap-8 mt-20">
          <div className="flex flex-col gap-5 w-1/3">
            <h2 className="text-xl font-semibold">Cart Totals</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <p>Subtotal</p>
                <p>Rs. {getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="flex justify-between text-gray-600">
                <p>Delivery Fee</p>
                <p>Rs. {getTotalCartAmount() === 0 ? 0 : 40}</p>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-gray-800">
                <p>Total</p>
                <p>
                  Rs.{" "}
                  {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}
                </p>
              </div>
            </div>
            {emptyCartMessage && (
              <h2 className="text-center text-red-500">Your cart is empty😒</h2>
            )}
            <button
              onClick={handleCheckout}
              className="mt-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition w-full"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
