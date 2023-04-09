import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
  creator: { type: String },
  approved: { type: Number },
  post_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const commentModel = mongoose.model("Comment", CommentSchema);

export default commentModel;
