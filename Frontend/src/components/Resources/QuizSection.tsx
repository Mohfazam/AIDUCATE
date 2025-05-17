import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Brain, CheckCircle2, XCircle } from 'lucide-react';

const quizData = {
  flashcards: [
    {
      id: 1,
      question: "What is the time complexity of QuickSort in the average case?",
      answer: "O(n log n)"
    },
    {
      id: 2,
      question: "What is a Binary Search Tree?",
      answer: "A tree data structure where each node has at most two children, with all left descendants less than the current node and all right descendants greater."
    }
  ],
  questions: [
    {
      id: 1,
      difficulty: "Easy",
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1
    },
    {
      id: 2,
      difficulty: "Medium",
      question: "What is the time complexity of inserting an element into a balanced BST?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correct: 2
    }
  ]
};

export default function QuizSection() {
  const [mode, setMode] = useState<'flashcard' | 'quiz'>('flashcard');
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % quizData.flashcards.length);
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Interactive Learning</h2>
          <div className="inline-flex bg-gray-800 p-1 rounded-lg mb-8">
            <button
              onClick={() => setMode('flashcard')}
              className={`px-6 py-2 rounded-md transition-colors ${
                mode === 'flashcard'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`px-6 py-2 rounded-md transition-colors ${
                mode === 'quiz'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Quiz
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === 'flashcard' ? (
            <motion.div
              key="flashcard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative"
            >
              <motion.div
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700/50 cursor-pointer min-h-[300px] flex items-center justify-center"
                onClick={handleFlip}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ perspective: 1000 }}
              >
                <div className={`${isFlipped ? 'rotate-180' : ''} text-center`}>
                  <Brain className="w-8 h-8 mx-auto mb-4 text-purple-500" />
                  <p className="text-xl text-white">
                    {isFlipped
                      ? quizData.flashcards[currentCard].answer
                      : quizData.flashcards[currentCard].question}
                  </p>
                </div>
              </motion.div>
              <button
                onClick={nextCard}
                className="mt-4 w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
              >
                Next Card
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700/50">
                <p className="text-sm text-purple-500 mb-2">
                  {quizData.questions[0].difficulty}
                </p>
                <h3 className="text-xl text-white mb-6">
                  {quizData.questions[0].question}
                </h3>
                <div className="space-y-3">
                  {quizData.questions[0].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedAnswer === index
                          ? selectedAnswer === quizData.questions[0].correct
                            ? 'bg-green-500/20 border-green-500'
                            : 'bg-red-500/20 border-red-500'
                          : 'bg-gray-700/50 hover:bg-gray-700'
                      } border border-gray-600`}
                    >
                      <div className="flex items-center">
                        {selectedAnswer === index && (
                          selectedAnswer === quizData.questions[0].correct ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          )
                        )}
                        <span className="text-white">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}