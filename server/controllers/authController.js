import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });


    const baseUrl = `${req.protocol}://${req.get("host")}`;


    const userToSend = {
      id: user._id,
      fullname: user.fullname,   
      username: user.username,
      email: user.email,
      birthday: user.birthday,
      photo: user.photo ? `${baseUrl}${user.photo}` : "",
    };


    
    res.json({
      token,
      user: userToSend,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const signup = async (req, res) => {
  const { fullname, username, email, password, birthday } = req.body;

  if (!fullname || !username || !email || !password || !birthday) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      birthday,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        birthday: newUser.birthday,
        photo: newUser.photo ? `${baseUrl}${newUser.photo}` : "",
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error during signup" });
  }
};
