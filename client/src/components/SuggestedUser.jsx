import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SuggestedUser({ user, currentUserToken, onFollowToggle }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleFollow = async () => {
    setLoading(true);
    try {
      const url = isFollowing
        ? `http://localhost:5000/api/users/unfollow/${user._id}`
        : `http://localhost:5000/api/users/follow/${user._id}`;

      await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
        },
      });

      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);

      if (onFollowToggle) {
        onFollowToggle(user._id, newFollowStatus);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToProfile = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={handleNavigateToProfile}
      >
        <img
          src={user.photo || "/default-profile.png"}
          alt={`${user.username}'s profile`}
          className="w-10 h-10 rounded-full object-cover bg-gray-300"
        />
        <span className="text-sm font-medium hover:underline">
          {user.username}
        </span>
      </div>
      <button
        className={`text-sm font-semibold ${
          isFollowing ? "text-gray-500" : "text-blue-500"
        }`}
        onClick={toggleFollow}
        disabled={loading}
      >
        {loading ? "..." : isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default SuggestedUser;
