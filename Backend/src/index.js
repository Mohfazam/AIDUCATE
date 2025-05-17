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





app.post("/Summary", async (req, res) => {
  try {
    const { videoId } = req.body;
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI("AIzaSyDzZ9d4RMv1D2Vahew6WaPlcleHYttl6N4");
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

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
