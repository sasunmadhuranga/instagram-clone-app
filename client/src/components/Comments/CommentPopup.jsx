import axios from "axios";
import React, { useState, useEffect } from "react";
import IconSection from "../IconSection";
import UserInfoCard from "../UserInfoCard";
import DeleteComment from "./DeleteComment";
import EmojiPicker from "./EmojiPicker";
import EditMenu from "./EditMenu";
import ConfirmModal from "../ConfirmModal";
import DetailsStep from "../CreatePost/DetailsStep";

const CommentPopup = ({ post, onClose, onLikeToggle, onSaveToggle, onCommentAdded, showEditMenu, onPostUpdate, onPostDelete, }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [openMenuIdx, setOpenMenuIdx] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [postData, setPostData] = useState(post);
  const mediaSrc = post.mediaUrl || post.media;

  const handleEmojiSelect = (emoji) => {
    setCommentText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const res = await fetch(`http://localhost:5000/api/posts/comment/${post._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ text: commentText }),
    });

    if (res.ok) {
      const updatedComments = await res.json();
      setComments(updatedComments);
      setCommentText("");
      onCommentAdded?.(post._id, updatedComments);
    } else {
      console.error("Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const res = await fetch(
      `http://localhost:5000/api/posts/${post._id}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (res.ok) {
      const updatedComments = await res.json();
      setComments(updatedComments);
      onCommentAdded?.(post._id, updatedComments);
    } else {
      console.error("Failed to delete comment");
    }
  };


  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      onPostDelete?.(post._id);
      onClose();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  useEffect(() => {
    setPostData({
      ...post,
      advanced: {
        hideLikes: post.hideLikes ?? false,
        disableComments: post.disableComments ?? false,
      },
    });
    setIsEditing(false);
  }, [post]);


  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
  };

  const handleUpdatePost = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const formData = new FormData();

      if (postData.croppedMedia || postData.originalMedia) {
        formData.append("media", postData.croppedMedia || postData.originalMedia);
      }
      formData.append("caption", postData.caption || "");
      formData.append("location", postData.location || "");
      formData.append("hideLikes", postData.advanced?.hideLikes || false);
      formData.append("disableComments", postData.advanced?.disableComments || false);

      const res = await fetch(`http://localhost:5000/api/posts/${postData._id}`, {
        method: "PUT",  
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const fullMediaUrl = data.media?.startsWith("http")
          ? data.media
          : `http://localhost:5000${data.media}`;

        const updatedPost = {
          ...data,
          mediaUrl: fullMediaUrl,
        };

        setPostData(updatedPost);
        setIsEditing(false);
        onPostUpdate?.(updatedPost); 
        onClose();


      } else {
        console.error("Update failed", data.msg);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
    onClose();
  };

  



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl"
        onClick={onClose}
      >
        &times;
      </button>

      <div className="bg-white w-[900px] h-[600px] rounded shadow-lg relative flex">
        {showEditMenu && (
          <EditMenu
            onDelete={confirmDelete}
            onCancel={() => {}}
            onEdit={startEditing}
          />
        )}
        <div className="w-1/2 bg-black flex items-center justify-center">
          {mediaSrc?.endsWith(".mp4") ? (
            <video
              src={mediaSrc}
              controls
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <img
              src={mediaSrc}
              alt="Post"
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>

        <div className="w-1/2 p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <UserInfoCard user={post.user} location={post.location} />
            <div className="text-sm text-gray-800 mb-2">{post.caption}</div>

            <div className="max-h-48 overflow-y-auto mb-4 relative">
              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="text-sm py-3 border-b flex justify-between items-center relative"
                  >
                    <span>
                      <strong>{comment.username}:</strong> {comment.text}
                    </span>

                    {(comment.userId === user._id || comment.userId?._id === user._id) && (
                      <div className="relative ml-2">
                        <button
                          onClick={() => setOpenMenuIdx(idx)}
                          className="text-gray-500 hover:text-black px-2"
                        >
                          ⋯
                        </button>
                        {openMenuIdx === idx && (
                          <DeleteComment
                            onDelete={() => {
                              handleDeleteComment(comment._id);
                              setOpenMenuIdx(null);
                            }}
                            onCancel={() => setOpenMenuIdx(null)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <IconSection post={post} handleLike={onLikeToggle} handleSave={onSaveToggle} handleComment={() => {}} />
            <form onSubmit={handleAddComment} className="flex items-start gap-2 mt-2 relative">
              <button
                type="button"
                className="text-xl px-2"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                😊
              </button>

              {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}

              <textarea
                placeholder="Add a comment..."
                className="flex-1 border rounded px-2 py-3 text-sm resize-none overflow-y-auto max-h-[72px] leading-tight"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={1}
              />

              <button type="submit" className="text-blue-500 font-semibold text-sm">
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
      {showConfirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this post?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-60">
          <DetailsStep
            postData={postData}
            setPostData={setPostData}
            onNext={handleUpdatePost}
            onBack={stopEditing}
            isEditing={true}
          />
        </div>
      )}

    </div>
  );
};

export default CommentPopup;
