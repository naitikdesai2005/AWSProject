import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { toast } from "react-toastify";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    number: false,
    specialChar: false,
    upperLower: false,
  });
  const navigate = useNavigate();

  const validatePassword = (value) => {
    setPassword(value);

    setPasswordCriteria({
      length: value.length >= 8,
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      upperLower: /[a-z]/.test(value) && /[A-Z]/.test(value),
    });
  };

  const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (!name) {
      setNameError("Please enter your name.");
      valid = false;
    }
    if (!email) {
      setEmailError("Please enter your email.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Please enter your password.");
      valid = false;
    }
    if (!allCriteriaMet) {
      setPasswordError("Password does not meet all criteria.");
      valid = false;
    }
    if (!valid) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/registerUser",
        { email, password, name }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        toast.success("Sign up Successfully");
        if (response.data.message === "user") {
          navigate("/homeuser");
        }
      } else {
        alert("Sign up failed: " + response.data.message);
      }
    } catch (error) {
      console.error("An error occurred during sign-up:", error);
    }
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="pt-1 flex items-center justify-center min-h-screen">
        <div className="bg-white flex w-full max-w-4xl transform transition-all duration-500">
          <div className="hidden md:flex items-center justify-center w-1/2 rounded-l-2xl overflow-hidden">
            <img
              src="/images/bg login.jpg"
              alt="Cookies"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-gray-800">Sign Up</h2>
              <p className="text-gray-600 text-sm">
                Please sign up to continue.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <FloatLabel>
                  <InputText
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f79c3e] transition-all duration-300"
                  />
                  <label htmlFor="name" className="text-gray-500">
                    Name
                  </label>
                </FloatLabel>
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>

              <div className="mb-6">
                <FloatLabel>
                  <InputText
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f79c3e] transition-all duration-300"
                  />
                  <label htmlFor="email" className="text-gray-500">
                    Email
                  </label>
                </FloatLabel>
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div className="mb-6">
                <FloatLabel>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                    id="password"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f79c3e] transition-all duration-300"
                  />
                  <label htmlFor="password" className="text-gray-500">
                    Password
                  </label>
                </FloatLabel>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <div className="mb-4 text-sm text-gray-700">
                <p>
                  <span
                    className={
                      passwordCriteria.length
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {passwordCriteria.length ? "✔" : "⬜"}
                  </span>{" "}
                  Password must be over 8 characters
                </p>
                <p>
                  <span
                    className={
                      passwordCriteria.number
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {passwordCriteria.number ? "✔" : "⬜"}
                  </span>{" "}
                  Password must contain 1 number
                </p>
                <p>
                  <span
                    className={
                      passwordCriteria.specialChar
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {passwordCriteria.specialChar ? "✔" : "⬜"}
                  </span>{" "}
                  Password must contain 1 special character
                </p>
                <p>
                  <span
                    className={
                      passwordCriteria.upperLower
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {passwordCriteria.upperLower ? "✔" : "⬜"}
                  </span>{" "}
                  Password must contain 1 uppercase and 1 lowercase letter
                </p>
              </div>

              <button
                type="submit"
                className={`w-full p-4 ${
                  allCriteriaMet
                    ? "bg-gradient-to-r from-[#f79c3e] to-[#f79c3e] text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                } font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 transition-all duration-300`}
                disabled={!allCriteriaMet}
              >
                Create Account
              </button>

              <div className="text-center mt-6">
                <h4 className="text-gray-700">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Login
                  </Link>
                </h4>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
