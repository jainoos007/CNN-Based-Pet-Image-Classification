const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.error("❌ No file received!");
    return res.status(400).json({ error: "No file uploaded!" });
  }

  const imagePath = path.join(__dirname, req.file.path);
  console.log("✅ Image received:", imagePath);

  exec(`python predict.py "${imagePath}"`, (error, stdout, stderr) => {
    fs.unlinkSync(imagePath); // Clean up image after prediction

    if (error) {
      console.error("❌ Prediction Error:", stderr || error.message);
      return res
        .status(500)
        .json({ error: "Prediction failed", details: stderr || error.message });
    }

    // Extract the actual result (Cat/Dog) from the output
    const outputLines = stdout.trim().split("\n");
    const cleanResult = outputLines[outputLines.length - 1].trim(); // Get last meaningful output

    res.json({ result: cleanResult });
  });
});

app.listen(7000, () => {
  console.log("🚀 Server running on http://localhost:7000");
});
