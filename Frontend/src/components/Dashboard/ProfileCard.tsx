import { User, Crown, Calendar, Award, Star, Code, Brain } from 'lucide-react';

interface Badge {
  name: string;
  icon: typeof User | typeof Award | typeof Star | typeof Code | typeof Brain;
  color: string;
}

interface ProfileCardProps {
  name: string;
  email: string;
  memberSince: string;
  subscriptionStatus?: 'Premium' | 'Basic';
  badges: Badge[];
}

export function ProfileCard({
  name,
  email,
  memberSince,
  subscriptionStatus,
  badges,
}: ProfileCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center">
          <User className="w-12 h-12 text-purple-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            {subscriptionStatus === 'Premium' && (
              <Crown className="w-6 h-6 text-yellow-400" />
            )}
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <User className="w-4 h-4" />
            <span>{email}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 mt-1">
            <Calendar className="w-4 h-4" />
            <span>Member since {memberSince}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Earned Badges</h3>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => {
            const BadgeIcon = badge.icon;
            return (
              <div
                key={index}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${badge.color}`}
              >
                <BadgeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm ${
          subscriptionStatus === 'Premium' 
            ? 'bg-yellow-400/10 text-yellow-400'
            : 'bg-blue-400/10 text-blue-400'
        }`}>
          {subscriptionStatus} Plan
        </span>
        <div className="flex items-center space-x-2">
          {subscriptionStatus === 'Premium' && (
            <Award className="w-5 h-5 text-yellow-400" />
          )}
          <Star className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      {/* Example additional section */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Skills</h3>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1 text-gray-300">
            <Code className="w-4 h-4 text-blue-400" />
            <span>Coding</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-300">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Problem Solving</span>
          </div>
        </div>
      </div>
    </div>
  );
}