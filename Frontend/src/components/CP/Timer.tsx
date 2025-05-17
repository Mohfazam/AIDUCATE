// Timer.tsx (updated)
import { useState, useEffect } from 'react';
import { Timer as TimerIcon, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Timer = ({ initialTime = 600 }: { initialTime?: number }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 120 && !isWarning) setIsWarning(true);
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isWarning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TimerIcon className="h-8 w-8 text-blue-400" />
          <h3 className="text-2xl font-semibold text-white">Time Remaining</h3>
        </div>
        <motion.div
          className={`text-4xl font-mono ${timeLeft <= 120 ? 'text-red-400' : 'text-white'}`}
          animate={{
            scale: timeLeft <= 120 ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.5, repeat: timeLeft <= 120 ? Infinity : 0 }}
        >
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </motion.div>
      </div>
      {isWarning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 flex items-center gap-3 text-red-400"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-lg">Time is running out! Complete your solution quickly.</span>
        </motion.div>
      )}
    </motion.div>
  );
};