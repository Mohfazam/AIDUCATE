import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Clipboard, Rocket, Code } from 'lucide-react';
import { useState, useEffect } from 'react';
//@ts-ignore
import type { Challenge, Language } from './CodeChallenges';

interface CodeEditorProps {
  challenge: Challenge;
  onXpGain: (amount: number) => void;
}

const LANGUAGES: { value: Language; label: string; extension: string }[] = [
  { value: 'javascript', label: 'JavaScript', extension: '.js' },
  { value: 'python', label: 'Python', extension: '.py' },
  { value: 'cpp', label: 'C++', extension: '.cpp' }
];

export const CodeEditor = ({ challenge, onXpGain }: CodeEditorProps) => {
  const [code, setCode] = useState(challenge.starterCode.javascript);
  const [output, setOutput] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastKeystroke, setLastKeystroke] = useState(Date.now());
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [showHiddenTests, setShowHiddenTests] = useState(false);

  useEffect(() => {
    //@ts-ignore
    setCode(challenge.starterCode[selectedLanguage]);
    setOutput([]);
    setShowHiddenTests(false);
  }, [challenge, selectedLanguage]);

  const executeJavaScript = (code: string, testCase: any) => {
    try {
      const userFunction = new Function(`
        ${code}
        return reverseArray;
      `)();
      
      const result = userFunction([...testCase.input]);
      return result;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const executePython = (code: string, testCase: any) => {
    try {
      const jsCode = code
        .replace('def reverse_array(arr):', 'function reverseArray(arr) {')
        .replace('    return', '  return')
        .replace('[::-1]', '.slice().reverse()')
        .replace('pass', 'return arr.slice().reverse()')
        + '}';

      const userFunction = new Function(`
        ${jsCode}
        return reverseArray;
      `)();
      
      return userFunction([...testCase.input]);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const executeCpp = (code: string, testCase: any) => {
    try {
      const jsCode = code
        .replace(/vector<int>/g, '')
        .replace(/&/g, '')
        .replace('reverseArray(', 'function reverseArray(')
        .replace(/\{[\s\S]*\}/, '{ return arr.slice().reverse(); }');

      const userFunction = new Function(`
        ${jsCode}
        return reverseArray;
      `)();
      
      return userFunction([...testCase.input]);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const runCode = () => {
    try {
      const results = challenge.testCases.map((testCase, index) => {
        try {
          let result;
          
          switch (selectedLanguage) {
            case 'javascript':
              result = executeJavaScript(code, testCase);
              break;
            case 'python':
              result = executePython(code, testCase);
              break;
            case 'cpp':
              result = executeCpp(code, testCase);
              break;
            default:
              throw new Error('Unsupported language');
          }

          const arraysEqual = (a: any[], b: any[]) => {
            if (!Array.isArray(a) || !Array.isArray(b)) return false;
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
              if (a[i] !== b[i]) return false;
            }
            return true;
          };

          const success = arraysEqual(result, testCase.output);
          
          if (success) onXpGain(50);
          
          return {
            input: testCase.input,
            expected: testCase.output,
            received: result,
            success,
            index,
            hidden: testCase.hidden || false
          };
        } catch (error) {
          return { error: (error as Error).message, index, hidden: testCase.hidden || false };
        }
      });

      const allTestsPassed = results.every(res => res.success);
      setShowHiddenTests(allTestsPassed);

      // Calculate hidden test stats
      const hiddenTests = results.filter(r => r.hidden);
      const hiddenPassed = hiddenTests.filter(r => r.success).length;
      const hiddenFailed = hiddenTests.length - hiddenPassed;
      const summary = allTestsPassed && hiddenTests.length > 0 
        ? [`📊 Hidden Test Summary: ${hiddenPassed}/${hiddenTests.length} passed, ${hiddenFailed} failed`]
        : [];

      setOutput([
        ...summary,
        ...results.map((res) => {
          if (res.hidden && !showHiddenTests) {
            return `🔒 Hidden Test ${res.index + 1} (Pass all visible tests to reveal)`;
          }

          const prefix = res.hidden ? '🔓 Hidden Test' : 'Test';
          return res.success 
            ? `✅ ${prefix} ${res.index + 1} Passed!\n   Input: ${JSON.stringify(res.input)}\n   Output: ${JSON.stringify(res.received)}`
            : res.error 
              ? `❌ ${prefix} ${res.index + 1} Error: ${res.error}`
              : `❌ ${prefix} ${res.index + 1} Failed\n   Input: ${JSON.stringify(res.input)}\n   Expected: ${JSON.stringify(res.expected)}\n   Received: ${JSON.stringify(res.received)}`;
        })
      ]);
    } catch (err) {
      setOutput([`🚨 Runtime Error: ${(err as Error).message}`]);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setIsTyping(true);
    setLastKeystroke(Date.now());

    setTimeout(() => {
      if (Date.now() - lastKeystroke >= 1500) {
        setIsTyping(false);
      }
    }, 1500);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-semibold">Code Editor</h3>
          {isTyping && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs bg-blue-500/20 px-2 py-1 rounded-full"
            >
              Typing...
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-slate-400" />
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-slate-700 text-sm px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <button
          //@ts-ignore
            onClick={() => setCode(challenge.starterCode[selectedLanguage])}
            className="bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 flex items-center gap-2 text-sm transition-colors"
          >
            <Clipboard className="h-4 w-4" />
            Reset Code
          </button>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={code}
          onChange={handleCodeChange}
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          className="w-full h-64 p-4 bg-slate-900 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Implement your solution here..."
          spellCheck="false"
        />
        <div className="absolute bottom-2 right-2 text-xs text-slate-500">
          {code.split('\n').length} lines | {selectedLanguage}
        </div>
      </div>
      
      <button 
        onClick={runCode}
        className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2 w-full justify-center transition-colors"
      >
        <Rocket className="h-5 w-5" />
        Execute Code
      </button>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="h-6 w-6 text-green-500" />
          <h3 className="text-xl font-semibold">Execution Results</h3>
        </div>
        
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 p-4 rounded-xl space-y-3 font-mono text-sm"
          >
            {output.length > 0 ? (
              output.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg ${
                    line.startsWith('✅') ? 'bg-green-500/10' :
                    line.startsWith('❌') ? 'bg-red-500/10' :
                    line.startsWith('⚠️') ? 'bg-yellow-500/20' :
                    line.startsWith('🔒') ? 'bg-slate-700/50' :
                    line.startsWith('📊') ? 'bg-blue-500/20' :
                    'bg-slate-800'
                  }`}
                >
                  {line.split('\n').map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
                </motion.div>
              ))
            ) : (
              <div className="text-slate-500 italic">
                Your results will appear here...
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};