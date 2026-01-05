import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt.js";

import { AvailableUserGender, UserGenderEnum } from "../constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: null,
      enum: AvailableUserGender,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
  };
  return generateToken(payload);
};

const User = model("User", userSchema);

export default User;
