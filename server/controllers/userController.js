import User from '../models/User.js';
import bcrypt from "bcryptjs";

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    console.log("Uploaded file info:", req.file);

    const photoUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { photo: photoUrl },
      { new: true }
    );

    console.log("Updated user after upload:", updatedUser);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during upload' });
  }
};


export const removeProfilePhoto = async (req, res) => {
  try {
   
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { photo: "" }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error during photo removal" });
  }
};


export const updateFullname = async (req, res) => {
  try {
    const { fullname } = req.body;

    if (!fullname || fullname.trim() === "") {
      return res.status(400).json({ msg: "Fullname is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullname },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ fullname: updatedUser.fullname });
  } catch (err) {
    console.error("Error updating name:", err);
    res.status(500).json({ msg: "Server error while updating name" });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === "") {
      return res.status(400).json({ msg: "Username is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ username: updatedUser.username });
  } catch (err) {
    console.error("Error updating username:", err);
    res.status(500).json({ msg: "Server error while updating username" });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ msg: "Server error during password update" });
  }
};


export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email.trim() === "") {
      return res.status(400).json({ msg: "Email is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { email },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ email: updatedUser.email });
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ msg: "Server error while updating email" });
  }
};

export const updateBirthday = async (req, res) => {
  try {
    const { birthday } = req.body;
    if (!birthday) {
      return res.status(400).json({ msg: "Birthday is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { birthday },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ birthday: updatedUser.birthday });
  } catch (error) {
    console.error("Error updating birthday:", error);
    res.status(500).json({ msg: "Server error while updating birthday" });
  }
};


export const followUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id || req.user.id);
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({ msg: "User to follow not found" });
    }

    const alreadyFollowing = currentUser.following.some(followingId => followingId.equals(userToFollow._id));
    if (!alreadyFollowing) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);

      await currentUser.save();
      await userToFollow.save();
    }

    const updatedCurrentUser = await User.findById(currentUser._id)
      .populate('followers', 'username photo fullname')
      .populate('following', 'username photo fullname');

    res.json({
      msg: "Followed",
      user: updatedCurrentUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during follow" });
  }
};


export const unfollowUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userToUnfollow = await User.findById(req.params.id);

    if (!userToUnfollow) {
      return res.status(404).json({ msg: "User to unfollow not found" });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    const updatedCurrentUser = await User.findById(currentUser._id)
      .populate('followers', 'username photo fullname')
      .populate('following', 'username photo fullname');

    res.json({
      msg: "Unfollowed",
      user: updatedCurrentUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during unfollow" });
  }
};


export const getSuggestedUsers = async (req, res) => {
  const currentUser = await User.findById(req.user._id).populate("following");

  const suggestions = await User.find({
    _id: { $ne: currentUser._id, $nin: currentUser.following }
  }).limit(5);

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const suggestionsWithFollowStatus = suggestions.map((user) => {
    return {
      ...user.toObject(),
      photo: user.photo ? `${baseUrl}${user.photo}` : "", 
      isFollowing: currentUser.following.some((f) => f._id.equals(user._id)),
    };
  });

  res.json(suggestionsWithFollowStatus);
};


export const removeFollower = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const followerToRemove = await User.findById(req.params.id);

    if (!followerToRemove) {
      return res.status(404).json({ msg: "Follower not found" });
    }

    currentUser.followers = currentUser.followers.filter(
      (followerId) => followerId.toString() !== followerToRemove._id.toString()
    );

    followerToRemove.following = followerToRemove.following.filter(
      (followingId) => followingId.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await followerToRemove.save();

    res.status(200).json({ msg: "Follower removed", followers: currentUser.followers });
  } catch (error) {
    console.error("Remove follower error:", error);
    res.status(500).json({ msg: "Server error removing follower" });
  }
};

export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;

    if (bio.length > 150) {
      return res.status(400).json({ msg: "Bio must be 150 characters or less" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { bio },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ bio: updatedUser.bio });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ msg: "Server error while updating bio" });
  }
};
