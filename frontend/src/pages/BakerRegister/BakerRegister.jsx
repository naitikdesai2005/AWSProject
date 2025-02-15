import React, { useRef, useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaStore,
  FaPhone,
  FaHome,
  FaCreditCard,
  FaLink,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function BakerRegister({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setBakerName] = useState("");
  const [bakeryname, setBakeryName] = useState("");
  const [mobilenumber, setPhone] = useState("");
  const [bakeryaddress, setAddress] = useState("");
  const [bankAccNumber, setBankAccNumber] = useState("");
  const [gender, setGender] = useState("");
  const [bakerlink, setBakerLink] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/baker/registerBaker",
        {
          email,
          password,
          name,
          bakeryname,
          mobilenumber,
          bakeryaddress,
          bankAccNumber,
          bakerlink,
          gender,
        }
      );
      if (response.data.success) {
        toast.success("Register Successfully");
        localStorage.setItem("token", response.data.token);
        navigate("/login");
      } else {
        alert("Registration failed: " + response.data.message);
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={formRef}
        className="bg-white w-full md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register as a Baker
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-600">
                  Baker Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaUser className="mx-2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setBakerName(e.target.value)}
                    className="w-full p-2 rounded-r-lg outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-600">Email</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaEnvelope className="mx-2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-r-lg outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-600">
                  Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaLock className="mx-2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded-r-lg outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-600">
                  Bakery Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <FaStore className="mx-2 text-gray-400" />
                  <input
                    type="text"
                    value={bakeryname}
                    onChange={(e) => setBakeryName(e.target.value)}
                    className="w-full p-2 rounded-r-lg outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-600">
                Phone Number
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaPhone className="mx-2 text-gray-400" />
                <input
                  type="tel"
                  value={mobilenumber}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 rounded-r-lg outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-600">
                Bakery Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaHome className="mx-2 text-gray-400" />
                <input
                  type="text"
                  value={bakeryaddress}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 rounded-r-lg outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-600">
                Bank Account Number
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaCreditCard className="mx-2 text-gray-400" />
                <input
                  type="text"
                  value={bankAccNumber}
                  onChange={(e) => setBankAccNumber(e.target.value)}
                  className="w-full p-2 rounded-r-lg outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-600">Gender</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 rounded-r-lg outline-none"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-600">
                Baker's Website Link (optional)
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaLink className="mx-2 text-gray-400" />
                <input
                  type="url"
                  value={bakerlink}
                  onChange={(e) => setBakerLink(e.target.value)}
                  className="w-full p-2 rounded-r-lg outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-6 bg-[#f79c3e] text-white rounded-lg font-medium hover:bg-orange-600"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BakerRegister;
