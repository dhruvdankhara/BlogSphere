import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cookieOption } from "../constants.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../schemas/auth.schema.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import { sendMail } from "../utils/helper.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  await registerSchema.validate({ name, email, username, password });

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "Email or username already exist");
  }

  // TODO: add profile feature

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

export const updateUser = asyncHandler(async (req, res) => {
  const { user } = req;
  const { name, username, email, gender } = req.body;

  // Validate request body
  await updateUserSchema.validate({ name, username, email, gender });

  // Check if email or username is already taken
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

  // Update user details
  user.name = name || user.name;
  user.username = username || user.username;
  user.email = email || user.email;
  user.gender = gender || user.gender;

  await user.save();

  const response = new ApiResponse(200, user, "User updated successfully");
  return res.status(response.statusCode).json(response);
});

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  user.isVerified = true;
  user.verificationToken = null;

  await user.save();

  const response = new ApiResponse(200, {}, "Email Verified SuccessFully");
  return res.status(response.statusCode).json(response);
};

export const sendEmailVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found with this email" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Email is already verified" });
  }

  const token = uuidv4();
  user.verificationToken = token;

  await user.save();
  const verificationLink = `http://localhost:8000/verify-email/${token}`;
  const message = `
          <h3>Email Verification Request</h3>
          <p>You requested a email verification. Click the button below to verify your email:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-align: center; border-radius: 5px; text-decoration: none; font-size: 16px;">
              Verify Email
          </a>
          <p>If you did not request this, please ignore this email.</p>
      `;

  await sendMail(email, "Email Verification Request", message);

  const response = new ApiResponse(
    200,
    {},
    "verification link is send To your profile"
  );

  return res.status(response.statusCode).json(response);
};

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  const resetToken = uuidv4();
  const resetTokenExpiration = Date.now() + 3600000;
  user.resetToken = resetToken;
  user.resetTokenExpiration = resetTokenExpiration;
  await user.save();

  const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;
  const message = `
          <h3>Password Reset Request</h3>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-align: center; border-radius: 5px; text-decoration: none; font-size: 16px;">
              Reset Password
          </a>
          <p>If you did not request this, please ignore this email.</p>
      `;
  await sendMail(email, "Password Reset Request", message);

  const response = new ApiResponse(
    200,
    {},
    "Password Reset Request Sent To your Email"
  );

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
  // const hashedpassword = await bcrypt.hash(newPassword, 8);
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;

  await user.save();

  const response = new ApiResponse(200, {}, "Password successfully reset");

  res.status(response.statusCode).json(response);
};
