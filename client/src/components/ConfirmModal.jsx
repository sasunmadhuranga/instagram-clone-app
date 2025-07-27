import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white relative w-[500px] rounded-xl overflow-hidden shadow-lg">
        <p className="flex justify-center mt-6">{message}</p>
          <button
            onClick={onConfirm}
            className="w-full py-3 font-semibold text-red-600 rounded hover:bg-gray-200 transition flex justify-center items-center"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 font-semibold text-gray-700 rounded hover:bg-gray-200 transition flex justify-center items-center"
          >
            Cancel
          </button>
        
      </div>
    </div>
  );
};

export default ConfirmModal;
