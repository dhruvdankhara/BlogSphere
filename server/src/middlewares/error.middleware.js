import fs from "fs";
import { ValidationError } from "yup";
import { ApiError } from "../utils/ApiError.js";
import { removeMulterImageFilesOnError } from "../utils/helper.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || error instanceof ValidationError ? 400 : 500,
      error.message || "Something wrong",
      error?.errors || [],
      error.stack
    );
  }

  removeMulterImageFilesOnError(req);

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
