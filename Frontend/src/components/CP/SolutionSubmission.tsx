import React, { useState, useRef } from 'react';
import { LockKeyhole, Zap, CheckCircle, XCircle, Award, TrendingUp, Users, Trophy, Code, Beaker, RefreshCw, ChevronDown, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface TestCase {
  input: string;
  expected: string;
  passed: boolean | null;
  hidden: boolean;
}

interface SolutionSubmissionProps {
  testCases: any[];
}

export const SolutionSubmission: React.FC<SolutionSubmissionProps> = ({ testCases }) => {
  const [solution, setSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [solutionTestCases, setSolutionTestCases] = useState<TestCase[]>(
    testCases.map(tc => ({
      input: tc.input,
      expected: tc.output,
      passed: null,
      hidden: tc.hidden,
    }))
  );
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState('tests'); // 'tests', 'leaderboard', 'achievements'

  const leaderboard = [
    { rank: 1, name: 'AlgoMaster', score: 2850, solved: 42 },
    { rank: 2, name: 'CodeNinja', score: 2720, solved: 38 },
    { rank: 3, name: 'ByteWarrior', score: 2680, solved: 35 },
  ];

  const achievements = [
    { icon: <Award className="h-5 w-5 text-yellow-400" />, title: 'Problem Solver', description: 'Solved 50+ problems' },
    { icon: <TrendingUp className="h-5 w-5 text-green-400" />, title: 'Streak Master', description: '7 days coding streak' },
    { icon: <Users className="h-5 w-5 text-blue-400" />, title: 'Team Player', description: 'Helped 10+ developers' },
  ];

  // Simple syntax validation for real-time error checking
  const validateCode = (code: string, model: monaco.editor.ITextModel) => {
    const errors: monaco.editor.IMarkerData[] = [];

    // Check for common JavaScript syntax issues
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      // Detect missing semicolons (basic heuristic)
      if (line.trim().match(/^[a-zA-Z0-9\s]*=[^;]*$/)) {
        errors.push({
          severity: monaco.MarkerSeverity.Error,
          message: 'Missing semicolon.',
          startLineNumber: index + 1,
          startColumn: 1,
          endLineNumber: index + 1,
          endColumn: line.length + 1,
        });
      }
      // Detect undefined function calls (basic heuristic)
      if (line.match(/\b\w+\(/) && !line.match(/\b(function|let|const|var)\b/)) {
        const match = line.match(/\b(\w+)\(/);
        if (match && !['console', 'Math', 'Array', 'Object'].includes(match[1])) {
          errors.push({
            severity: monaco.MarkerSeverity.Warning,
            message: `Function '${match[1]}' may be undefined.`,
            startLineNumber: index + 1,
            startColumn: line.indexOf(match[1]) + 1,
            endLineNumber: index + 1,
            endColumn: line.indexOf(match[1]) + match[1].length + 1,
          });
        }
      }
    });

    // Set markers for errors
    monaco.editor.setModelMarkers(model, 'owner', errors);
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, _monacoInstance: typeof monaco) => {
    editorRef.current = editor;
    // Validate code on change
    editor.onDidChangeModelContent(() => {
      const model = editor.getModel();
      if (model) {
        validateCode(editor.getValue(), model);
      }
    });
    // Initial validation
    const model = editor.getModel();
    if (model) {
      validateCode(editor.getValue(), model);
    }
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newTestCases = solutionTestCases.map(test => ({
      ...test,
      passed: Math.random() > 0.5,
    }));

    setSolutionTestCases(newTestCases);
    setResult(newTestCases.every(test => test.passed) ? 'success' : 'error');
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 backdrop-blur-lg border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <LockKeyhole className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white">Two Sum Challenge</h3>
        </div>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-2 text-sm rounded-full px-3 py-1 ${
              result === 'success' 
              ? 'text-green-400 bg-green-900/20' 
              : 'text-red-400 bg-red-900/20'
            }`}
          >
            {result === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <span className="font-medium">
              {result === 'success' ? 'All tests passed!' : 'Some tests failed'}
            </span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-indigo-400" />
                <h4 className="font-medium text-gray-200">Solution Code</h4>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-2 border-b border-slate-700 bg-slate-800">
                <div className="flex items-center space-x-1">
                  <button 
                    className="p-1.5 rounded hover:bg-slate-700 text-gray-300 text-xs"
                    onClick={formatCode}
                  >
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Format</span>
                    </div>
                  </button>
                  
                  <button 
                    className="p-1.5 rounded hover:bg-slate-700 text-gray-300 text-xs"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  >
                    <div className="flex items-center gap-1.5">
                      <ChevronDown className="h-3.5 w-3.5" />
                      <span>Settings</span>
                    </div>
                  </button>
                  
                  <button 
                    className="p-1.5 rounded hover:bg-slate-700 text-gray-300 text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Docs</span>
                    </div>
                  </button>
                </div>
                
                <div className="text-xs text-gray-400 font-mono">
                  javascript
                </div>
              </div>
              
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-slate-700 p-3 bg-slate-800/70"
                  >
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div>
                        <label className="block text-gray-400 mb-1">Theme</label>
                        <select 
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                        >
                          <option value="vs-dark">Dark</option>
                          <option value="light">Light</option>
                          <option value="hc-black">High Contrast</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 mb-1">Font Size</label>
                        <select 
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                        >
                          {[12, 14, 16, 18, 20].map(size => (
                            <option key={size} value={size}>{size}px</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="w-full h-64 md:h-80 overflow-hidden border-0">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={solution}
                  onChange={(value) => setSolution(value || '')}
                  onMount={handleEditorDidMount}
                  theme={theme}
                  options={{
                    lineNumbers: 'on',
                    automaticLayout: true,
                    fontSize,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    autoIndent: 'full',
                    formatOnType: true,
                    formatOnPaste: true,
                    bracketPairColorization: { enabled: true },
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    tabSize: 2,
                    renderLineHighlight: 'all',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    folding: true,
                    foldingHighlight: true,
                    lineDecorationsWidth: 10,
                    //@ts-ignore
                    renderIndentGuides: true,
                    contextmenu: true
                  }}
                />
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Beaker className="h-4 w-4 text-indigo-400" />
                <h4 className="font-medium text-gray-200">Test Cases</h4>
              </div>
              
              {result && (
                <div className="text-sm text-gray-400">
                  {solutionTestCases.filter(tc => tc.passed).length}/{solutionTestCases.length} passing
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {solutionTestCases.map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border ${
                    test.passed === null
                      ? 'bg-slate-800/60 border-slate-700'
                      : test.passed
                      ? 'bg-green-900/10 border-green-800/30'
                      : 'bg-red-900/10 border-red-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-400 mr-2">Input:</span>
                        <code className="text-white font-mono bg-slate-700/50 px-1.5 py-0.5 rounded text-xs">
                          {test.input}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-400 mr-2">Expected:</span>
                        <code className="text-white font-mono bg-slate-700/50 px-1.5 py-0.5 rounded text-xs">
                          {test.expected}
                        </code>
                      </div>
                      
                      {test.passed === false && (
                        <div>
                          <span className="text-gray-400 mr-2">Actual:</span>
                          <code className="text-red-300 font-mono bg-red-900/30 px-1.5 py-0.5 rounded text-xs">
                            undefined
                          </code>
                        </div>
                      )}
                    </div>
                    
                    {test.passed !== null && (
                      <div className={`p-1 rounded-full ${test.passed ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                        {test.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {test.hidden && (
                    <div className="mt-2 text-xs text-amber-400 bg-amber-900/20 py-1 px-2 rounded inline-block">
                      Hidden test case
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 md:py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold transition-all duration-300 ${
              isSubmitting
                ? 'bg-slate-700/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-lg shadow-indigo-900/30'
            }`}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            <Zap className="h-5 w-5" />
            {isSubmitting ? 'Testing Solution...' : 'Submit Solution'}
          </motion.button>
        </div>

        <div className="space-y-8">
          {/* Tab Navigation */}
          <div className="border-b border-slate-700">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('tests')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'tests'
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Tests
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'leaderboard'
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'achievements'
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Achievements
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'tests' && (
              <motion.div
                key="tests"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">Problem Description</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Given an array of integers <code className="text-xs px-1 py-0.5 bg-slate-700 rounded">nums</code> and 
                    an integer <code className="text-xs px-1 py-0.5 bg-slate-700 rounded">target</code>, return 
                    <em className="text-indigo-300"> indices</em> of the two numbers such that they add up to target.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">
                      <span className="text-indigo-400 font-medium">Input:</span> Array of integers, target value
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="text-indigo-400 font-medium">Output:</span> Array with two indices
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="text-indigo-400 font-medium">Constraints:</span>
                      <ul className="list-disc list-inside ml-2 mt-1 space-y-1 text-xs text-gray-400">
                        <li>2 ≤ nums.length ≤ 10^4</li>
                        <li>-10^9 ≤ nums[i] ≤ 10^9</li>
                        <li>-10^9 ≤ target ≤ 10^9</li>
                        <li>Only one valid answer exists</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-lg">
                  <h4 className="text-indigo-300 font-medium flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4" />
                    Challenge Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <div className="text-indigo-400 mt-0.5">•</div>
                      <div>Consider using a hash map to improve efficiency</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="text-indigo-400 mt-0.5">•</div>
                      <div>Brute force approach works but has O(n²) time complexity</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="text-indigo-400 mt-0.5">•</div>
                      <div>Think about edge cases like duplicate numbers</div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Top Performers
                </h4>
                
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-3 p-3 text-xs font-medium text-gray-400 border-b border-slate-700 bg-slate-800">
                    <div>Rank</div>
                    <div>User</div>
                    <div>Score</div>
                  </div>
                  
                  <div className="divide-y divide-slate-700/60">
                    {leaderboard.map((user, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="grid grid-cols-[auto_1fr_auto] gap-3 p-3 items-center hover:bg-slate-800/40 transition-colors duration-200"
                      >
                        <div>
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                            ${index === 0 
                              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' 
                              : index === 1 
                                ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' 
                                : 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100'
                            }
                          `}>
                            {user.rank}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.solved} problems solved</div>
                        </div>
                        
                        <div>
                          <div className="font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            {user.score}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                  <h5 className="text-indigo-400 text-sm font-medium mb-3">Your Stats</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-900/70 rounded-lg text-center">
                      <div className="text-2xl font-semibold text-white">24</div>
                      <div className="text-xs text-gray-400 mt-1">Problems Solved</div>
                    </div>
                    <div className="p-3 bg-slate-900/70 rounded-lg text-center">
                      <div className="text-2xl font-semibold text-white">1905</div>
                      <div className="text-xs text-gray-400 mt-1">Total Score</div>
                    </div>
                    <div className="p-3 bg-slate-900/70 rounded-lg text-center">
                      <div className="text-2xl font-semibold text-white">15</div>
                      <div className="text-xs text-gray-400 mt-1">Global Rank</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-400" />
                  Your Achievements
                </h4>
                
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 transition-colors duration-200"
                    >
                      <div className="p-2 rounded-lg bg-slate-900/60">
                        {achievement.icon}
                      </div>
                      <div>
                        <h5 className="text-white font-medium">{achievement.title}</h5>
                        <div className="text-sm text-gray-400 mt-0.5">{achievement.description}</div>
                        <div className="mt-2 w-full bg-slate-700/50 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                            style={{ width: `${80 - index * 20}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border border-indigo-800/30 bg-indigo-900/10"
                >
                  <h5 className="text-indigo-300 font-medium mb-3">Upcoming Achievement</h5>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-slate-900/60 opacity-50">
                    {/* @ts-ignore */}
                      <Star className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium">Algorithm Master</h5>
                      <div className="text-sm text-gray-400 mt-0.5">Solve 15 hard difficulty problems</div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full">
                          <div className="h-1.5 rounded-full bg-gradient-to-r from-slate-500 to-indigo-500/50" style={{width: '40%'}}></div>
                        </div>
                        <div className="text-xs text-gray-400">6/15</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};