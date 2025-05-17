import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Book, Search, X } from 'lucide-react';
import { fetchTheoryContent } from './api';
import { TheoryHeader } from './TheoryHeader';
import { TheorySection } from './TheorySection';
import { fallbackTheoryData } from './FallBackTheoryData';
import type { TheoryContent as TheoryContentType } from './theory';
import { Navbar } from '../Navbar';

export function TheoryContent() {
  const [content, setContent] = useState<TheoryContentType | null>(null);
//   const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const videoId = location.state?.videoId;

  useEffect(() => {
    if (!videoId) {
      navigate('/input');
      return;
    }

    const loadContent = async () => {
      try {
        const data = await fetchTheoryContent(videoId);
        setContent(data);
        setUsedFallback(false);
      } catch (err) {
        console.error('Failed to fetch content, using fallback data:', err);
        setContent(fallbackTheoryData);
        setUsedFallback(true);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [videoId, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const newProgress = (scrolled / maxScroll) * 100;
      setProgress(newProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-purple-400 animate-pulse">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-400 text-center">
          <p className="text-xl font-semibold">Failed to load content</p>
          <button 
            onClick={() => navigate('/input')} 
            className="mt-4 px-4 py-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-900/70 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const filteredSections = content.sections.filter(section => 
    section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.theory.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.theory.tips.some(tip => tip.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-900">
        <Navbar title='Theory Master' icon={Book} />

      {/* Progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-purple-600 transition-all duration-300 z-50"
        style={{ width: `${progress}%` }}
      />

      {/* Navigation header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/input')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search content..."
                className="pl-10 pr-10 py-2 bg-gray-800 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-5 h-5" />
              <span>{content.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {usedFallback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg text-yellow-200"
          >
            <p className="text-sm">
              Note: Using fallback content as we couldn't fetch the video-specific data. 
              This is example content about Arrays and Data Structures.
            </p>
          </motion.div>
        )}

        <TheoryHeader content={content} />

        <div className="mt-8 space-y-6">
          <AnimatePresence>
            {filteredSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <TheorySection
                  section={section}
                  index={index}
                  isActive={activeSection === index}
                  onToggle={() => setActiveSection(activeSection === index ? null : index)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredSections.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400">No sections match your search criteria</p>
            </motion.div>
          )}
        </div>

        {/* Quick navigation */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}