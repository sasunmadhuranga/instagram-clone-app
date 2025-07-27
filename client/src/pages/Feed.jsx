import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebars/Sidebar";
import RightSidebar from "../components/Sidebars/RightSidebar";
import IconSection from "../components/IconSection";
import CommentPopup from "../components/Comments/CommentPopup";
import UserInfoCard from "../components/UserInfoCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Feed = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [feedPosts, setFeedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  

  useEffect(() => {
    const fetchFeed = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:5000/api/posts/feed", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (res.ok) setFeedPosts(data);
      else console.error("Feed error:", data.msg);
    };

    fetchFeed();
  }, []);

  const handleToggleLike = async (postId) => {
    const res = await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();

      setFeedPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likedByCurrentUser: data.liked,
                likesCount: data.likesCount,
              }
            : post
        )
      );

      setSelectedPost((prev) =>
        prev && prev._id === postId
          ? {
              ...prev,
              likedByCurrentUser: data.liked,
              likesCount: data.likesCount,
            }
          : prev
      );
    }
  };

  const handleCommentAdded = (postId, updatedComments) => {
    setFeedPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments: updatedComments } : p
      )
    );

    setSelectedPost((prev) =>
      prev && prev._id === postId ? { ...prev, comments: updatedComments } : prev
    );
  };

  const handleToggleSave = async (postId) => {
    const res = await fetch(`http://localhost:5000/api/posts/save/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setFeedPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, savedByCurrentUser: data.saved } : post
        )
      );

      setSelectedPost((prev) =>
        prev && prev._id === postId
          ? { ...prev, savedByCurrentUser: data.saved }
          : prev
      );
    }
  };


  return (
    <div className="min-h-screen bg-white-100 flex">
      <div>
        <Sidebar />
      </div>

      <div className="flex-1 px-6 lg:px-16 max-w-3xl pt-2 ml-10">

        
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="space-y-6">
          {feedPosts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded shadow">
              <UserInfoCard user={post.user} location={post.location} />
              <div className="w-[600px] max-w-full bg-black rounded mb-2  mt-1 flex items-center justify-center overflow-hidden">
                {post.mediaUrl.endsWith(".mp4") ? (
                  <video
                    src={post.mediaUrl}
                    controls
                    className="max-h-[600px] w-auto object-contain"
                  />
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt="Post"
                    className="max-h-[600px] w-auto object-contain"
                  />
                )}
              </div>
             
              <IconSection
                post={post}
                handleLike={handleToggleLike}
                handleComment={() => {
                  if (!post.disableComments) {
                    setSelectedPost(post);
                  } else {
                    toast.info("Commenting is disabled on this post.");
                  }
                }}
                handleSave={handleToggleSave}
                />


              <div className="text-sm text-gray-800">{post.caption}</div>
            </div>
          ))}
        </div>
        
      </div>

      <RightSidebar />
      {selectedPost && (
        <CommentPopup 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onLikeToggle={handleToggleLike}
          onSaveToggle={handleToggleSave}
          onCommentAdded={handleCommentAdded}
          showEditMenu={false}
          />
        )}

    </div>
  );
};

export default Feed;
