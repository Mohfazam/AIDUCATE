import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface HistoryProps {
  onAnalyze: (url: string) => void;
}

export const History = ({ onAnalyze }: HistoryProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('youtubeUrlHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleHistoryItemClick = (item: string) => {
    onAnalyze(item);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('youtubeUrlHistory');
    toast.info('History cleared');
  };

  // Update history when a new URL is analyzed
//   @ts-ignore
  const updateHistory = (url: string) => {
    const updatedHistory = [url, ...history.filter(item => item !== url)].slice(0, 10); // Keep only last 10 items
    setHistory(updatedHistory);
    localStorage.setItem('youtubeUrlHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="absolute top-4 right-4 z-20">
      <motion.button
        onClick={() => setShowHistory(!showHistory)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="px-4 backdrop-blur-lg bg-white/10 rounded-xl flex items-center justify-center gap-2 border border-white/10 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
      >
        <HistoryIcon className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/10 overflow-hidden mt-2 w-96 max-h-[400px] overflow-y-auto"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-medium">Recent URLs</h3>
              <div className="flex gap-2">
                <button 
                  onClick={clearHistory}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ul className="divide-y divide-white/10">
              {history.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleHistoryItemClick(item)}
                    className="w-full text-left p-3 hover:bg-white/5 transition-colors text-sm font-light tracking-wide text-neutral-300 truncate"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};