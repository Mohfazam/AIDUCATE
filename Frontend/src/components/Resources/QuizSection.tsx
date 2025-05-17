import { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Award,
  Settings,
  HelpCircle,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  BookOpen,
  Menu,
  Star,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import JSConfetti from "js-confetti";


interface Question {
  id: number;
  difficulty: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  recommendations: { type: string; text: string; url: string; level: string }[];
}

interface Performance {
  score: number;
  totalQuestions: number;
  analytics: {
    timeSpent: number[];
    correctByDifficulty: Record<string, number>;
  };
  streak: number;
}

// QuizInsights component for the sidebar
const QuizInsights: React.FC<{
  performance: Performance;
  questions: Question[];
  bookmarkedQuestions: number[];
}> = ({ performance, questions, bookmarkedQuestions }) => {
  const motivationalTips = [
    "Keep pushing! Every question is a step closer to mastery.",
    "Mistakes are learning opportunities. Review and improve!",
    "Consistency is key. Practice daily to excel!",
  ];
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Rotate motivational tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % motivationalTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const difficultyBreakdown = Object.entries(performance.analytics.correctByDifficulty).map(([difficulty, count]) => ({
    difficulty,
    correct: count,
    total: questions.filter((q) => q.difficulty === difficulty).length,
  }));

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-600 shadow-lg sticky top-4 h-fit">
      <h3 className="text-xl font-bold text-white mb-4">Quiz Insights</h3>
      {/* Quick Stats */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-2">Quick Stats</h4>
        <p className="text-gray-300">Score: {performance.score.toFixed(1)}/{performance.totalQuestions}</p>
        <p className="text-gray-300">Streak: {performance.streak}</p>
        <p className="text-gray-300">Progress: {Math.round((performance.score / performance.totalQuestions) * 100)}%</p>
        <p className="text-gray-300">Bookmarks: {bookmarkedQuestions.length}</p>
      </div>
      {/* Difficulty Breakdown */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-2">Difficulty Breakdown</h4>
        {difficultyBreakdown.map(({ difficulty, correct, total }) => (
          <p key={difficulty} className="text-gray-300">{difficulty}: {correct}/{total}</p>
        ))}
      </div>
      {/* Motivational Tip */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Motivational Tip</h4>
        <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <p className="text-gray-300">{motivationalTips[currentTipIndex]}</p>
        </div>
      </div>
    </div>
  );
};

const quizData: { questions: Question[] } = {
  questions: [
    {
      id: 1,
      difficulty: "Easy",
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1,
      explanation: "LIFO stands for Last In, First Out. A Stack operates on this principle, where the last element added is the first to be removed.",
      recommendations: [
        { type: "article", text: "Review stack basics", url: "https://www.programiz.com/dsa/stack", level: "beginner" },
        { type: "video", text: "Watch stack tutorial", url: "https://www.youtube.com/watch?v=wjI1WNcIntg", level: "beginner" },
        { type: "article", text: "Deepen stack knowledge", url: "https://www.geeksforgeeks.org/stack-data-structure/", level: "intermediate" },
      ],
    },
    {
      id: 2,
      difficulty: "Medium",
      question: "What is the time complexity of inserting an element into a balanced BST?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correct: 2,
      explanation: "In a balanced Binary Search Tree (BST), insertion takes O(log n) time due to the logarithmic height of the tree.",
      recommendations: [
        { type: "article", text: "Study BST operations", url: "https://www.programiz.com/dsa/binary-search-tree", level: "beginner" },
        { type: "practice", text: "Practice BST problems", url: "https://leetcode.com/tag/binary-search-tree/", level: "intermediate" },
        { type: "article", text: "Deepen BST knowledge", url: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/", level: "intermediate" },
      ],
    },
    {
      id: 3,
      difficulty: "Easy",
      question: "What is the primary advantage of a Linked List over an Array?",
      options: ["Constant-time access", "Dynamic size", "Cache locality", "Fixed size"],
      correct: 1,
      explanation: "Linked Lists allow dynamic resizing, making insertions and deletions easier compared to arrays with fixed sizes.",
      recommendations: [
        { type: "article", text: "Learn Linked List basics", url: "https://www.programiz.com/dsa/linked-list", level: "beginner" },
        { type: "video", text: "Watch Linked List tutorial", url: "https://www.youtube.com/watch?v=njTh_OwMljM", level: "beginner" },
        { type: "article", text: "Explore Linked Lists", url: "https://www.geeksforgeeks.org/data-structures/linked-list/", level: "intermediate" },
      ],
    },
    {
      id: 4,
      difficulty: "Medium",
      question: "Which algorithm is used to detect a cycle in a graph?",
      options: ["Dijkstra’s", "Floyd’s", "Kruskal’s", "DFS"],
      correct: 3,
      explanation: "DFS detects cycles in a graph by tracking visited nodes and identifying back edges.",
      recommendations: [
        { type: "article", text: "Review DFS", url: "https://www.programiz.com/dsa/graph-dfs", level: "beginner" },
        { type: "practice", text: "Practice cycle detection", url: "https://leetcode.com/problems/course-schedule/", level: "intermediate" },
        { type: "article", text: "Study graph algorithms", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/", level: "intermediate" },
      ],
    },
    {
      id: 5,
      difficulty: "Hard",
      question: "What is the space complexity of Merge Sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correct: 2,
      explanation: "Merge Sort requires O(n) space for temporary arrays during the merge process.",
      recommendations: [
        { type: "article", text: "Study Merge Sort", url: "https://www.programiz.com/dsa/merge-sort", level: "beginner" },
        { type: "video", text: "Watch Merge Sort tutorial", url: "https://www.youtube.com/watch?v=TzeBrDU-JaY", level: "beginner" },
        { type: "article", text: "Master Merge Sort", url: "https://www.geeksforgeeks.org/merge-sort/", level: "intermediate" },
      ],
    },
    {
      id: 6,
      difficulty: "Medium",
      question: "What is the purpose of a Hash Table?",
      options: ["Sorting data", "Storing key-value pairs", "Graph traversal", "Tree balancing"],
      correct: 1,
      explanation: "Hash Tables store key-value pairs for efficient O(1) average-case operations.",
      recommendations: [
        { type: "article", text: "Learn Hashing", url: "https://www.programiz.com/dsa/hash-table", level: "beginner" },
        { type: "practice", text: "Practice Hash Table problems", url: "https://leetcode.com/tag/hash-table/", level: "intermediate" },
        { type: "article", text: "Explore Hash Tables", url: "https://www.geeksforgeeks.org/hash-table-data-structure/", level: "intermediate" },
      ],
    },
    {
      id: 7,
      difficulty: "Hard",
      question: "Which algorithm guarantees the shortest path in a weighted graph?",
      options: ["BFS", "DFS", "Dijkstra’s", "Prim’s"],
      correct: 2,
      explanation: "Dijkstra’s algorithm uses a priority queue to find the shortest path in a weighted graph.",
      recommendations: [
        { type: "article", text: "Study Dijkstra’s", url: "https://www.programiz.com/dsa/dijkstra-algorithm", level: "beginner" },
        { type: "practice", text: "Practice shortest path", url: "https://leetcode.com/problems/network-delay-time/", level: "intermediate" },
        { type: "article", text: "Deepen Dijkstra’s knowledge", url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/", level: "intermediate" },
      ],
    },
  ],
};

const motivationalQuotes = [
  { score: 80, quote: "Outstanding! You’re mastering these concepts!" },
  { score: 60, quote: "Great effort! A little more practice will make you unstoppable!" },
  { score: 40, quote: "You’re on the right track! Keep studying!" },
  { score: 0, quote: "Every step forward counts. Keep learning!" },
];

const COLORS = ["#8b5cf6", "#a78bfa", "#d8b4fe"];

export default function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quizData.questions.length).fill(null));
  const [performance, setPerformance] = useState<Performance>({
    score: 0,
    totalQuestions: quizData.questions.length,
    analytics: {
      timeSpent: Array(quizData.questions.length).fill(0),
      correctByDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
    },
    streak: 0,
  });
  const [completed, setCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [settings, setSettings] = useState({
    sound: true,
    timer: true,
    timeLimit: 30,
  });
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState<{
    type: string;
    text: string;
    url: string;
    level: string;
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const jsConfetti = new JSConfetti();
  const timerStartRef = useRef<number>(Date.now());

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quizProgress");
      if (saved) {
        const { answers, currentQuestion, completed, bookmarkedQuestions } = JSON.parse(saved);
        setAnswers(answers);
        setPerformance((prev) => ({
          ...prev,
          score: answers.filter((a: number | null, i: number) => a === quizData.questions[i].correct).length,
        }));
        setCurrentQuestion(currentQuestion);
        setCompleted(completed);
        setBookmarkedQuestions(bookmarkedQuestions || []);
      }
    } catch (error) {
      console.error("Failed to load quiz progress:", error);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "quizProgress",
        JSON.stringify({
          answers,
          currentQuestion,
          completed,
          bookmarkedQuestions,
        })
      );
    } catch (error) {
      console.error("Failed to save quiz progress:", error);
    }
  }, [answers, currentQuestion, completed, bookmarkedQuestions]);

  // Timer logic
  useEffect(() => {
    if (settings.timer && !completed && !reviewMode && !isTimerPaused && selectedAnswer === null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(-1);
            return settings.timeLimit;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [settings.timer, currentQuestion, selectedAnswer, completed, reviewMode, isTimerPaused]);

  // Play timer warning sound
  useEffect(() => {
    if (settings.sound && timeLeft === 5 && !isTimerPaused && !reviewMode) {
      const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/24/02-40-36-196_1.mp3");
      audio.play().catch(() => {});
    }
  }, [timeLeft, settings.sound, isTimerPaused, reviewMode]);

  // Track time spent per question
  useEffect(() => {
    if (!completed && !reviewMode) {
      timerStartRef.current = Date.now();
      return () => {
        const timeSpent = (Date.now() - timerStartRef.current) / 1000;
        setPerformance((prev) => ({
          ...prev,
          analytics: {
            ...prev.analytics,
            timeSpent: prev.analytics.timeSpent.map((t, i) => (i === currentQuestion ? t + timeSpent : t)),
          },
        }));
      };
    }
  }, [currentQuestion, completed, reviewMode]);

  // Sound effects
  const playSound = (type: "correct" | "incorrect" | "click") => {
    if (settings.sound) {
      const audio = new Audio(
        type === "correct"
          ? "https://cdn.pixabay.com/audio/2023/02/23/10-17-14-598_1.mp3"
          : type === "incorrect"
          ? "https://cdn.pixabay.com/audio/2022/01/18/16-36-30-454_1.mp3"
          : "https://cdn.pixabay.com/audio/2022/03/24/02-40-36-196_1.mp3"
      );
      audio.play().catch(() => {});
    }
  };

  const getScoreMultiplier = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return 1;
      case "Medium":
        return 1.5;
      case "Hard":
        return 2;
      default:
        return 1;
    }
  };

  const handleAnswer = (index: number, isSkip = false) => {
    if (confirmedAnswer !== null && !reviewMode) return;
    setConfirmedAnswer(index);
    setShowExplanation(true);
    if (!reviewMode) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = index;
      setAnswers(newAnswers);
      const isCorrect = index === quizData.questions[currentQuestion].correct;
      const multiplier = getScoreMultiplier(quizData.questions[currentQuestion].difficulty);
      if (isCorrect && !isSkip) {
        setPerformance((prev) => ({
          ...prev,
          score: prev.score + (usedHint ? 0.5 : 1) * multiplier,
          streak: prev.streak + 1,
          analytics: {
            ...prev.analytics,
            correctByDifficulty: {
              ...prev.analytics.correctByDifficulty,
              [quizData.questions[currentQuestion].difficulty]:
                (prev.analytics.correctByDifficulty[quizData.questions[currentQuestion].difficulty] || 0) + 1,
            },
          },
        }));
        playSound("correct");
      } else {
        setPerformance((prev) => ({ ...prev, streak: 0 }));
        if (!isSkip) playSound("incorrect");
      }
      setUsedHint(false);
      setTimeout(() => {
        if (currentQuestion + 1 < quizData.questions.length) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setConfirmedAnswer(null);
          setShowExplanation(false);
          setTimeLeft(settings.timeLimit);
          setIsTimerPaused(false);
        } else {
          setCompleted(true);
          if (
            performance.score + (isCorrect && !isSkip ? 1 * multiplier : 0) >=
            quizData.questions.length * 0.8
          ) {
            jsConfetti.addConfetti({ emojis: ["🎉", "⭐", "🚀"] });
          }
        }
      }, 1500);
    }
  };

  const skipQuestion = () => {
    if (selectedAnswer === null && !reviewMode) {
      setPerformance((prev) => ({ ...prev, score: Math.max(0, prev.score - 0.25) }));
      handleAnswer(-1, true);
      playSound("click");
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setConfirmedAnswer(answers[currentQuestion - 1]);
      setShowExplanation(!!answers[currentQuestion - 1]);
      setTimeLeft(settings.timeLimit);
      setUsedHint(false);
      setIsTimerPaused(false);
      playSound("click");
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setConfirmedAnswer(answers[currentQuestion + 1]);
      setShowExplanation(!!answers[currentQuestion + 1]);
      setTimeLeft(settings.timeLimit);
      setUsedHint(false);
      setIsTimerPaused(false);
      playSound("click");
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setConfirmedAnswer(null);
    setAnswers(Array(quizData.questions.length).fill(null));
    setPerformance({
      score: 0,
      totalQuestions: quizData.questions.length,
      analytics: {
        timeSpent: Array(quizData.questions.length).fill(0),
        correctByDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
      },
      streak: 0,
    });
    setCompleted(false);
    setReviewMode(false);
    setShowExplanation(false);
    setTimeLeft(settings.timeLimit);
    setUsedHint(false);
    setIsTimerPaused(false);
    setBookmarkedQuestions([]);
    localStorage.removeItem("quizProgress");
    playSound("click");
  };

  const handleHint = () => {
    if (!usedHint && selectedAnswer === null && !reviewMode) {
      setUsedHint(true);
      alert(`Hint: Consider the option related to ${quizData.questions[currentQuestion].options[quizData.questions[currentQuestion].correct].split(" ")[0]}.`);
      playSound("click");
    }
  };

  const toggleBookmark = (questionId: number) => {
    setBookmarkedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
    playSound("click");
  };

  const shareResults = () => {
    const percentage = Math.round((performance.score / quizData.questions.length) * 100);
    const text = `I scored ${performance.score.toFixed(1)}/${quizData.questions.length} (${percentage}%) on the Data Structures & Algorithms Quiz! 🎓 Try it!`;
    navigator.clipboard.writeText(text);
    alert("Results copied to clipboard!");
    playSound("click");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!completed) {
        if (e.key >= "1" && e.key <= "4") setSelectedAnswer(parseInt(e.key) - 1);
        if (e.key === "Enter" && selectedAnswer !== null && confirmedAnswer === null) handleAnswer(selectedAnswer);
        if (e.key === "Enter" && confirmedAnswer !== null) nextQuestion();
        if (e.key === "Escape") resetQuiz();
        if (e.key === "h") handleHint();
        if (e.key === "s") skipQuestion();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, selectedAnswer, confirmedAnswer, completed]);

  // Progress calculation
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  // Motivational quote
  const getQuote = () => {
    const percentage = (performance.score / quizData.questions.length) * 100;
    return motivationalQuotes.find((q) => percentage >= q.score)?.quote || "Keep learning!";
  };

  // Pie chart data
  const pieData = Object.entries(performance.analytics.correctByDifficulty).map(([difficulty, count]) => ({
    name: difficulty,
    value: count,
  }));

  return (
    <section className="py-12 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Quiz Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
              <h2 className="text-3xl font-bold text-white mb-6 sm:mb-0">Interactive Quiz</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowBookmarks(!showBookmarks)}
                  className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  aria-label="Toggle bookmarks"
                >
                  <BookOpen size={20} />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  aria-label="Toggle settings"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>

            {/* Bookmarks Panel */}
            {showBookmarks && (
              <div className="mb-6 p-4 rounded-lg bg-gray-800 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Bookmarked Questions</h3>
                {bookmarkedQuestions.length ? (
                  <ul className="space-y-2">
                    {bookmarkedQuestions.map((id) => {
                      const question = quizData.questions.find((q) => q.id === id);
                      return (
                        question && (
                          <li
                            key={id}
                            className="p-2 rounded-lg bg-gray-700/50 text-white cursor-pointer hover:bg-gray-700 transition-colors"
                            onClick={() => {
                              setCurrentQuestion(quizData.questions.findIndex((q) => q.id === id));
                              setShowBookmarks(false);
                              playSound("click");
                            }}
                            role="button"
                            aria-label={`Go to question: ${question.question}`}
                          >
                            {question.question}
                          </li>
                        )
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-400">No questions bookmarked yet.</p>
                )}
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="mb-6 p-4 rounded-lg bg-gray-800 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.sound}
                      onChange={() => {
                        setSettings({ ...settings, sound: !settings.sound });
                        if (!settings.sound) playSound("click");
                      }}
                      className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                      aria-label="Toggle sound effects"
                    />
                    <span className="text-white">Sound Effects</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.timer}
                      onChange={() => setSettings({ ...settings, timer: !settings.timer })}
                      className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                      aria-label="Toggle timer"
                    />
                    <span className="text-white">Timer</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">Time Limit:</span>
                    <input
                      type="number"
                      value={settings.timeLimit}
                      onChange={(e) => {
                        setSettings({ ...settings, timeLimit: parseInt(e.target.value) || 30 });
                        setTimeLeft(parseInt(e.target.value) || 30);
                      }}
                      className="w-16 p-1 rounded bg-gray-700 text-white focus:ring-purple-500"
                      min="10"
                      max="60"
                      aria-label="Set time limit"
                    />
                    <span className="text-white">seconds</span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Circle */}
            <div className="mb-6 flex justify-between items-center">
              <div className="relative w-16 h-16 group">
                <svg className="w-full h-full" viewBox="0 0 100 100" aria-label={`Progress: ${Math.round(progress)}%`}>
                  <circle className="stroke-gray-700" cx="50" cy="50" r="45" fill="none" strokeWidth="10" />
                  <circle
                    className="stroke-[url(#progressGradient)]"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (progress / 100) * 283}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#8b5cf6" }} />
                      <stop offset="100%" style={{ stopColor: "#d8b4fe" }} />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-white">
                  {Math.round(progress)}%
                </span>
                <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded p-1 transition-opacity">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <div className="flex space-x-4">
                <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {quizData.questions.length}</span>
                <span className="text-sm text-gray-400">
                  Score: {performance.score.toFixed(1)}/{quizData.questions.length} | Streak: {performance.streak}
                </span>
              </div>
            </div>

            {/* Resource Modal */}
            {showResourceModal && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowResourceModal(null)}
              >
                <div
                  className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">{showResourceModal.text}</h3>
                  <p className="text-gray-300 mb-4">
                    Type: {showResourceModal.type.charAt(0).toUpperCase() + showResourceModal.type.slice(1)}
                    <br />
                    Level: {showResourceModal.level.charAt(0).toUpperCase() + showResourceModal.level.slice(1)}
                  </p>
                  <a
                    href={showResourceModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Visit Resource
                  </a>
                  <button
                    onClick={() => setShowResourceModal(null)}
                    className="ml-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                    aria-label="Close modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Content */}
            <div>
              {completed && !reviewMode ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-lg rounded-xl p-8 border border-gray-600 shadow-lg">
                  <Award className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-2xl font-bold text-white mb-4">Quiz Completed!</h3>
                  <p className="text-lg text-gray-300 mb-4">
                    Your Score: {performance.score.toFixed(1)}/{quizData.questions.length} (
                    {Math.round((performance.score / quizData.questions.length) * 100)}%)
                  </p>
                  <p className="text-md italic text-gray-400 mb-6">"{getQuote()}"</p>
                  <h4 className="text-lg font-semibold text-white mb-2">Performance Analytics</h4>
                  <div className="mb-6 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
                          formatter={(value, name) => [`${value} correct`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-gray-300 mb-6">
                    <p>
                      Average Time per Question:{" "}
                      {(performance.analytics.timeSpent.reduce((a, b) => a + b, 0) / quizData.questions.length).toFixed(1)}s
                    </p>
                    <p>Correct Answers by Difficulty:</p>
                    <ul className="list-disc list-inside">
                      {Object.entries(performance.analytics.correctByDifficulty).map(([diff, count]) => (
                        <li key={diff}>
                          {diff}: {count}/{quizData.questions.filter((q) => q.difficulty === diff).length}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside text-gray-300 mb-6">
                    {answers
                      .map((answer, i) => {
                        const isCorrect = answer === quizData.questions[i].correct;
                        return quizData.questions[i].recommendations
                          .filter((rec) => (isCorrect ? rec.level === "intermediate" : rec.level === "beginner"))
                          .map((rec, j) => (
                            <li
                              key={`${i}-${j}`}
                              className="cursor-pointer text-purple-500 hover:underline"
                              onClick={() => {
                                setShowResourceModal(rec);
                                playSound("click");
                              }}
                            >
                              {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}: {rec.text}
                            </li>
                          ));
                      })
                      .flat()}
                  </ul>
                  <h4 className="text-lg font-semibold text-white mb-2">Bookmarked Questions</h4>
                  <ul className="list-disc list-inside text-gray-300 mb-6">
                    {bookmarkedQuestions.length ? (
                      bookmarkedQuestions.map((id) => (
                        <li key={id}>{quizData.questions.find((q) => q.id === id)?.question}</li>
                      ))
                    ) : (
                      <li>No questions bookmarked</li>
                    )}
                  </ul>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => {
                        setReviewMode(true);
                        playSound("click");
                      }}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500"
                      aria-label="Review answers"
                    >
                      <BookOpen size={20} />
                      <span>Review Answers</span>
                    </button>
                    <button
                      onClick={shareResults}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500"
                      aria-label="Share results"
                    >
                      <Share2 size={20} />
                      <span>Share Results</span>
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500"
                      aria-label="Try again"
                    >
                      <RotateCcw size={20} />
                      <span>Try Again</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-lg rounded-xl p-8 border border-gray-600 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-4">
                      <p className="text-sm text-purple-500">{quizData.questions[currentQuestion].difficulty}</p>
                      <p className="text-sm text-gray-400">Question {currentQuestion + 1}</p>
                    </div>
                    {settings.timer && !reviewMode && (
                      <div className="flex items-center space-x-2">
                        <div className="relative w-8 h-8">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              className="stroke-gray-700"
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              strokeWidth="10"
                            />
                            <circle
                              className={`${timeLeft <= 10 ? "stroke-red-500" : timeLeft <= 20 ? "stroke-yellow-500" : "stroke-green-500"} ${
                                timeLeft <= 10 ? "animate-pulse" : ""
                              }`}
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              strokeWidth="10"
                              strokeDasharray="283"
                              strokeDashoffset={283 - (timeLeft / settings.timeLimit) * 283}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white">
                            {timeLeft}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setIsTimerPaused(!isTimerPaused);
                            playSound("click");
                          }}
                          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors ring-offset-2 focus:ring-2 focus:ring-purple-500"
                          aria-label={isTimerPaused ? "Resume timer" : "Pause timer"}
                        >
                          {isTimerPaused ? <Play size={16} /> : <Pause size={16} />}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl text-white">{quizData.questions[currentQuestion].question}</h3>
                    <button
                      onClick={() => toggleBookmark(quizData.questions[currentQuestion].id)}
                      className={`p-2 rounded-full ${
                        bookmarkedQuestions.includes(quizData.questions[currentQuestion].id)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400"
                      } hover:bg-purple-700 transition-colors ring-offset-2 focus:ring-2 focus:ring-purple-500`}
                      aria-label={
                        bookmarkedQuestions.includes(quizData.questions[currentQuestion].id)
                          ? "Remove bookmark"
                          : "Bookmark question"
                      }
                    >
                      <Bookmark size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {quizData.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (confirmedAnswer === null) {
                            setSelectedAnswer(index);
                            playSound("click");
                          }
                        }}
                        disabled={confirmedAnswer !== null && !reviewMode}
                        className={`w-full p-4 rounded-lg text-left transition-colors flex items-center space-x-2 ${
                          selectedAnswer === index && confirmedAnswer === null
                            ? "ring-2 ring-purple-500 bg-purple-600/20"
                            : confirmedAnswer === index
                            ? confirmedAnswer === quizData.questions[currentQuestion].correct
                              ? "bg-green-500/20 border-green-500"
                              : confirmedAnswer === -1
                              ? "bg-gray-700/50 border-gray-600"
                              : "bg-red-500/20 border-red-500"
                            : confirmedAnswer !== null && !reviewMode
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-gray-700/50 hover:bg-gray-700"
                        } border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        aria-label={`Select option ${option}`}
                      >
                        {confirmedAnswer === index &&
                          confirmedAnswer !== -1 &&
                          (confirmedAnswer === quizData.questions[currentQuestion].correct ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          ))}
                        <span className="text-white">{option}</span>
                      </button>
                    ))}
                  </div>
                  {selectedAnswer !== null && confirmedAnswer === null && !reviewMode && (
                    <button
                      onClick={() => handleAnswer(selectedAnswer)}
                      className="mt-4 w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500"
                      aria-label="Confirm answer"
                    >
                      <CheckCircle2 size={20} />
                      <span>Confirm Answer</span>
                    </button>
                  )}
                  {showExplanation && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <button
                        onClick={() => setShowExplanation(false)}
                        className="flex items-center space-x-2 text-white font-semibold mb-2"
                        aria-label={showExplanation ? "Hide explanation" : "Show explanation"}
                      >
                        <span>Explanation</span>
                        {showExplanation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      <p className="text-gray-300">{quizData.questions[currentQuestion].explanation}</p>
                      <h4 className="text-lg font-semibold text-white mt-4 mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside text-gray-300">
                        {quizData.questions[currentQuestion].recommendations
                          .filter((rec) =>
                            confirmedAnswer === quizData.questions[currentQuestion].correct
                              ? rec.level === "intermediate"
                              : rec.level === "beginner"
                          )
                          .map((rec, i) => (
                            <li
                              key={i}
                              className="cursor-pointer text-purple-500 hover:underline"
                              onClick={() => {
                                setShowResourceModal(rec);
                                playSound("click");
                              }}
                            >
                              {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}: {rec.text}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                      className={`px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500 ${
                        currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label="Previous question"
                    >
                      <ChevronLeft size={20} />
                      <span>Previous</span>
                    </button>
                    {!reviewMode && (
                      <>
                        <button
                          onClick={handleHint}
                          disabled={usedHint || selectedAnswer !== null}
                          className={`px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500 ${
                            usedHint || selectedAnswer !== null ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          aria-label="Get hint"
                        >
                          <HelpCircle size={20} />
                          <span>Hint</span>
                        </button>
                        <button
                          onClick={skipQuestion}
                          disabled={selectedAnswer !== null}
                          className={`px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500 ${
                            selectedAnswer !== null ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          aria-label="Skip question"
                        >
                          <ChevronRight size={20} />
                          <span>Skip</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500"
                      aria-label="Reset quiz"
                    >
                      <RotateCcw size={20} />
                      <span>Reset</span>
                    </button>
                    {reviewMode && (
                      <button
                        onClick={nextQuestion}
                        disabled={currentQuestion + 1 === quizData.questions.length}
                        className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ring-offset-2 focus:ring-2 focus:ring-purple-500 ${
                          currentQuestion + 1 === quizData.questions.length ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        aria-label="Next question"
                      >
                        <span>Next</span>
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <div className="lg:col-span-1">
              <QuizInsights
                performance={performance}
                questions={quizData.questions}
                bookmarkedQuestions={bookmarkedQuestions}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}