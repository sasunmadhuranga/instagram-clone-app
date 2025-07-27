import { useState } from "react";
import Profilecard from "../Profilecard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

export default function ProfileSection() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [username, setUsername] = useState(user?.username || "");
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");


  const closePopup = () => {
    setIsPopupOpen(false);
    setIsEditingName(false);
    setIsEditingUsername(false);
    setIsEditingPhoto(false);
    setFullname(user?.fullname || "");
    setUsername(user?.username || "");
  };

  const handleSaveName = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/update-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ fullname }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Failed to update name");
        return;
      }

      const updatedUser = { ...user, fullname: data.fullname };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Name updated!");
      closePopup();
      window.location.reload();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating name. Try again.");
    }
  };

  const handleSaveUsername = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Failed to update username");
        return;
      }

      const updatedUser = { ...user, username: data.username };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Username updated!");
      closePopup();
      window.location.reload();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating username. Try again.");
    }
  };
  const handlePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  if (!token) {
    toast.error("Not authenticated.");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:5000/api/users/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Upload failed");
        return;
      }

      const baseUrl = "http://localhost:5000";
      const updatedUser = {
        token,
        fullname: data.fullname || user.fullname,
        username: data.username || user.username,
        email: data.email || user.email,
        bio: data.bio || user.bio || "",
        photo: baseUrl + data.photo,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setFullname(updatedUser.fullname);
      setUsername(updatedUser.username);
      setIsEditingPhoto(false);
      setIsPopupOpen(false);

      toast.success("Profile photo updated!");

      window.location.reload();

    } catch (err) {
      console.error(err);
      toast.error("Error uploading photo");
    }
  };

  const handlePhotoRemove = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (!token) {
      toast.error("Not authenticated.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/remove-photo", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Failed to remove photo");
        return;
      }

      const updatedUser = {
        token,
        fullname: data.fullname || user.fullname,
        username: data.username || user.username,
        email: data.email || user.email,
        bio: data.bio || user.bio || "",
        photo: "",
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditingPhoto(false);
      setIsPopupOpen(false);

      toast.success("Profile photo removed!");
      window.location.reload();

    } catch (err) {
      console.error(err);
      toast.error("Error removing photo");
    }
  };

  const handleSaveBio = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/update-bio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Failed to update bio");
        return;
      }

      const updatedUser = { ...user, bio: data.bio };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Bio updated!");
    } catch (err) {
      console.error("Error updating bio:", err);
      toast.error("Error saving bio");
    }
  };


 return (
  <div className="relative">
    <div onClick={() => setIsPopupOpen(true)}
      className="hover:bg-gray-200 pl-3 pb-3 cursor-pointer rounded-lg">
      <Profilecard/>
    </div>

    <ToastContainer position="top-right" autoClose={3000} />
    <div className="px-4 mt-10">
      <label htmlFor="bio" className="block font-semibold text-sm text-gray-700 mb-1">
        Bio
      </label>
      <textarea
        id="bio"
        value={bio}
        onChange={(e) => {
          if (e.target.value.length <= 150) {
            setBio(e.target.value);
          }
        }}
        maxLength={150}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write something about yourself..."
      />
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">{bio.length}/150</span>
        <button
          onClick={handleSaveBio}
          className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-medium"
        >
          Save Bio
        </button>
      </div>
    </div>
    
    
    {isPopupOpen && (
      <>
        <div
          onClick={closePopup}
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
        ></div>

        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-lg max-w-xl w-full p-6 relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close popup"
            >
              &times;
            </button>

            {isEditingName ? (
              <div className="max-w-lg mx-auto min-h-[250px] px-4 py-6 flex flex-col">
                <button
                  onClick={() => setIsEditingName(false)}
                  className="absolute top-3 left-4 text-blue-600 font-semibold text-lg flex items-center space-x-1"
                >
                  <span className="text-2xl font-bold">{'<'}</span>
                </button>

                <label htmlFor="fullname" className="mt-7 mb-2 font-semibold text-lg">Full Name</label>
                <input
                  id="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            ) : isEditingUsername ? (
              <div className="max-w-lg mx-auto min-h-[250px] px-4 py-6 flex flex-col">
                <button
                  onClick={() => setIsEditingUsername(false)}
                  className="absolute top-3 left-4 text-blue-600 font-semibold text-lg flex items-center space-x-1"
                >
                  <span className="text-2xl font-bold">{'<'}</span>
                </button>

                <label htmlFor="username" className="mt-7 mb-2 font-semibold text-lg">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveUsername}
                  className="bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            ) : isEditingPhoto ? (
              <div className="max-w-md mx-auto min-h-[250px] px-4 py-6 flex flex-col items-center text-center">
                <button
                  onClick={() => setIsEditingPhoto(false)}
                  className="absolute top-3 left-4 text-blue-600 font-semibold text-lg flex items-center space-x-1"
                >
                  <span className="text-2xl font-bold">{'<'}</span>
                </button>
                <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
                  <img
                    src={user?.photo || "/default-profile.png"}
                    alt=""
                    className="w-24 h-24 rounded-full object-cover mb-6"
                  />
                </div>

                <button
                  type="button"
                  className="w-full py-3 pl-2 font-semibold text-blue-600 rounded hover:bg-gray-200 transition flex justify-between items-center"
                  onClick={() => document.getElementById('photoUploadInput').click()}
                >
                  Upload New Photo
                  <span className="text-gray-400 font-bold text-xl pr-2">{'>'}</span>
                </button>

                <input
                  type="file"
                  id="photoUploadInput"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
                    if (file && validTypes.includes(file.type.toLowerCase())) {
                      handlePhotoUpload(e);
                    } else {
                      toast.error("Please select a valid image file (jpg, jpeg, png, gif).");
                    }
                  }}
                  className="hidden"
                />

                <button
                  onClick={handlePhotoRemove}
                  className="w-full py-3 pl-2 font-semibold text-red-600 rounded hover:bg-gray-200 transition flex justify-between items-center mt-2"
                >
                  Remove Current Photo
                  <span className="text-gray-400 font-bold text-xl pr-2">{'>'}</span>
                </button>

                <button
                  onClick={closePopup}
                  className="w-full py-3 mt-4 bg-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
                    <img
                      src={user?.photo || "/default-profile.png"}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                  </div>
                  <h2 className="text-xl font-bold">{user?.fullname || "No Name Provided"}</h2>
                  <p className="text-gray-500">@{user?.username || "unknown"}</p>
                </div>

                <div className="max-w-md mx-auto flex flex-col space-y-3 px-1">
                  <button
                    type="button"
                    className="w-full py-3 pl-2 font-semibold rounded hover:bg-gray-200 transition flex justify-between items-center"
                    onClick={() => setIsEditingName(true)}
                  >
                    Edit Name
                    <span className="text-gray-400 font-bold text-xl pr-2">{">"}</span>
                  </button>

                  <button
                    type="button"
                    className="w-full py-3 pl-2 font-semibold rounded hover:bg-gray-200 transition flex justify-between items-center"
                    onClick={() => setIsEditingUsername(true)}
                  >
                    Edit Username
                    <span className="text-gray-400 font-bold text-xl pr-2">{">"}</span>
                  </button>

                  <button
                    type="button"
                    className="w-full py-3 pl-2 font-semibold rounded hover:bg-gray-200 transition flex justify-between items-center"
                    onClick={() => setIsEditingPhoto(true)}
                  >
                    Profile Picture
                    <span className="text-gray-400 font-bold text-xl pr-2">{">"}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);
}