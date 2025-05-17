// SolutionSubmission.tsx
import { useState } from 'react';
import { LockKeyhole, Zap, CheckCircle, XCircle, Award, TrendingUp, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const SolutionSubmission = ({ testCases }: { testCases: any[] }) => {
  const [solution, setSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [solutionTestCases, setSolutionTestCases] = useState(
    testCases.map(tc => ({
      input: tc.input,
      expected: tc.output,
      passed: false,
      hidden: tc.hidden
    }))
  );

  const leaderboard = [
    { rank: 1, name: "AlgoMaster", score: 2850, solved: 42 },
    { rank: 2, name: "CodeNinja", score: 2720, solved: 38 },
    { rank: 3, name: "ByteWarrior", score: 2680, solved: 35 },
  ];

  const achievements = [
    { icon: <Award className="h-5 w-5 text-yellow-400" />, title: "Problem Solver", description: "Solved 50+ problems" },
    { icon: <TrendingUp className="h-5 w-5 text-green-400" />, title: "Streak Master", description: "7 days coding streak" },
    { icon: <Users className="h-5 w-5 text-blue-400" />, title: "Team Player", description: "Helped 10+ developers" }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTestCases = solutionTestCases.map(test => ({
      ...test,
      passed: Math.random() > 0.5,
    }));
    
    setSolutionTestCases(newTestCases);
    setResult(newTestCases.every(test => test.passed) ? 'success' : 'error');
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <LockKeyhole className="h-8 w-8 text-green-400" />
          <h3 className="text-2xl font-semibold text-white">Submit Solution</h3>
        </div>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-3 ${
              result === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {result === 'success' ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
            <span className="text-lg font-semibold">
              {result === 'success' ? 'All tests passed!' : 'Some tests failed'}
            </span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className="w-full h-48 p-6 bg-slate-900/50 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 border border-white/10 text-white"
            placeholder="Write your solution here..."
          />

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">Test Cases</h4>
            <div className="grid gap-3">
              {solutionTestCases.map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/10"
                >
                  <div className="space-x-4 text-gray-300">
                    <span className="text-gray-400">Input:</span>
                    <code className="text-white">{test.input}</code>
                    <span className="text-gray-400">Expected:</span>
                    <code className="text-white">{test.expected}</code>
                  </div>
                  {test.passed !== null && (
                    <div className={test.passed ? 'text-green-400' : 'text-red-400'}>
                      {test.passed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold ${
              isSubmitting
                ? 'bg-slate-700/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-400 to-pink-600 hover:opacity-90'
            }`}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            <Zap className="h-5 w-5" />
            {isSubmitting ? 'Testing Solution...' : 'Submit Solution'}
          </motion.button>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Top Performers
            </h4>
            <div className="space-y-2">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-semibold ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      'text-gray-400'
                    }`}>#{user.rank}</span>
                    <div>
                      <h5 className="text-white font-semibold">{user.name}</h5>
                      <span className="text-sm text-gray-400">{user.solved} problems solved</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-purple-400 font-semibold">{user.score}</span>
                    <span className="text-gray-400 text-sm ml-1">points</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-400" />
              Your Achievements
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/10"
                >
                  {achievement.icon}
                  <div>
                    <h5 className="text-white font-semibold">{achievement.title}</h5>
                    <span className="text-sm text-gray-400">{achievement.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};