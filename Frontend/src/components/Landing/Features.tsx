import { motion } from 'framer-motion';
import { Trophy, Users, Brain, BarChart as ChartBar, Gift, Sparkles } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: "Gamification Mechanics",
      description: "Earn points, badges, and climb leaderboards as you learn. Complete challenges to level up your skills.",
      items: ["Points System", "Achievement Badges", "Global Leaderboards", "Level Progression"]
    },
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "Interactive Learning",
      description: "Engage with AI-generated content and interactive exercises that adapt to your learning style.",
      items: ["AI Quizzes", "Role-Playing", "Simulations", "Adaptive Learning"]
    },
    {
      icon: <Gift className="w-8 h-8 text-pink-400" />,
      title: "Rewards & Incentives",
      description: "Unlock exclusive content and earn virtual currency as you progress through your learning journey.",
      items: ["Virtual Currency", "Premium Content", "Special Badges", "Learning Streaks"]
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Social Learning",
      description: "Connect with peers, participate in team challenges, and learn together in a collaborative environment.",
      items: ["Team Challenges", "Discussion Forums", "Peer Recognition", "Group Projects"]
    },
    {
      icon: <ChartBar className="w-8 h-8 text-purple-400" />,
      title: "Analytics",
      description: "Track your progress with detailed analytics and identify areas for improvement.",
      items: ["Progress Tracking", "Skill Analysis", "Performance Metrics", "Learning Insights"]
    },
    {
      icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
      title: "AI-Powered Support",
      description: "Get personalized assistance and recommendations powered by advanced AI technology.",
      items: ["24/7 AI Tutor", "Smart Recommendations", "Personalized Path", "Instant Feedback"]
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"> Enhanced Learning</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover all the tools and features that make EduPlay the perfect platform for your learning journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  {feature.icon}
                  <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
                <ul className="grid grid-cols-2 gap-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};