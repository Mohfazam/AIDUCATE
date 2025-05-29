import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

export interface Challenge {
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'CP';
  title: string;
  problemStatement: string;
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
  };
  testCases: {
    input: any[];
    output: any;
    hidden: boolean;
  }[];
  solution: {
    javascript: string;
    python: string;
    cpp: string;
  };
}

interface CodeChallengesProps {
  onSelectChallenge: (challenge: Challenge) => void;
}

interface ApiProblem {
  title: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  solution: string;
}

interface ApiResponse {
  success: boolean;
  problems: ApiProblem[];
}
//@ts-ignore
const DEFAULT_CHALLENGES: Challenge[] = [
  {
    difficulty: 'Easy',
    title: 'Reverse Array',
    problemStatement: 'Given an array of integers, return a new array with the elements in reverse order.',
    starterCode: {
      javascript: 'function reverseArray(arr) {\n  // Your code here\n}',
      python: 'def reverse_array(arr):\n    # Your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> reverseArray(vector<int>& arr) {\n    // Your code here\n    return arr;\n}',
    },
    testCases: [
      { input: [1, 2, 3, 4], output: [4, 3, 2, 1], hidden: false },
      { input: [5], output: [5], hidden: false },
      { input: [], output: [], hidden: true },
      { input: [1, 1, 1], output: [1, 1, 1], hidden: true },
    ],
    solution: {
      javascript: 'function reverseArray(arr) {\n  return arr.slice().reverse();\n}',
      python: 'def reverse_array(arr):\n    return arr[::-1]',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> reverseArray(vector<int>& arr) {\n    vector<int> result = arr;\n    reverse(result.begin(), result.end());\n    return result;\n}',
    },
  },
  {
    difficulty: 'Easy',
    title: 'Two Sum',
    problemStatement:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution.',
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}',
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1], hidden: false },
      { input: [[3, 2, 4], 6], output: [1, 2], hidden: false },
      { input: [[3, 3], 6], output: [0, 1], hidden: true },
      { input: [[1, 2, 3, 4], 7], output: [2, 3], hidden: true },
    ],
    solution: {
      javascript:
        'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python:
        'def two_sum(nums, target):\n    hash_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hash_map:\n            return [hash_map[complement], i]\n        hash_map[num] = i\n    return []',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (map.find(complement) != map.end()) {\n            return {map[complement], i};\n        }\n        map[nums[i]] = i;\n    }\n    return {};\n}',
    },
  },
  {
    difficulty: 'Easy',
    title: 'Palindrome Number',
    problemStatement:
      'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.',
    starterCode: {
      javascript: 'function isPalindrome(x) {\n  // Your code here\n}',
      python: 'def is_palindrome(x):\n    # Your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nbool isPalindrome(int x) {\n    // Your code here\n    return false;\n}',
    },
    testCases: [
      { input: [121], output: true, hidden: false },
      { input: [-121], output: false, hidden: false },
      { input: [10], output: false, hidden: true },
      { input: [12321], output: true, hidden: true },
    ],
    solution: {
      javascript:
        'function isPalindrome(x) {\n  if (x < 0) return false;\n  let reversed = 0, original = x;\n  while (x > 0) {\n    reversed = reversed * 10 + x % 10;\n    x = Math.floor(x / 10);\n  }\n  return reversed === original;\n}',
      python:
        'def is_palindrome(x):\n    if x < 0:\n        return False\n    return str(x) == str(x)[::-1]',
      cpp: '#include <vector>\nusing namespace std;\nbool isPalindrome(int x) {\n    if (x < 0) return false;\n    long reversed = 0, original = x;\n    while (x > 0) {\n        reversed = reversed * 10 + x % 10;\n        x /= 10;\n    }\n    return reversed == original;\n}',
    },
  },
];

// Parse sampleInput string to test case input
interface CodeChallengesProps {
  onSelectChallenge: (challenge: Challenge) => void;
}
const parseSampleInput = (sampleInput: string): any[] => {
  try {
    // Example: "candidates = [2, 3, 5], target = 8" -> [[2, 3, 5], 8]
    const parts = sampleInput.split(', ');
    const candidatesMatch = parts[0].match(/candidates = (\[.*?\])/);
    const targetMatch = parts[1].match(/target = (\d+)/);
    if (!candidatesMatch || !targetMatch) throw new Error('Invalid sampleInput format');
    const candidates = JSON.parse(candidatesMatch[1].replace(/ /g, ',')); // Convert "[2, 3, 5]" to [2, 3, 5]
    const target = parseInt(targetMatch[1], 10);
    return [candidates, target];
  } catch (error) {
    console.warn('Failed to parse sampleInput:', sampleInput, error);
    return [];
  }
};

// Parse sampleOutput string to test case output
const parseSampleOutput = (sampleOutput: string, difficulty: string): any => {
  try {
    if (difficulty === 'Easy') {
      if (sampleOutput === 'True' || sampleOutput === 'False') {
        return sampleOutput === 'True';
      }
      // Handle array outputs like "[2, 3, 3]"
      return JSON.parse(sampleOutput.replace(/ /g, ','));
    } else if (difficulty === 'Medium') {
      // Handle array of arrays like "[[2, 2, 3], [7]]"
      return JSON.parse(sampleOutput.replace(/ /g, ','));
    } else {
      // Handle Hard outputs (e.g., numbers or arrays)
      return sampleOutput.match(/^\d+$/) ? parseInt(sampleOutput, 10) : JSON.parse(sampleOutput);
    }
  } catch (error) {
    console.warn('Failed to parse sampleOutput:', sampleOutput, error);
    return sampleOutput;
  }
};

export const CodeChallenges = ({ onSelectChallenge }: CodeChallengesProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<Record<string, number>>({
    Easy: 0,
    Medium: 0,
    Hard: 0
  });
  const [selectedCategory, setSelectedCategory] = useState<Challenge['difficulty']>('Easy');
  //@ts-ignore
  const [retryActive, setRetryActive] = useState(true);
  const [retryInProgress, setRetryInProgress] = useState(false);
  //@ts-ignore
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to fetch from a single endpoint with retry logic
  const fetchWithRetry = async (url: string, videoId: string, difficulty: string): Promise<ApiProblem[]> => {
    // Reset retry count for this endpoint when starting a fresh fetch
    if (retryCount[difficulty] === 0) {
      setRetryCount(prev => ({ ...prev, [difficulty]: 1 }));
    }

    try {
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      const response = await axios.post<ApiResponse>(
        url,
        { videoId },
        { signal: abortControllerRef.current.signal }
      );

      if (!response.data.success) {
        throw new Error(`${difficulty} API returned success: false`);
      }

      // Reset retry count on success
      setRetryCount(prev => ({ ...prev, [difficulty]: 0 }));

      return response.data.problems || [];
    } catch (error) {
      // Don't retry if the request was aborted
      if (axios.isCancel(error)) {
        console.log(`${difficulty} request was cancelled`);
        throw error;
      }

      // Increment retry count for this endpoint
      const newRetryCount = retryCount[difficulty] + 1;
      setRetryCount(prev => ({ ...prev, [difficulty]: newRetryCount }));

      console.log(`Retry attempt ${newRetryCount} for ${difficulty}`);

      // Calculate backoff delay (exponential backoff with a cap)
      const backoffDelay = Math.min(Math.pow(1.5, newRetryCount) * 1000, 10000);

      // If retry is active, wait and try again
      if (retryActive) {
        console.log(`Retrying ${difficulty} in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return fetchWithRetry(url, videoId, difficulty);
      } else {
        throw error;
      }
    }
  };

  const fetchChallenges = async () => {
    const videoId = localStorage.getItem('currentVideoId');
    if (!videoId) {
      console.log('No video ID found');
      setError('No video ID found. Please set a video ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setRetryInProgress(true);

    // Fetch from all three endpoints
    const endpoints = [
      { url: 'http://localhost:3000/CodeDojoEasy', difficulty: 'Easy' },
      { url: 'http://localhost:3000/CodeDojoMedium', difficulty: 'Medium' },
      { url: 'http://localhost:3000/CodeDojoHard', difficulty: 'Hard' },
    ];

    try {
      const fetchedChallenges: Challenge[] = [];

      for (const { url, difficulty } of endpoints) {
        try {
          const problems = await fetchWithRetry(url, videoId, difficulty);

          const mappedChallenges = problems.map((problem: ApiProblem) => ({
            difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
            title: problem.title,
            problemStatement: problem.description,
            starterCode: {
              javascript: `function ${problem.title
                .toLowerCase()
                .replace(/ /g, '')}(candidates, target) {\n  // Your code here\n}`,
              python: `def ${problem.title
                .toLowerCase()
                .replace(/ /g, '_')}(candidates, target):\n    # Your code here\n    pass`,
              cpp: `#include <vector>\nusing namespace std;\nvector<int> ${problem.title
                .toLowerCase()
                .replace(/ /g, '')}(vector<int>& candidates, int target) {\n    // Your code here\n    return {};\n}`,
            },
            testCases: [
              {
                input: parseSampleInput(problem.sampleInput),
                output: parseSampleOutput(problem.sampleOutput, difficulty),
                hidden: false,
              },
              // Add a hidden test case (placeholder, as API provides only one)
              {
                input: parseSampleInput(problem.sampleInput),
                output: parseSampleOutput(problem.sampleOutput, difficulty),
                hidden: true,
              },
            ],
            solution: {
              javascript: problem.solution,
              python: '# Python solution not provided by API',
              cpp: '// C++ solution not provided by API',
            },
          }));

          fetchedChallenges.push(...mappedChallenges);
        } catch (error) {
          // If any endpoint fails after retries, we'll continue trying
          if (!axios.isCancel(error)) {
            console.error(`Failed to fetch ${difficulty} challenges:`, error);
          }
        }
      }

      // Only update state if we have challenges or if user cancelled
      if (fetchedChallenges.length > 0) {
        console.log('Fetched challenges:', fetchedChallenges);
        setChallenges(fetchedChallenges);
        setError(null);
        setRetryInProgress(false);
        setLoading(false);
      } else if (!retryActive) {
        setRetryInProgress(false);
      } else {
        // If we have no challenges but retries are active, start over
        console.log('No challenges fetched, retrying all endpoints...');
        setTimeout(() => fetchChallenges(), 2000);
      }
    } catch (err) {
      // This catch will only execute if the retry loop is broken
      console.error('Fatal error fetching challenges:', err);
      setError('Fatal error fetching challenges. Please try again later.');
      setRetryInProgress(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();

    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Ensure selectedCategory has challenges
  useEffect(() => {
    if (challenges.length > 0) {
      const availableCategories = Array.from(new Set(challenges.map(c => c.difficulty)));
      if (!availableCategories.includes(selectedCategory)) {
        console.log(`No challenges for ${selectedCategory}, switching to available category`);
        setSelectedCategory(availableCategories[0] || 'Easy');
      }
    }
  }, [challenges, selectedCategory]);

  const categories: Challenge['difficulty'][] = ['Easy', 'Medium', 'Hard', 'CP'];
  const filteredChallenges = challenges.filter(c => c.difficulty === selectedCategory);

  if (loading && retryInProgress) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6">
        <motion.div
          className="relative w-48 h-48 mx-auto"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="absolute w-full h-full border-4 border-purple-500/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-purple-400 font-mono font-bold"
              style={{
                left: `${Math.cos((i * 30 * Math.PI) / 180) * 70 + 50}%`,
                top: `${Math.sin((i * 30 * Math.PI) / 180) * 70 + 50}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {i % 2 === 0 ? '1' : '0'}
            </motion.span>
          ))}
          <motion.div
            className="absolute inset-0 m-auto w-16 h-16 bg-purple-500 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-purple-500" />
          <h3 className="text-xl font-semibold">Code Challenges</h3>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge, index) => (
            <motion.div
              key={`${challenge.difficulty}-${index}`}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-slate-700 border-l-4 border-purple-500 cursor-pointer"
              onClick={() => {
                console.log('Selecting challenge:', challenge.title);
                onSelectChallenge(challenge);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{challenge.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{challenge.problemStatement}</p>
                </div>
                <ChevronRight className="text-slate-400" />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600 text-slate-300">
                  {challenge.difficulty}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-4 bg-slate-800/50 rounded-xl text-slate-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>
              {retryInProgress
                ? "Attempting to fetch challenges..."
                : "No challenges available for this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};