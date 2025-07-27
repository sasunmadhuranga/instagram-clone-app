import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebars/Sidebar";
import ProfilePhotoModal from "../components/Profile/ProfilePhotoModal";
import { useNavigate, useParams } from "react-router-dom";
import PostGrid from "../components/Profile/PostGrid";
import useProfile from "../hooks/useProfile";
import { uploadProfilePhoto, removeProfilePhoto } from "../utils/profilePhotoHandlers";
import FollowersModal from "../components/FollowersModal";
import FollowingModal from "../components/FollowingModal";  
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);  
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);  
  const { username } = useParams();
  const loggedInUsername = storedUser?.username;
  const [isFollowing, setIsFollowing] = useState(false);

  
  const isOwnProfile = !username || username === loggedInUsername;

  const {
    form,
    setForm,
    counts,
    myPosts,
    setCounts,
    savedPosts,
  } = useProfile(token, username);



  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const fetchFollowersAndFollowing = async () => {
    try {
      const url = isOwnProfile ? "http://localhost:5000/api/users/me" : `http://localhost:5000/api/users/${username}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch followers/following");
      const data = await res.json();
      setFollowersList(data.followers || []);
      setFollowingList(data.following || []);
      
      const loggedInUserFollows = data.followers.some(follower => follower.username === loggedInUsername);
      setIsFollowing(loggedInUserFollows);
    } catch (err) {
      console.error("Failed to fetch followers and following", err);
    }
  };
  
  useEffect(() => {
    fetchFollowersAndFollowing();
  }, [username]);

  const handleShowFollowers = () => {
    fetchFollowersAndFollowing();
    setShowFollowersModal(true);
  };

  const handleShowFollowing = () => {
    fetchFollowersAndFollowing();
    setShowFollowingModal(true);
  };

  const handleRemoveFollower = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/remove-follower/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to remove follower");
      }

      setFollowersList((prev) => prev.filter((user) => user._id !== id));
      setCounts((prev) => ({ ...prev, followers: prev.followers - 1 }));
    } catch (error) {
      console.error(error);
      alert("Error removing follower: " + error.message);
    }
  };


  const handleUnfollow = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/unfollow/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to unfollow user");
      }

      setCounts((prev) => ({ ...prev, following: prev.following - 1 }));
    } catch (error) {
      console.error(error);
      alert("Error unfollowing: " + error.message);
    }
  };

  const handleFollow = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/follow/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to follow user");
      }

      setCounts((prev) => ({ ...prev, following: prev.following + 1 }));
    } catch (error) {
      console.error(error);
      alert("Error following: " + error.message);
    }
  };

  const handleFollowToggle = async () => {
    if (!form._id) return; 

    if (isFollowing) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/unfollow/${form._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.msg || "Failed to unfollow user");
        }

        setIsFollowing(false);
        setCounts(prev => ({ ...prev, followers: prev.followers - 1 }));
        setFollowersList(prev => prev.filter(f => f.username !== loggedInUsername));

      } catch (error) {
        alert("Error unfollowing: " + error.message);
      }
    } else {

      try {
        const res = await fetch(`http://localhost:5000/api/users/follow/${form._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.msg || "Failed to follow user");
        }

        setIsFollowing(true);
        setCounts(prev => ({ ...prev, followers: prev.followers + 1 }));
        setFollowersList(prev => [...prev, { username: loggedInUsername }]);

      } catch (error) {
        alert("Error following: " + error.message);
      }
    }
  };

  const handleToggleSave = async (postId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/save/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to save/unsave post");
    const updatedPost = await res.json();
    return updatedPost; 
  } catch (error) {
    console.error("Error toggling save:", error);
    alert("Error saving post");
  }
};



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row ">
      <Sidebar />
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex items-center space-x-16 mb-8 relative">
          <div
            className="w-40 h-40 rounded-full bg-gray-300 overflow-hidden cursor-pointer"
            onClick={() => setShowPhotoModal(true)}
          >
            {form.photo ? (
              <img
                src={form.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                ?
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold">{form.username}</h2>
              
              {!isOwnProfile && (
                <button
                  onClick={handleFollowToggle}
                  className= "px-4 py-1 rounded text-sm font-semibold bg-indigo-700 text-white hover:bg-indigo-500"
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}

              {isOwnProfile && (
                <button
                  onClick={() => navigate("/EditProfile")}
                  className="px-4 py-1 border-none rounded text-sm hover:bg-gray-200 active:scale-95"
                >
                  Edit profile
                </button>
              )}
            </div>

            <div className="flex space-x-10 mt-4 text-sm md:text-base">
              <div><span className="font-semibold">{counts.posts}</span> posts</div>
              <div
                className="cursor-pointer hover:underline"
                onClick={handleShowFollowers}
              >
                <span className="font-semibold">{counts.followers}</span> followers
              </div>
              <div
                className="cursor-pointer hover:underline"
                onClick={handleShowFollowing}  
              >
                <span className="font-semibold">{counts.following}</span> following
              </div>
            </div>
            {form.fullname && (
              <p className="text-gray-900 font-medium text-sm mt-4">{form.fullname}</p>
            )}
            <p className="text-gray-600 text-sm">{form.bio}</p>
          </div>
        </div>

        {showPhotoModal && (
          <ProfilePhotoModal
            onClose={() => setShowPhotoModal(false)}
            onUpload={(file) => uploadProfilePhoto(file, token, setForm, () => setShowPhotoModal(false))}
            onRemove={() => removeProfilePhoto(token, setForm, () => setShowPhotoModal(false))}
          />
        )}

        {showFollowersModal && (
          <FollowersModal
            followers={followersList}
            onClose={() => setShowFollowersModal(false)}
            onUnfollow={handleRemoveFollower}
          />
        )}

        {showFollowingModal && (
          <FollowingModal
            following={followingList}
            onClose={() => setShowFollowingModal(false)}
            onUnfollow={handleUnfollow} 
            onFollow={handleFollow}
          />
        )}

        <div className="border-t pt-6 mt-10">
          <div className="flex justify-center gap-4 mt-4">
            <button
              className={activeTab === "posts" ? "border-b-2 font-semibold" : ""}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            {isOwnProfile && (
              <button
                className={activeTab === "saved" ? "border-b-2 font-semibold" : ""}
                onClick={() => setActiveTab("saved")}
              >
                Saved
              </button>
            )}
          </div>


          <PostGrid 
            posts={activeTab === "posts" ? myPosts : isOwnProfile ? savedPosts : []} 
            onSaveToggle={handleToggleSave}
          />

        </div>
      </div>
    </div>
  );
};

export default Profile;
