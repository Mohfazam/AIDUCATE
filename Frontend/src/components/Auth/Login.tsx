import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    },
    tap: {
      scale: 0.95
    },
    disabled: {
      opacity: 0.6,
      cursor: "not-allowed"
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://eduplaybackend.vercel.app/Login', {
        username,
        password
      });

      if (response.data.success) {
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        
        // Show success message
        toast.success('Login successful!');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute w-96 h-96 bg-purple-500 rounded-full filter blur-3xl top-20 -left-20 opacity-20"
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
      >
        <motion.div variants={itemVariants}>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{' '}
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              create a new account
            </motion.a>
          </p>
        </motion.div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg flex items-center"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <motion.form variants={itemVariants} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <motion.div variants={itemVariants}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Username"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="#" 
              className="text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              Forgot your password?
            </motion.a>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              whileHover={isLoading ? {} : "hover"}
              whileTap={isLoading ? {} : "tap"}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                isLoading ? "bg-purple-700" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};