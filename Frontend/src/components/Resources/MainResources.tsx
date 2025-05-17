import { useState } from "react";
import LearningResources from "./LearningResources";
import QuizSection from "./QuizSection";
import ResourceCategories from "./ResourceCategories";
import ResourceList from "./ResourceList";
import StudyMaterials from "./StudyMaterials";
import StudyTips from "./StudyTips";
import { Navbar } from "../Navbar";
import { BookOpen, Library, TestTube, BookMarked } from "lucide-react";

export const MainResources = () => {
  const [selectedCategory, setSelectedCategory] = useState("dsa"); 
  const [activeTab, setActiveTab] = useState("all"); 

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "quiz":
        return <QuizSection />;
      case "study":
        return <StudyMaterials />;
      case "all":
      default:
        return (
          <div className="space-y-8">
            <LearningResources />
            <ResourceList
              selectedCategory={selectedCategory}
              difficulty="all"
              searchQuery=""
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-white">
      <Navbar title="Resources" icon={BookOpen} />
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

          {/* Main Content with Tabs */}
          <div className="lg:col-span-3">
            {/* Enhanced Tab Navigation */}
            <div className="flex flex-col sm:flex-row space-y-2  sm:ml-[10%] w-[80%] sm:space-x-4 mb-6 bg-gray-800/30 backdrop-blur-xl rounded-xl p-3 border border-gray-700/30 shadow-lg">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
                  activeTab === "all"
                    ? "bg-purple-600 text-white shadow-md scale-105"
                    : "bg-gray-700/50 text-gray-200 hover:bg-gray-600 hover:scale-102"
                }`}
              >
                <Library size={20} />
                <span>All Resources</span>
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
                  activeTab === "quiz"
                    ? "bg-purple-600 text-white shadow-md scale-105"
                    : "bg-gray-700/50 text-gray-200 hover:bg-gray-600 hover:scale-102"
                }`}
              >
                <TestTube size={20} />
                <span>Quiz</span>
              </button>
              <button
                onClick={() => setActiveTab("study")}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
                  activeTab === "study"
                    ? "bg-purple-600 text-white shadow-md scale-105"
                    : "bg-gray-700/50 text-gray-200 hover:bg-gray-600 hover:scale-102"
                }`}
              >
                <BookMarked size={20} />
                <span>Study Materials</span>
              </button>
            </div>
            {/* Tab Content */}
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};
