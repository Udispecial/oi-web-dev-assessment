import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() },
});

const tagModel = mongoose.model("Tag", TagSchema);

export default tagModel;
