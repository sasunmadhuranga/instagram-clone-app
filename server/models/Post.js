import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  media: { type: String, required: true }, 
  caption: { type: String },
  location: { type: String },
  hideLikes: { type: Boolean, default: false },
  disableComments: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
