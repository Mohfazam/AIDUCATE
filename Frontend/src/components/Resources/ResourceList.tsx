import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Video, Link as LinkIcon, Download, Eye, Play, 
  Star, BookmarkPlus, BookmarkCheck, Trophy, Code as CodeIcon 
} from 'lucide-react';
import React from 'react';
import YouTube from 'react-youtube';

// Extended resource data with new fields
const resources = {
  dsa: [
    {
      id: 1,
      title: 'Complete DSA Guide',
      type: 'pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      preview: true,
      difficulty: 'intermediate',
      rating: 4.8,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80',
      description: 'Comprehensive guide covering all essential data structures and algorithms concepts.',
      quiz: [
        {
          question: 'What is the time complexity of QuickSort in average case?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
          correct: 1
        }
      ],
      codeSnippet: {
        language: 'typescript',
        code: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x <= pivot);
  const right = arr.slice(1).filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`
      }
    },
    {
      id: 2,
      title: 'Algorithm Visualization',
      type: 'video',
      url: 'dQw4w9WgXcQ',
      preview: true,
      difficulty: 'beginner',
      rating: 4.5,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80'
    }
  ],
};

// Learning paths data
const learningPaths = {
  dsa: [
    {
      title: 'Beginner DSA Path',
      steps: [
        'Basic Data Structures',
        'Time Complexity Analysis',
        'Sorting Algorithms',
        'Searching Algorithms'
      ]
    }
  ]
};

// Daily quotes
const quotes = [
  {
    text: "The best way to predict the future is to implement it.",
    author: "David Heinemeier Hansson"
  }
];

interface ResourceListProps {
  selectedCategory: string;
  difficulty: string;
  searchQuery: string;
}

// Helper function to get appropriate icon based on resource type
const getIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5" />;
    case 'video':
      return <Video className="w-5 h-5" />;
    default:
      return <LinkIcon className="w-5 h-5" />;
  }
};

// Helper function to get action buttons based on resource
const getActionButtons = (resource: any) => {
  const buttons = [];
  
  if (resource.preview) {
    buttons.push(
      <button
        key="preview"
        onClick={() => window.open(resource.url, '_blank')}
        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <Eye className="w-4 h-4 mr-1.5" />
        Preview
      </button>
    );
  }

  if (resource.type === 'pdf') {
    buttons.push(
      <button
        key="download"
        onClick={() => window.open(resource.url, '_blank')}
        className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <Download className="w-4 h-4 mr-1.5" />
        Download
      </button>
    );
  }

  if (resource.type === 'video') {
    buttons.push(
      <button
        key="play"
        onClick={() => window.open(`https://youtube.com/watch?v=${resource.url}`, '_blank')}
        className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <Play className="w-4 h-4 mr-1.5" />
        Play
      </button>
    );
  }

  return buttons;
};

export default function ResourceList({ selectedCategory, difficulty, searchQuery }: ResourceListProps) {
  const [selectedResource, setSelectedResource] = React.useState<any>(null);
  const [bookmarkedResources, setBookmarkedResources] = React.useState<number[]>([]);
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [quizAnswers, setQuizAnswers] = React.useState<number[]>([]);

  const filteredResources = React.useMemo(() => {
    return (resources[selectedCategory as keyof typeof resources] || []).filter(resource => {
      const matchesDifficulty = difficulty === 'all' || resource.difficulty === difficulty;
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, difficulty, searchQuery]);

  const toggleBookmark = (resourceId: number) => {
    setBookmarkedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  return (
    <section className="space-y-8">
      {/* Featured Resources */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.filter(r => r.featured).map(resource => (
            <motion.div
              key={`featured-${resource.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group overflow-hidden rounded-xl"
            >
              <img 
                src={resource.thumbnail} 
                alt={resource.title}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-200">{resource.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quote of the Day */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-8">
        <h3 className="text-lg font-semibold mb-2">💭 Quote of the Day</h3>
        <blockquote className="text-gray-300 italic">
          "{quotes[0].text}"
          <footer className="text-sm text-gray-400 mt-2">— {quotes[0].author}</footer>
        </blockquote>
      </div>

      {/* AI-Suggested Learning Path */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-8">
        <h3 className="text-lg font-semibold mb-4">🤖 Recommended Learning Path</h3>
        <div className="space-y-3">
          {learningPaths[selectedCategory as keyof typeof learningPaths]?.[0].steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                {index + 1}
              </div>
              <span className="text-gray-300">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Resources */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      {getIcon(resource.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      {resource.description && (
                        <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {bookmarkedResources.includes(resource.id) ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-sm px-2 py-1 bg-gray-700 rounded-full">
                    {resource.type.toUpperCase()}
                  </span>
                  <span className="text-sm px-2 py-1 bg-purple-500/20 rounded-full">
                    {resource.difficulty}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{resource.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getActionButtons(resource)}
                  {resource.quiz && (
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="inline-flex items-center px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      <Trophy className="w-4 h-4 mr-1.5" />
                      Take Quiz
                    </button>
                  )}
                  {resource.codeSnippet && (
                    <button
                      onClick={() => setSelectedResource(resource)}
                      className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      <CodeIcon className="w-4 h-4 mr-1.5" />
                      View Code
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Resource Preview Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{selectedResource.title}</h3>
                {selectedResource.description && (
                  <p className="text-gray-400 mb-4">{selectedResource.description}</p>
                )}
              </div>

              {selectedResource.type === 'pdf' ? (
                <iframe
                  src={`${selectedResource.url}#view=FitH`}
                  className="w-full h-[60vh] rounded-lg"
                  title={selectedResource.title}
                />
              ) : selectedResource.type === 'video' ? (
                <YouTube
                  videoId={selectedResource.url}
                  className="w-full aspect-video rounded-lg overflow-hidden"
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                />
              ) : selectedResource.codeSnippet ? (
                <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-gray-300">
                    {selectedResource.codeSnippet.code}
                  </code>
                </pre>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && selectedResource?.quiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuiz(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-6">Quick Quiz</h3>
              {selectedResource.quiz.map((q: any, index: number) => (
                <div key={index} className="mb-6">
                  <p className="text-lg mb-4">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option: string, optionIndex: number) => (
                      <button
                        key={optionIndex}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [index]: optionIndex }))}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          quizAnswers[index] === optionIndex
                            ? quizAnswers[index] === q.correct
                              ? 'bg-green-500/20 border-green-500'
                              : 'bg-red-500/20 border-red-500'
                            : 'bg-gray-700/50 hover:bg-gray-700'
                        } border border-gray-600`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}