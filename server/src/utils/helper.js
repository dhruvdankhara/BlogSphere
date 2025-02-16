import nodemailer from "nodemailer";
import fs from "fs";

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

export const sendMail = async (email, subject, message) => {
  const trasporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  await trasporter.sendMail({
    from: "blog sphere",
    to: email,
    subject,
    html: message,
  });
};
