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

export const CodeChallenges = ({ onSelectChallenge }: CodeChallengesProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Challenge['difficulty']>('Easy');

  useEffect(() => {
    const fetchChallenges = async () => {
      const videoId = localStorage.getItem('currentVideoId');
      if (!videoId) {
        setError('No video ID found');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('http://localhost:3000/coding-challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId })
        });

        if (!response.ok) throw new Error('Failed to fetch challenges');
        
        const data = await response.json();
        setChallenges(data.codingChallenges || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch challenges');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const categories: Challenge['difficulty'][] = ['Easy', 'Medium', 'Hard', 'CP'];
  const filteredChallenges = challenges.filter(c => c.difficulty === selectedCategory);

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

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        {error}
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
        {filteredChallenges.map((challenge, index) => (
          <motion.div
            key={`${challenge.difficulty}-${index}`}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-slate-700 border-l-4 border-purple-500 cursor-pointer"
            onClick={() => onSelectChallenge(challenge)}
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
        ))}
      </div>
    </div>
  );
};