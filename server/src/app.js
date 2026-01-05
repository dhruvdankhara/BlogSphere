import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

import errorHandler from "./middlewares/error.middleware.js";
import upload from "./middlewares/multer.middlewares.js";

import authRoute from "./router/auth.routes.js";
import blogRoute from "./router/blog.routes.js";
import userRoute from "./router/user.routes.js";

import asyncHandler from "./utils/asyncHandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { uploadImage } from "./utils/cloudinary.js";

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/user", userRoute);

app.post(
  "/api/v1/upload",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const file = req.file;

    let imageUrl = "";
    if (file) {
      imageUrl = await uploadImage(file.path);
    }

    const response = new ApiResponse(
      201,
      { imageUrl: imageUrl?.secure_url },
      "image uploaded"
    );

    return res.status(response.statusCode).json(response);
  })
);

app.use(errorHandler);

export default app;
