import { Schema, model } from "mongoose";

const followSchema = new Schema(
  {
    // follower --> following :: harsh --> dhruv :: harsh is following dhruv
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Follow = model("Follow", followSchema);

export default Follow;
