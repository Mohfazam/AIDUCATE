const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
require('dotenv').config();

// YouTube.js setup with CommonJS
async function getYouTubeInstance() {
    const { Innertube } = await import('youtubei.js/web');
    return Innertube.create({
        lang: 'en',
        location: 'US',
        retrieve_player: false,
        fetch_options: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
            }
        }
    });
}

app.use(express.json());

app.post("/Summary", async (req, res) => {
    try {
        const { videoId } = req.body;

        // Validate video ID
        if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            return res.status(400).json({ 
                success: false,
                error: "Invalid YouTube Video ID format" 
            });
        }

        // Get YouTube instance
        const youtube = await getYouTubeInstance();
        
        // First check basic availability
        const basicInfo = await youtube.getBasicInfo(videoId);
        if (basicInfo.playability_status.status !== 'OK') {
            return res.status(400).json({
                success: false,
                error: "Video unavailable",
                reason: basicInfo.playability_status.reason || 'Not available in your region/country'
            });
        }

        // Get full video info
        const info = await youtube.getInfo(videoId);
        
        // Check transcript availability
        if (!info.has_transcript) {
            return res.status(400).json({
                success: false,
                error: "Transcript disabled",
                message: "This video does not have captions available"
            });
        }

        // Fetch transcript
        const transcriptData = await info.getTranscript();
        const transcriptText = transcriptData.transcript.content.body.initial_segments
            .map(segment => segment.snippet.text)
            .join(" ");

        // Generate summary
        const genAI = new GoogleGenerativeAI(process.env.KEY1);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `Generate a concise 200-word summary of this video transcript:\n\n${transcriptText}`;
        const result = await model.generateContent(prompt);
        const summary = await result.response.text();

        res.status(200).json({
            success: true,
            summary: summary.trim(),
            videoDetails: {
                title: basicInfo.basic_info.title,
                duration: basicInfo.basic_info.duration,
                channel: basicInfo.basic_info.author
            }
        });

    } catch (error) {
        console.error("Summary Error:", error);
        
        const errorInfo = {
            success: false,
            error: "Failed to generate summary",
            message: error.message,
            type: "PROCESSING_ERROR"
        };

        if (error.info?.playability_status) {
            errorInfo.type = "VIDEO_UNAVAILABLE";
            errorInfo.message = error.info.playability_status.reason;
        }

        if (error.message.includes("Transcript disabled")) {
            errorInfo.type = "TRANSCRIPT_DISABLED";
            errorInfo.message = "Captions are disabled for this video";
        }

        const statusCode = errorInfo.type === "VIDEO_UNAVAILABLE" ? 400 : 500;
        res.status(statusCode).json(errorInfo);
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});