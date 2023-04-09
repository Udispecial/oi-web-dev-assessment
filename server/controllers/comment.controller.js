import mongoose from "mongoose";
import Comment from "../mongodb/models/comment.js";
import Post from "../mongodb/models/post.js";

const getAllComments = async (req, res) => {
  const query = {};
  try {
    const post = await Comment.find(query);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { comment, postId, name } = req.body;
    // start a new session

    const session = await mongoose.startSession();
    session.startTransaction();

    const post = await Post.findById({ _id: postId }).session(session);
    if (!post) throw new Error("Post not found");

    const newComment = await Comment.create({
      comment,
      name,
      approved: 0,
      creator: req.user_id,
      created_at: new Date().toISOString(),
    });
    post.comments.push(newComment._id);
    await post.save({ session });
    console.log(post);
    // newComment.post_id.push(post._id);
    // await newComment.save({ session });

    session.commitTransaction();

    res.status(200).json({ message: "Comment created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndUpdate(
      { _id: id },
      {
        approved: 1,
        updated_at: new Date().toISOString(),
      }
    );

    res.status(200).json({ message: "Comment updated sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const commentToDelete = await Comment.findById({ _id: id });

    if (!commentToDelete) throw new Error("comment not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    commentToDelete.deleteOne({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Comment deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCommentByPostId = async () => {};

export {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentByPostId,
};
