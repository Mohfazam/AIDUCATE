import { motion } from "framer-motion";
import { Sparkles, Bookmark } from "lucide-react";

interface Tip {
  emoji: string;
  tip: string;
}

interface TrendingTopic {
  title: string;
  views: string;
  category: string;
}

const tips: Tip[] = [
  {
    emoji: "💡",
    tip: "Break down complex problems into smaller, manageable pieces",
  },
  {
    emoji: "🚀",
    tip: "Practice coding regularly, even if just for 30 minutes a day",
  },
  {
    emoji: "📚",
    tip: "Read documentation thoroughly before starting a new project",
  },
  {
    emoji: "🎯",
    tip: "Focus on understanding concepts rather than memorizing solutions",
  },
  {
    emoji: "🤝",
    tip: "Join coding communities and participate in discussions",
  },
  { emoji: "✍️", tip: "Document your code and maintain a learning journal" },
  { emoji: "🔄", tip: "Review and refactor your code regularly" },
  { emoji: "⏰", tip: "Set specific learning goals with deadlines" },
];

const trendingTopics: TrendingTopic[] = [
  {
    title: "React Hooks Deep Dive",
    views: "2.5k",
    category: "Web Development",
  },
  {
    title: "System Design Fundamentals",
    views: "1.8k",
    category: "Architecture",
  },
  { title: "GraphQL vs REST", views: "1.2k", category: "API Design" },
];

export default function StudyTips() {
  return (
    <aside className="space-y-8 sticky top-8">
      {/* Trending Topics */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold">Trending Now</h2>
        </div>
        <div className="space-y-4">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <h3 className="font-medium group-hover:text-purple-400 transition-colors">
                {topic.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>{topic.views} views</span>
                <span>•</span>
                <span>{topic.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold mb-6">Study Tips</h2>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <span className="text-2xl">{tip.emoji}</span>
              <p className="text-gray-300">{tip.tip}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bookmarked Resources */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-2 mb-6">
          <Bookmark className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold">Bookmarked</h2>
        </div>
        <p className="text-gray-400 text-sm">
          Your bookmarked resources will appear here for access.
        </p>
      </div>
    </aside>
  );
}
