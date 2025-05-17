import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { YouTubeLearningPortal } from './components/YouTubeInputCard';
// import { SummaryComponent } from './components/SummaryTab/SummaryTab';
import { MainLanding } from './components/Landing/Main-Landing';
// import { TheoryTab } from './components/SummaryTab/TheoryTab';
// import { HARDCODED_SUMMARY } from './components/SummaryTab/SummaryTab';
import { MainQuiz } from './components/Knowledge-Check/MainQuiz';
import { MainResources } from './components/Resources/MainResources';
import { CodePlayground } from './components/CodeDojo/Codeplayground';
import { CompetitiveArena } from './components/CP/CompetativeArena';
import { Signup } from './components/Auth/Signup';
import { Login } from './components/Auth/Login';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TheoryContent } from './components/Content/TheoryContent';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLanding />} />
          <Route path="/input" element={<YouTubeLearningPortal />} />
          <Route path="/content" element={<TheoryContent />} />
          {/* <Route path="/content2" element={<TheoryTab summary={HARDCODED_SUMMARY} />} /> */}
          <Route path="/code" element={<CodePlayground />} />
          {/* <Route path="/code" element={<CodeTab />} /> */}
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