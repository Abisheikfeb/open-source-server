const express = require("express");
const cors = require("cors"); // Import CORS
const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Load environment variables

const app = express();
const port = 5000;

// Enable CORS for frontend (React running on port 3000)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from React frontend
    methods: "GET,POST",
  })
);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Route to Get PDF Files from Cloudinary
app.get("/get-pdfs", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("format:pdf") // Fetch PDFs (removes resource_type:raw)
      .sort_by("created_at", "desc") // Sort by latest uploaded
      .max_results(100) // Limit results
      .execute();

    // Extract relevant data
    const pdfs = result.resources.map((pdf) => ({
      public_id: pdf.public_id,
      url: pdf.secure_url,
      format: pdf.format,
    }));

    res.json(pdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ error: "Error fetching PDFs", details: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
