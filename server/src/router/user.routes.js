import { Router } from "express";
import {
  verifyJWT,
  getLoggedInUserOrIgnore,
} from "../middlewares/auth.middleware.js";
import {
  followUser,
  getUserPost,
  unfollowUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/:username").get(getLoggedInUserOrIgnore, getUserProfile);

router.route("/:username/follow").post(verifyJWT, followUser);
router.route("/:username/unfollow").post(verifyJWT, unfollowUser);

router.route("/:username/blogs").get(getUserPost);

export default router;
