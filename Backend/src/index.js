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
const KEY2 = process.env.KEY2;
const KEY3 = process.env.KEY3;

mongoose
  .connect(MONGOOSE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Something went wrong", err));

app.use(express.json());
app.use(cors());

app.get("/Health", (req, res) => {
  res.json({
    msg: "Everything Works fine till now"
  });
});

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

    const genAI = new GoogleGenerativeAI(KEY2);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 3 easy coding problems with solutions based on this transcript.
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

    
    const easyProblems = [];
    const easySections = rawOutput.split('"""').filter(s => s.trim());
    
    easySections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      const problem = { title: null, description: null, sampleInput: null, sampleOutput: null, solution: [] };

      lines.forEach(line => {
        if (line.startsWith('Title:')) problem.title = line.replace('Title:', '').trim();
        if (line.startsWith('Description:')) problem.description = line.replace('Description:', '').trim();
        if (line.startsWith('Sample Input:')) problem.sampleInput = line.replace('Sample Input:', '').trim();
        if (line.startsWith('Sample Output:')) problem.sampleOutput = line.replace('Sample Output:', '').trim();
        if (line.startsWith('function')) problem.solution.push(line.trim());
        if (problem.solution.length > 0 && !line.startsWith('Problem')) problem.solution.push(line.trim());
      });

      if (problem.title) {
        problem.solution = problem.solution.join('\n');
        easyProblems.push(problem);
      }
    });

    res.status(200).json({
      success: true,
      problems: easyProblems.slice(0, 3).map(p => ({
        title: p.title || "Easy Challenge",
        description: p.description || "Basic programming problem",
        sampleInput: p.sampleInput || "[]",
        sampleOutput: p.sampleOutput || "[]",
        solution: p.solution || "// Solution not generated"
      }))
    });

  } catch (error) {
    console.error("Easy problems error:", error);
    res.status(500).json({ error: "Failed to generate easy problems", message: error.message });
  }
});

app.post("/CodeDojoMedium", async (req, res) => {
  try {
    const { videoId } = req.body;
    
    // Validate video ID format
    if (!videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return res.status(400).json({ error: "Invalid YouTube video ID" });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY2);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 3 medium coding problems with solutions based on this transcript.
    Requirements:
    - Optimization challenges
    - Edge case handling
    - OOP or algorithms
    Format EXACTLY like this:
    
    Problem 1:
    Title: [Problem Name]
    Description: [Complex problem statement]
    Sample Input: [Challenging input]
    Sample Output: [Non-trivial output]
    Solution:
    class MediumSolution {
        // Non-trivial implementation
    }
    
    Problem 2:
    Title: [Problem Name]
    Description: [Complex problem statement]
    Sample Input: [Challenging input]
    Sample Output: [Non-trivial output]
    Solution:
    class MediumSolution {
        // Non-trivial implementation
    }
    
    Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt, { timeout: 10000 });
    const rawOutput = await result.response.text();

    // Enhanced parsing logic
    const mediumProblems = [];
    const problemBlocks = rawOutput.split(/(Problem\s+\d+:)/).filter(b => b.trim());
    
    let currentProblem = null;
    problemBlocks.forEach(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);
      
      if (block.startsWith('Problem')) {
        if (currentProblem) mediumProblems.push(currentProblem);
        currentProblem = {
          title: null,
          description: null,
          sampleInput: null,
          sampleOutput: null,
          solution: []
        };
      } else if (currentProblem) {
        lines.forEach(line => {
          if (line.startsWith('Title:')) {
            currentProblem.title = line.replace('Title:', '').trim();
          } else if (line.startsWith('Description:')) {
            currentProblem.description = line.replace('Description:', '').trim();
          } else if (line.startsWith('Sample Input:')) {
            currentProblem.sampleInput = line.replace('Sample Input:', '').trim();
          } else if (line.startsWith('Sample Output:')) {
            currentProblem.sampleOutput = line.replace('Sample Output:', '').trim();
          } else if (line.startsWith('class') || line.includes('{') || line.includes('}')) {
            currentProblem.solution.push(line);
          }
        });
      }
    });
    
    if (currentProblem && currentProblem.title) {
      mediumProblems.push(currentProblem);
    }

    // Process solutions
    const formattedProblems = mediumProblems.slice(0, 3).map(p => {
      const solutionCode = p.solution.join('\n').trim();
      return {
        title: p.title || "Medium Coding Challenge",
        description: p.description || "Solve this intermediate programming problem",
        sampleInput: p.sampleInput || "{}",
        sampleOutput: p.sampleOutput || "{}",
        solution: solutionCode || "// Solution code not generated"
      };
    });

    res.status(200).json({
      success: true,
      problems: formattedProblems
    });

  } catch (error) {
    console.error("Medium Error:", error);
    res.status(500).json({
      error: "Failed to generate medium problems",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/CodeDojoHard", async (req, res) => {
  try {
    const { videoId } = req.body;
    
    if (!videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return res.status(400).json({ error: "Invalid YouTube video ID" });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY2);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 3 hard coding problems with solutions based on this transcript.
    Requirements:
    - Complex algorithms (DP, graphs)
    - Time/space optimization
    - Multiple solutions
    Format EXACTLY like this:
    
    Problem 1:
    Title: [Problem Name]
    Description: [Advanced problem statement]
    Sample Input: [Complex input]
    Sample Output: [Optimized output]
    Solution:
    function hardSolution(input) {
        // Optimal implementation
    }
    
    Problem 2:
    Title: [Problem Name]
    Description: [Advanced problem statement]
    Sample Input: [Complex input]
    Sample Output: [Optimized output]
    Solution:
    function hardSolution(input) {
        // Optimal implementation
    }
    
    Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt, { timeout: 10000 });
    const rawOutput = await result.response.text();

    // Enhanced parsing logic
    const hardProblems = [];
    const problemBlocks = rawOutput.split(/(Problem\s+\d+:)/).filter(b => b.trim());
    
    let currentProblem = null;
    problemBlocks.forEach(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);
      
      if (block.startsWith('Problem')) {
        if (currentProblem) hardProblems.push(currentProblem);
        currentProblem = {
          title: null,
          description: null,
          sampleInput: null,
          sampleOutput: null,
          solution: []
        };
      } else if (currentProblem) {
        lines.forEach(line => {
          if (line.startsWith('Title:')) {
            currentProblem.title = line.replace('Title:', '').trim();
          } else if (line.startsWith('Description:')) {
            currentProblem.description = line.replace('Description:', '').trim();
          } else if (line.startsWith('Sample Input:')) {
            currentProblem.sampleInput = line.replace('Sample Input:', '').trim();
          } else if (line.startsWith('Sample Output:')) {
            currentProblem.sampleOutput = line.replace('Sample Output:', '').trim();
          } else if (line.startsWith('function') || line.includes('{') || line.includes('}')) {
            currentProblem.solution.push(line);
          }
        });
      }
    });
    
    if (currentProblem && currentProblem.title) {
      hardProblems.push(currentProblem);
    }

    // Process solutions
    const formattedProblems = hardProblems.slice(0, 3).map(p => {
      const solutionCode = p.solution.join('\n').trim();
      return {
        title: p.title || "Hard Coding Challenge",
        description: p.description || "Solve this advanced programming problem",
        sampleInput: p.sampleInput || "Complex input",
        sampleOutput: p.sampleOutput || "Optimized output",
        solution: solutionCode || "// Solution code not generated"
      };
    });

    res.status(200).json({
      success: true,
      problems: formattedProblems
    });

  } catch (error) {
    console.error("Hard Error:", error);
    res.status(500).json({
      error: "Failed to generate hard problems",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/CodeDojoQuiz", async (req, res) => {
  try {
    const { videoId } = req.body;
    
    // Validate video ID format
    if (!videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return res.status(400).json({ error: "Invalid YouTube video ID" });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY2);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 4-5 quiz questions with answers based on this transcript.
    Format EXACTLY like this:
    
    Question 1:
    Question: [Programming concept question]
    Options:
    A) [Option 1]
    B) [Option 2]
    C) [Option 3]
    D) [Option 4]
    Answer: [Correct option letter]
    Explanation: [Brief technical explanation]
    
    Question 2:
    Question: [Another question]
    Options:
    A) [Option 1]
    B) [Option 2]
    C) [Option 3]
    D) [Option 4]
    Answer: [Correct option letter]
    Explanation: [Brief technical explanation]
    
    Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt, { timeout: 10000 });
    const rawOutput = await result.response.text();

    // Parse quiz questions
    const quizQuestions = [];
    const questionBlocks = rawOutput.split(/(Question\s+\d+:)/).filter(b => b.trim());
    
    let currentQuestion = null;
    questionBlocks.forEach(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);
      
      if (block.startsWith('Question')) {
        if (currentQuestion) quizQuestions.push(currentQuestion);
        currentQuestion = {
          question: null,
          options: [],
          answer: null,
          explanation: null
        };
      } else if (currentQuestion) {
        lines.forEach(line => {
          if (line.startsWith('Question:')) {
            currentQuestion.question = line.replace('Question:', '').trim();
          } else if (line.match(/^[A-D]\)/)) {
            currentQuestion.options.push(line.trim());
          } else if (line.startsWith('Answer:')) {
            currentQuestion.answer = line.replace('Answer:', '').trim().charAt(0);
          } else if (line.startsWith('Explanation:')) {
            currentQuestion.explanation = line.replace('Explanation:', '').trim();
          }
        });
      }
    });

    if (currentQuestion && currentQuestion.question) {
      quizQuestions.push(currentQuestion);
    }

    // Format final output
    const formattedQuestions = quizQuestions.slice(0, 5).map(q => ({
      question: q.question || "Programming concept question",
      options: q.options.length >= 4 ? q.options : ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      answer: q.answer || "A",
      explanation: q.explanation || "Key concept explanation"
    }));

    res.status(200).json({
      success: true,
      quiz: formattedQuestions
    });

  } catch (error) {
    console.error("Quiz Error:", error);
    res.status(500).json({
      error: "Failed to generate quiz",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


//KNOWLEDGE CHECK

app.post("/KnowledgeCheckEasy", async (req, res) => {
  try {
    const { videoId } = req.body;
    
    if (!videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return res.status(400).json({ error: "Invalid YouTube video ID" });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY3);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 10 easy programming quiz questions based on this transcript.
    Format EXACTLY like this:
    
    Question 1:
    Question: [Programming concept question]
    Options:
    A) [Option 1]
    B) [Option 2]
    C) [Option 3]
    D) [Option 4]
    Correct Answer: [Letter]
    Hint: [Brief hint]
    
    Question 2:
    Question: [Another question]
    Options:
    A) [Option 1]
    B) [Option 2]
    C) [Option 3]
    D) [Option 4]
    Correct Answer: [Letter]
    Hint: [Brief hint]
    
    Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt, { timeout: 10000 });
    const rawOutput = await result.response.text();


    const questions = [];
    const questionBlocks = rawOutput.split(/(Question\s+\d+:)/).filter(b => b.trim());
    
    let currentQuestion = null;
    questionBlocks.forEach(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);
      
      if (block.startsWith('Question')) {
        if (currentQuestion) questions.push(currentQuestion);
        currentQuestion = {
          question: null,
          options: [],
          correctAnswer: null,
          hint: null
        };
      } else if (currentQuestion) {
        lines.forEach(line => {
          if (line.startsWith('Question:')) {
            currentQuestion.question = line.replace('Question:', '').trim();
          } else if (line.match(/^[A-D]\)/)) {
            currentQuestion.options.push(line.replace(/^[A-D]\)\s*/, '').trim());
          } else if (line.startsWith('Correct Answer:')) {
            currentQuestion.correctAnswer = line.replace('Correct Answer:', '').trim().charAt(0);
          } else if (line.startsWith('Hint:')) {
            currentQuestion.hint = line.replace('Hint:', '').trim();
          }
        });
      }
    });

    if (currentQuestion && currentQuestion.question) {
      questions.push(currentQuestion);
    }

    const formattedQuestions = questions.slice(0, 10).map(q => ({
      question: q.question || "Programming concept question",
      options: q.options.length >= 4 ? [
        q.options[0] || "Option 1",
        q.options[1] || "Option 2",
        q.options[2] || "Option 3",
        q.options[3] || "Option 4"
      ] : ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: q.correctAnswer || "A",
      hint: q.hint || "Review basic array concepts"
    }));

    res.status(200).json({
      success: true,
      questions: formattedQuestions
    });

  } catch (error) {
    console.error("Knowledge Check Error:", error);
    res.status(500).json({
      error: "Failed to generate quiz",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post("/KnowledgeCheckMedium", async (req, res) => {
  try {
    const { videoId } = req.body;
    
    if (!videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return res.status(400).json({ error: "Invalid YouTube video ID" });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ");

    const genAI = new GoogleGenerativeAI(KEY3);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 10 medium-difficulty programming quiz questions based on this transcript.
    Format EXACTLY like this:
    
    Question 1:
    Question: [Intermediate concept question]
    Options:
    A) [Option 1]
    B) [Option 2]
    C) [Option 3]
    D) [Option 4]
    Correct Answer: [Letter]
    Explanation: [Technical explanation]
    
    Question 2:
    Question: [Algorithm analysis question]
    Options:
    A) [Option 1]
    B) [Option 2]
    C) [Option 3]
    D) [Option 4]
    Correct Answer: [Letter]
    Explanation: [Technical explanation]
    
    Transcript: ${transcriptText}`;

    const result = await model.generateContent(prompt, { timeout: 10000 });
    const rawOutput = await result.response.text();

    // Medium-specific parsing
    const mediumQuestions = [];
    const questionBlocks = rawOutput.split(/(Question\s+\d+:)/).filter(b => b.trim());
    
    let currentQuestion = null;
    questionBlocks.forEach(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);
      
      if (block.startsWith('Question')) {
        if (currentQuestion) mediumQuestions.push(currentQuestion);
        currentQuestion = {
          question: null,
          options: [],
          correctAnswer: null,
          explanation: null
        };
      } else if (currentQuestion) {
        lines.forEach(line => {
          if (line.startsWith('Question:')) {
            currentQuestion.question = line.replace('Question:', '').trim();
          } else if (line.match(/^[A-D]\)/)) {
            currentQuestion.options.push(line.replace(/^[A-D]\)\s*/, '').trim());
          } else if (line.startsWith('Correct Answer:')) {
            currentQuestion.correctAnswer = line.replace('Correct Answer:', '').trim().charAt(0);
          } else if (line.startsWith('Explanation:')) {
            currentQuestion.explanation = line.replace('Explanation:', '').trim();
          }
        });
      }
    });

    if (currentQuestion && currentQuestion.question) {
      mediumQuestions.push(currentQuestion);
    }

    // Format medium questions
    const formattedMedium = mediumQuestions.slice(0, 10).map(q => ({
      question: q.question || "Intermediate programming question",
      options: q.options.length >= 4 ? q.options : [
        "O(n) time complexity",
        "O(log n) complexity",
        "O(n^2) complexity",
        "Constant time complexity"
      ],
      correctAnswer: q.correctAnswer || "A",
      explanation: q.explanation || "Medium difficulty concept explanation"
    }));

    res.status(200).json({
      success: true,
      questions: formattedMedium
    });

  } catch (error) {
    console.error("Medium Check Error:", error);
    res.status(500).json({
      error: "Failed to generate medium quiz",
      message: error.message
    });
  }
});

app.post("/KnowledgeCheckHard", async (req, res) => {
  try {
    const { videoId } = req.body;

    
    if (!videoId?.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return res.status(400).json({ error: "Invalid YouTube video ID format" });
    }

    
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(item => item.text).join(" ").substring(0, 30000);

    const genAI = new GoogleGenerativeAI(KEY3);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 10 advanced programming quiz questions based on this transcript:
    ${transcriptText}

    Format EXACTLY like this:
    Question 1:
    Question: [Complex algorithm question]
    Options:
    A) [Option 1]
    B) [Option 2]
    C) [Option 3]
    D) [Option 4]
    Correct Answer: [Letter]
    Technical Analysis: [Detailed analysis]`;

    let retries = 3;
    let result;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        result = await model.generateContent(prompt, {
          timeout: 30000  
        });
        break;
      } catch (error) {
        if (attempt === retries) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        console.log(`Retry attempt ${attempt}`);
      }
    }

    const rawOutput = (await result.response).text();
    
    
    const hardQuestions = [];
    const questionBlocks = rawOutput.split(/Question\s+\d+:/i).filter(b => b.trim());
    
    for (const block of questionBlocks) {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);
      const questionObj = {
        question: null,
        options: [],
        correctAnswer: null,
        analysis: null
      };

      for (const line of lines) {
        if (line.startsWith('Question:')) {
          questionObj.question = line.replace('Question:', '').trim();
        } else if (/^[A-D]\)/.test(line)) {
          questionObj.options.push(line.replace(/^[A-D]\)\s*/, '').trim());
        } else if (line.startsWith('Correct Answer:')) {
          questionObj.correctAnswer = line.replace('Correct Answer:', '').trim().charAt(0).toUpperCase();
        } else if (line.startsWith('Technical Analysis:')) {
          questionObj.analysis = line.replace('Technical Analysis:', '').trim();
        }
      }

      if (questionObj.question && questionObj.options.length >= 4) {
        hardQuestions.push(questionObj);
      }
    }

    // Format response
    const formattedQuestions = hardQuestions.slice(0, 10).map((q, index) => ({
      id: index + 1,
      question: q.question || `Advanced Question ${index + 1}`,
      options: q.options,
      correctAnswer: ['A','B','C','D'].includes(q.correctAnswer) ? q.correctAnswer : 'A',
      analysis: q.analysis || "Detailed technical analysis not available"
    }));

    res.status(200).json({
      success: true,
      count: formattedQuestions.length,
      questions: formattedQuestions
    });

  } catch (error) {
    console.error("Hard Check Error:", error);
    const statusCode = error.message.includes('timeout') ? 504 : 500;
    res.status(statusCode).json({
      success: false,
      error: "Failed to generate hard quiz",
      message: error.message.replace(/\[GoogleGenerativeAI Error\]:\s*/gi, '')
    });
  }
});

app.listen(3000, () => { 
  console.log("Server is running at port 3000");
});
