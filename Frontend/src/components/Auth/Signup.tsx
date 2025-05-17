import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Eye, EyeOff, UserPlus, AlertCircle, Check } from 'lucide-react';

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength when password field changes
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 2) {
      setError('Please use a stronger password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://eduplaybackend.vercel.app/Signup', {
        username: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Check for 200 status code as successful response
      if (response.status === 200) {
        // Show success message
        toast.success('Account created successfully!');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(response.data.msg || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-violet-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8 overflow-hidden h-fit w-full">
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
        className="absolute w-96 h-96 bg-blue-500 rounded-full filter blur-3xl -bottom-20 -right-20 opacity-20"
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
      >
        <motion.div variants={itemVariants}>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              Sign in
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Full Name"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Email address"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
              
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-400">Password strength:</div>
                    <div className="text-xs font-medium" style={{ color: getStrengthColor() }}>
                      {getStrengthText()}
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()}`} 
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center text-xs text-gray-400">
                      <Check className={`h-3 w-3 mr-1 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-600'}`} />
                      <span>Capital letter</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Check className={`h-3 w-3 mr-1 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-600'}`} />
                      <span>Number</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Check className={`h-3 w-3 mr-1 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-600'}`} />
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Check className={`h-3 w-3 mr-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-600'}`} />
                      <span>Special character</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Confirm Password"
              />
              {formData.password && formData.confirmPassword && (
                <div className="mt-1 flex items-center">
                  {formData.password === formData.confirmPassword ? (
                    <span className="text-xs text-green-500 flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" /> Passwords don't match
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </div>

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
                <UserPlus className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Creating account..." : "Sign up"}
            </motion.button>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-xs text-center text-gray-400 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
};