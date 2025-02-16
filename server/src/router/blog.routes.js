import { Router } from "express";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import {
  createBlogPost,
  deleteBlogPost,
  editBlogPost,
  getBlogPost,
  getAllBlogPosts,
  likeBlogPost,
  unlikeBlogPost,
  getPopularBlogPosts,
  searchBlogPosts,
} from "../controllers/blog.controller.js";
import upload from "../middlewares/multer.middlewares.js";
import {
  getBlogComments,
  createComment,
} from "../controllers/comment.controller.js";

const router = Router();

router
  .route("/")
  .get(getAllBlogPosts)
  .post(verifyJWT, upload.single("featureImage"), createBlogPost);

router.route("/popular").get(getPopularBlogPosts);

router
  .route("/:blogId")
  .get(getLoggedInUserOrIgnore, getBlogPost)
  .post(verifyJWT, upload.single("featureImage"), editBlogPost)
  .delete(verifyJWT, deleteBlogPost);

router.route("/search/:searchQuery").get(searchBlogPosts);

router
  .route("/:blogId/comment")
  .get(getBlogComments)
  .post(verifyJWT, createComment);

router.route("/:blogId/like").post(verifyJWT, likeBlogPost);
router.route("/:blogId/unlike").post(verifyJWT, unlikeBlogPost);

export default router;
