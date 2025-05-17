import {
  ChevronDown,
  ChevronUp,
  Rocket,
  Book,
  Code,
  ArrowUp,
  CheckSquare,
  Share2,
  Search,
  Star,
  Zap,
  BookOpen,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

const roadmap = [
  {
    level: "Beginner",
    icon: <Book className="w-6 h-6" />,
    steps: [
      {
        id: "b1",
        text: "Learn basic programming",
        tooltip: "Understand syntax, logic, and coding principles.",
      },
      {
        id: "b2",
        text: "Variables & data types",
        tooltip: "Learn how data is stored and manipulated.",
      },
      {
        id: "b3",
        text: "Control structures, loops",
        tooltip: "Control program flow with conditionals.",
      },
      {
        id: "b4",
        text: "Basic problem-solving",
        tooltip: "Solve simple coding challenges.",
      },
    ],
  },
  {
    level: "Intermediate",
    icon: <Code className="w-6 h-6" />,
    steps: [
      {
        id: "i1",
        text: "Study data structures",
        tooltip: "Explore arrays, lists, trees, graphs.",
      },
      {
        id: "i2",
        text: "Algorithm analysis",
        tooltip: "Understand time/space complexity.",
      },
      {
        id: "i3",
        text: "Coding challenges",
        tooltip: "Tackle problems on LeetCode/HackerRank.",
      },
      {
        id: "i4",
        text: "Build small projects",
        tooltip: "Create apps like to-do lists.",
      },
    ],
  },
  {
    level: "Advanced",
    icon: <Rocket className="w-6 h-6" />,
    steps: [
      {
        id: "a1",
        text: "System design",
        tooltip: "Design scalable, reliable systems.",
      },
      {
        id: "a2",
        text: "Optimization techniques",
        tooltip: "Optimize code for performance.",
      },
      {
        id: "a3",
        text: "Open source contribution",
        tooltip: "Collaborate on GitHub projects.",
      },
      {
        id: "a4",
        text: "Complex applications",
        tooltip: "Develop full-stack or distributed apps.",
      },
    ],
  },
];

const faqs = [
  {
    question: "Best way to learn Data Structures?",
    answer:
      "Start with arrays and linked lists, understand operations and time complexity, then progress to complex structures. Practice implementing from scratch and solve problems.",
    keywords: ["data structures", "learn", "arrays", "linked lists"],
  },
  {
    question: "How to practice coding effectively?",
    answer:
      "Set regular practice time, use LeetCode or HackerRank, start with easy problems, increase difficulty, and review/optimize solutions.",
    keywords: ["practice", "coding", "LeetCode", "HackerRank"],
  },
  {
    question: "Top resources for DSA?",
    answer:
      "Use GeeksforGeeks, Introduction to Algorithms (CLRS), competitive programming sites, and YouTube channels like mycodeschool and Abdul Bari.",
    keywords: ["resources", "DSA", "GeeksforGeeks", "CLRS"],
  },
];

const funFacts = [
  {
    id: "f1",
    text: "The term 'algorithm' comes from Al-Khwarizmi",
    isTrue: true,
    explanation: "Al-Khwarizmi’s algebra work inspired the term.",
  },
  {
    id: "f2",
    text: "First computer bug was a moth in 1947",
    isTrue: true,
    explanation: "A moth caused a malfunction in the Mark II.",
  },
  {
    id: "f3",
    text: "Big O notation began in 1894",
    isTrue: true,
    explanation: "Paul Bachmann formalized asymptotic analysis.",
  },
];

const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-20 p-3 bg-gray-900/90 text-white text-sm rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 w-56">
          {content}
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
    <div
      className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default function LearningResources() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: boolean }>(
    JSON.parse(localStorage.getItem("roadmapProgress") || "{}")
  );
  const [faqSearch, setFaqSearch] = useState("");
  const [funFactAnswers, setFunFactAnswers] = useState<{
    [key: string]: boolean | null;
  }>(JSON.parse(localStorage.getItem("funFactAnswers") || "{}"));
  const [showQuizResult, setShowQuizResult] = useState<{
    factId: string;
    isCorrect: boolean;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem("roadmapProgress", JSON.stringify(progress));
    localStorage.setItem("funFactAnswers", JSON.stringify(funFactAnswers));
  }, [progress, funFactAnswers]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markStepCompleted = (stepId: string) => {
    setProgress((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const shareStage = (level: string) => {
    const url = `${
      window.location.origin
    }/resources?stage=${level.toLowerCase()}`;
    navigator.clipboard.writeText(url);
    alert(`Copied ${level} stage URL to clipboard!`);
  };

  const shareFaq = (faq: { question: string; answer: string }) => {
    const text = `${faq.question}\n${faq.answer}`;
    navigator.clipboard.writeText(text);
    alert("Copied FAQ to clipboard!");
  };

  const answerFunFact = (factId: string, answer: boolean) => {
    const fact = funFacts.find((f) => f.id === factId);
    if (fact) {
      setFunFactAnswers((prev) => ({ ...prev, [factId]: answer }));
      setShowQuizResult({ factId, isCorrect: answer === fact.isTrue });
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.keywords.some((keyword) =>
        keyword.toLowerCase().includes(faqSearch.toLowerCase())
      )
  );

  const chartData = useMemo(
    () =>
      roadmap.flatMap((stage) =>
        stage.steps.map((step) => ({
          name: step.text,
          completed: progress[step.id] ? 100 : 0,
        }))
      ),
    [progress]
  );

  const pieData = useMemo(
    () =>
      roadmap.map((stage) => ({
        name: stage.level,
        value:
          (stage.steps.filter((step) => progress[step.id]).length /
            stage.steps.length) *
          100,
      })),
    [progress]
  );

  const COLORS = ["#8884d8", "#82ca9d", "#ffc107"];

  return (
    <section className="py-6 relative bg-gray-900">
      <style>
        {`
          .roadmap-card:hover, .faq-card:hover, .fact-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          }
          .roadmap-card, .faq-card, .fact-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .faq-content {
            transition: height 0.3s ease;
          }
          text, tspan {
            fill: #ffffff !important;
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <BookOpen className="w-8 h-8 mr-2 text-purple-400" /> Learning
            Roadmap
          </h2>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Progress Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/30 p-4 rounded-lg">
                <h4 className="text-base font-medium text-white mb-3">
                  Step Completion
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 80 }}
                  >
                    <CartesianGrid stroke="#4a5568" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#fff", fontSize: 14 }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={80}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                      tick={{ fill: "#fff", fontSize: 14 }}
                      domain={[0, 100]}
                      ticks={[0, 50, 100]}
                      label={{
                        value: "% Completed",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#fff",
                        fontSize: 14,
                        offset: -5,
                      }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px",
                      }}
                      cursor={{ stroke: "#8884d8", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 5, fill: "#8884d8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-900/30 p-4 rounded-lg">
                <h4 className="text-base font-medium text-white mb-3">
                  Level Completion
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ${Math.round(value)}%`
                      }
                      labelLine={{ stroke: "#fff" }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "10px",
                      }}
                    />
                    
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {roadmap.map((stage) => {
              const stageProgress =
                (stage.steps.filter((step) => progress[step.id]).length /
                  stage.steps.length) *
                100;
              return (
                <div
                  key={stage.level}
                  className="roadmap-card bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                        {stage.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {stage.level}
                      </h3>
                    </div>
                    <Tooltip content={`Share the ${stage.level} roadmap!`}>
                      <button
                        onClick={() => shareStage(stage.level)}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  </div>
                  <ul className="space-y-3">
                    {stage.steps.map((step) => (
                      <Tooltip key={step.id} content={step.tooltip}>
                        <li className="flex items-center justify-between text-white">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                            <span className="text-base">{step.text}</span>
                          </div>
                          <button
                            onClick={() => markStepCompleted(step.id)}
                            className={`p-1 rounded-full ${
                              progress[step.id]
                                ? "text-teal-400"
                                : "text-gray-200"
                            } hover:text-teal-300 transition-colors`}
                          >
                            <CheckSquare className="w-5 h-5" />
                          </button>
                        </li>
                      </Tooltip>
                    ))}
                  </ul>
                  <ProgressBar progress={stageProgress} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Zap className="w-8 h-8 mr-2 text-purple-400" /> FAQ
          </h2>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200" />
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-200"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="faq-card bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between w-full p-6">
                    <button
                      className="text-left flex-1"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="text-lg font-medium text-white">
                        {faq.question}
                      </span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <Tooltip content="Share this FAQ!">
                        <button
                          onClick={() => shareFaq(faq)}
                          className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </Tooltip>
                      <button onClick={() => toggleFaq(index)} className="p-2">
                        {expandedFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-purple-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-purple-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      height: expandedFaq === index ? "auto" : 0,
                      overflow: "hidden",
                    }}
                    className="faq-content"
                  >
                    <p className="px-6 pb-6 text-gray-200 text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-center text-base">
                No FAQs found matching your search.
              </p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Star className="w-8 h-8 mr-2 text-purple-400" /> Did You Know?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {funFacts.map((fact) => (
              <div
                key={fact.id}
                className="fact-card bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg"
              >
                <Tooltip content="Test your knowledge with a quick quiz!">
                  <p className="text-white text-base mb-4">{fact.text}</p>
                </Tooltip>
                <div className="flex space-x-4">
                  <button
                    onClick={() => answerFunFact(fact.id, true)}
                    className={`flex-1 py-2 rounded-lg text-white text-base transition-colors ${
                      funFactAnswers[fact.id] === true
                        ? "bg-green-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    disabled={funFactAnswers[fact.id] !== undefined}
                  >
                    True
                  </button>
                  <button
                    onClick={() => answerFunFact(fact.id, false)}
                    className={`flex-1 py-2 rounded-lg text-white text-base transition-colors ${
                      funFactAnswers[fact.id] === false
                        ? "bg-red-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    disabled={funFactAnswers[fact.id] !== undefined}
                  >
                    False
                  </button>
                </div>
                {showQuizResult?.factId === fact.id && (
                  <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                    <p
                      className={`text-base ${
                        showQuizResult.isCorrect
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {showQuizResult.isCorrect ? "Correct!" : "Incorrect!"}{" "}
                      {fact.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-colors"
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </section>
  );
}
