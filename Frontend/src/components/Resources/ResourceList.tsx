import {
  FileText,
  Video,
  Link as LinkIcon,
  Download,
  Eye,
  Play,
  Star,
  BookmarkPlus,
  BookmarkCheck,
  Trophy,
  Code as CodeIcon,
  CheckCircle,
  Share2,
  Search,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
  SortAsc,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import YouTube from "react-youtube";
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import confetti from "canvas-confetti";

// Resource data with tags and learning path step
// Resource data with tags and learning path step
const resources = {
  dsa: [
    {
      id: 1,
      title: "Complete DSA Guide",
      type: "pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      preview: true,
      difficulty: "intermediate",
      rating: 4.8,
      featured: true,
      thumbnail:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80",
      description:
        "Comprehensive guide covering all essential data structures and algorithms concepts.",
      duration: "4 hours",
      tags: ["Popular", "In-Depth"],
      learningPathStep: "Basic Data Structures",
      quiz: [
        {
          question: "What is the time complexity of QuickSort in average case?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          correct: 1,
          explanation:
            "QuickSort has an average time complexity of O(n log n) due to its divide-and-conquer approach.",
        },
      ],
      codeSnippet: {
        language: "typescript",
        code: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x <= pivot);
  const right = arr.slice(1).filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
      },
    },
    {
      id: 2,
      title: "Algorithm Visualization",
      type: "video",
      url: "dQw4w9WgXcQ",
      preview: true,
      difficulty: "beginner",
      rating: 4.5,
      featured: true,
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
      description:
        "Visual explanation of common algorithms with step-by-step animations.",
      duration: "45 minutes",
      tags: ["Quick", "Visual"],
      learningPathStep: "Sorting Algorithms",
    },
    {
      id: 3,
      title: "Sorting Algorithms Guide",
      type: "pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      preview: false,
      difficulty: "beginner",
      rating: 4.2,
      featured: false,
      thumbnail:
        "https://images.unsplash.com/photo-1509228627152-72ae9ae0e446?w=400&q=80",
      description:
        "Detailed guide on sorting algorithms like Bubble Sort and Merge Sort.",
      duration: "2 hours",
      tags: ["Beginner-Friendly"],
      learningPathStep: "Sorting Algorithms",
    },
  ],
};

// Learning path data with analytics metrics
const learningPaths = {
  dsa: [
    {
      title: "Beginner DSA Path",
      steps: [
        { name: "Basic Data Structures", difficulty: 1, relevance: 8 },
        { name: "Time Complexity Analysis", difficulty: 2, relevance: 7 },
        { name: "Sorting Algorithms", difficulty: 2, relevance: 9 },
        { name: "Searching Algorithms", difficulty: 3, relevance: 8 },
      ],
    },
  ],
};

// Daily quote
const quotes = [
  {
    text: "The best way to predict the future is to implement it.",
    author: "David Heinemeier Hansson",
  },
];

interface ResourceListProps {
  selectedCategory: string;
  difficulty: string;
  searchQuery: string;
}

// Helper to get resource type icon
const getIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="w-5 h-5 text-white" />;
    case "video":
      return <Video className="w-5 h-5 text-white" />;
    default:
      return <LinkIcon className="w-5 h-5 text-white" />;
  }
};

// Helper to generate action buttons
const getActionButtons = (
  resource: any,
  setShowQuiz: (show: boolean) => void,
  setSelectedResource: (resource: any) => void
) => {
  const buttons = [];
  if (resource.preview) {
    buttons.push(
      <button
        key="preview"
        onClick={() => window.open(resource.url, "_blank")}
        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <Eye className="w-4 h-4 mr-1.5" /> Preview
      </button>
    );
  }
  if (resource.type === "pdf") {
    buttons.push(
      <button
        key="download"
        onClick={() => window.open(resource.url, "_blank")}
        className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <Download className="w-4 h-4 mr-1.5" /> Download
      </button>
    );
  }
  if (resource.type === "video") {
    buttons.push(
      <button
        key="play"
        onClick={() =>
          window.open(`https://youtube.com/watch?v=${resource.url}`, "_blank")
        }
        className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <Play className="w-4 h-4 mr-1.5" /> Play
      </button>
    );
  }
  if (resource.quiz) {
    buttons.push(
      <button
        key="quiz"
        onClick={() => setShowQuiz(true)}
        className="inline-flex items-center px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <Trophy className="w-4 h-4 mr-1.5" /> Take Quiz
      </button>
    );
  }
  if (resource.codeSnippet) {
    buttons.push(
      <button
        key="code"
        onClick={() => setSelectedResource(resource)}
        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <CodeIcon className="w-4 h-4 mr-1.5" /> View Code
      </button>
    );
  }
  return buttons;
};

// Tooltip component
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
        <div className="absolute z-20 p-3 bg-gray-900/90 text-white text-sm font-medium rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 w-56">
          {content}
        </div>
      )}
    </div>
  );
};

export default function ResourceList({
  selectedCategory,
  difficulty,
  searchQuery,
}: ResourceListProps) {
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [bookmarkedResources, setBookmarkedResources] = useState<number[]>(
    JSON.parse(localStorage.getItem("bookmarkedResources") || "[]")
  );
  const [completedResources, setCompletedResources] = useState<number[]>(
    JSON.parse(localStorage.getItem("completedResources") || "[]")
  );
  const [completedSteps, setCompletedSteps] = useState<string[]>(
    JSON.parse(localStorage.getItem("completedSteps") || "[]")
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [sortBy, setSortBy] = useState<"rating" | "difficulty" | "type">(
    "rating"
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedStepFilter, setSelectedStepFilter] = useState<string>("all");

  // Persist state
  useEffect(() => {
    localStorage.setItem(
      "bookmarkedResources",
      JSON.stringify(bookmarkedResources)
    );
    localStorage.setItem(
      "completedResources",
      JSON.stringify(completedResources)
    );
    localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
  }, [bookmarkedResources, completedResources, completedSteps]);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let result = (
      resources[selectedCategory as keyof typeof resources] || []
    ).filter((resource) => {
      const matchesDifficulty =
        difficulty === "all" || resource.difficulty === difficulty;
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        false;
      const matchesStep =
        selectedStepFilter === "all" ||
        resource.learningPathStep === selectedStepFilter;
      return matchesDifficulty && matchesSearch && matchesStep;
    });

    return result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "difficulty")
        return a.difficulty.localeCompare(b.difficulty);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return 0;
    });
  }, [selectedCategory, difficulty, searchQuery, sortBy, selectedStepFilter]);

  // LineChart data for step completion progress
  const lineChartData = useMemo(() => {
    return learningPaths.dsa[0].steps.map((step) => ({
      name: step.name,
      completion: completedSteps.includes(step.name) ? 100 : 0,
    }));
  }, [completedSteps]);

  // RadarChart data for step difficulty/relevance
  const radarChartData = useMemo(() => {
    return learningPaths.dsa[0].steps.map((step) => ({
      subject: step.name,
      difficulty: step.difficulty,
      relevance: step.relevance,
    }));
  }, []);

  // Progress percentage
  const progressPercentage = useMemo(() => {
    const totalSteps = learningPaths.dsa[0].steps.length;
    const completedCount = completedSteps.length;
    return Math.round((completedCount / totalSteps) * 100);
  }, [completedSteps]);

  // Recommended next step
  const recommendedStep = useMemo(() => {
    const incompleteSteps = learningPaths.dsa[0].steps.filter(
      (step) => !completedSteps.includes(step.name)
    );
    return incompleteSteps.length > 0 ? incompleteSteps[0].name : null;
  }, [completedSteps]);

  // Toggle bookmark
  const toggleBookmark = (resourceId: number) => {
    setBookmarkedResources((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Toggle resource completion
  const toggleCompleted = (resourceId: number) => {
    setCompletedResources((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Toggle step completion
  const toggleStepCompleted = (stepName: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepName)
        ? prev.filter((name) => name !== stepName)
        : [...prev, stepName]
    );
  };

  // Share resource
  const shareResource = (resource: any) => {
    const url =
      resource.type === "video"
        ? `https://youtube.com/watch?v=${resource.url}`
        : resource.url;
    navigator.clipboard.writeText(`${resource.title}: ${url}`);
    alert(`Copied ${resource.title} to clipboard!`);
  };

  // Carousel navigation
  const handleCarouselNav = (direction: "prev" | "next") => {
    const featured = filteredResources.filter((r) => r.featured);
    if (direction === "next") {
      setCarouselIndex((carouselIndex + 1) % Math.max(1, featured.length));
    } else {
      setCarouselIndex(
        (carouselIndex - 1 + featured.length) % Math.max(1, featured.length)
      );
    }
  };

  // Highlight search query
  const highlightSearch = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-yellow-500/30 text-white">$1</mark>'
    );
  };

  // Handle quiz answer
  const handleQuizAnswer = (
    index: number,
    optionIndex: number,
    correct: number
  ) => {
    setQuizAnswers((prev) => ({ ...prev, [index]: optionIndex }));
    if (optionIndex === correct) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <section className="py-12 bg-gray-900 space-y-8">
      <style>
        {`
          .resource-card:hover, .carousel-item:hover, .modal:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          }
          .resource-card, .carousel-item, .modal {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .tag:hover {
            background-color: rgba(168, 85, 247, 0.3);
          }
          text, tspan {
            fill: #ffffff !important;
            font-weight: bold;
          }
        `}
      </style>

      {/* Featured Resources Carousel */}
      <div className="relative">
        <h2 className="text-2xl font-bold text-white mb-3 mt-[-60px] mt flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-purple-400" /> Featured
          Resources
        </h2>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {filteredResources
              .filter((r) => r.featured)
              .map((resource) => (
                <div
                  key={`featured-${resource.id}`}
                  className="carousel-item min-w-full p-2"
                >
                  <div className="relative group overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 shadow-lg">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                      <h3
                        className="text-xl font-bold text-white mb-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearch(resource.title),
                        }}
                      />
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-200 font-medium">
                          {resource.rating}
                        </span>
                        <Clock className="w-4 h-4 text-gray-200" />
                        <span className="text-sm text-gray-200 font-medium">
                          {resource.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {filteredResources.filter((r) => r.featured).length > 1 && (
            <>
              <button
                onClick={() => handleCarouselNav("prev")}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/50 p-2 rounded-full hover:bg-gray-700"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => handleCarouselNav("next")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/50 p-2 rounded-full hover:bg-gray-700"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quote of the Day */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-400" /> Quote of the Day
        </h3>
        <blockquote className="italic text-base text-gray-200 font-medium">
          "{quotes[0].text}"
          <footer className="text-sm text-gray-200 mt-2 font-medium">
            — {quotes[0].author}
          </footer>
        </blockquote>
      </div>

      {/* Recommended Learning Path with Analytics */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-400" /> Recommended
          Learning Path
        </h3>
        {/* Progress Percentage */}
        <div className="mb-4">
          <p className="text-base font-bold text-white">
            Progress: {progressPercentage}% Complete
          </p>
        </div>
        {/* Step Completion Tracker */}
        <div className="space-y-3 mb-6">
          {learningPaths[
            selectedCategory as keyof typeof learningPaths
          ]?.[0].steps.map((step, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <span className="text-base text-gray-200 font-medium">
                  {step.name}
                </span>
              </div>
              <Tooltip
                content={
                  completedSteps.includes(step.name)
                    ? "Mark as Incomplete"
                    : "Mark as Completed"
                }
              >
                <button
                  onClick={() => toggleStepCompleted(step.name)}
                  className="text-gray-200 hover:text-teal-400 transition-colors"
                >
                  <CheckCircle
                    className={`w-5 h-5 ${
                      completedSteps.includes(step.name) ? "text-teal-400" : ""
                    }`}
                  />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
        {/* Learning Path Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/30 p-4 rounded-lg">
            <h4 className="text-base font-bold text-white mb-3">
              Step Completion Progress
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={lineChartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 50 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#fff", fontSize: 14, fontWeight: "bold" }}
                />
                <YAxis
                  tick={{ fill: "#fff", fontSize: 14, fontWeight: "bold" }}
                  domain={[0, 100]}
                  label={{
                    value: "Completion (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#fff",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px",
                    fontWeight: "bold",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-900/30 p-4 rounded-lg">
            <h4 className="text-base font-bold text-white mb-3">
              Step Difficulty & Relevance
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarChartData}>
                <PolarGrid stroke="#fff" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#fff", fontSize: 14, fontWeight: "bold" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 10]}
                  tick={{ fill: "#fff", fontSize: 14, fontWeight: "bold" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "10px",
                    fontWeight: "bold",
                  }}
                />
                <Radar
                  name="Difficulty"
                  dataKey="difficulty"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Relevance"
                  dataKey="relevance"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm font-bold text-white">
                      {value}
                    </span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Next Step Recommendation */}
        {recommendedStep && (
          <div className="mt-6">
            <h4 className="text-base font-bold text-white mb-2">
              Next Recommended Step
            </h4>
            <p className="text-sm text-gray-200 font-medium">
              Based on your progress, focus on:
              <span className="inline-flex items-center ml-2 px-2 py-1 bg-purple-500/20 rounded-full text-purple-300 font-medium">
                {recommendedStep}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Available Resources */}
      <div>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Search className="w-6 h-6 mr-2 text-purple-400" /> Available
            Resources
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2 flex-wrap gap-2">
              <Tooltip content="Show all resources">
                <button
                  onClick={() => setSelectedStepFilter("all")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedStepFilter === "all"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-700 text-gray-200"
                  } hover:bg-purple-400 transition-colors`}
                >
                  All
                </button>
              </Tooltip>
              {learningPaths.dsa[0].steps.map((step) => (
                <Tooltip key={step.name} content={`Filter by ${step.name}`}>
                  <button
                    onClick={() => setSelectedStepFilter(step.name)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedStepFilter === step.name
                        ? "bg-purple-500 text-white"
                        : "bg-gray-700 text-gray-200"
                    } hover:bg-purple-400 transition-colors`}
                  >
                    {step.name}
                  </button>
                </Tooltip>
              ))}
              <Tooltip content="Clear all filters">
                <button
                  onClick={() => setSelectedStepFilter("all")}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </Tooltip>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-gray-800/50 border border-gray-700/50 rounded-lg py-2 pl-10 pr-8 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="type">Sort by Type</option>
              </select>
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-200" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="resource-card bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    {getIcon(resource.type)}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-white text-lg"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearch(resource.title),
                      }}
                    />
                    {resource.description && (
                      <p
                        className="text-sm text-gray-200 mt-1 font-medium"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearch(resource.description),
                        }}
                      />
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {resource.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="tag text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium cursor-pointer transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Tooltip
                    content={
                      bookmarkedResources.includes(resource.id)
                        ? "Remove Bookmark"
                        : "Bookmark Resource"
                    }
                  >
                    <button
                      onClick={() => toggleBookmark(resource.id)}
                      className="text-gray-200 hover:text-purple-400 transition-colors"
                    >
                      {bookmarkedResources.includes(resource.id) ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <BookmarkPlus className="w-5 h-5" />
                      )}
                    </button>
                  </Tooltip>
                  <Tooltip
                    content={
                      completedResources.includes(resource.id)
                        ? "Mark as Incomplete"
                        : "Mark as Completed"
                    }
                  >
                    <button
                      onClick={() => toggleCompleted(resource.id)}
                      className="text-gray-200 hover:text-teal-400 transition-colors"
                    >
                      <CheckCircle
                        className={`w-5 h-5 ${
                          completedResources.includes(resource.id)
                            ? "text-teal-400"
                            : ""
                        }`}
                      />
                    </button>
                  </Tooltip>
                  <Tooltip content="Share Resource">
                    <button
                      onClick={() => shareResource(resource)}
                      className="text-gray-200 hover:text-indigo-400 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-sm px-2 py-1 bg-gray-700 rounded-full text-white font-medium">
                  {resource.type.toUpperCase()}
                </span>
                <span className="text-sm px-2 py-1 bg-purple-500/20 rounded-full text-white font-medium">
                  {resource.difficulty}
                </span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-200 ml-1 font-medium">
                    {resource.rating}
                  </span>
                </div>
                <Clock className="w-4 h-4 text-gray-200" />
                <span className="text-sm text-gray-200 font-medium">
                  {resource.duration}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {getActionButtons(resource, setShowQuiz, setSelectedResource)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Preview Modal */}
      {selectedResource && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResource(null)}
        >
          <div
            className="modal bg-gray-800 rounded-xl p-6 w-full max-w-5xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              {selectedResource.title}
            </h3>
            {selectedResource.description && (
              <p className="text-base text-gray-200 mb-4 font-medium">
                {selectedResource.description}
              </p>
            )}
            {selectedResource.type === "pdf" ? (
              <iframe
                src={`${selectedResource.url}#view=FitH`}
                className="w-full h-[60vh] rounded-lg"
                title={selectedResource.title}
              />
            ) : selectedResource.type === "video" ? (
              <YouTube
                videoId={selectedResource.url}
                className="w-full aspect-video rounded-lg overflow-hidden"
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 1 },
                }}
              />
            ) : selectedResource.codeSnippet ? (
              <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-gray-200 font-medium">
                  {selectedResource.codeSnippet.code}
                </code>
              </pre>
            ) : null}
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && selectedResource?.quiz && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuiz(false)}
        >
          <div
            className="modal bg-gray-800 rounded-xl p-6 w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-6">Quick Quiz</h3>
            {selectedResource.quiz.map((q: any, index: number) => (
              <div key={index} className="mb-6">
                <p className="text-lg font-bold text-white mb-4">
                  {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((option: string, optionIndex: number) => (
                    <button
                      key={optionIndex}
                      onClick={() =>
                        handleQuizAnswer(index, optionIndex, q.correct)
                      }
                      className={`w-full p-3 rounded-lg text-left text-white font-medium transition-colors ${
                        quizAnswers[index] === optionIndex
                          ? quizAnswers[index] === q.correct
                            ? "bg-green-500/20 border-green-500"
                            : "bg-red-500/20 border-red-500"
                          : "bg-gray-700/50 hover:bg-gray-700"
                      } border border-gray-600`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {quizAnswers[index] !== undefined && (
                  <p
                    className={`text-sm mt-2 font-medium ${
                      quizAnswers[index] === q.correct
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {quizAnswers[index] === q.correct
                      ? "Correct!"
                      : "Incorrect!"}{" "}
                    {q.explanation}
                  </p>
                )}
              </div>
            ))}
            <button
              onClick={() => setQuizAnswers({})}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
