import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book,
  Check,
  Sparkles,
  BookMarked,
  Share2,
  AlertCircle,
  Clock,
  Zap,
  Trophy as TrophyIcon,
  Search
} from 'lucide-react';
import { Navbar } from '../Navbar';
interface Theory {
  details: string;
  badge: string;
  points: number;
  tips: string[];
}

interface Section {
  time: string;
  content: string;
  theory: Theory;
}

interface Summary {
  title: string;
  duration: string;
  sections: Section[];
  keyTopics: string[];
}

export const HARDCODED_SUMMARY = {
  title: "Mastering Arrays in C++",
  duration: "52:45",
  sections: [
    {
      time: "00:32",
      content: "Introduction to Data Structures and Algorithms: Importance in coding and real-world systems",
      theory: {
        details: "Explore how data structures form the backbone of efficient software development. Learn about time-space complexity tradeoffs and real-world applications in database systems and AI algorithms.",
        badge: "🚀 Starter Unlocked",
        points: 10,
        tips: [
          "Data structures optimize memory usage",
          "Algorithms determine operational efficiency",
          "Combination crucial for scalable systems"
        ]
      }
    },
    {
      time: "01:52",
      content: "Fundamental concepts: Data structures as storage methods, algorithms as operational procedures",
      theory: {
        details: "Deep dive into abstract data types (ADTs) versus concrete implementations. Comparison of linear vs non-linear structures. Algorithm design patterns: divide-and-conquer, greedy methods, and dynamic programming.",
        badge: "📚 Foundation Achieved",
        points: 15,
        tips: [
          "ADTs define interface, implementations define storage",
          "Arrays are simplest linear structure",
          "Algorithm efficiency measured in Big O notation"
        ]
      }
    },
    {
      time: "00:23",
      content: "Array basics: First data structure discussed, storing multiple values under single variable",
      theory: {
        details: "Comprehensive look at array characteristics: fixed size, contiguous memory allocation, random access. Comparison with vectors in C++. Best practices for array initialization and bounds checking.",
        badge: "🔓 Array Prodigy",
        points: 20,
        tips: [
          "Index starts at 0 in most languages",
          "Contiguous memory enables fast access",
          "Size must be known at declaration in C++"
        ]
      }
    },
    {
      time: "03:57",
      content: "Array implementation in C++: Type-specific storage, memory efficiency for large datasets",
      theory: {
        details: "Memory allocation patterns in stack vs heap. Detailed code walkthroughs for static and dynamic arrays. Performance comparison between raw arrays and STL containers like std::array.",
        badge: "💻 Code Warrior",
        points: 25,
        tips: [
          "Stack arrays have fixed size",
          "Heap allocation uses new/delete",
          "STL arrays provide bounds checking"
        ]
      }
    },
    {
      time: "04:13",
      content: "Memory management: Storage mechanisms, element access, and manipulation techniques",
      theory: {
        details: "Deep memory diagramming: how arrays occupy RAM. Pointer arithmetic explained. Common pitfalls: buffer overflows, dangling pointers, and memory leaks. Modern C++ smart pointers with arrays.",
        badge: "🧠 Memory Master",
        points: 30,
        tips: [
          "arr[i] equivalent to *(arr + i)",
          "Always initialize pointer arrays",
          "Use unique_ptr for automatic cleanup"
        ]
      }
    },
    {
      time: "52:39",
      content: "Practical exercises: Hands-on problems with arrays and nested loops",
      theory: {
        details: "Curated problem set: array reversal, matrix rotation, and prefix sum techniques. Competitive programming strategies: time optimization, edge case handling, and test-driven development approaches.",
        badge: "🏆 Challenge Champion",
        points: 50,
        tips: [
          "Nested loops O(n²) complexity",
          "Precompute values when possible",
          "Always test empty array case"
        ]
      }
    }
  ],
  keyTopics: [
    "Array declaration and initialization in C++",
    "Memory allocation and element access",
    "Efficient data storage strategies",
    "Nested loop implementations",
    "Array manipulation best practices",
    "Practical problem-solving techniques"
  ]
};



const ProgressPill = ({ value, max }: any) => (
  <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden w-72 shadow-inner">
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"
      initial={{ width: 0 }}
      animate={{ width: `${(value / max) * 100}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-overlay">
      {value}/{max} Concepts Mastered
    </div>
  </div>
);

const AchievementBadge = ({ icon, text }: any) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-500/20 px-4 py-2 rounded-full border border-purple-500/30 shadow-lg"
  >
    {icon}
    <span className="text-sm font-medium text-purple-200">{text}</span>
  </motion.div>
);

const TheoryTab = ({ summary }:{ summary: Summary }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [unlocked, setUnlocked] = useState(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [viewedSections, setViewedSections] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedUnlocked = localStorage.getItem('unlockedSections');
    const savedPoints = localStorage.getItem('totalPoints');
    if (savedUnlocked) setUnlocked(new Set(JSON.parse(savedUnlocked)));
    if (savedPoints) setTotalPoints(parseInt(savedPoints));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('unlockedSections', JSON.stringify([...unlocked]));
    localStorage.setItem('totalPoints', totalPoints.toString());
    if (unlocked.size === summary.sections.length && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Confetti for 3 seconds
    }
  }, [unlocked, totalPoints, summary.sections.length]);

  const handleSectionClick = (index:any) => {
    const newViewed = new Set(viewedSections);
    newViewed.add(index);
    setViewedSections(newViewed);

    if (!unlocked.has(index)) {
      setUnlocked(prev => new Set([...prev, index]));
      setTotalPoints(prev => prev + summary.sections[index].theory.points);
    }
    
    setExpandedIndex(prev => prev === index ? null : index);
  };

  const filteredSections = summary.sections.filter(section => 
    section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.theory.tips.some(tip => tip.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-8">
      {/* <Navbar title='fuck you ziegler' icon={Book} /> */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="flex flex-wrap gap-6 items-center justify-between p-8 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-xl border border-purple-500/30">
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{summary.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-slate-400">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">{summary.duration}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <AchievementBadge
              icon={<TrophyIcon className="h-5 w-5 text-yellow-400" />}
              text={`${totalPoints} XP`}
            />
            <ProgressPill value={unlocked.size} max={summary.sections.length} />
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search sections or tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-6">
            {filteredSections.map((section) => {
              const originalIndex = summary.sections.indexOf(section);
              const isUnlocked = unlocked.has(originalIndex);
              const isViewed = viewedSections.has(originalIndex);
              
              return (
                <motion.div
                  key={originalIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: originalIndex * 0.1 }}
                  className="border border-slate-800 rounded-xl overflow-hidden shadow-md"
                >
                  <button
                    onClick={() => handleSectionClick(originalIndex)}
                    className={`w-full p-6 text-left flex items-start gap-6 transition-all ${
                      expandedIndex === originalIndex 
                        ? 'bg-gradient-to-r from-slate-800 to-slate-850' 
                        : 'hover:bg-slate-800/50'
                    } ${!isViewed ? 'border-2 border-purple-500/40' : ''}`}
                  >
                    <div className="flex flex-col items-center gap-2 relative group">
                      <span className="text-purple-400 font-mono text-sm">
                        {section.time}
                      </span>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        {section.theory.tips[0]}
                      </div>
                      {isUnlocked ? (
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <AlertCircle className="h-8 w-8 text-yellow-500/50" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {section.content}
                      </h3>
                      {isUnlocked && (
                        <div className="flex gap-2 flex-wrap">
                          {section.theory.tips.map((tip, tipIndex) => (
                            <span
                              key={tipIndex}
                              className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-300"
                            >
                              {tip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedIndex === originalIndex && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-850/50 border-t border-slate-800"
                      >
                        <div className="p-6 pt-0 space-y-6">
                          <motion.div
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            className="flex items-center gap-4 bg-gradient-to-r from-purple-600/10 to-blue-500/10 p-4 rounded-lg border border-purple-500/20"
                          >
                            <Sparkles className="h-6 w-6 text-purple-400" />
                            <div>
                              <p className="text-purple-300 font-bold">
                                {section.theory.badge}
                              </p>
                              <p className="text-sm text-purple-200">
                                +{section.theory.points} XP Earned!
                              </p>
                            </div>
                          </motion.div>

                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white">Deep Dive</h4>
                              <p className="text-slate-300 leading-relaxed text-sm">
                                {section.theory.details}
                              </p>
                            </div>
                            
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-inner">
                              <h4 className="text-lg font-semibold text-white mb-4">
                                Pro Tips
                              </h4>
                              <ul className="space-y-3">
                                {section.theory.tips.map((tip, tipIndex) => (
                                  <li
                                    key={tipIndex}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                      <Check className="h-4 w-4 text-purple-400" />
                                    </div>
                                    <span className="text-slate-300 text-sm">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 border-t border-slate-800 pt-6">
                            <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-xl transition-all border border-slate-700">
                              <BookMarked className="h-5 w-5 text-purple-400" />
                              <span className="text-white font-medium">Save</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-xl transition-all border border-slate-700">
                              <Share2 className="h-5 w-5 text-purple-400" />
                              <span className="text-white font-medium">Share</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simple confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -10 
              }}
              animate={{ 
                y: window.innerHeight + 10,
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: Math.random() * 2 + 1,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function SummaryComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white antialiased">
      <Navbar title="Theory Mastery" icon={Book} />
      <div className="pt-20 max-w-7xl mx-auto px-8 pb-12">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TheoryTab summary={HARDCODED_SUMMARY} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
