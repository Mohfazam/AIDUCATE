// MainResources.tsx
import { useState } from 'react';
import LearningResources from './LearningResources';
import QuizSection from './QuizSection';
import ResourceCategories from './ResourceCategories';
import ResourceList from './ResourceList';
import StudyMaterials from './StudyMaterials';
import StudyTips from './StudyTips';
import { Navbar } from '../Navbar';
import { BookOpen } from 'lucide-react';

export const MainResources = () => {
  const [selectedCategory, setSelectedCategory] = useState('dsa'); // Default category

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-white">
      <Navbar 
        title="Resources" 
        icon={BookOpen}
      />
      <main className="flex-grow overflow-y-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <ResourceCategories 
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
            <StudyTips />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <LearningResources />
            <ResourceList 
              selectedCategory={selectedCategory}
              difficulty="all"      // Default prop
              searchQuery=""        // Default prop
            />
            <QuizSection />
            <StudyMaterials />
          </div>
        </div>
      </main>
    </div>
  );
};