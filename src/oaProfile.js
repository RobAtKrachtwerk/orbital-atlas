import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaEdit, FaUpload, FaTrash } from "react-icons/fa";
import LogoutButton from "./components/LogoutButton";

function Profile({ onProfilePhotoUpdate, profilePhoto }) {
  const { user, isAuthenticated } = useAuth0();
  const [editMode, setEditMode] = useState(false);
  const [tempProfilePhoto, setTempProfilePhoto] = useState(profilePhoto || "");
  const [formData, setFormData] = useState({
    firstName: user?.given_name || "",
    lastName: user?.family_name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Must contain at least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("Must contain at least one number");
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (formData.password && !validatePassword(formData.password)) {
      alert("Password does not meet the requirements");
      return;
    }
    onProfilePhotoUpdate(tempProfilePhoto); // Update globally
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") validatePassword(value);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setTempProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setTempProfilePhoto("");
    onProfilePhotoUpdate(""); // Notify App.js
  };

  if (!isAuthenticated) {
    return <p className="text-center">You need to log in to view your profile.</p>;
  }

  return (
    <div className="container-xl">
      <div className="title-container">
        <h1 className="text-center">Profile</h1>
      </div>

      <div className="profile-section mb-5">
        <h2>Profile Photo</h2>
        <div className="d-flex flex-column">
          {tempProfilePhoto ? (
            <img
              src={tempProfilePhoto}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#6610F2",
                color: "white",
                fontSize: "2rem",
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          {editMode && (
            <div className="photo-actions mt-3">
              <label className="btn btn-secondary me-2">
                <FaUpload className="me-2" /> Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
              </label>
              <button className="btn btn-danger" onClick={handleRemovePhoto}>
                <FaTrash className="me-2" /> Remove Photo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-section mb-5">
        <h2>Personal Information</h2>
        <form>
          <div className="form-group mb-4">
            <label className="text-white mb-3">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-control"
              disabled={!editMode}
            />
          </div>
          <div className="form-group mb-4">
            <label className="text-white mb-3">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-control"
              disabled={!editMode}
            />
          </div>
          <div className="form-group mb-4">
            <label className="text-white mb-3">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              disabled
            />
          </div>
        </form>
      </div>

      <div className="profile-section mb-5">
        <h2>Change Password</h2>
        {editMode && (
          <form>
            <div className="form-group mb-4">
              <label className="text-white mb-3">New Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group mb-4">
              <label className="text-white mb-3">Confirm New Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            {passwordErrors.length > 0 && (
              <ul className="text-danger mt-2">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </form>
        )}
      </div>

      <div className="profile-actions mt-4">
        {editMode ? (
          <button type="button" className="btn btn-success me-3 mt-0" onClick={handleSave}>
            Save Changes
          </button>
        ) : (
          <button type="button" className="btn btn-primary me-3 mt-0" onClick={handleEdit}>
            <FaEdit className="me-2" /> Edit Profile
          </button>
        )}
        <LogoutButton />
      </div>
    </div>
  );
}

export default Profile;
