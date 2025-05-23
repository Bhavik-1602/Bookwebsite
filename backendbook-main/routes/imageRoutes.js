import express from "express";
import upload from "../middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index"); // make sure views/index.ejs exists
});

router.post("/image", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, { folder: "NodeJs_Express" });
    console.log("Cloudinary response:", cloudinaryResponse);
    res.json({ message: "File uploaded successfully", data: cloudinaryResponse });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
