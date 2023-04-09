import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
  creator: { type: String },
});

const postModel = mongoose.model("Post", PostSchema);

export default postModel;
