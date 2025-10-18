// const multer = require("multer");
// // const path = require("path");

// // Store files in memory (good for uploading to cloud like Cloudinary)
// // const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Data.now() + "-" + file.originalname);
//   },
// });

// exports.upload = multer({ storage });



const multer = require("multer");

// Use memory storage for uploading files directly to Cloudinary
const storage = multer.memoryStorage(); // updated

exports.upload = multer({ storage }); // updated




// Only accept video files
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("video/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only video files are allowed"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;
