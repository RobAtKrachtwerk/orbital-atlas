import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaEdit, FaUpload, FaTrash } from "react-icons/fa";
import LogoutButton from "./components/LogoutButton";

function Profile({ onProfilePhotoUpdate, profilePhoto }) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
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
  const [message, setMessage] = useState("");

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Must contain at least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("Must contain at least one number");
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleEdit = () => setEditMode(true);

  // ✅ Functie om profiel te updaten op backend
  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (formData.password && !validatePassword(formData.password)) {
      alert("Password does not meet the requirements");
      return;
    }

    try {
      const token = await getAccessTokenSilently(); // Haal token op voor beveiliging
      const response = await fetch("https://orbital-atlas.onrender.com/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password ? formData.password : undefined, // Alleen verzenden als ingevuld
          profilePhoto: tempProfilePhoto,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        onProfilePhotoUpdate(tempProfilePhoto);
        setEditMode(false);
        setMessage("Profile updated successfully!");
      } else {
        setMessage(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage("Error updating profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") validatePassword(value);
  };

  // ✅ Profielfoto uploaden naar backend
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("https://orbital-atlas.onrender.com/users/upload-photo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setTempProfilePhoto(result.photoUrl);
        onProfilePhotoUpdate(result.photoUrl);
      } else {
        setMessage("Failed to upload photo.");
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      setMessage("Error uploading photo.");
    }
  };

  const handleRemovePhoto = () => {
    setTempProfilePhoto("");
    onProfilePhotoUpdate("");
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
            <img src={tempProfilePhoto} alt="Profile" className="rounded-circle" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
          ) : (
            <div className="rounded-circle" style={{ width: "100px", height: "100px", backgroundColor: "#6610F2", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          {editMode && (
            <div className="photo-actions mt-3">
              <label className="btn btn-secondary me-2">
                <FaUpload className="me-2" /> Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
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
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" disabled={!editMode} />
          </div>
          <div className="form-group mb-4">
            <label className="text-white mb-3">Last Name:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" disabled={!editMode} />
          </div>
        </form>
      </div>

      <div className="profile-actions mt-4">
        {editMode ? (
          <button className="btn btn-success me-3 mt-0" onClick={handleSave}>Save Changes</button>
        ) : (
          <button className="btn btn-primary me-3 mt-0" onClick={handleEdit}><FaEdit className="me-2" /> Edit Profile</button>
        )}
        <LogoutButton />
      </div>

      {message && <p className="text-success mt-3">{message}</p>}
    </div>
  );
}

export default Profile;
