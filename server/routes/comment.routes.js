import express from "express";
import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentByPostId,
} from "../controllers/comment.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getAllComments);
router.route("/", auth).post(createComment);
router.route("/:id", auth).patch(updateComment);
router.route("/:id", auth).delete(deleteComment);
router.route("/:id", auth).get(getCommentByPostId);

export default router;
