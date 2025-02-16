import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
  changeCurrentPassword,
  changeAvatar,
  updateUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/register", registerUser);

router.get("/me", verifyJWT, getCurrentUser);

router.post("/change-password", verifyJWT, changeCurrentPassword);

router.post("/update-avatar", verifyJWT, upload.single("avatar"), changeAvatar);

router.post("/update-user", verifyJWT, updateUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
