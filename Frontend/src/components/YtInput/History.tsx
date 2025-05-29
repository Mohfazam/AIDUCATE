import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, X, Trash2, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

interface HistoryProps {
  onSelectUrl: (url: string) => void;
  currentUrl: string;
}

interface HistoryItem {
  url: string;
  timestamp: number;
}

export const History = ({ onSelectUrl, currentUrl }: HistoryProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('youtubeUrlHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        
        if (parsedHistory.length > 0) {
          if (typeof parsedHistory[0] === 'string') {
            const convertedHistory = parsedHistory.map((url: string) => ({
              url,
              timestamp: Date.now()
            }));
            setHistory(convertedHistory);
          } else {
            setHistory(parsedHistory);
          }
        }
      } catch (error) {
        console.error('Error parsing history:', error);
        setHistory([]);
      }
    }
  }, []);

  const handleHistoryItemClick = (item: HistoryItem) => {
    onSelectUrl(item.url);
    setShowHistory(false);
    toast.info('URL selected from history');
  };

  const removeHistoryItem = (e: React.MouseEvent, itemUrl: string) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.url !== itemUrl);
    setHistory(updatedHistory);
    localStorage.setItem('youtubeUrlHistory', JSON.stringify(updatedHistory));
    toast.info('URL removed from history');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('youtubeUrlHistory');
    toast.info('History cleared');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getVideoIdFromUrl = (url: string) => {
    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regex);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="absolute top-4 right-4 z-20">
      <motion.button
        onClick={() => setShowHistory(!showHistory)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-10 px-4 backdrop-blur-lg bg-white/10 rounded-xl flex items-center justify-center gap-2 border border-white/10 shadow-lg hover:bg-white/15 transition-all duration-300"
      >
        <HistoryIcon className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">History</span>
      </motion.button>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-[350px] sm:w-[450px] backdrop-blur-xl bg-black/40 rounded-xl border border-white/10 shadow-xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-300" />
                <h3 className="font-medium text-white">Recent Videos</h3>
              </div>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <motion.button 
                    onClick={clearHistory}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </motion.button>
                )}
                <motion.button 
                  onClick={() => setShowHistory(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-6 h-6 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              {history.length > 0 ? (
                <ul className="divide-y divide-white/5">
                  {history.map((item, index) => {
                    const videoId = getVideoIdFromUrl(item.url);
                    const isCurrentUrl = item.url === currentUrl;
                    
                    return (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative ${isCurrentUrl ? 'bg-indigo-600/20' : 'hover:bg-white/5'} transition-colors`}
                      >
                        <button
                          onClick={() => handleHistoryItemClick(item)}
                          className="w-full text-left p-3 flex gap-3 items-center"
                        >
                          {videoId && (
                            <div className="w-16 h-9 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                              <img 
                                src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex-grow min-w-0">
                            <div className="truncate text-sm font-light tracking-wide text-white">
                              {item.url}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-neutral-400">
                                {formatTimestamp(item.timestamp)}
                              </span>
                              
                              {isCurrentUrl && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                                  Current
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-shrink-0 flex items-center">
                            <motion.button
                              onClick={(e) => removeHistoryItem(e, item.url)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                            
                            <motion.a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </motion.a>
                          </div>
                        </button>

                        {isCurrentUrl && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3">
                    <Clock className="w-6 h-6 text-neutral-400" />
                  </div>
                  <p className="text-neutral-400 text-sm">No history yet</p>
                  <p className="text-neutral-500 text-xs mt-1">
                    Analyzed YouTube videos will appear here
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};