import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hand, MousePointer } from 'lucide-react';

interface CustomCursorProps {
  color?: string;
}
// @ts-ignore
export const CustomCursor: React.FC<CustomCursorProps> = ({ 
  color = 'rgba(168, 85, 247, 0.5)' 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  // @ts-ignore
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set new timeout
      const timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Adjust this value to control how long the hand cursor stays after scrolling stops
      
      setScrollTimeout(timeout);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    clicking: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 0.8,
    },
  };

  const dotVariants = {
    default: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      scale: 1,
    },
    clicking: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      scale: 0.5,
    },
  };

  if (typeof window === 'undefined' || !isVisible) return null;

  return (
    <div className="cursor-none pointer-events-none fixed inset-0 z-50">
      <motion.div
        className="w-8 h-8 rounded-full border border-white mix-blend-difference fixed top-0 left-0 flex items-center justify-center"
        variants={variants}
        animate={isClicking ? 'clicking' : 'default'}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        {isScrolling ? (
          <Hand className="w-4 h-4 text-white" />
        ) : (
          <MousePointer className="w-4 h-4 text-white" />
        )}
      </motion.div>
      <motion.div
        className="w-2 h-2 bg-white rounded-full fixed top-0 left-0 mix-blend-difference"
        variants={dotVariants}
        animate={isClicking ? 'clicking' : 'default'}
        transition={{ type: 'spring', stiffness: 700, damping: 28, mass: 0.5 }}
      />
    </div>
  );
};