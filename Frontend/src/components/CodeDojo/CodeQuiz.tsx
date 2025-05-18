import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tips?: string[]; // Added for potential hints or guidance
}

interface CodeQuizProps {
  onXpGain: (amount: number) => void;
}

interface ApiQuiz {
  question: string;
  options: string[];
  answer: string; // e.g., "A", "B"
  explanation: string;
  tips?: string[]; // Optional, in case API adds tips
}

interface ApiResponse {
  success: boolean;
  quiz: ApiQuiz[];
}

const DEFAULT_QUIZZES: Quiz[] = [
  {
    question: 'What is the time complexity of reversing an array of length n?',
    options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctIndex: 1,
    explanation:
      'Reversing an array requires iterating through the array to swap elements, which takes O(n) time, where n is the length of the array.',
    tips: [
      'Consider two-pointer technique for in-place reversal.',
      'Avoid creating a new array to save space.',
    ],
  },
  {
    question: 'In the Two Sum problem, what data structure is typically used to achieve O(n) time complexity?',
    options: ['Array', 'Linked List', 'Hash Map', 'Binary Tree'],
    correctIndex: 2,
    explanation:
      'A Hash Map is used to store numbers and their indices, allowing constant-time lookups to find the complement of the target sum, achieving O(n) time complexity.',
    tips: [
      'Use a hash map to trade space for time.',
      'Check for edge cases like empty arrays.',
    ],
  },
  {
    question: 'How can you check if a number is a palindrome without converting it to a string?',
    options: [
      'Compare it with its square',
      'Reverse the digits mathematically',
      'Check if it’s divisible by 10',
      'Use a hash map',
    ],
    correctIndex: 1,
    explanation:
      'To check if a number is a palindrome, you can reverse its digits by extracting them using modulo and division operations, then compare the reversed number with the original.',
    tips: [
      'Handle negative numbers carefully.',
      'Watch for integer overflow in languages like C++.',
    ],
  },
];

// Convert answer string (e.g., "A") to correctIndex (e.g., 0)
const answerToIndex = (answer: string): number => {
  const index = answer.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  if (index < 0 || index > 3) throw new Error(`Invalid answer: ${answer}`);
  return index;
};

export const CodeQuiz = ({ onXpGain }: CodeQuizProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(DEFAULT_QUIZZES);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('CodeQuiz mounted, initial quizzes:', quizzes);
    const fetchQuizzes = async () => {
      try {
        const videoId = localStorage.getItem('currentVideoId');
        if (!videoId) {
          console.log('No video ID found, using default quizzes');
          setError('No video ID found, showing default quizzes');
          setQuizzes(DEFAULT_QUIZZES);
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.post<ApiResponse>('http://localhost:3000/CodeDojoQuiz', {
          videoId,
        });

        if (!response.data.success) {
          throw new Error('CodeDojoQuiz API returned success: false');
        }

        const apiQuizzes = response.data.quiz || [];
        const validQuizzes: Quiz[] = apiQuizzes
          .filter(
            (quiz: ApiQuiz) =>
              quiz.question &&
              Array.isArray(quiz.options) &&
              quiz.options.length === 4 &&
              typeof quiz.answer === 'string' &&
              quiz.explanation,
          )
          .map((quiz: ApiQuiz) => ({
            question: quiz.question,
            options: quiz.options,
            correctIndex: answerToIndex(quiz.answer),
            explanation: quiz.explanation,
            tips: quiz.tips || [], // Use API tips if provided, else empty
          }));

        console.log('Fetched quizzes:', validQuizzes);
        setQuizzes([...DEFAULT_QUIZZES, ...validQuizzes]);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quizzes';
        setError(errorMessage);
        setQuizzes(DEFAULT_QUIZZES);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === quizzes[currentQuizIndex].correctIndex) {
      onXpGain(100);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuizIndex(prev => Math.min(prev + 1, quizzes.length - 1));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-slate-400">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-purple-500" />
          <h3 className="text-xl font-semibold">Knowledge Check</h3>
        </div>
        <span className="text-sm text-slate-400">
          Question {currentQuizIndex + 1} of {quizzes.length}
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-3 text-slate-400">
            <BookOpen className="h-5 w-5" />
            <p>No quizzes available</p>
          </div>
        </div>
      ) : (
        <motion.div
          key={currentQuizIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 p-6 rounded-xl shadow-lg"
        >
          <h4 className="text-lg font-medium mb-4">{quizzes[currentQuizIndex].question}</h4>

          <div className="space-y-3">
            {quizzes[currentQuizIndex].options.map((option, index) => {
              const isCorrect = index === quizzes[currentQuizIndex].correctIndex;
              const isSelected = index === selectedAnswer;
              let bgColor = 'bg-slate-700';

              if (selectedAnswer !== null) {
                bgColor = isCorrect
                  ? 'bg-green-500/20 border-green-500'
                  : isSelected
                    ? 'bg-red-500/20 border-red-500'
                    : 'bg-slate-800';
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-3 rounded-lg text-left transition-all border-2 ${bgColor} ${
                    selectedAnswer === null ? 'hover:bg-slate-600 cursor-pointer' : 'cursor-default'
                  }`}
                  whileHover={selectedAnswer === null ? { scale: 1.02 } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer !== null &&
                      (isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : isSelected ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : null)}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className="p-4 bg-slate-700/50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-sm text-slate-300 mb-2 font-medium">Explanation:</p>
                  <p className="text-slate-400 text-sm">{quizzes[currentQuizIndex].explanation}</p>

                  {quizzes[currentQuizIndex].tips && quizzes[currentQuizIndex].tips.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-300 mb-2 font-medium">Pro Tips:</p>
                      <ul className="list-disc pl-5 text-slate-400 text-sm">
                        {quizzes[currentQuizIndex].tips.map((tip, index) => (
                          <li key={index} className="mb-1">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentQuizIndex < quizzes.length - 1 && (
                    <button
                      onClick={handleNextQuiz}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600 transition-colors"
                    >
                      Next Question
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};