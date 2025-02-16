import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { readFileSync } from "fs";
import path from "path";

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
import authRoute from "./router/auth.routes.js";
import blogRoute from "./router/blog.routes.js";
import userRoute from "./router/user.routes.js";

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/user", userRoute);

app.use(errorHandler);

export default app;
