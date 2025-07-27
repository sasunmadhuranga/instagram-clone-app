import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function PasswordSection() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const closePopup = () => {
    setIsPopupOpen(false);
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
    toast.error("New passwords do not match!");
    return;
  }

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser.token;

  if (!token) {
    toast.info("You must be logged in to change your password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/users/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (response.status === 401) {
      toast.info("Session expired or unauthorized. Please log in again.");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      toast.error(data.msg || "Failed to update password.");
    } else {
      toast.success("Password updated successfully!");
      closePopup();
    }
  } catch (err) {
    console.error("Error updating password:", err);
    toast.error("An error occurred. Please try again.");
  }
};

  return (
    <div className="relative">
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="cursor-pointer p-3 border rounded-xl hover:bg-gray-200 w-full"
      >
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-semibold mb-1">Password</h2>
          <button
            className="text-blue-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setIsPopupOpen(true);
              setIsChangingPassword(true);
            }}
          >
            Change password
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <>
          <div
            onClick={closePopup}
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
          ></div>

          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="bg-white rounded-3xl shadow-lg max-w-lg w-full p-6 relative">
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              >
                &times;
              </button>

              {isChangingPassword && (
                <div className="flex flex-col">
                  <p className="text-sm text-gray-600 mb-6">
                    Your password must be at least 6 characters.
                  </p>

                  <label className="font-semibold text-sm mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="font-semibold text-sm mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="font-semibold text-sm mb-1">
                    Re-enter New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={handleChangePassword}
                    className="bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                  >
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
