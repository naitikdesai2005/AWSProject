import React, { useState, useEffect } from "react";
import HeaderBaker from "../HeaderBaker/HeaderBaker.jsx";
import axios from "axios";
import "./Bakerprofile.css";

const Bakerprofile = () => {
  const [bakerDetails, setBakerDetails] = useState({
    name: "",
    email: "",
    bio: "",
    mobilenumber: "",
    bakeryname: "",
    bakeryaddress: "",
    profilePic: "",
    gender: "",
    link: "",
    bankAccNumber: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState(bakerDetails);

  // Fetch baker profile on load
  useEffect(() => {
    const fetchBakerProfile = async () => {
      try {
        const response = await axios.get("/api/baker/profile", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setBakerDetails(response.data.data);
        } else {
          console.error("Error fetching baker profile: Unsuccessful response");
        }
      } catch (error) {
        console.error("Error fetching baker profile:", error);
      }
    };

    fetchBakerProfile();
  }, []);

  useEffect(() => {
    setUpdatedDetails(bakerDetails);
  }, [bakerDetails]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle profile save
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", updatedDetails.name);
    formData.append("email", updatedDetails.email);
    formData.append("mobilenumber", updatedDetails.mobilenumber);
    formData.append("bakeryname", updatedDetails.bakeryname);
    formData.append("bakeryaddress", updatedDetails.bakeryaddress);
    formData.append("gender", updatedDetails.gender);
    formData.append("bankAccNumber", updatedDetails.bankAccNumber);
    if (updatedDetails.bio) formData.append("bio", updatedDetails.bio);
    if (updatedDetails.link) formData.append("link", updatedDetails.link);
    if (updatedDetails.profilePic instanceof File) {
      formData.append("image", updatedDetails.profilePic);
    }

    try {
      const response = await axios.post("/api/baker/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      setBakerDetails(updatedDetails);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating baker profile:", error);
    }
  };

  // Handle profile picture change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedDetails({ ...updatedDetails, profilePic: file });
    }
  };

  // Profile picture URL
  const profilePicSrc =
    updatedDetails.profilePic instanceof File
      ? URL.createObjectURL(updatedDetails.profilePic)
      : updatedDetails.profilePic || "https://via.placeholder.com/150";

  return (
    <>
      <HeaderBaker />
      <div className="baker-profile-container">
        <div className="profile-pic">
          <img src={profilePicSrc} alt="Profile" />
          {isEditing && (
            <>
              <input
                type="file"
                id="profilePicUpload"
                onChange={handleFileChange}
              />
              <label htmlFor="profilePicUpload" className="upload-button">
                Upload New Picture
              </label>
            </>
          )}
        </div>

        <div className="profile-details">
          {isEditing ? (
            <div className="edit-container">
              <div className="input-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={updatedDetails.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={updatedDetails.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="mobilenumber"
                  value={updatedDetails.mobilenumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Bakery Name:</label>
                <input
                  type="text"
                  name="bakeryname"
                  value={updatedDetails.bakeryname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="bakeryaddress"
                  value={updatedDetails.bakeryaddress}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Bio:</label>
                <textarea
                  name="bio"
                  value={updatedDetails.bio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Facebook / Instagram Link (Optional):</label>
                <input
                  type="text"
                  name="link"
                  value={updatedDetails.link}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Bank Account Number:</label>
                <input
                  type="text"
                  name="bankAccNumber"
                  value={updatedDetails.bankAccNumber}
                  onChange={handleInputChange}
                />
              </div>
              <br />
              <button onClick={handleSave} className="save-button">
                Save
              </button>
            </div>
          ) : (
            <div>
              <h2>{bakerDetails.name}</h2>
              <p>Email: {bakerDetails.email}</p>
              <p>Phone: {bakerDetails.mobilenumber}</p>
              <p>Bakery: {bakerDetails.bakeryname}</p>
              <p>Address: {bakerDetails.bakeryaddress}</p>
              <p>Gender: {bakerDetails.gender}</p>
              <p>
                Facebook / Instagram Link: {bakerDetails.link || "Not Provided"}
              </p>
              <p>
                Bank Account Number:{" "}
                {bakerDetails.bankAccNumber || "Not Provided"}
              </p>
              <p>{bakerDetails.bio}</p>
              <button onClick={handleEditToggle} className="edit-button">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Bakerprofile;
