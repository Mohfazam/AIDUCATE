import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { History } from './History';

export const YouTubeLearningPortal = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);
  const [greeting, setGreeting] = useState('');
const [history, setHistory] = useState<string[]>([]);
  // Component initialization
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning! Ready to learn something new?');
    else if (hour < 18) setGreeting('Good afternoon! What shall we explore today?');
    else setGreeting('Good evening! Time for some evening learning!');

    // Auto-focus input
    const input = document.querySelector('input');
    if (input) input.focus();

    // Check clipboard for YouTube URL
    navigator.clipboard.readText().then(text => {
      if (text.includes('youtube.com/') || text.includes('youtu.be/')) {
        setUrl(text);
        toast.info('YouTube URL detected and pasted!');
      }
    }).catch(() => {
      // Clipboard access denied - silent fail
    });
  }, []);

  const extractVideoId = (url: string) => {
    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regex);
    return (match && match[2].length === 11) ? match[2] : null;
  };
const updateHistory = (urlToSave: string) => {
    const updatedHistory = [urlToSave, ...history.filter(item => item !== urlToSave)].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('youtubeUrlHistory', JSON.stringify(updatedHistory));
  };
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isExtracted) {
      timeoutId = setTimeout(() => {
        localStorage.setItem('currentVideoId', videoId);
        navigate('/content', { state: { videoId } });
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [isExtracted, navigate, videoId]);

  const handleAnalyze = (urlToAnalyze: string) => {
    setIsLoading(true);
    
    try {
      if (!urlToAnalyze) {
        toast.error('Please enter a YouTube URL');
        return;
      }

      const extractedId = extractVideoId(urlToAnalyze);
      if (!extractedId) {
        toast.error('Invalid YouTube URL');
        return;
      }
updateHistory(urlToAnalyze);
      setVideoId(extractedId);
      localStorage.setItem('currentVideoId', extractedId);
      setIsExtracted(true);
      toast.success('Video ID extracted and stored');
    } catch (error) {
      toast.error('Error processing video URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white p-4 flex items-center justify-center relative overflow-hidden">
      {/* Deep radial gradient background with spotlight effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15)_0,_transparent_70%)]"></div>
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-900/30 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-blue-900/20 blur-[80px]"></div>
      </div>
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Main glass container */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-xl p-8 overflow-hidden relative">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"></div>
          
          <div className="text-center mb-8 relative">
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-light tracking-wide text-neutral-300 mb-4"
            >
              👋 {greeting}
            </motion.p>
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-semibold text-white mb-2"
            >
              YouTube Video Processor
            </motion.h1>
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="font-light tracking-wide text-neutral-300"
            >
              Enter a YouTube URL to continue
            </motion.p>
          </div>

          <div className="space-y-6 relative">
            <motion.div 
              className="flex gap-4 flex-col sm:flex-row"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex-grow relative backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube URL..."
                  className="w-full bg-transparent px-6 py-4 text-lg focus:outline-none text-white placeholder-neutral-400 font-light tracking-wide relative z-10"
                  disabled={isExtracted}
                />
              </div>
              
              <motion.button
                onClick={() => handleAnalyze(url)}
                disabled={isLoading || isExtracted}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-4 sm:py-0 backdrop-blur-lg bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 border border-white/10 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    <span className="font-medium">Analyze</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {isExtracted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-white/10 rounded-xlAAP border border-white/10 p-6 space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader className="w-6 h-6 text-indigo-300" />
                    </motion.div>
                    <span className="text-lg text-white font-light">Processing video content...</span>
                  </div>

                  {/* Thumbnail Preview */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                      alt="Video Thumbnail"
                      className="rounded-xl border border-white/10 shadow-lg max-w-sm w-full object-cover"
                    />
                  </motion.div>
                  
                  <div className="space-y-3 relative z-10">
                    <p className="font-light tracking-wide text-neutral-300">Extracted Video ID:</p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      <code className="text-indigo-300 break-all font-mono p-3 bg-black/20 rounded-lg block w-full backdrop-blur-sm border border-white/10">
                        {videoId}
                      </code>
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-neutral-400 mt-2 font-light tracking-wide"
                    >
                      Redirecting to content page...
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* History Component rendered outside the main container */}
      <History 
        onAnalyze={(url) => {
          setUrl(url);
          handleAnalyze(url);
        }} 
      />
    </div>
  );
};