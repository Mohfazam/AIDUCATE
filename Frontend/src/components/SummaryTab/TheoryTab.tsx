import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Sparkles, BookMarked, Share2, Clock,  
  TrophyIcon, Search, BrainCircuit,
} from 'lucide-react';
import { Navbar } from '../Navbar';


// Enhanced Progress Pill with floating particles
const ProgressPill = ({ value, max }: { value: number; max: number }) => {
  const progress = (value / max) * 100;
  
  return (
    <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden w-80 shadow-2xl">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Animated particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/50 rounded-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.random() * 300 - 150,
              y: Math.random() * 20 - 10
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: Math.random() * 1
            }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-overlay">
        {value}/{max} Concepts Mastered
      </div>
    </div>
  );
};

// Floating Achievement Badge
const AchievementBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="relative flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-blue-500/30 px-4 py-2 rounded-xl border border-purple-500/30 shadow-2xl backdrop-blur-sm"
  >
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] opacity-20" />
    {icon}
    <span className="text-sm font-medium text-purple-100 drop-shadow-md">{text}</span>
    <div className="absolute -inset-2 bg-radial-gradient from-purple-500/20 to-transparent blur-lg" />
  </motion.div>
);

// Holographic Section Card
const SectionComponent = ({ section, isExpanded, onClick }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative border border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-950"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4wMiIvPjwvc3ZnPg==')]" />
      
      <button
        onClick={onClick}
        className={`w-full p-6 text-left flex items-start gap-6 transition-all ${
          isExpanded ? 'bg-gradient-to-r from-slate-800/50 to-slate-900/50' : ''
        }`}
      >
        {/* Animated Time Indicator */}
        <div className="relative flex flex-col items-center gap-2">
          <motion.div
            className="text-purple-400 font-mono text-sm"
            animate={{ textShadow: ["0 0 8px rgba(192,132,252,0)", "0 0 8px rgba(192,132,252,0.5)", "0 0 8px rgba(192,132,252,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {section.time}
          </motion.div>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
            <Check className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
            {section.content}
          </h3>
          
          <div className="flex gap-2 flex-wrap">
            {section.theory.tips.map((tip: string, i: number) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-300 backdrop-blur-sm"
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent"
          >
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 relative">
                  <div className="absolute -inset-1 bg-purple-500/10 blur-2xl" />
                  <h4 className="text-lg font-bold text-white">Deep Analysis</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {section.theory.details}
                  </p>
                </div>
                
                <div className="space-y-4 relative">
                  <div className="absolute -inset-1 bg-blue-500/10 blur-2xl" />
                  <h4 className="text-lg font-bold text-white">Expert Techniques</h4>
                  <ul className="space-y-3">
                    {section.theory.tips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-slate-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 border-t border-slate-800 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm"
                >
                  <BookMarked className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-medium">Bookmark</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm"
                >
                  <Share2 className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced TheoryTab Component
export const TheoryTab = ({ summary }: any) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      
      <div className="max-w-7xl mx-auto space-y-8">
      <Navbar title='Theory Mastery' icon={Sparkles} />
        {/* Floating Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-8"
        >
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-xl border border-purple-500/30"
              >
                <BrainCircuit className="h-8 w-8 text-purple-400" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
                  {summary.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-slate-400">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">{summary.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <AchievementBadge
                icon={<TrophyIcon className="h-6 w-6 text-yellow-400" />}
                text={`${summary.sections.length * 25} XP`}
              />
              <ProgressPill value={4} max={summary.sections.length} />
            </div>
          </div>
        </motion.div>

        {/* Animated Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 backdrop-blur-xl shadow-xl"
          />
        </motion.div>

        {/* Animated Sections Grid */}
        <div className="grid gap-6">
          {summary.sections.map((section: any, index: number) => (
            <SectionComponent
              key={index}
              section={section}
              isExpanded={expandedIndex === index}
              onClick={() => setExpandedIndex(prev => prev === index ? null : index)}
            />
          ))}
        </div>
      </div>

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh'
            }}
            animate={{
              x: ['0%', '100%', '0%'],
              y: ['0%', '100%', '0%'],
              scale: [1, 2, 1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};