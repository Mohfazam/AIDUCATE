import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const YouTubeLearningPortal = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);

  const extractVideoId = (url: string) => {
    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regex);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    //@ts-ignore
    let timeoutId: NodeJS.Timeout;
    if (isExtracted) {
      timeoutId = setTimeout(() => {
        // Store in localStorage before navigation
        localStorage.setItem('currentVideoId', videoId);
        navigate('/content', { state: { videoId } });
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [isExtracted, navigate, videoId]);

  const handleAnalyze = () => {
    setIsLoading(true);
    
    try {
      if (!url) {
        toast.error('Please enter a YouTube URL');
        return;
      }

      const extractedId = extractVideoId(url);
      if (!extractedId) {
        toast.error('Invalid YouTube URL');
        return;
      }

      // Update both state and localStorage
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-gray-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            YouTube Video Processor
          </h1>
          <p className="text-gray-400">Enter a YouTube URL to continue</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL..."
              className="w-full bg-gray-700 rounded-xl px-6 py-4 text-lg border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              disabled={isExtracted}
            />
            
            <motion.button
              onClick={handleAnalyze}
              disabled={isLoading || isExtracted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Analyze
                </>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {isExtracted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center p-6 bg-gray-700 rounded-xl space-y-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <Loader className="w-6 h-6 animate-spin text-purple-400" />
                  <span className="text-lg">Processing video content...</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-300">Extracted Video ID:</p>
                  <code className="text-purple-400 break-all font-mono p-2 bg-gray-800 rounded-lg">
                    {videoId}
                  </code>
                  <p className="text-sm text-gray-400 mt-2">
                    Redirecting to content page...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};