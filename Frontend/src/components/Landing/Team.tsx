import { motion } from 'framer-motion';
import { Linkedin, Twitter, User } from 'lucide-react';

export const Team = () => {
  const teamMembers = [
    {
      name: 'Mohammad Sarwar Khan',
      role: 'Team Lead',
      bio: 'Driving technical excellence in full-stack development, specializing in scalable MERN solutions and system architecture design.',
      social: { linkedin: 'https://www.linkedin.com/in/mohammed-sarwar-khan/', twitter: 'https://x.com/mohfazam' },
      leadership: true,
      icon: <User className="w-12 h-12 text-white" />, // Male icon
      color: "from-blue-500 to-cyan-500" // Slightly different blue gradient for male
    },
    {
      name: 'Md Mubashiruddin',
      role: 'Frontend Developer',
      bio: "Expert in crafting responsive and dynamic user interfaces using modern JavaScript frameworks and best UI practices.",
      social: { linkedin: 'https://www.linkedin.com/in/md-mubashiruddin/', twitter: 'https://x.com/amaanx_6' },
      icon: <User className="w-12 h-12 text-white" />, // Male icon
      color: "from-blue-600 to-indigo-500" // Blue-toned gradient for male
    },
    {
      name: 'Mohammed Talha Ahmed',
      role: 'Backend Developer',
      bio: 'Skilled in building scalable and secure server-side architectures with robust API integrations and database management.',
      social: { linkedin: 'https://www.linkedin.com/in/mohammed-talha-ahmed-6871a42ab/', twitter: 'https://x.com/mohfazam' },
      icon: <User className="w-12 h-12 text-white" />, // Male icon
      color: "from-blue-500 to-cyan-500" // Slightly different blue gradient for male
    },
    {
      name: 'Uzma Fatima',
      role: 'Researcher and Presenter',
      bio: 'Spearheading technology research and innovation strategies for cutting-edge solutions.',
      social: { linkedin: 'https://www.linkedin.com/in/uzma-fatima-5b111629b/', twitter: 'https://x.com/KauserKafia' },
      icon: <User className="w-12 h-12 text-white" />, // Female icon
      color: "from-pink-500 to-rose-500" // Pink-toned gradient for female
    },
    {
      name: 'Habeeba Khatoon',
      role: 'UI/UX Designer',
      bio: 'Specializes in designing intuitive and user-centric interfaces that enhance usability and user satisfaction.',
      social: { linkedin: 'ttps://www.linkedin.com/in/habeeba-khatoon18/', twitter: 'https://x.com/mnuma0_0' },
      icon: <User className="w-12 h-12 text-white" />, // Female icon
      color: "from-rose-600 to-pink-400" // Slightly different pink gradient for female
    },
  ];

  const textGlow = {
    hidden: { textShadow: "0 0 0px rgba(59, 130, 246, 0)" },
    visible: {
      textShadow: "0 0 12px rgba(59, 130, 246, 0.3)",
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const // Explicitly type as "reverse"
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-900">
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.h1
            initial="hidden"
            whileInView="visible"
            variants={textGlow}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            AIDUCATE
          </motion.h1>
          <p className="text-xl text-gray-400">Unified Excellence in Technical Innovation</p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative group"
            >
              <div className={`h-full bg-gray-800 rounded-xl p-6 border border-gray-700 
                transition-all duration-300 hover:bg-gray-700 hover:shadow-xl 
                ${member.leadership ? 'hover:border-blue-500/30' : 'hover:border-gray-600'}`}>

                {/* Leadership Accent */}
                {member.leadership && (
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1 }}
                    className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                  />
                )}

                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 mb-6 rounded-full bg-gradient-to-br ${member.color} 
                    flex items-center justify-center shadow-lg`}>
                    {member.icon}
                  </div>

                  <h3 className={`text-xl text-center font-semibold mb-2 
                    ${member.leadership ? 'text-blue-400' : 'text-white'}`}>
                    {member.name}
                  </h3>
                  
                  <p className="text-sm text-blue-400 font-medium mb-4 uppercase text-center tracking-wide">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-400 text-sm text-center mb-6 line-clamp-4">
                    {member.bio}
                  </p>

                  <div className="flex gap-4 opacity-80 hover:opacity-100 transition-opacity">
                    <a href={member.social.linkedin} target="_blank" rel="noopener">
                      <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" />
                    </a>
                    <a href={member.social.twitter} target="_blank" rel="noopener">
                      <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};