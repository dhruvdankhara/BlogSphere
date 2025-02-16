import { Schema, model } from "mongoose";

const blogScheme = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    featureImage: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    visits: {
      type: Number,
      default: 0,
    },
    topicId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
  },
  { timestamps: true }
);

const Blog = model("Blog", blogScheme);

export default Blog;
