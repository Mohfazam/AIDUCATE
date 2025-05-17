import { QuizProvider } from './QuizContext';
import DifficultySelector from './DifficultySelector'; 
import Quiz from './Quiz'; 
import { Navbar } from '../Navbar'; 
import { useQuiz } from './QuizContext';
import { Brain } from 'lucide-react'; 

const QuizContent = () => {
  const { difficulty } = useQuiz();
  return difficulty ? <Quiz /> : <DifficultySelector />;
};

export const MainQuiz = () => {
  return (
    <QuizProvider>
      <div className="flex flex-col h-screen">
        <Navbar 
          title="Quiz" 
          icon={Brain} 
        />
        <main className="flex-grow overflow-y-scroll">
          <QuizContent />
        </main>
      </div>
    </QuizProvider>
  );
};