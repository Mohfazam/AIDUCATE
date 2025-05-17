import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookMarked, Share2, Zap, Trophy, Flame, BrainCircuit } from 'lucide-react';

export const SectionDetails = ({ section }: any) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="border-t border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent backdrop-blur-lg"
  >
    <div className="p-8 space-y-8 relative overflow-hidden">
      {/* Animated holographic grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHN0cm9rZT0icmdiYSg5OCwxMDIsMjQyLDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-20" />
      
      {/* XP Celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute right-8 top-8 flex items-center gap-2 px-4 py-2 bg-emerald-900/30 rounded-full text-emerald-400 text-sm border border-emerald-400/20"
      >
        <Sparkles className="h-4 w-4" />
        <span className="font-bold">+{section.theory.points} XP</span>
        <div className="ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Deep Dive - Neuro Pathway */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <BrainCircuit className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-200 bg-clip-text text-transparent">
              Neural Pathway Activation
            </h3>
          </div>
          
          <motion.div
            className="prose prose-invert text-slate-300 leading-relaxed space-y-4"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            {section.theory.details.split('. ').map((sentence: string, i: number) => (
              <p key={i} className="flex items-start gap-2">
                <span className="text-purple-400">▹</span>
                {sentence.trim()}
              </p>
            ))}
          </motion.div>

          {/* Cognitive Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Mastery Progress</span>
              <span className="text-emerald-400">42% Retained</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: '42%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Pro Tips - Gamified */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Zap className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
              Cognitive Hacks
            </h3>
          </div>

          <div className="grid gap-4">
            {section.theory.tips.map((tip: string, i: number) => (
              <motion.div
                key={i}
                className="p-4 bg-slate-800/20 border border-slate-700 rounded-xl group hover:border-cyan-400/30 transition-colors"
                whileHover={{ translateX: 5 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-cyan-500/10 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                  <span className="text-slate-300">{tip}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/30 rounded-full text-xs">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-400">+{Math.round(section.theory.points/2)} XP</span>
                  </div>
                  <div className="h-1 w-1 bg-slate-600 rounded-full" />
                  <span className="text-xs text-slate-500">Difficulty {i+1}/5</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Knowledge Hub */}
      <div className="border-t border-slate-800 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/30 hover:bg-slate-700/40 rounded-xl transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <BookMarked className="h-5 w-5 text-purple-400" />
              <span className="text-slate-300">Save to Neural Cache</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/30 hover:bg-slate-700/40 rounded-xl transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <Share2 className="h-5 w-5 text-cyan-400" />
              <span className="text-slate-300">Share Cognition</span>
            </motion.button>
          </div>
          
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span className="text-sm text-slate-400">
              <span className="text-amber-400">1.2k</span> Masters
            </span>
          </div>
        </div>
      </div>

      {/* Micro-Interaction Particles */}
      <AnimatePresence>
        {section.theory.badge && (
          <motion.div
            className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);