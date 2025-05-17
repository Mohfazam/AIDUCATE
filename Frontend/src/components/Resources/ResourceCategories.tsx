import { motion } from 'framer-motion';
import { Code, Globe, Brain, Shield, BookCheck, Trophy } from 'lucide-react';

const categories = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    icon: <Code className="w-5 h-5" />,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'web',
    title: 'Web Development',
    icon: <Globe className="w-5 h-5" />,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'ml',
    title: 'Machine Learning & AI',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30'
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    icon: <Shield className="w-5 h-5" />,
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30'
  },
  {
    id: 'best-practices',
    title: 'Software Development Best Practices',
    icon: <BookCheck className="w-5 h-5" />,
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/30'
  },
  {
    id: 'competitive',
    title: 'Competitive Programming',
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-indigo-500/20 to-violet-500/20',
    borderColor: 'border-indigo-500/30'
  }
];

interface ResourceCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function ResourceCategories({ selectedCategory, onSelectCategory }: ResourceCategoriesProps) {
  return (
    <section className="relative">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(category.id)}
            className={`
              w-full text-left p-4 rounded-lg border transition-all duration-200 min-h-[4.5rem]
              ${selectedCategory === category.id 
                ? `bg-gradient-to-br ${category.color} ${category.borderColor} shadow-lg` 
                : 'bg-gray-900/50 border-gray-800/50 hover:bg-gray-800/50'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                p-2 rounded-md transition-colors duration-200 flex-shrink-0
                ${selectedCategory === category.id 
                  ? 'bg-white/10' 
                  : 'bg-gray-800/80'
                }
              `}>
                {category.icon}
              </div>
              <span className={`
                text-xs font-medium text-gray-100 leading-tight
                ${selectedCategory === category.id ? 'line-clamp-3' : 'line-clamp-2'}
              `}>
                {category.title}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}