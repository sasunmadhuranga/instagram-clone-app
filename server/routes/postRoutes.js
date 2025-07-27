import User from "../models/User.js";  
import Post from "../models/Post.js"; 
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import postUpload from "../middleware/postUpload.js";
import {
  createPost,
  getFeedPosts,
  toggleLikePost,
  addComment,
  deleteComment,
  toggleSavePost,
  getMyPosts,
  getSavedPosts,
  deletePost,
  updatePost,
  getPostsByUsername,
} from "../controllers/postController.js";


const router = express.Router();


router.post("/", protect, postUpload.single("media"), createPost);


router.get("/feed", protect, getFeedPosts);
router.put("/like/:id", protect, toggleLikePost); 
router.put("/comment/:id", protect, addComment); 
router.delete("/:id/comment/:commentId", protect, deleteComment);
router.put("/save/:id", protect, toggleSavePost);
router.get("/my-posts", protect, getMyPosts);
router.get("/saved-posts", protect, getSavedPosts);
router.delete("/:id", protect, deletePost);
router.put("/:id", protect, postUpload.single("media"), updatePost);

router.get("/user/:username", protect, getPostsByUsername);


export default router;
