import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight, AlertCircle } from 'lucide-react';

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

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    difficulty: 'Easy',
    title: 'Reverse Array',
    problemStatement: 'Given an array of integers, return a new array with the elements in reverse order.',
    starterCode: {
      javascript: 'function reverseArray(arr) {\n  // Your code here\n}',
      python: 'def reverse_array(arr):\n    # Your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> reverseArray(vector<int>& arr) {\n    // Your code here\n    return arr;\n}'
    },
    testCases: [
      { input: [1, 2, 3, 4], output: [4, 3, 2, 1], hidden: false },
      { input: [5], output: [5], hidden: false },
      { input: [], output: [], hidden: true },
      { input: [1, 1, 1], output: [1, 1, 1], hidden: true }
    ],
    solution: {
      javascript: 'function reverseArray(arr) {\n  return arr.slice().reverse();\n}',
      python: 'def reverse_array(arr):\n    return arr[::-1]',
      cpp: '#include <vector>\nusing namespace std;\    vector<int> reverseArray(vector<int>& arr) {\n    vector<int> result = arr;\n    reverse(result.begin(), result.end());\n    return result;\n}'
    }
  },
  {
    difficulty: 'Easy',
    title: 'Two Sum',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution.',
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}'
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1], hidden: false },
      { input: [[3, 2, 4], 6], output: [1, 2], hidden: false },
      { input: [[3, 3], 6], output: [0, 1], hidden: true },
      { input: [[1, 2, 3, 4], 7], output: [2, 3], hidden: true }
    ],
    solution: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def two_sum(nums, target):\n    hash_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hash_map:\n            return [hash_map[complement], i]\n        hash_map[num] = i\n    return []',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (map.find(complement) != map.end()) {\n            return {map[complement], i};\n        }\n        map[nums[i]] = i;\n    }\n    return {};\n}'
    }
  },
  {
    difficulty: 'Easy',
    title: 'Palindrome Number',
    problemStatement: 'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.',
    starterCode: {
      javascript: 'function isPalindrome(x) {\n  // Your code here\n}',
      python: 'def is_palindrome(x):\n    # Your code here\n    pass',
      cpp: '#include <vector>\nusing namespace std;\nbool isPalindrome(int x) {\n    // Your code here\n    return false;\n}'
    },
    testCases: [
      { input: [121], output: true, hidden: false },
      { input: [-121], output: false, hidden: false },
      { input: [10], output: false, hidden: true },
      { input: [12321], output: true, hidden: true }
    ],
    solution: {
      javascript: 'function isPalindrome(x) {\n  if (x < 0) return false;\n  let reversed = 0, original = x;\n  while (x > 0) {\n    reversed = reversed * 10 + x % 10;\n    x = Math.floor(x / 10);\n  }\n  return reversed === original;\n}',
      python: 'def is_palindrome(x):\n    if x < 0:\n        return False\n    return str(x) == str(x)[::-1]',
      cpp: '#include <vector>\nusing namespace std;\nbool isPalindrome(int x) {\n    if (x < 0) return false;\n    long reversed = 0, original = x;\n    while (x > 0) {\n        reversed = reversed * 10 + x % 10;\n        x /= 10;\n    }\n    return reversed == original;\n}'
    }
  }
];

export const CodeChallenges = ({ onSelectChallenge }: CodeChallengesProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>(DEFAULT_CHALLENGES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Challenge['difficulty']>('Easy');

  useEffect(() => {
    console.log('CodeChallenges mounted, initial challenges:', challenges);
    const fetchChallenges = async () => {
      try {
        const videoId = localStorage.getItem('currentVideoId');
        if (!videoId) {
          console.log('No video ID found, using default challenges');
          setChallenges(DEFAULT_CHALLENGES);
          setError('No video ID found, showing default challenges');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/coding-challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedChallenges = data.codingChallenges || [];
        console.log('Fetched challenges:', fetchedChallenges);
        setChallenges([...DEFAULT_CHALLENGES, ...fetchedChallenges]);
      } catch (err) {
        console.error('Error fetching challenges:', err);
        // setError('Failed to fetch challenges, showing default challenges'); 
        setChallenges(DEFAULT_CHALLENGES);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Ensure selectedCategory has challenges
  useEffect(() => {
    const availableCategories = Array.from(new Set(challenges.map(c => c.difficulty)));
    if (!availableCategories.includes(selectedCategory)) {
      console.log(`No challenges for ${selectedCategory}, switching to Easy`);
      setSelectedCategory('Easy');
    }
  }, [challenges, selectedCategory]);

  const categories: Challenge['difficulty'][] = ['Easy', 'Medium', 'Hard', 'CP'];
  const filteredChallenges = challenges.filter(c => c.difficulty === selectedCategory);

  console.log('Rendering challenges, selectedCategory:', selectedCategory, 'filteredChallenges:', filteredChallenges);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
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
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category 
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
                  <p className="text-sm text-slate-400 mt-1">
                    {challenge.problemStatement}
                  </p>
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
            No challenges available for {selectedCategory} category. Select 'Easy' for default challenges.
          </div>
        )}
      </div>
    </div>
  );
};