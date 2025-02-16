import Blog from "../models/blog.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import { ApiError } from "../utils/ApiError.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({ username }).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found with this username");
  }

  const followers = await Follow.find({
    following: user._id,
  });

  const following = await Follow.find({
    follower: user._id,
  });

  let isFollowing = false;

  if (req.user) {
    const isFollow = await Follow.findOne({
      follower: req.user._id,
      following: user._id,
    });

    if (isFollow) {
      isFollowing = true;
    }
  }

  const posts = await Blog.find({ userId: user._id });

  const data = {
    ...user._doc,
    followers: followers.length,
    following: following.length,
    isFollowing,
    posts: posts.length,
  };

  const response = new ApiResponse(200, data, "User fetched successfully");
  return res.status(response.statusCode).json(response);
});

export const getUserPost = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const blogs = await Blog.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: {
          $first: "$user",
        },
      },
    },
    {
      $addFields: {
        username: "$user.username",
      },
    },
    {
      $match: {
        username,
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
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  const response = new ApiResponse(200, blogs, "user fetched succefully");
  return res.status(response.statusCode).json(response);
});

export const followUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const loggedInUser = req.user;

  const followedUser = await User.findOne({ username });

  if (!followedUser) {
    throw new ApiError(404, {}, "User not found");
  }

  if (followedUser.username === loggedInUser.username) {
    throw new ApiError(400, "You can't follow yourself");
  }

  const isAlreadyFollowing = await Follow.findOne({
    follower: loggedInUser._id,
    following: followedUser._id,
  });

  if (isAlreadyFollowing) {
    throw new ApiError(400, "You already follow this user");
  }

  const follow = await Follow.create({
    follower: loggedInUser._id,
    following: followedUser._id,
  });

  const response = new ApiResponse(201, follow, "User followed successfully");
  return res.status(response.statusCode).json(response);
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const loggedInUser = req.user;

  const followedUser = await User.findOne({ username });

  if (!followedUser) {
    throw new ApiError(404, "User not found");
  }

  if (followedUser.username === loggedInUser.username) {
    throw new ApiError(400, "You can't unfollow yourself");
  }

  const isFollowing = await Follow.findOne({
    follower: loggedInUser._id,
    following: followedUser._id,
  });

  if (!isFollowing) {
    throw new ApiError(400, "You don't follow this user");
  }

  await Follow.findByIdAndDelete(isFollowing._id);

  const response = new ApiResponse(200, {}, "User unfollowed successfully");
  return res.status(response.statusCode).json(response);
});

export const getFollowersFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const followers = await Follow.find({
    follower: userId,
  });

  const following = await Follow.find({
    following: userId,
  });

  const response = new ApiResponse(
    400,
    {
      followers: followers.length,
      following: following.length,
    },
    "You don't follow this user"
  );
  return res.status(response.statusCode).json(response);
});
