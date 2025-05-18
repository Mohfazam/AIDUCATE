import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useQuiz } from './QuizContext';
import { Brain, Timer, Zap, Award, HelpCircle, BarChart, RefreshCw } from 'lucide-react';
import { getQuestions } from './data/questions';

interface QuizResults {
  correctAnswers: number;
  incorrectAnswers: number;
  timePerQuestion: number[];
  usedHints: boolean[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hint?: string;
}

interface QuizQuestions {
  easy: QuizQuestion[];
  medium: QuizQuestion[];
  hard: QuizQuestion[];
}

const Quiz = () => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestions | null>(null);
  const {
    difficulty,
    score,
    setScore,
    streak,
    setStreak,
    currentQuestion,
    setCurrentQuestion,
    showExplanation,
    setShowExplanation,
    xp,
    setXp,
    setDifficulty,
  } = useQuiz();

  const [startTime] = useState(30);
  const [timer, setTimer] = useState(startTime);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState<QuizResults>({
    correctAnswers: 0,
    incorrectAnswers: 0,
    timePerQuestion: [],
    usedHints: [],
  });
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStart, setLoadingStart] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadQuestions = async () => {
      setLoadingStart(Date.now());
      try {
        const questions = await getQuestions();
        if (mounted) {
          setQuizQuestions(questions);
          setQuestionsLoaded(true);
          setError(null);
          setRetryCount(0);
        }
      } catch (err) {
        if (mounted) {
          setError(
            `Failed to load questions: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
          setRetryCount(prev => prev + 1);
        }
      }
    };
    loadQuestions();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showExplanation && timer > 0 && !quizComplete && questionsLoaded) {
      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, showExplanation, quizComplete, questionsLoaded]);

  useEffect(() => {
    if (timer === 0 && !showExplanation && !quizComplete && questionsLoaded) {
      handleAnswer(-1); // Treat as incorrect if timer expires
    }
  }, [timer, showExplanation, quizComplete, questionsLoaded]);

  useEffect(() => {
    if (loadingStart && !questionsLoaded) {
      const elapsed = Date.now() - loadingStart;
      if (elapsed > 60000) {
        // 60s timeout
        setError(
          'API is taking too long to respond. Please check your connection or try a different difficulty.',
        );
      }
    }
  }, [loadingStart, questionsLoaded, retryCount]);

  if (!difficulty) return null;

  if (!questionsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-8">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Assembling Knowledge Matrix
            </h2>
            <p className="text-gray-400 text-sm">
              Loading cognitive patterns for {difficulty} difficulty...
            </p>
            {retryCount > 0 && (
              <p className="text-yellow-400 text-sm">Retrying API... Attempt {retryCount}</p>
            )}
            {error && (
              <p className="text-red-400 text-sm">
                {error}{' '}
                <button
                  className="underline text-blue-400"
                  onClick={() => setDifficulty(null)}
                >
                  Change Difficulty
                </button>
              </p>
            )}
            <motion.div
              className="h-1 bg-gray-800 rounded-full w-48 mx-auto overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '12rem' }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (quizQuestions && quizQuestions[difficulty].length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p className="text-gray-400 mb-4">
            No questions found for {difficulty} difficulty. Try another difficulty.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg font-semibold"
            onClick={() => setDifficulty(null)}
          >
            Change Difficulty
          </motion.button>
        </div>
      </div>
    );
  }
  // @ts-ignore
  const currentQuestionData = quizQuestions[difficulty][currentQuestion];
  // @ts-ignore
  const totalQuestions = quizQuestions[difficulty].length;
  const streakBonus = Math.floor(streak / 3) * 10;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === currentQuestionData.correct;
    const timeSpent = startTime - timer;

    setResults(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
      timePerQuestion: [...prev.timePerQuestion, timeSpent],
      usedHints: [...prev.usedHints, showHint],
    }));

    if (isCorrect) {
      setScore(score + 10 + streakBonus);
      setStreak(streak + 1);
      setXp(xp + 20 + streakBonus);
    } else {
      setStreak(0);
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion >= totalQuestions - 1) {
      setQuizComplete(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(startTime);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setXp(0);
    setQuizComplete(false);
    setResults({
      correctAnswers: 0,
      incorrectAnswers: 0,
      timePerQuestion: [],
      usedHints: [],
    });
    setTimer(startTime);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
  };

  const changeDifficulty = () => {
    setDifficulty(null);
    restartQuiz();
  };

  if (quizComplete) {
    const accuracy = (results.correctAnswers / totalQuestions) * 100;
    const avgTime =
      results.timePerQuestion.reduce((a, b) => a + b, 0) / results.timePerQuestion.length || 0;
    const hintsUsed = results.usedHints.filter(h => h).length;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black p-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Quiz Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl text-white mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Accuracy</span>
                    <span className="text-white font-bold">{accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Correct Answers</span>
                    <span className="text-green-400 font-bold">
                      {results.correctAnswers}/{totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Wrong Answers</span>
                    <span className="text-red-400 font-bold">
                      {results.incorrectAnswers}/{totalQuestions}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl text-white mb-4">Additional Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Final Score</span>
                    <span className="text-purple-400 font-bold">{score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">XP Gained</span>
                    <span className="text-yellow-400 font-bold">{xp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Avg. Time/Question</span>
                    <span className="text-blue-400 font-bold">{avgTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Hints Used</span>
                    <span className="text-orange-400 font-bold">{hintsUsed}/{totalQuestions}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-xl text-white mb-4">Performance Analysis</h3>
              <p className="text-gray-300 mb-4">
                {accuracy >= 80
                  ? 'Excellent performance! You have a strong grasp of the concepts.'
                  : accuracy >= 60
                    ? 'Good job! You understand the basics but could improve on some areas.'
                    : 'Keep practicing! Focus on reviewing the core concepts.'}
              </p>
              <div className="space-y-2">
                {avgTime > 20 && (
                  <p className="text-gray-300">
                    • Try to improve your response time while maintaining accuracy.
                  </p>
                )}
                {hintsUsed > totalQuestions / 2 && (
                  <p className="text-gray-300">
                    • Work on building confidence to reduce reliance on hints.
                  </p>
                )}
                {streak < 3 && (
                  <p className="text-gray-300">
                    • Focus on building consistent streaks of correct answers.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
                onClick={restartQuiz}
              >
                <RefreshCw className="mr-2" />
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
                onClick={changeDifficulty}
              >
                <BarChart className="mr-2" />
                Change Difficulty
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black p-4"
    >
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-4 mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Brain className="text-purple-400 mr-2" />
              <span className="text-white">Score: {score}</span>
            </div>
            <div className="flex items-center">
              <Zap className="text-yellow-400 mr-2" />
              <span className="text-white">Streak: {streak}</span>
            </div>
            <div className="flex items-center">
              <Award className="text-green-400 mr-2" />
              <span className="text-white">XP: {xp}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Timer className="text-red-400 mr-2" />
            <span className="text-white">{timer}s</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center text-white mb-2">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="text-gray-400">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gray-800 rounded-lg p-8 mb-8 shadow-xl"
        >
          <h2 className="text-2xl text-white mb-6">{currentQuestionData.question}</h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestionData.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg text-left transition-colors ${
                  selectedAnswer === null
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : selectedAnswer === index
                      ? index === currentQuestionData.correct
                        ? 'bg-green-600'
                        : 'bg-red-600'
                      : index === currentQuestionData.correct && showExplanation
                        ? 'bg-green-600'
                        : 'bg-gray-700'
                } text-white`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {!showExplanation && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 flex items-center text-purple-400 hover:text-purple-300"
              onClick={() => setShowHint(true)}
            >
              <HelpCircle className="mr-2" />
              Need a hint?
            </motion.button>
          )}

          <AnimatePresence>
            {showHint && !showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 bg-purple-900/50 rounded-lg text-purple-200"
              >
                {currentQuestionData.hint || 'Consider the problem’s core concepts and solution approach.'}
              </motion.div>
            )}

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6"
              >
                <div className="p-4 bg-gray-700 rounded-lg mb-4">
                  <h3 className="text-xl text-white mb-2">Explanation</h3>
                  <p className="text-gray-300">{currentQuestionData.explanation}</p>
                </div>

                {currentQuestionData.hint && (
                  <div className="p-4 bg-gray-700 rounded-lg mb-4">
                    <h3 className="text-xl text-white mb-2">Pro Tips</h3>
                    <ul className="list-disc pl-5 text-gray-300">
                      <li>{currentQuestionData.hint}</li>
                    </ul>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold"
                  onClick={nextQuestion}
                >
                  {currentQuestion === totalQuestions - 1 ? 'Show Results' : 'Next Question'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Quiz;