import { motion } from 'framer-motion';
import { Gamepad2, Brain, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {

  const Navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const handleGetStarted = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (isAuthenticated) {
    Navigate('/input');
  } else {
    const nestedRedirect = encodeURIComponent('/login?redirect=/input');
    Navigate(`/signup?redirect=${nestedRedirect}`);
  }
};


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-slate-900 to-black"></div>
      
      {/* Animated circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute w-96 h-96 bg-purple-500 rounded-full filter blur-3xl -top-20 -left-20"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
          rotate: [0, -90, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 4
        }}
        className="absolute w-96 h-96 bg-blue-500 rounded-full filter blur-3xl -bottom-20 -right-20"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl md:text-7xl mt-10 font-bold text-white mb-8">
              Learning Made 
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"> Playful</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Transform your educational journey with gamified learning experiences that make every lesson an adventure.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.button
              variants={buttonVariants}
               onClick={handleGetStarted}
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Get Started Free
            </motion.button>
            
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: <Gamepad2 className="w-8 h-8 text-purple-400" />, title: "Gamified Learning", desc: "Learn through play and earn rewards" },
              { icon: <Brain className="w-8 h-8 text-blue-400" />, title: "AI-Powered", desc: "Personalized learning paths" },
              { icon: <Rocket className="w-8 h-8 text-pink-400" />, title: "Track Progress", desc: "Monitor your growth" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:shadow-xl hover:shadow-purple-500/20"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center text-center gap-4"
                >
                  {item.icon}
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};