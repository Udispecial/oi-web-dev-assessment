import express from "express";
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getAllTags);
router.route("/", auth).post(createTag);
router.route("/:id", auth).patch(updateTag);
router.route("/:id", auth).delete(deleteTag);

export default router;
