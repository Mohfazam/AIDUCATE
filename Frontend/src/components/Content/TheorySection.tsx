import { ChevronDown, Clock, Award, Lightbulb, CheckCircle } from 'lucide-react';
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
      className={`bg-gradient-to-r ${
        isActive 
          ? 'from-slate-900 to-slate-800' 
          : 'from-slate-900/60 to-slate-800/40'
      } rounded-xl shadow-lg border ${
        isActive ? 'border-teal-500/50' : 'border-slate-700/40'
      } transition-all duration-300 overflow-hidden`}
    >
      <button 
        className="w-full px-6 py-5 flex items-center justify-between cursor-pointer group focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-[#0A0F1C] rounded-t-xl"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isActive ? 'bg-teal-500/20' : 'bg-slate-800/30'
          } transition-colors`}>
            <Clock className={`w-5 h-5 ${
              isActive ? 'text-teal-400' : 'text-slate-400'
            }`} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-400">{section.time}</p>
            <h3 className={`text-lg font-semibold ${
              isActive ? 'text-teal-300' : 'text-slate-200'
            } group-hover:text-teal-300 transition-colors`}>
              {section.content}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-teal-900/20 rounded-full">
            <Award className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-teal-300">
              {section.theory.points} pts
            </span>
          </div>
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isActive ? 'bg-teal-500/20' : 'bg-slate-800/30'
            } transition-colors`}
          >
            <ChevronDown className={`w-5 h-5 ${
              isActive ? 'text-teal-400' : 'text-slate-400'
            } group-hover:text-teal-400`} />
          </motion.div>
        </div>
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
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800/30">
                <p className="text-slate-300 leading-relaxed">{section.theory.details}</p>
              </div>
              
              {/* Badge and points */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-teal-900/20 to-emerald-900/20 p-4 rounded-xl border border-teal-800/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20">
                  <Award className="w-6 h-6 text-teal-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-teal-300">
                    {section.theory.badge}
                  </span>
                  <span className="text-sm text-teal-400">
                    Keep learning to earn more badges
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
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-900/10 rounded-xl border border-amber-700/30">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h4 className="font-semibold text-amber-300">Pro Tips</h4>
                </div>
                <ul className="space-y-3 pl-4">
                  {section.theory.tips.map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-800/30"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
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