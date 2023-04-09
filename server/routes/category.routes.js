import express from "express";
import {
  getAllCategories,
  createcategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getAllCategories);
router.route("/", auth).post(createcategory);
router.route("/:id", auth).patch(updateCategory);
router.route("/:id", auth).delete(deleteCategory);

export default router;
