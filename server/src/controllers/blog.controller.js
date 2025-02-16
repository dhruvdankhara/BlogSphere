import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { createBlogPostSchema } from "../schemas/blog.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";

export const createBlogPost = asyncHandler(async (req, res) => {
  // TODO: add topics feature using id and file this id with database queries.
  const user = req.user;
  const file = req.file;
  const { title, content, slug } = req.body;

  await createBlogPostSchema.validate({ title, content, slug });

  const existingBlog = await Blog.findOne({ slug });

  if (existingBlog) {
    throw new ApiError(400, "Blog post with this title already exists");
  }

  let imageUrl = "";
  if (file) {
    imageUrl = await uploadImage(file.path);
  }

  const blog = await Blog.create({
    userId: user._id,
    title,
    content,
    slug,
    featureImage: imageUrl?.secure_url || "",
  });

  if (!blog) {
    throw new ApiError(500, "Failed to create blog post");
  }

  const response = new ApiResponse(201, blog, "Blog post created successfully");
  return res.status(response.statusCode).json(response);
});

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findOne({ slug: blogId });

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  if (blog.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this blog post");
  }

  await deleteImage(
    blog.featureImage
      .substring(blog.featureImage.lastIndexOf("/") + 1)
      .split(".")[0]
  );

  await Blog.findByIdAndDelete(blog._id);

  await Comment.deleteMany({ blogId: blog._id });

  await Like.deleteMany({ blogId: blog._id });

  const response = new ApiResponse(200, null, "Blog post deleted successfully");
  return res.status(response.statusCode).json(response);
});

export const editBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { title, content, slug } = req.body;
  const file = req.file;

  const blog = await Blog.findOne({ slug: blogId });

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  if (blog.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this blog post");
  }

  if (slug != blog.slug) {
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      throw new ApiError(400, "Blog post with this title already exists");
    }
  }

  if (file) {
    const cloudinaryResponse = await uploadImage(file.path);
    blog.featureImage = cloudinaryResponse.secure_url;
  }

  if (title) blog.title = title;
  if (content) blog.content = content;
  if (slug) blog.slug = slug;

  await blog.save();

  const response = new ApiResponse(200, blog, "Blog post updated successfully");
  return res.status(response.statusCode).json(response);
});

export const getBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.aggregate([
    {
      $match: {
        // _id: new mongoose.Types.ObjectId(blogId),
        slug: blogId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: {
          $first: "$author",
        },
      },
    },
    {
      $project: {
        userId: 0,
        __v: 0,
      },
    },
  ]);

  if (blog.length == 0) {
    throw new ApiError(404, "Blog post not found");
  }

  await Blog.updateOne({ _id: blog[0]._id }, { visits: blog[0].visits + 1 });

  let isLiked = false;
  if (req.user) {
    const like = await Like.findOne({
      userId: req.user._id,
      blogId: blog[0]._id,
    });

    if (like) {
      isLiked = true;
    }
  }

  const likes = await Like.find({ blogId: blog[0]._id });

  const comments = await Comment.find({ blogId: blog[0]._id });

  const response = new ApiResponse(
    200,
    { ...blog[0], isLiked, likes: likes.length, comments: comments.length },
    "Blog post retrieved successfully"
  );

  return res.status(response.statusCode).json(response);
});

export const getAllBlogPosts = asyncHandler(async (req, res) => {
  const blog = await Blog.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: {
          $first: "$author",
        },
      },
    },
    {
      $project: {
        userId: 0,
        __v: 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  const response = new ApiResponse(
    200,
    blog,
    "Blog posts retrieved successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const getPopularBlogPosts = asyncHandler(async (req, res) => {
  const blog = await Blog.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: {
          $first: "$author",
        },
      },
    },
    {
      $project: {
        userId: 0,
        __v: 0,
      },
    },
    {
      $sort: {
        visits: -1,
      },
    },
  ]);

  const response = new ApiResponse(
    200,
    blog,
    "Popular blog posts retrieved successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const likeBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  const isAlreadyLiked = await Like.findOne({
    userId: req.user._id,
    blogId: blog._id,
  });

  if (isAlreadyLiked) {
    throw new ApiError(400, "You have already liked this blog post");
  }

  await Like.create({
    userId: req.user._id,
    blogId: blog._id,
  });

  const response = new ApiResponse(200, null, "Blog post liked successfully");
  return res.status(response.statusCode).json(response);
});

export const unlikeBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  const isAlreadyLiked = await Like.findOne({
    userId: req.user._id,
    blogId: blog._id,
  });

  if (!isAlreadyLiked) {
    throw new ApiError(400, "You have not liked this blog post");
  }

  await Like.findOneAndDelete({
    userId: req.user._id,
    blogId: blog._id,
  });

  const response = new ApiResponse(200, null, "Blog post unliked successfully");
  return res.status(response.statusCode).json(response);
});

export const searchBlogPosts = asyncHandler(async (req, res) => {
  const { searchQuery } = req.params;

  const blog = await Blog.aggregate([
    {
      $match: {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: {
          $first: "$author",
        },
      },
    },
    {
      $project: {
        userId: 0,
        __v: 0,
      },
    },
  ]);

  const response = new ApiResponse(
    200,
    blog,
    "Search results retrieved successfully"
  );
  return res.status(response.statusCode).json(response);
});
