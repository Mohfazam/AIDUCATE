const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const { YoutubeTranscript } = require("youtube-transcript");
const { GoogleGenerativeAI } = require("@google/generative-ai"); 

let videoId;

const UserModel = require("../models/UsersSchema");

const app = express();
const MONGOOSE_URL = process.env.MONGO_URL;
const KEY1 = process.env.KEY1;

mongoose
  .connect(MONGOOSE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Something went wrong", err));

app.use(express.json());
app.use(cors());

app.post("/Signup", async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const User = new UserModel({ username, email, password: hashedPassword });
    await User.save();

    res.status(200).json({
      msg: "Signup ready",
      username,
      email,
      objectid: User._id,
    });
  } catch (err) {
    res.status(500).json({
      Msg: "Something went wrong",
      error: err,
    });
  }
});

app.post("/Login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

//THEORY MASTER START

app.post("/Summary", async (req, res) => {
  try {
    const { videoId } = req.body;
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY1);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Provide a 200-word summary of this video transcript:\n\n${transcriptText}`;
    const result = await model.generateContent(prompt);
    const summary = await result.response.text();

    res.status(200).json({ success: true, summary });
    
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({
      error: "Failed to generate summary",
      message: error.message
    });
  }
});

app.post("/SummaryMain", async (req, res) => {
  try {
    const { videoId } = req.body;
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY1);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze this video transcript and format the response EXACTLY like this between triple quotes:
    """
    Title: [Generated Course Title]
    Duration: [HH:MM:SS]
    Topics: [Number] Topics
    Points: [Number] Total Points
    ---
    KEY TOPICS:
    - [Topic 1]
    - [Topic 2]
    - [Topic...]
    """
    
    Requirements:
    1. Create a concise 5-7 word course title
    2. Convert total video length to HH:MM:SS
    3. Count distinct main topics
    4. Generate points between 150-300 if not specified
    5. List key topics as bullet points
    
    Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt);
    const rawOutput = await result.response.text();

    // Parse components
    const parseSection = (text, pattern) => text.match(pattern)?.[1]?.trim() || null;
    
    const title = parseSection(rawOutput, /Title:\s*(.*?)(\n|$)/i);
    const duration = parseSection(rawOutput, /Duration:\s*(.*?)(\n|$)/i);
    const topics = parseSection(rawOutput, /Topics:\s*(\d+).*?Topics/i);
    const points = parseSection(rawOutput, /Points:\s*(\d+).*?Points/i);

    // Generate random points if not found (150-300 range)
    const randomPoints = Math.floor(Math.random() * 151) + 150; // 150-300
    
    // Parse key topics
    const topicsSection = rawOutput.split('KEY TOPICS:')[1] || '';
    const keyTopics = topicsSection.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-/, '').trim())
      .filter(Boolean);

    // Fallback title from first 5 transcript words
    const fallbackTitle = transcriptText.split(/\s+/).slice(0, 5).join(' ') + '...';

    res.status(200).json({
      success: true,
      title: title || fallbackTitle,
      duration: duration || transcript[transcript.length-1]?.offsetAsString || "00:00:00",
      topics: topics || String(keyTopics.length || 0),
      points: points || String(randomPoints),
      keyTopics: keyTopics.length > 0 ? keyTopics : ["No key topics identified"]
    });

  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({
      error: "Failed to generate summary",
      message: error.message
    });
  }
});

app.post("/SummarySubPoints", async (req, res) => {
  try {
    const { videoId } = req.body;
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY1);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze this video transcript and generate for EACH important section:
    1. Timestamp (HH:MM:SS)
    2. Section title (5-7 words)
    3. Subtitle (short phrase)
    4. 20-30 word summary
    5. 3 bullet point tips
    Format EXACTLY like this between triple quotes:
    """
    [HH:MM:SS]
    Title: [Section Title]
    Subtitle: [Descriptive Subtitle]
    Summary: [Concise summary]
    Tips:
    - [Practical tip 1]
    - [Practical tip 2]
    - [Practical tip 3]
    """
    Include 3-5 sections. Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt);
    const rawOutput = await result.response.text();

    // Enhanced parsing logic
    const sections = rawOutput.split('"""').filter(s => s.trim());
    const subPoints = [];

    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      
      const entry = {
        timestamp: lines[0]?.match(/\d{2}:\d{2}:\d{2}/)?.[0] || null,
        title: null,
        subtitle: null,
        summary: null,
        tips: []
      };

      lines.forEach(line => {
        if (line.startsWith('Title:')) entry.title = line.replace('Title:', '').trim();
        if (line.startsWith('Subtitle:')) entry.subtitle = line.replace('Subtitle:', '').trim();
        if (line.startsWith('Summary:')) entry.summary = line.replace('Summary:', '').trim();
        if (line.startsWith('-')) entry.tips.push(line.replace('-', '').trim());
      });

      if (entry.timestamp && entry.title && entry.tips.length >= 3) {
        subPoints.push({
          timestamp: entry.timestamp,
          title: entry.title,
          subtitle: entry.subtitle || "Key Concepts", // Default subtitle
          summary: entry.summary || "Essential insights from this section",
          tips: entry.tips.slice(0, 3)
        });
      }
    });

    res.status(200).json({
      success: true,
      subPoints: subPoints.length > 0 ? subPoints : [{ error: "No sections generated" }]
    });

  } catch (error) {
    console.error("SubPoints error:", error);
    res.status(500).json({
      error: "Failed to generate subpoints",
      message: error.message
    });
  }
});


//CODE DOJO

app.post("/CodeDojoEasy", async (req, res) => {
  try {
    const { videoId } = req.body;
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY1);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 3 easy-level coding problems with solutions based on this transcript.
    For each problem include:
    1. Title
    2. Problem description
    3. Sample input/output
    4. Solution function
    Format EXACTLY like this between triple quotes:
    """
    Problem 1:
    Title: [Problem Name]
    Description: [2-3 sentence challenge]
    Sample Input: [Example input]
    Sample Output: [Expected output]
    Solution:
    function exampleSolution(input) {
        // Implementation
    }
    """
    Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt);
    const rawOutput = await result.response.text();

    // Parse problems
    const problemSections = rawOutput.split('"""').filter(s => s.trim());
    const problems = [];

    problemSections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      
      const problem = {
        title: null,
        description: null,
        sampleInput: null,
        sampleOutput: null,
        solution: []
      };

      let currentField = null;
      
      lines.forEach(line => {
        if (line.startsWith('Title:')) {
          problem.title = line.replace('Title:', '').trim();
        } else if (line.startsWith('Description:')) {
          problem.description = line.replace('Description:', '').trim();
        } else if (line.startsWith('Sample Input:')) {
          problem.sampleInput = line.replace('Sample Input:', '').trim();
        } else if (line.startsWith('Sample Output:')) {
          problem.sampleOutput = line.replace('Sample Output:', '').trim();
        } else if (line.startsWith('function')) {
          problem.solution.push(line.trim());
        } else if (line.startsWith('}')) {
          problem.solution.push(line.trim());
        } else if (problem.solution.length > 0) {
          problem.solution.push(line.trim());
        }
      });

      if (problem.title && problem.description) {
        problem.solution = problem.solution.join('\n');
        problems.push(problem);
      }
    });

    
    const finalProblems = problems.slice(0, 3).map(p => ({
      title: p.title || "Coding Challenge",
      description: p.description || "Solve this programming problem",
      sampleInput: p.sampleInput || "No input provided",
      sampleOutput: p.sampleOutput || "Expected output",
      solution: p.solution || "// No solution generated"
    }));

    res.status(200).json({
      success: true,
      problems: finalProblems
    });

  } catch (error) {
    console.error("CodeDojo error:", error);
    res.status(500).json({
      error: "Failed to generate problems",
      message: error.message
    });
  }
});


app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
