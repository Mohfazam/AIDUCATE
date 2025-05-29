const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const { ApifyClient } = require("apify-client");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize Apify client
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

// Initialize Google Generative AI
const KEY4 = process.env.KEY4;
// 
const genAI = new GoogleGenerativeAI(KEY4); // This doesnt work


app.use(express.json());

app.post("/summary", async (req, res) => { // Changed to lowercase for consistency
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ success: false, error: "Missing videoId" });
    }

    const input = {
      video_url: `https://www.youtube.com/watch?v=${videoId}`,
    };

    // Run Apify actor
    const run = await client.actor("invideoiq/video-transcript-scraper").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      return res.status(404).json({ success: false, error: "No transcript found" });
    }

    const transcriptText = items.map(item => item.text).join(" ");
    
    // Generate summary
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize this YouTube transcript in 200 words:\n${transcriptText}`;
    const result = await model.generateContent(prompt);
    const summary = (await result.response).text();

    res.json({ success: true, summary });

  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate summary",
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));