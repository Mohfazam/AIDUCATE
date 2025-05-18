import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavProps {
  title: string;
  icon: React.ElementType;
}

const ProfileBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/signup');
  };

  return (
    <div className="relative ml-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-2"
      >
        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-2 space-y-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Your Dashboard</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = ({ title, icon: Icon }: NavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { scrollY } = useScroll();
  const navbarHeight = useTransform(scrollY, [0, 100], [80, 60]);
  const navbarOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(!!authStatus);
  }, []);

 const handleNavigation = (path: string) => {
  const authStatus = localStorage.getItem('isAuthenticated');
  if (authStatus) {
    navigate(path);
  } else {
    navigate('/signup');
  }
  setIsMobileMenuOpen(false);
};


  return (
    <motion.nav
      style={{ height: navbarHeight, opacity: navbarOpacity }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" 
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <motion.button
              onClick={() => handleNavigation('/')}
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </span>
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
            <motion.button
                onClick={() => handleNavigation('/')}
                className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
              >
                Home
              </motion.button>
              <motion.button
                onClick={() => handleNavigation('/content')}
                className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
              >
                Theory Mastery
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('/Code')}
                className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
              >
                Code Dojo
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('/cp')}
                className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
              >
                Competative Arena
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('/kc')}
                className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
              >
                Knowledge Check
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('/rh')}
                className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                whileHover={{ scale: 1.05 }}
              >
                Resource Hub
              </motion.button>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <ProfileBadge />
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </motion.button>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 transition-colors duration-200 md:hidden ml-4"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-2">
              <motion.button
                onClick={() => handleNavigation('/content')}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Theory Mastery
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('/Code')}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Code Dojo
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('/cp')}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Competative Arena
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('/kc')}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Knowledge Check
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('/rh')}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Resource Hub
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};