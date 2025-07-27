import ModalPortal from "../ModalPortal";

export default function DeleteComment({ onDelete, onCancel }) {
  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col bg-white relative w-[500px] rounded-xl overflow-hidden shadow-lg">
          <button
            onClick={onDelete} 
            className="w-full py-3 font-semibold text-red-600 rounded hover:bg-gray-200 transition flex justify-center items-center"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 font-semibold text-gray-700 rounded hover:bg-gray-200 transition flex justify-center items-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
