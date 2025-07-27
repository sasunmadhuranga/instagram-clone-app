import React, { useEffect, useState } from "react";

const FollowingModal = ({ following, onClose, onUnfollow, onFollow }) => {
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const prepared = following.map((user) => ({
      ...user,
      isFollowing: true,
    }));
    setUsers(prepared);
  }, [following]);

  const handleToggleFollow = async (userId) => {
    setLoadingUserId(userId);

    const targetUser = users.find((u) => u._id === userId);
    const nextFollowState = !targetUser.isFollowing;

    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, isFollowing: nextFollowState } : user
      )
    );

    try {
      if (nextFollowState) {
        await onFollow(userId);
      } else {
        await onUnfollow(userId);
      }
    } catch (err) {
      console.error("Error toggling follow state:", err);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, isFollowing: !nextFollowState }
            : user
        )
      );
    } finally {
      setTimeout(() => setLoadingUserId(null), 300); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-xl w-full max-w-xl w-[500px] max-h-[80vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Following</h2>

        <ul className="space-y-4">
          {users.length === 0 ? (
            <li className="text-center text-gray-500">
              Not following anyone yet!
            </li>
          ) : (
            users.map((user) => {
              const isLoading = loadingUserId === user._id;
              return (
                <li
                  key={user._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        user.photo?.startsWith("http")
                          ? user.photo
                          : user.photo
                          ? `http://localhost:5000${user.photo}`
                          : "/default-avatar.png"
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        {user.fullname}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFollow(user._id)}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-1 rounded text-sm font-medium transition-all duration-200
                        ${
                        user.isFollowing
                            ? "text-white bg-red-500 hover:bg-red-400"
                            : "text-white bg-indigo-700 hover:bg-indigo-500"
                        }
                        ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
                    `}
                    >
                    {user.isFollowing ? "Unfollow" : "Follow"}
                    {isLoading && (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    )}
                    </button>

                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default FollowingModal;
