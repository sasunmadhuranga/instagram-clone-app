import { useRef } from "react";

const ProfilePhotoModal = ({ onClose, onUpload, onRemove }) => {
  const fileInputRef = useRef();

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-80 rounded-xl overflow-hidden shadow-lg">
        <h1 className="text-center font-bold py-4 border-b">Change Profile Photo</h1>

        <button
          onClick={handleFileSelect}
          className="block w-full py-3 text-blue-500 font-semibold hover:bg-gray-100"
        >
          Upload Photo
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files[0];
            const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            if (file && validTypes.includes(file.type.toLowerCase())) {
              onUpload(file);
            } else {
              alert("Please select a valid image file (jpg, jpeg, png, gif).");
            }
          }}
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/gif"
        />

        <button
          onClick={onRemove}
          className="block w-full py-3 text-red-500 font-semibold hover:bg-gray-100"
        >
          Remove Current Photo
        </button>
        <button
          onClick={onClose}
          className="block w-full py-3 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfilePhotoModal;
