import express from "express";
import { login, createUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(createUser);

export default router;
