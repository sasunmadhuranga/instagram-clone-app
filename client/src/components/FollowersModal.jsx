import React from "react";

const FollowersModal = ({ followers, onClose, onUnfollow }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-xl w-full max-w-xl w-[500px] max-h-[80vh] overflow-y-auto p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Followers</h2>

        <ul className="space-y-4">
          {followers.length === 0 ? (
            <li className="text-center text-gray-500">No followers yet.</li>
          ) : (
            followers.map((user) => (
              <li key={user._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      user.photo
                        ? user.photo.startsWith("http")
                          ? user.photo
                          : `http://localhost:5000${user.photo}`
                        : "/default-avatar.png"
                    }
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.fullname}</div>
                  </div>
                </div>
                <button
                  onClick={() => onUnfollow(user._id)}
                  className="px-4 py-1 rounded text-white bg-red-500 hover:bg-red-400"
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FollowersModal;
