import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  const links = {
    company: ['About', 'Careers', 'Press'],
    resources: ['Blog', 'Help Center', 'Guidelines'],
    legal: ['Privacy', 'Terms', 'Security'],
    social: [
      { icon: <Github className="w-5 h-5" />, href: 'https://github.com/Mohfazam/AIDUCATE' },
      { icon: <Twitter className="w-5 h-5" />, href: '#' },
      { icon: <Linkedin className="w-5 h-5" />, href: '#' },
      { icon: <Mail className="w-5 h-5" />, href: '#' }
    ]
  };

  return (
    <footer className="relative bg-slate-900">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-1"
          >
            <h3 className="text-2xl font-bold text-white mb-6">AIDUCATE</h3>
            <p className="text-gray-400 mb-6">
              Making learning fun and engaging through gamification and interactive experiences.
            </p>
            <div className="flex space-x-4">
              {links.social.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {['company', 'resources', 'legal'].map((section, index) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="col-span-1"
            >
              <h4 className="text-lg font-semibold text-white mb-6 capitalize">{section}</h4>
              <ul className="space-y-4">
                {/* @ts-ignore */}
                {links[section].map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center"
        >
          <p className="text-gray-400">
            © {new Date().getFullYear()} AIDUCATE. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};