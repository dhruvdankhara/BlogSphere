import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cookieOption } from "../constants.js";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
  changePasswordSchema,
} from "../schemas/auth.schema.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  await registerSchema.validate({ name, email, username, password });

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "Email or username already exist");
  }

  const user = await User.create({
    name,
    email,
    username,
    password,
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  const token = await createdUser.generateAccessToken();

  const response = new ApiResponse(
    201,
    { user: createdUser, token },
    "User register successfully"
  );
  return res
    .status(response.statusCode)
    .cookie("token", token, cookieOption)
    .json(response);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  await loginSchema.validate({ username, email, password });

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found with this username or email");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  const token = await user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -updatedAt -createdAt"
  );

  const response = new ApiResponse(
    200,
    { user: loggedInUser, token },
    "User login successfully."
  );
  return res
    .status(response.statusCode)
    .cookie("token", token, cookieOption)
    .json(response);
});

export const logoutUser = asyncHandler((req, res) => {
  const response = new ApiResponse(200, {}, "User logged out successfully");
  return res
    .status(response.statusCode)
    .clearCookie("token", cookieOption)
    .json(response);
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const response = new ApiResponse(200, user, "user fetched successfully");
  return res.status(response.statusCode).json(response);
});

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.trim().length === 0
  ) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const user = await User.findOne({ resetToken: token });
  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }
  if (user.resetTokenExpiration < Date.now()) {
    return res.status(400).json({ message: "Token expired" });
  }
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;

  await user.save();

  const response = new ApiResponse(200, {}, "Password successfully reset");

  res.status(response.statusCode).json(response);
};

export const updateUser = asyncHandler(async (req, res) => {
  const { user } = req;
  const { name, username, email, gender } = req.body;

  await updateUserSchema.validate({ name, username, email, gender });

  const isEmailTaken = await User.findOne({ email });
  if (isEmailTaken && isEmailTaken._id.toString() !== user._id.toString()) {
    throw new ApiError(409, "Email already exists");
  }

  const isUsernameTaken = await User.findOne({ username });
  if (
    isUsernameTaken &&
    isUsernameTaken._id.toString() !== user._id.toString()
  ) {
    throw new ApiError(409, "Username already exists");
  }

  user.name = name || user.name;
  user.username = username || user.username;
  user.email = email || user.email;
  user.gender = gender || user.gender;

  await user.save();

  const response = new ApiResponse(200, user, "User updated successfully");
  return res.status(response.statusCode).json(response);
});

export const changeAvatar = asyncHandler(async (req, res) => {
  const user = req.user;
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "Please provide an image");
  }

  if (user.avatar) {
    await deleteImage(
      user.avatar.substring(user.avatar.lastIndexOf("/") + 1).split(".")[0]
    );
  }

  const imageUrl = await uploadImage(file.path);

  if (!imageUrl) {
    throw new ApiError(500, "Failed to upload image");
  }

  user.avatar = imageUrl.secure_url;

  await user.save();

  const response = new ApiResponse(200, user, "profile image updated");
  return res.status(response.statusCode).json(response);
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  await changePasswordSchema.validate({ oldPassword, newPassword });

  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  user.password = newPassword;

  await user.save();

  const response = new ApiResponse(200, {}, "Password changed successfully");
  return res.status(response.statusCode).json(response);
});
