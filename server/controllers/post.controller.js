import mongoose from "mongoose";
import Post from "../mongodb/models/post.js";
import User from "../mongodb/models/user.js";

import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllPosts = async (req, res) => {
  const { searchQuery = "", page = 1 } = req.query;

  const query = {};
  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  try {
    const startIndex = (Number(page) - 1) * 8;
    const count = await Post.countDocuments({ query });
    const post = await Post.find(query)
      .limit(8)
      .sort({ _id: -1 })
      .skip(startIndex)
      .populate("tags")
      .populate("categories")
      .populate("comments");

    res.status(200).json({
      data: post,
      currentPage: Number(page),
      total: Math.ceil(count / 8),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostsById = async (req, res) => {
  const { id } = req.params;
  const postExists = await Post.findOne({ _id: id })
    .populate("tags")
    .populate("categories")
    .populate("comments");
  if (postExists) {
    res.status(200).json(postExists);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, description, category, tags, photo } = req.body;
    // start a new session

    const session = await mongoose.startSession();
    session.startTransaction();

    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      title,
      description,
      category,
      tags,
      photo: photoUrl.url,
      creator: req.user_id,
      created_at: new Date().toISOString(),
    });
    newPost.categories.push(category);
    newPost.tags.push(tags);
    await newPost.save({ session });

    session.commitTransaction();

    res
      .status(200)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        category,
        tags,
        photo: photoUrl.url || photo,
        updated_at: new Date().toISOString(),
      }
    );
    updatedPost.categories.push(category);
    updatedPost.tags.push(tags);
    await updatedPost.save({ session });

    res.status(200).json({ message: "Post updated sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const postToDelete = await Post.findById({ _id: id });

    if (!postToDelete) throw new Error("Post not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    postToDelete.deleteOne({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Post deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllPosts, createPost, updatePost, deletePost, getPostsById };
