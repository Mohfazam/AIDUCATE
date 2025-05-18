import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Book, Search, X, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { fetchTheoryData } from './TheoryDataAPI';
import { TheoryHeader } from './TheoryHeader';
import { TheorySection } from './TheorySection';
import { fallbackTheoryData } from './FallBack';
import type { TheoryContent as TheoryContentType } from './theory';
import { Navbar } from '../Navbar';

interface SummaryResponse {
  success: boolean;
  summary: string;
}

export function TheoryContent() {
  const [content, setContent] = useState<TheoryContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

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
        const data = await fetchTheoryData(videoId);
        setContent(data);
        setUsedFallback(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Failed to fetch content, using fallback data:', err);
        setContent(fallbackTheoryData);
        setUsedFallback(true);
        setErrorMessage(`Failed to load video-specific content: ${errorMsg}. Showing example content instead.`);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const response = await axios.post<SummaryResponse>('http://localhost:3000/Summary', { videoId });
        setSummary(response.data.summary);
      } catch (err) {
        console.error('Error fetching summary:', err);
        setSummaryError('Failed to load summary. Please try again later.');
      } finally {
        setSummaryLoading(false);
      }
    };

    loadContent();
    fetchSummary();
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
      <div className="flex items-center justify-center min-h-screen bg-[#0A0F1C]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-teal-400 animate-pulse text-lg">Preparing your learning journey...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0F1C]">
        <div className="text-center px-4 py-8 bg-red-900/20 border border-red-700/50 rounded-xl max-w-md">
          <p className="text-xl font-semibold text-red-300 mb-4">Failed to load content</p>
          <p className="text-red-200 mb-6">We couldn't retrieve the theory content. This might be due to a connection issue or the content might not be available.</p>
          <button
            onClick={() => navigate('/input')}
            className="px-6 py-3 bg-red-800/50 text-red-200 rounded-lg hover:bg-red-800/70 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const paragraphs = summary?.split('\n\n') || [];
  const filteredSections = content.sections.filter(section =>
    section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.theory.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.theory.tips.some(tip => tip.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Navbar title='Theory Master' icon={Book} />

      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 z-50"
        style={{ width: `${progress}%` }}
      />

      {/* Navigation header */}
      <div className="sticky top-0 bg-[#0A0F1C]/95 backdrop-blur-sm border-b border-slate-800 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={() => navigate('/input')}
            className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex-1 flex items-center justify-between sm:justify-end gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search content..."
                className="pl-10 pr-10 py-2 bg-slate-900/50 rounded-lg text-sm border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none w-full sm:w-64 text-slate-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                </button>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-slate-400">
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
            className="mb-6 p-4 bg-amber-900/20 border border-amber-700/50 rounded-xl text-amber-200"
          >
            <p className="text-sm">
              {errorMessage || 'Note: Using fallback content as we couldn\'t fetch the video-specific data. This is example content about Arrays and Data Structures.'}
            </p>
          </motion.div>
        )}

        {content.sections.length === 0 && !usedFallback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-900/20 border border-amber-700/50 rounded-xl text-amber-200"
          >
            <p className="text-sm">
              No sections were generated for this video. Showing main content details below.
            </p>
          </motion.div>
        )}

        <TheoryHeader content={content} />

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20">
                <Brain className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Content Summary
              </h2>
            </div>

            {summaryLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-300 text-sm">Generating summary...</p>
              </div>
            ) : summaryError ? (
              <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-semibold text-red-300">Error</h3>
                </div>
                <p className="text-red-200">{summaryError}</p>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">AI-Generated Summary</span>
                </div>

                <div className="prose prose-invert max-w-none">
                  {paragraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="mb-4 text-slate-300 leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <p className="text-slate-400 text-sm">
                    This summary was generated by AI based on the video content and may not capture every detail.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>

        {content.sections.length > 0 && (
          <div className="space-y-6">
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
                className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800"
              >
                <p className="text-slate-400">No sections match your search criteria</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Quick navigation */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white p-4 rounded-full shadow-lg transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowLeft className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}