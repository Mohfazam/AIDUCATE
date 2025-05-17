import { Award, Star, Code, Brain } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { StatsCard } from './StatsCard';
import { Navbar } from '../Navbar';

export function Dashboard() {
  const profileData = {
    name: 'Kafia',
    email: 'Kafia@gmail.com',
    memberSince: '12-03-2025',
    subscriptionStatus: 'Premium' as const,
    badges: [
      { name: 'Quiz Master', icon: Award, color: 'bg-yellow-400/10 text-yellow-400' },
      { name: 'Code Explorer', icon: Code, color: 'bg-blue-400/10 text-blue-400' },
      { name: 'Fast Learner', icon: Brain, color: 'bg-purple-400/10 text-purple-400' },
      { name: 'Top Performer', icon: Star, color: 'bg-green-400/10 text-green-400' },
    ],
  };

  const statsData = {
    quizzesCompleted: 48,
    accuracy: 92,
    xpPoints: 3750,
    streak: 15,
    timeSpent: 45,
    achievements: 12,
    recentActivities: [
      {
        type: 'quiz',
        title: 'Completed Python Basics Quiz',
        timestamp: '2 hours ago',
      },
      {
        type: 'course',
        title: 'Watched AI Ethics Video',
        timestamp: '4 hours ago',
      },
      {
        type: 'quiz',
        title: 'Completed JavaScript Arrays Quiz',
        timestamp: 'Yesterday',
      },
    ],
    recommendedQuizzes: [
      {
        title: 'React Fundamentals',
        difficulty: 'Intermediate' as const,
        duration: '30 mins',
      },
      {
        title: 'Data Structures in JS',
        difficulty: 'Advanced' as const,
        duration: '45 mins',
      },
      {
        title: 'HTML & CSS Basics',
        difficulty: 'Beginner' as const,
        duration: '20 mins',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <Navbar title='Dashboard' icon={Award}/>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <ProfileCard {...profileData} />
          <StatsCard {...statsData} />
        </div>
      </div>
    </div>
  );
}