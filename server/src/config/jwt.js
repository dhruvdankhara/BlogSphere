import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const verifyToken = (token) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (error) {
    throw new ApiError(401, "unauthorized.", error);
  }
};
