import { useEffect, useState } from 'react';
import { Trophy, Sword } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Timer } from './Timer';
import { ProblemStatement } from './ProblemStatement';
import { SolutionSubmission } from './SolutionSubmission';
import { Navbar } from '../Navbar';

const DEFAULT_PROBLEMS = [
  {
    title: 'Sum of Array',
    description: 'Given an array of integers, compute the sum of all elements. Return 0 if the array is empty.',
    difficulty: 'Easy',
    timeLimit: '10 minutes',
    starterCode: {
      javascript: 'function sumArray(arr) {\n  // Your code here\n}',
    },
    testCases: [
      { input: '[1, 2, 3, 4]', output: '10', hidden: false },
      { input: '[]', output: '0', hidden: false },
      { input: '[-1, -2, 3]', output: '0', hidden: true },
      { input: '[5]', output: '5', hidden: true },
    ],
    example: {
      input: '[1, 2, 3]',
      output: '6',
      explanation: 'The sum of elements 1 + 2 + 3 = 6.',
    },
    learningResources: [
      {
        title: 'Array Methods in JavaScript',
        description: 'Learn about array methods like reduce for summing elements.',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
      },
    ],
  },
  {
    title: 'Maximum Subarray Sum',
    description: 'Given an array of integers, find the maximum sum of any contiguous subarray. Return 0 if the array is empty.',
    difficulty: 'Medium',
    timeLimit: '15 minutes',
    starterCode: {
      javascript: 'function maxSubArray(arr) {\n  // Your code here\n}',
    },
    testCases: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', hidden: false },
      { input: '[1]', output: '1', hidden: false },
      { input: '[-1, -2, -3]', output: '-1', hidden: true },
      { input: '[5, 4, -1, 7, 8]', output: '23', hidden: true },
    ],
    example: {
      input: '[4, -1, 2, 1]',
      output: '6',
      explanation: 'The subarray [4, -1, 2, 1] has the maximum sum of 4 + (-1) + 2 + 1 = 6.',
    },
    learningResources: [
      {
        title: 'Kadane’s Algorithm Explained',
        description: 'Understand how to solve the maximum subarray problem efficiently.',
        url: 'https://en.wikipedia.org/wiki/Maximum_subarray_problem',
      },
    ],
  },
  {
    title: 'Longest Common Subsequence',
    description: 'Given two strings, find the length of their longest common subsequence. A subsequence is a sequence of characters that can be derived by deleting some or no elements without changing the order of the remaining elements.',
    difficulty: 'Hard',
    timeLimit: '20 minutes',
    starterCode: {
      javascript: 'function longestCommonSubsequence(str1, str2) {\n  // Your code here\n}',
    },
    testCases: [
      { input: '["ABCD", "ACDF"]', output: '3', hidden: false },
      { input: '["", "XYZ"]', output: '0', hidden: false },
      { input: '["AGGTAB", "GXTXAYB"]', output: '4', hidden: true },
      { input: '["ABC", "DEF"]', output: '0', hidden: true },
    ],
    example: {
      input: '["ABCD", "ACDF"]',
      output: '3',
      explanation: 'The longest common subsequence is "ACD" with length 3.',
    },
    learningResources: [
      {
        title: 'Dynamic Programming: LCS',
        description: 'Learn how to solve the LCS problem using dynamic programming.',
        url: 'https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/',
      },
    ],
  },
];

export const CompetitiveArena = () => {
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('CompetitiveArena mounted, fetching problem...');
    const fetchProblem = async () => {
      try {
        const videoId = localStorage.getItem('currentVideoId') || '_ANrF3FJm7I';
        console.log('Using videoId:', videoId);

        const response = await axios.post('http://localhost:3000/generate-problem', {
          videoId,
        });
        console.log('Fetched problem:', response.data);
        setProblem(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching problem:', err);
      //  setError('Failed to load problem, showing default problem.');
        // Select a random default problem
        const randomIndex = Math.floor(Math.random() * DEFAULT_PROBLEMS.length);
        setProblem(DEFAULT_PROBLEMS[randomIndex]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, []);

  return (
    <section className="relative py-12 overflow-hidden bg-slate-900">
      <div className="container mx-auto px-6">
        <Navbar title="Competitive Arena" icon={Sword} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 flex items-center justify-center gap-4">
            <Trophy className="h-12 w-12 text-yellow-400" />
            <span>
              Competitive
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"> Arena</span>
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Test your skills against challenging problems under time pressure
          </p>
        </motion.div>

        <div className="grid gap-8">
          <Timer initialTime={problem?.timeLimit ? parseInt(problem.timeLimit.split(' ')[0]) * 60 : 600} />

          {loading ? (
            <div className="animate-pulse space-y-4 p-8 bg-white/10 rounded-2xl">
              <div className="h-8 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="text-red-400 p-8 bg-white/10 rounded-2xl mb-4">
                  {error}
                </div>
              )}
              {problem ? (
                <ProblemStatement problem={problem} />
              ) : (
                <div className="text-red-400 p-8 bg-white/10 rounded-2xl">
                  No problem available.
                </div>
              )}
            </>
          )}

          <SolutionSubmission testCases={problem?.testCases || []} />
        </div>
      </div>
    </section>
  );
};