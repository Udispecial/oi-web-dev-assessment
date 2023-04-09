import express from "express";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPostsById,
} from "../controllers/post.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getAllPosts);
router.route("/:id").get(getPostsById);
router.route("/", auth).post(createPost);
router.route("/:id", auth).patch(updatePost);
router.route("/:id", auth).delete(deletePost);

export default router;
