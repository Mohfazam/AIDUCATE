import { ChevronDown, ChevronUp, Clock, Award, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TheorySection as TheorySectionType } from './theory';

interface TheorySectionProps {
  section: TheorySectionType;
  index: number;
  isActive: boolean;
  onToggle: () => void;
}

export function TheorySection({ section, index, isActive, onToggle }: TheorySectionProps) {
  const randomPoints = Math.floor(Math.random() * 11) + 20;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gray-800 rounded-lg shadow-lg border ${
        isActive ? 'border-purple-500' : 'border-gray-700'
      } transition-colors duration-300`}
    >
      <button 
        className="w-full px-6 py-4 flex items-center justify-between cursor-pointer group"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{section.time}</span>
          </div>
          <h3 className={`text-lg font-semibold ${
            isActive ? 'text-purple-400' : 'text-gray-100'
          } group-hover:text-purple-400 transition-colors`}>
            {section.content}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isActive ? (
            <ChevronUp className="w-5 h-5 text-purple-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Theory details */}
              <div className="bg-gray-900/50 p-6 rounded-lg">
                <p className="text-gray-300 leading-relaxed">{section.theory.details}</p>
              </div>
              
              {/* Badge and points */}
              <div className="flex items-center gap-3 bg-purple-900/20 p-4 rounded-lg">
                <Award className="w-5 h-5 text-purple-400" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{section.theory.badge.split(' ')[0]}</span>
                  <span className="font-medium text-purple-200">
                    {section.theory.badge.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                <div className="ml-auto px-4 py-2 bg-teal-900/30 rounded-lg border border-teal-800/30">
                  <span className="text-sm font-medium text-teal-300">
                    {section.theory.points} Points
                  </span>
                </div>
              </div>

              {/* Pro tips */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Lightbulb className="w-5 h-5" />
                  <h4 className="font-semibold">Pro Tips:</h4>
                </div>
                <ul className="space-y-3">
                  {section.theory.tips.map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}