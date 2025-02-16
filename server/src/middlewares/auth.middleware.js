import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken } from "../config/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decodedData = verifyToken(token);

    const user = await User.findById(decodedData?._id).select(
      "-password -createdAt -updatedAt -__v"
    );

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized");
  }
});

export const getLoggedInUserOrIgnore = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedData?._id).select(
      "-password -createdAt -updatedAt -__v"
    );

    req.user = user;
    next();
  } catch (error) {
    next();
  }
});
