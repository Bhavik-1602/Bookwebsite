const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const handleFileUpload = (upload) => (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const file = req.files[0];

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'book_covers',
      transformation: [{ width: 500, height: 700, crop: 'limit' }]
    });

    req.cloudinaryUrl = result.secure_url;
    fs.unlinkSync(file.path);
    next();
  } catch (error) {
    console.error("Cloudinary error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

module.exports = {
  handleFileUpload,
  uploadToCloudinary,
};
