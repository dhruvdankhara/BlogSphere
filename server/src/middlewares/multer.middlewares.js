import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-")
      .split(".")[0];

    const fileExtension = file.originalname.substring(
      file.originalname.lastIndexOf(".")
    );
    cb(null, fileName + "-" + Date.now() + fileExtension);
  },
});

const upload = multer({ storage });

export default upload;
