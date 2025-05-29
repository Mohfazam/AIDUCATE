import React, { createContext, useContext, useState, ReactNode } from 'react';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizContextType {
  difficulty: Difficulty | null;
  setDifficulty: (difficulty: Difficulty | null) => void; // Change to accept null
  score: number;
  setScore: (score: number) => void;
  streak: number;
  setStreak: (streak: number) => void;
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
  showExplanation: boolean;
  setShowExplanation: (show: boolean) => void;
  xp: number;
  setXp: (xp: number) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [xp, setXp] = useState(0);

  return (
    <QuizContext.Provider
      value={{
        difficulty,
        setDifficulty,
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
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};