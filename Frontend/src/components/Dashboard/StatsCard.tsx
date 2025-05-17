import { Trophy, Target, Brain, Zap, BookOpen, Code as CodeIcon, Medal, ChevronUp, Brackets, Database, Layout, Lock } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface StatsCardProps {
  quizzesCompleted: number;
  accuracy: number;
  xpPoints: number;
  streak: number;
  timeSpent: number;
  achievements: number;
  recentActivities: Array<{
    type: string;
    title: string;
    timestamp: string;
  }>;
  recommendedQuizzes: Array<{
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
  }>;
}

const progressData = [
  { name: 'Week 1', xp: 240 },
  { name: 'Week 2', xp: 450 },
  { name: 'Week 3', xp: 650 },
  { name: 'Week 4', xp: 890 },
];

const topicProgressData = [
  { name: 'Arrays', completed: 24, total: 30 },
  { name: 'Objects', completed: 18, total: 25 },
  { name: 'Functions', completed: 15, total: 20 },
  { name: 'DOM', completed: 12, total: 15 },
  { name: 'Async', completed: 8, total: 12 },
];

const leaderboardData = [
  { rank: 1, name: 'Sarah Chen', xp: 4850, change: 'up' },
  { rank: 2, name: 'Kafia', xp: 3750, change: 'same' },
  { rank: 3, name: 'Mike Smith', xp: 3600, change: 'up' },
  { rank: 4, name: 'Emma Davis', xp: 3400, change: 'down' },
  { rank: 5, name: 'James Wilson', xp: 3200, change: 'up' },
];

const categoryStats = [
  { category: 'Arrays & Strings', icon: Brackets, solved: 45, total: 60, color: 'text-blue-400' },
  { category: 'Database Design', icon: Database, solved: 28, total: 40, color: 'text-purple-400' },
  { category: 'Stacks and Queues', icon: Layout, solved: 35, total: 50, color: 'text-green-400' },
  { category: 'Number Theory', icon: Lock, solved: 20, total: 30, color: 'text-red-400' },
];

export function StatsCard({
  quizzesCompleted,
  accuracy,
  xpPoints,
  streak,
  recentActivities,
  recommendedQuizzes,
}: StatsCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Stats */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300">Quizzes</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{quizzesCompleted}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{accuracy}%</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300">XP Points</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{xpPoints}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Streak</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{streak} days</p>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Category Progress</h3>
        <div className="space-y-4">
          {categoryStats.map((category, index) => {
            const Icon = category.icon;
            const progress = (category.solved / category.total) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${category.color}`} />
                    <span className="text-white">{category.category}</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {category.solved}/{category.total}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className={`h-full rounded-full ${category.color.replace('text', 'bg')}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Progress Chart */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Topic Progress</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="completed" fill="#8b5cf6" />
              <Bar dataKey="total" fill="#4B5563" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Global Leaderboard */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Global Leaderboard</h3>
        <div className="space-y-3">
          {leaderboardData.map((player, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                player.name === 'Kafia' ? 'bg-purple-500/20' : 'bg-gray-700/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-400' :
                    index === 2 ? 'bg-orange-400/20 text-orange-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    <Medal className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{player.name}</p>
                    <p className="text-sm text-gray-400">{player.xp.toLocaleString()} XP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-white">#{player.rank}</span>
                  {player.change === 'up' && <ChevronUp className="w-5 h-5 text-green-400" />}
                  {player.change === 'down' && <ChevronUp className="w-5 h-5 text-red-400 transform rotate-180" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP Progress Chart */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">XP Progress</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="xpColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#xpColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/30">
              {activity.type === 'quiz' ? (
                <BookOpen className="w-5 h-5 text-green-400 mt-1" />
              ) : (
                <CodeIcon className="w-5 h-5 text-blue-400 mt-1" />
              )}
              <div>
                <p className="text-white font-medium">{activity.title}</p>
                <p className="text-sm text-gray-400">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Quizzes */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Recommended Quizzes</h3>
        <div className="space-y-3">
          {recommendedQuizzes.map((quiz, index) => (
            <div key={index} className="p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium">{quiz.title}</h4>
                  <p className="text-sm text-gray-400">{quiz.duration}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  quiz.difficulty === 'Beginner' ? 'bg-green-400/10 text-green-400' :
                  quiz.difficulty === 'Intermediate' ? 'bg-yellow-400/10 text-yellow-400' :
                  'bg-red-400/10 text-red-400'
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}