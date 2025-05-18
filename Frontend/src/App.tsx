import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { YouTubeLearningPortal } from './components/YtInput/YouTubeInputCard';
import { MainLanding } from './components/Landing/Main-Landing';
import { MainQuiz } from './components/Knowledge-Check/MainQuiz';
import { MainResources } from './components/Resources/MainResources';
import { CodePlayground } from './components/CodeDojo/Codeplayground';
import { CompetitiveArena } from './components/CP/CompetativeArena';
import { Signup } from './components/Auth/Signup';
import { Login } from './components/Auth/Login';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TheoryContent } from './components/Content/TheoryContent';
// import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLanding />} />
          <Route path="/input" element={<YouTubeLearningPortal />} />
          <Route
            path="/content"
            element={
                <TheoryContent />
            }
          />
          <Route path="/code" element={<CodePlayground />} />
          <Route path="/cp" element={<CompetitiveArena />} />
          <Route path="/kc" element={<MainQuiz />} />
          <Route path="/rh" element={<MainResources />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;