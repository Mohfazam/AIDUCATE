import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Rocket, Book, Code, ArrowUp } from 'lucide-react';
import { useState } from 'react';

const roadmap = [
  {
    level: "Beginner",
    icon: <Book className="w-6 h-6" />,
    steps: [
      "Learn basic programming concepts",
      "Understand variables and data types",
      "Master control structures and loops",
      "Practice basic problem-solving"
    ]
  },
  {
    level: "Intermediate",
    icon: <Code className="w-6 h-6" />,
    steps: [
      "Study data structures in depth",
      "Learn algorithm analysis",
      "Practice coding challenges",
      "Build small projects"
    ]
  },
  {
    level: "Advanced",
    icon: <Rocket className="w-6 h-6" />,
    steps: [
      "Master system design principles",
      "Learn optimization techniques",
      "Contribute to open source",
      "Build complex applications"
    ]
  }
];

const faqs = [
  {
    question: "What is the best way to learn Data Structures?",
    answer: "Start with basic data structures like arrays and linked lists, understand their operations and time complexity, then progress to more complex structures. Practice implementing them from scratch and solve related problems."
  },
  {
    question: "How can I practice coding effectively?",
    answer: "Set aside regular time for coding practice, use platforms like LeetCode or HackerRank, start with easy problems and gradually increase difficulty, and always review and optimize your solutions."
  },
  {
    question: "What are the top resources for DSA?",
    answer: "Popular resources include GeeksforGeeks, Introduction to Algorithms (CLRS book), competitive programming websites, and YouTube channels like mycodeschool and Abdul Bari."
  }
];

const funFacts = [
  "The term 'algorithm' comes from the name of Persian mathematician Al-Khwarizmi",
  "The first computer bug was an actual moth found in the Mark II computer in 1947",
  "The Big O notation was introduced by German mathematician Paul Bachmann in 1894"
];

export default function LearningResources() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show scroll-to-top button when scrolling down
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowScrollTop(window.scrollY > 300);
    });
  }

  return (
    <section className="py-12 relative">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Learning Roadmap</h2>
          <div className="space-y-6">
            {roadmap.map((stage, index) => (
              <motion.div
                key={stage.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                    {stage.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{stage.level}</h3>
                </div>
                <ul className="space-y-2">
                  {stage.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden"
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-purple-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-500" />
                  )}
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: expandedFaq === index ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-gray-300">{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Did You Know?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {funFacts.map((fact, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
              >
                <p className="text-gray-300">{fact}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-colors"
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </div>
    </section>
  );
}