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
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-xl shadow-xl p-8 border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mb-4"
          >
            {content.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-300 mb-4 max-w-2xl"
          >
            Master this topic with our comprehensive learning materials and interactive content.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-start md:justify-end gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
            <Clock className="w-5 h-5 text-teal-400" />
            <span className="text-slate-300">{content.duration}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span className="text-slate-300">{content.keyTopics.length} Topics</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-teal-900/30 rounded-lg border border-teal-700/30">
            <Award className="w-5 h-5 text-teal-400" />
            <span className="text-teal-300">
              {content.sections.reduce((total, section) => total + section.theory.points, 0)} Points
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Key Topics</h3>
        <div className="flex flex-wrap gap-2">
          {content.keyTopics.map((topic, index) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="px-4 py-2 bg-gradient-to-r from-teal-900/30 to-emerald-900/30 text-slate-300 rounded-full text-sm border border-teal-800/30 hover:border-teal-500/50 transition-all duration-300 cursor-default shadow-sm hover:shadow-md hover:shadow-teal-900/20"
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}