import React, { useContext, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { StoreContext } from "../context/StoreContext";
import UserNavbar from "../../HomeUser/UserNavbar/UserNavbar";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";

function ContactForm() {
  const { isAuthenticated } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.message) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/createContactus",
        formData
      );
      if (response.data.success) {
        setResponseMessage("Your message has been submitted successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setErrors({});
      } else {
        setResponseMessage("Failed to submit your message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setResponseMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated ? <UserNavbar /> : <Navbar />}
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="bg-white flex w-full max-w-3xl rounded-lg overflow-hidden md:flex-row flex-col min-h-[80vh]">
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
              <p className="text-gray-600 text-sm">
                <br />
                We'd love to hear from you. Send us a message!
              </p>
            </div>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <FloatLabel>
                  <InputText
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f79c3e] text-base"
                  />
                  <label htmlFor="name">Name</label>
                </FloatLabel>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <FloatLabel>
                  <InputText
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f79c3e] text-base"
                  />
                  <label htmlFor="email">Email</label>
                </FloatLabel>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <FloatLabel>
                  <InputText
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f79c3e] text-base"
                  />
                  <label htmlFor="phone">Phone Number</label>
                </FloatLabel>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <FloatLabel>
                  <InputTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f79c3e] text-base"
                    rows={4}
                  />
                  <label htmlFor="message">Message</label>
                </FloatLabel>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 bg-gradient-to-r from-[#f79c3e] to-[#f79c3e] text-white font-semibold rounded-lg transition-all duration-300 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#e68a2c]"
                }`}
              >
                {isLoading ? "Sending..." : "Submit"}
              </button>
            </form>
            {responseMessage && (
              <p className="mt-4 text-center text-green-600 font-medium text-sm">
                {responseMessage}
              </p>
            )}
          </div>
          <div className="hidden md:flex items-center justify-center w-full md:w-1/2 bg-gray-50 p-8">
            <img
              src="https://img.freepik.com/premium-vector/customer-service-representative-uses-laptop-online-support_1305385-80606.jpg"
              alt="Contact Us"
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactForm;
