import { motion } from 'framer-motion';
import { Brain, Trophy, Rocket } from 'lucide-react';
import { useQuiz } from './QuizContext';

const difficulties = [
  {
    level: 'easy',
    icon: Brain,
    title: 'Easy',
    description: 'Start with basic concepts',
    color: 'from-green-500 to-emerald-600',
  },
  {
    level: 'medium',
    icon: Trophy,
    title: 'Medium',
    description: 'Challenge your knowledge',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    level: 'hard',
    icon: Rocket,
    title: 'Hard',
    description: 'Master advanced concepts',
    color: 'from-purple-500 to-pink-600',
  },
];

const DifficultySelector = () => {
  const { setDifficulty } = useQuiz();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black p-4"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Knowledge Check
        </h1>
        <p className="text-gray-300 text-lg">Choose your difficulty level to begin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {difficulties.map(({ level, icon: Icon, title, description, color }) => (
          <motion.button
            key={level}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-r ${color} p-6 rounded-xl text-white shadow-xl hover:shadow-2xl transition-shadow`}
            onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
          >
            <div className="flex flex-col items-center space-y-4">
              <Icon size={48} className="text-white" />
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-gray-100 text-sm">{description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DifficultySelector;