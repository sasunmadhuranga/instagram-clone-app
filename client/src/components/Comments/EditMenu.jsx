import { useState } from "react";
import ModalPortal from "../ModalPortal"; 
import ConfirmModal from "../ConfirmModal";

const EditMenu = ({ onCancel, onDelete, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleOpenMenu = () => setIsModalOpen(true);
  const handleCloseMenu = () => {
    setIsModalOpen(false);
    onCancel?.();
  };

  const handleDeleteClick = () => {
    handleCloseMenu();
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.();
    setShowConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <div className="absolute top-3 right-6 z-50">
      <button
        onClick={handleOpenMenu}
        className="text-black hover:text-gray-500 text-2xl"
      >
        ⋯
      </button>

      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col bg-white w-[500px] rounded-xl overflow-hidden shadow-lg text-sm font-medium">
              <button
                onClick={handleDeleteClick}
                className="w-full py-3 text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  onEdit?.();
                  handleCloseMenu();
                }}
                className="w-full py-3 hover:bg-gray-100"
              >
                Edit
              </button>
              <button className="w-full py-3 hover:bg-gray-100">
                Hide likes count
              </button>
              <button className="w-full py-3 hover:bg-gray-100">
                Turn off commenting
              </button>
              <button className="w-full py-3 hover:bg-gray-100">
                Share to...
              </button>
              <button className="w-full py-3 hover:bg-gray-100">Copy link</button>
              <button
                onClick={handleCloseMenu}
                className="w-full py-3 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {showConfirmDelete && (
        <ModalPortal>
          <ConfirmModal
            message="Are you sure you want to delete this post?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </ModalPortal>
      )}
    </div>
  );
};

export default EditMenu;
