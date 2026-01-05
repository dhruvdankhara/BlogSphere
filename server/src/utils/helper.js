import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { uploadImage } from "./cloudinary.js";

export const removeMulterImageFilesOnError = (req) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log("Error while removing file from local:", err);
      } else {
        console.log("Removed file local path: ", req.file.path);
      }
    });
  }
};

export const generateBlogImageFromTitle = async (title) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

  const prompt =
    `Create a picture that represents a blog post titled "${title}". ` +
    `The image should be visually appealing and relevant to the title. ` +
    `Provide the image in PNG format as base64 encoded data.`;

  const aspectRatio = "16:9";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ text: prompt }],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: aspectRatio,
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");

      const imageName = `blog-image-${Date.now()}.png`;

      fs.writeFileSync(imageName, buffer);

      const uploadedImage = await uploadImage(imageName);
      // console.log(`Image saved as ${imageName}`);

      return uploadedImage?.secure_url;
    }
  }
};
