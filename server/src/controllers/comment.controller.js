import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Comment from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Blog from "../models/blog.model.js";
import mongoose from "mongoose";

export const createComment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { blogId } = req.params;
  const { content } = req.body;

  const blogPost = await Blog.findById(blogId);

  const comment = await Comment.create({
    content,
    userId: user._id,
    blogId: blogPost._id,
  });

  if (!comment) {
    throw new ApiError(500, "Falied to create comment.");
  }

  const response = new ApiResponse(201, comment, "Comment added successfully.");
  return res.status(response.statusCode).json(response);
});

export const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const comments = await Comment.aggregate([
    {
      $match: {
        blogId: new mongoose.Types.ObjectId(blogId),
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
              password: 0,
              createdAt: 0,
              updatedAt: 0,
              __v: 0,
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
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        __v: 0,
      },
    },
  ]);

  if (comments.length == 0) {
    const response = new ApiResponse(200, {}, "No Comment found on this post");
    return res.status(response.statusCode).json(response);
  }

  const response = new ApiResponse(200, comments, "Comment found.");
  return res.status(response.statusCode).json(response);
});
