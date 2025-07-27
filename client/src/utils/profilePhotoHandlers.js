import { toast } from "react-toastify";
export const uploadProfilePhoto = async (file, token, setForm, closeModal) => {
  const formData = new FormData();
  formData.append("photo", file);

  try {
    const res = await fetch("http://localhost:5000/api/users/upload-photo", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      const baseUrl = "http://localhost:5000";
      const updatedPhoto = baseUrl + data.photo;

      setForm((prev) => ({
        ...prev,
        photo: updatedPhoto + "?t=" + new Date().getTime(),
      }));

      localStorage.setItem(
        "user",
        JSON.stringify({ ...data, token, photo: updatedPhoto })
      );

      closeModal();
      toast.success("Profile photo uploaded successfully!");
    } else {
      toast.error(data.msg || "Upload failed.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    toast.error("Server error during upload.");
  }
};

export const removeProfilePhoto = async (token, setForm, closeModal) => {
  try {
    const res = await fetch("http://localhost:5000/api/users/remove-photo", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setForm((prev) => ({ ...prev, photo: "" }));

      localStorage.setItem("user", JSON.stringify({ ...data, token, photo: "" }));

      closeModal();
      toast.success("Profile photo removed successfully!");
    } else {
      toast.error(data.msg || "Failed to remove photo.");
    }
  } catch (err) {
    console.error("Remove photo error:", err);
    toast.error("Server error during photo removal.");
  }
};
