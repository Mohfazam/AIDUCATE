import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Sparkles, Trophy, Flame, Rocket, LockKeyhole } from 'lucide-react';

export const SectionComponent = ({ 
  section,
  originalIndex,
  isExpanded,
  isUnlocked,
  isViewed,
  onSectionClick,
  streakCount
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showXpBoost, setShowXpBoost] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const xpMultiplier = 1 + (streakCount * 0.1);

  const animateXpFlow = () => {
    if (!progressRef.current) return;
    
    const particles = 15;
    Array.from({ length: particles }).forEach((_,) => {
      const particle = document.createElement('div');
      particle.className = `absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `0%`;
      progressRef.current?.appendChild(particle);

      particle.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: `translateY(-${Math.random() * 50 + 30}px) translateX(${Math.random() * 40 - 20}px) scale(0.2)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 200,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => particle.remove();
    });
  };

  useEffect(() => {
    if (isUnlocked) {
      animateXpFlow();
      setShowXpBoost(true);
      const timer = setTimeout(() => setShowXpBoost(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  return (
    <motion.div 
      className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Neural Network Connection Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path 
            d="M10 50 Q 40 30 50 50 T 90 50"
            stroke="url(#neuralGradient)" 
            strokeWidth="0.5" 
            fill="none"
            strokeDasharray="4 2"
          />
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* XP Progress Storm */}
      <div ref={progressRef} className="absolute inset-0 pointer-events-none" />

      <button 
        onClick={() => onSectionClick(originalIndex)}
        className="w-full p-8 text-left flex items-start gap-6 relative overflow-hidden"
      >
        {/* Hover Plasma Effect */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(600px_at_50%_50%,rgba(139,92,246,0.15),transparent]"
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Quantum Badge */}
        <div className="relative flex flex-col items-center gap-4 z-10">
          <motion.div 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-xl ${
              isUnlocked 
                ? 'bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 border border-emerald-400/20 shadow-quantum'
                : 'bg-gradient-to-br from-rose-400/30 to-amber-400/30 border border-rose-400/20'
            }`}
            animate={{ 
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {isUnlocked ? (
              <Check className="w-6 h-6 text-emerald-300" />
            ) : (
              <LockKeyhole className="w-6 h-6 text-rose-300" />
            )}
          </motion.div>

          {/* XP Multiplier Chip */}
          {isUnlocked && (
            <motion.div 
              className="absolute -bottom-2 px-2 py-1 bg-gradient-to-r from-amber-500/80 to-yellow-400/80 rounded-full text-xs font-bold flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Zap className="w-3 h-3" />
              <span>×{xpMultiplier.toFixed(1)}</span>
            </motion.div>
          )}
        </div>

        {/* Content Matrix */}
        <div className="flex-1 space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <motion.h3 
              className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              {section.content}
            </motion.h3>
            
            {/* Streak Fire */}
            {streakCount > 0 && (
              <motion.div 
                className="flex items-center gap-1 px-2 py-1 bg-rose-900/30 rounded-full text-rose-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Flame className="w-4 h-4" />
                <span className="text-xs font-bold">{streakCount}</span>
              </motion.div>
            )}
          </div>

          {/* Hacker-style Progress Bar */}
          <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="absolute h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: isViewed ? '100%' : `${Math.random() * 20 + 5}%` }}
              transition={{ duration: 1.5, type: 'spring' }}
            />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI0IDAiLz48L3N2Zz4=)]" />
          </div>

          {/* Unlocked Secrets */}
          {isUnlocked && (
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {section.theory.tips.map((tip: string, i: number) => (
                <motion.div
                  key={i}
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-mono text-cyan-300 relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  {tip}
                  <div className="absolute inset-0 border border-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* XP Storm Indicator */}
        {showXpBoost && (
          <motion.div 
            className="absolute right-4 top-4 flex items-center gap-2 px-3 py-1 bg-emerald-900/30 rounded-full text-emerald-400 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Sparkles className="w-4 h-4" />
            +{Math.round(section.theory.points * xpMultiplier)} XP
          </motion.div>
        )}
      </button>

      {/* Cyberpunk Expansion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="border-t border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <div className="p-8 space-y-8 relative">
              {/* Holographic Grid */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHN0cm9rZT0icmdiYSg5OCwgMTAyLCAyNDIsIDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')]" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
                {/* Neural Core */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-900/30 rounded-lg">
                      <Rocket className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h4 className="text-xl font-bold text-cyan-300">Core Concept</h4>
                  </div>
                  <p className="text-slate-300 font-light leading-relaxed">
                    {section.theory.details}
                  </p>
                </div>

                {/* Achievement Matrix */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-900/30 rounded-lg">
                      <Trophy className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-xl font-bold text-purple-300">Mastery Path</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {section.theory.tips.map((tip: string, i: number) => (
                      <div 
                        key={i}
                        className="p-4 bg-slate-800/20 border border-slate-700 rounded-xl hover:border-cyan-400/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          <span className="text-sm font-bold text-cyan-300">Milestone {i + 1}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-8 border-t border-slate-800">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 hover:bg-slate-700/40 rounded-xl transition-all">
                  <span className="text-slate-300">Share Mastery</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </button>
                <div className="flex -space-x-3">
                  {[1,2,3].map((_, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 bg-slate-700 border-2 border-slate-800 rounded-full flex items-center justify-center text-xs text-slate-300"
                    >
                      {i+1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};