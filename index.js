const express = require("express");
const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Load environment variables

const app = express();
const port = 5000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.get("/get-pdfs", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("resource_type:raw AND format:pdf") // Filter PDFs
      .sort_by("created_at", "desc") // Sort by latest uploaded
      .max_results(100) // Limit results
      .execute();

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
