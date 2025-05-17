import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Engineer",
      quote: "AIDUCATE transformed how I approach learning. The gamification elements make even complex topics engaging and fun.",
      rating: 5,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Maria Garcia",
      role: "Student",
      quote: "The interactive quizzes and AI-powered recommendations helped me improve my grades significantly.",
      rating: 5,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "James Wilson",
      role: "Teacher",
      quote: "As an educator, I've seen firsthand how AIDUCATE increases student engagement and retention.",
      rating: 5,
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      quote: "The personalized learning paths helped me acquire new skills quickly, even with my busy schedule.",
      rating: 5,
      color: "from-rose-500 to-red-500"
    },
    {
      name: "David Chen",
      role: "Data Scientist",
      quote: "AIDUCATE's AI-powered feedback on my coding exercises was incredibly helpful. It's like having a personal tutor available 24/7.",
      rating: 5,
      color: "from-amber-500 to-yellow-500"
    },
    {
      name: "Emily Patel",
      role: "Healthcare Professional",
      quote: "The platform made continuing education enjoyable rather than a chore. I've recommended it to all my colleagues.",
      rating: 5,
      color: "from-indigo-500 to-violet-500"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 3;

  const nextTestimonials = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + testimonialsPerPage >= testimonials.length 
        ? 0 
        : prevIndex + testimonialsPerPage
    );
  };

  const prevTestimonials = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - testimonialsPerPage < 0 
        ? Math.max(0, testimonials.length - testimonialsPerPage) 
        : prevIndex - testimonialsPerPage
    );
  };

  const currentTestimonials = testimonials.slice(
    currentIndex,
    Math.min(currentIndex + testimonialsPerPage, testimonials.length)
  );

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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  // Track the slide direction for animations
  const [slideDirection, setSlideDirection] = useState(0);

  const handleNext = () => {
    setSlideDirection(1);
    nextTestimonials();
  };

  const handlePrev = () => {
    setSlideDirection(-1);
    prevTestimonials();
  };

  // Calculate total pages
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const currentPage = Math.floor(currentIndex / testimonialsPerPage) + 1;

  return (
    <section className="relative py-20 flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-slate-900 to-black"></div>
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
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
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              What Our Users
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"> Say</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their educational journey with AIDUCATE.
            </p>
          </motion.div>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <AnimatePresence custom={slideDirection} mode="wait">
            <motion.div
              key={currentIndex}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {currentTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative"
                >
                  <div className="h-full rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 transform hover:shadow-xl hover:shadow-purple-500/20">
                    <div className="flex items-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.color} p-4 flex items-center justify-center shadow-lg`}
                      >
                        <User className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-white">{testimonial.name}</h3>
                        <p className="text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.2, y: -2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-600/20" />
                      <p className="text-gray-300 italic pl-6">{testimonial.quote}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10">
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: currentPage === index + 1 ? 1.2 : 1,
                    backgroundColor: currentPage === index + 1 ? 'rgb(168, 85, 247)' : 'rgba(255, 255, 255, 0.3)'
                  }}
                  className="w-3 h-3 rounded-full cursor-pointer"
                  onClick={() => {
                    const newIndex = index * testimonialsPerPage;
                    setSlideDirection(newIndex > currentIndex ? 1 : -1);
                    setCurrentIndex(newIndex);
                  }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};