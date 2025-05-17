import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface CodeQuizProps {
  onXpGain: (amount: number) => void;
}

export const CodeQuiz = ({ onXpGain }: CodeQuizProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const videoId = localStorage.getItem('currentVideoId');
      if (!videoId) {
        setError('No video ID found in localStorage');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/coding-challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.quizzes || !Array.isArray(data.quizzes)) {
          throw new Error('Invalid quizzes data format');
        }

        setQuizzes(data.quizzes.filter((quiz: any) => 
          quiz.question && 
          Array.isArray(quiz.options) && 
          typeof quiz.correctIndex === 'number'
        ));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
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

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl">
        <div className="flex items-center gap-3 text-red-400">
          <BookOpen className="h-5 w-5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Error loading quizzes:</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="p-4 bg-slate-800/50 rounded-xl">
        <div className="flex items-center gap-3 text-slate-400">
          <BookOpen className="h-5 w-5" />
          <p>No quizzes available for this video</p>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentQuizIndex];
  const hasNextQuiz = currentQuizIndex < quizzes.length - 1;

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

      <motion.div
        key={currentQuizIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 p-6 rounded-xl shadow-lg"
      >
        <h4 className="text-lg font-medium mb-4">{currentQuiz.question}</h4>
        
        <div className="space-y-3">
          {currentQuiz.options.map((option, index) => {
            const isCorrect = index === currentQuiz.correctIndex;
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
                  {selectedAnswer !== null && (
                    isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : isSelected ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : null
                  )}
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
                <p className="text-slate-400 text-sm">{currentQuiz.explanation}</p>
                
                {hasNextQuiz && (
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
    </div>
  );
};