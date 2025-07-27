import express from 'express';
import upload from '../middleware/upload.js'; 
import { protect } from "../middleware/authMiddleware.js";
import { 
  uploadProfilePhoto,
  removeProfilePhoto,
  updateFullname,
  updateUsername,
  updatePassword,
  updateEmail,
  updateBirthday,
  followUser,
  unfollowUser,
  getSuggestedUsers,
  removeFollower,
  updateBio
} from '../controllers/userController.js';

import User from "../models/User.js"; 

const router = express.Router();

router.post('/upload-photo', protect, upload.single('photo'), uploadProfilePhoto);
router.delete('/remove-photo', protect, removeProfilePhoto);
router.put('/update-name', protect, updateFullname);
router.put('/update-username', protect, updateUsername);
router.put('/update-password', protect, updatePassword);
router.put('/update-email', protect, updateEmail);
router.put("/update-birthday", protect, updateBirthday);
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.get('/suggested', protect, getSuggestedUsers);
router.put("/remove-follower/:id", protect, removeFollower);
router.put("/update-bio", protect, updateBio);

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("followers", "username photo fullname")
      .populate("following", "username photo fullname");

    res.json({
      _id: user._id, 
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      photo: user.photo,
      fullname: user.fullname || "",
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get('/search', protect, async (req, res) => {
  const { q } = req.query;
  console.log('Search query:', q);

  if (!q) return res.json([]);

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullname: { $regex: q, $options: 'i' } }
      ]
    }).select('_id username fullname photo');

    console.log('Users found:', users.length);

    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ msg: 'Server error during search' });
  }
});


router.get('/:username', protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("followers", "username photo fullname")
      .populate("following", "username photo fullname");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      _id: user._id, 
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      photo: user.photo,
      fullname: user.fullname || "",
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



export default router;
