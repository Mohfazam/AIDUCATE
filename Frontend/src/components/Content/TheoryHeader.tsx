import { Clock, BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TheoryContent } from './theory';

interface TheoryHeaderProps {
  content: TheoryContent;
}

export function TheoryHeader({ content }: TheoryHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700"
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gray-100 mb-4"
      >
        {content.title}
      </motion.h1>

      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-5 h-5" />
          <span>{content.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <BookOpen className="w-5 h-5" />
          <span>{content.keyTopics.length} Topics</span>
        </div>
        <div className="flex items-center gap-2 text-purple-400">
          <Award className="w-5 h-5" />
          <span>
            {content.sections.reduce((total, section) => total + section.theory.points, 0)} Total Points
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Key Topics</h3>
        <div className="flex flex-wrap gap-2">
          {content.keyTopics.map((topic, index) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm border border-purple-700/50 hover:border-purple-500 transition-colors cursor-default"
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}