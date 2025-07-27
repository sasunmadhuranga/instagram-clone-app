import React, { useState, useEffect } from "react";
import CommentPopup from "../Comments/CommentPopup";

const PostGrid = ({ posts: initialPosts, onSaveToggle }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    setSelectedPost(updatedPost); 
  };

  const handlePostDelete = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== deletedPostId));
    setSelectedPost(null); 
  };

  const getMediaUrl = (post) => {
    if (post.mediaUrl) return post.mediaUrl;
    if (post.media?.startsWith("http")) return post.media;
    if (post.media?.startsWith("/")) return `http://localhost:5000${post.media}`;
    return "";
  };

  /*const handleSaveToggle = async (postId) => {
    const updatedPost = await onSaveToggle(postId);
    if (updatedPost) handlePostUpdate(updatedPost);
  };*/

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => setSelectedPost(post)}
            className="relative pb-[100%] bg-gray-100 overflow-hidden cursor-pointer group"
          >
            {getMediaUrl(post)?.endsWith(".mp4") ? (
              <video
                src={getMediaUrl(post)}
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition duration-200"
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={getMediaUrl(post)}
                alt="user post"
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition duration-200"
              />
            )}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition duration-200" />
          </div>
        ))}
      </div>

      {selectedPost && (
        <CommentPopup
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLikeToggle={() => {}}
          onSaveToggle={onSaveToggle}
          onCommentAdded={() => {}}
          showEditMenu={true}
          onPostUpdate={handlePostUpdate} 
          onPostDelete={handlePostDelete} 
        />
      )}
    </>
  );
};

export default PostGrid;
