import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    // Form validation
    if (!email) {
      setEmailError("Please enter your email.");
      return;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Invalid email format.");
      return;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      return;
    }

    // Check static admin credentials
    if (email === "admin@gmail.com" && password === "admin123") {
      toast.success("Login Successful");
      navigate("/admindash");  // Redirect to admin dashboard
    } else {
      toast.error("Invalid login credentials.");
    }
  };

  return (
    <div className="pt-20 flex items-center justify-center min-h-screen">
      <div className="bg-white flex w-full max-w-4xl transform transition-all duration-500 hover:scale-105">
        {/* Left Side - Image */}
        <div className="hidden md:flex items-center justify-center w-1/2 rounded-l-2xl overflow-hidden">
          <img
            src="../../../Image/bac.jpg"
            alt="Cookies"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600 text-sm">Please login to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
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
                <InputText
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              className="w-full p-4 bg-gradient-to-r from-[#f79c3e] to-[#f79c3e] text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#f79c3e] transition-all duration-300"
            >
              Login
            </button>

            <div className="text-center mt-6">
              <Link
                to="/forgetpass"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
