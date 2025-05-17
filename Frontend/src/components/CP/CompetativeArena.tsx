// CompetitiveArena.tsx
import { useEffect, useState } from 'react';
import { Trophy, Sword } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Timer } from './Timer';
import { ProblemStatement } from './ProblemStatement';
import { SolutionSubmission } from './SolutionSubmission';
import { Navbar } from '../Navbar';

export const CompetitiveArena = () => {
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.post('http://localhost:3000/generate-problem', {
          videoId: '_ANrF3FJm7I' // Replace with dynamic video ID if needed
        });
        setProblem(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load problem. Please try again.');
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblem();
  }, []);

  return (
    <section className="relative py-12 overflow-hidden bg-slate-900">
      <div className="container mx-auto px-6">
        <Navbar title='Competitive Arena' icon={Sword} />
        
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
          <Timer initialTime={problem?.timeLimit ? 
            parseInt(problem.timeLimit.split(' ')[0]) * 60 : 600} />

          {loading ? (
            <div className="animate-pulse space-y-4 p-8 bg-white/10 rounded-2xl">
              <div className="h-8 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 p-8 bg-white/10 rounded-2xl">
              {error}
            </div>
          ) : problem ? (
            <ProblemStatement problem={problem} />
          ) : null}

          <SolutionSubmission testCases={problem?.testCases || []} />
        </div>
      </div>
    </section>
  );
};