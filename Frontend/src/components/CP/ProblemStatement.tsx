// ProblemStatement.tsx
import { useState } from 'react';
import { Zap, Copy, Check, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProblemStatement = ({ problem }: { problem: any }) => {
  const [copied, setCopied] = useState(false);
  // const [selectedPlatform, setSelectedPlatform] = useState('all');

  const codeTemplate = problem?.starterCode?.javascript || 
    `function solveProblem(input) {\n  // Your solution here\n}`;

  // const platforms = [
  //   { name: 'all', label: 'All Platforms' },
  //   { name: 'codeforces', label: 'CodeForces' },
  //   { name: 'leetcode', label: 'LeetCode' },
  //   { name: 'atcoder', label: 'AtCoder' }
  // ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Zap className="h-8 w-8 text-purple-400" />
          <h3 className="text-2xl font-semibold text-white">Challenge</h3>
        </div>
        <div className="flex items-center gap-3 text-yellow-400">
          <span className="text-lg font-semibold capitalize">{problem?.difficulty || 'Medium'}</span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="prose prose-invert">
          <h4 className="text-2xl font-semibold text-white mb-4">
            {problem?.title || 'Loading Problem...'}
          </h4>
          
          {problem?.description && (
            <p className="text-gray-300 text-lg">{problem.description}</p>
          )}

          {problem?.example && (
            <div className="mt-6 bg-slate-900/50 p-4 rounded-xl">
              <h5 className="text-xl font-semibold text-white mb-2">Example</h5>
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-gray-400">Input:</span>
                  <code className="block text-white mt-1">
                    {problem.example.input}
                  </code>
                </div>
                <div className="flex-1">
                  <span className="text-gray-400">Output:</span>
                  <code className="block text-white mt-1">
                    {problem.example.output}
                  </code>
                </div>
              </div>
              {problem.example.explanation && (
                <p className="text-gray-400 mt-2">
                  Explanation: {problem.example.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="relative mt-6">
          <pre className="p-6 bg-slate-900/50 rounded-xl text-sm font-mono overflow-x-auto border border-white/10 text-white">
            {codeTemplate}
          </pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <Copy className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {problem?.learningResources && (
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Learning Resources
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {problem.learningResources.map((resource: any, index: number) => (
                <motion.a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-900/50 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <div>
                      <h5 className="text-white font-semibold mb-1">
                        {resource.title}
                      </h5>
                      <p className="text-sm text-gray-400">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};