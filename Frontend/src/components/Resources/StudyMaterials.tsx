import { motion } from 'framer-motion';
import { Search, Book, Network, Database, Code, Terminal, Download } from 'lucide-react';
import { useState } from 'react';

const materials = [
  {
    id: 1,
    title: 'Data Structures & Algorithms',
    icon: <Code className="w-6 h-6" />,
    description: 'Master the fundamentals of DSA with comprehensive guides and examples.',
    downloadLink: 'https://ggnindia.dronacharya.info/Downloads/Sub-info/RelatedBook/Data-Structure-Algorithms-Text-Book-1.pdf',
    fileName: 'data-structures-algorithms.pdf',
    category: 'dsa'
  },
  {
    id: 2,
    title: 'Operating Systems',
    icon: <Terminal className="w-6 h-6" />,
    description: 'Learn about process management, scheduling, and memory allocation.',
    downloadLink: 'https://www.cl.cam.ac.uk/teaching/1011/OpSystems/os1a-slides.pdf',
    fileName: 'operating-systems-guide.pdf',
    category: 'os'
  },
  {
    id: 3,
    title: 'Computer Networks',
    icon: <Network className="w-6 h-6" />,
    description: 'Understand networking protocols, architecture, and implementation.',
    downloadLink: 'https://www.vssut.ac.in/lecture_notes/lecture1423905560.pdf',
    fileName: 'computer-networks.pdf',
    category: 'networks'
  },
  {
    id: 4,
    title: 'Database Management Systems',
    icon: <Database className="w-6 h-6" />,
    description: 'Explore relational databases, SQL, and database design principles.',
    downloadLink: 'https://mrcet.com/downloads/digital_notes/CSE/II%20Year/DBMS.pdf',
    fileName: 'database-systems.pdf',
    category: 'dbms'
  },
  {
    id: 5,
    title: 'Software Engineering',
    icon: <Book className="w-6 h-6" />,
    description: 'Learn software development lifecycle, design patterns, and best practices.',
    downloadLink: 'https://www.vssut.ac.in/lecture_notes/lecture1428551142.pdf',
    fileName: 'software-engineering.pdf',
    category: 'se'
  }
];

export default function StudyMaterials() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (downloadLink: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Study Materials</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                  {material.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{material.title}</h3>
              </div>
              <p className="text-gray-400 mb-4">{material.description}</p>
              <button
                onClick={() => handleDownload(material.downloadLink, material.fileName)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}