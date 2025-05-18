import axios from 'axios';

interface ApiQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // e.g., "C"
  hint?: string;
  explanation?: string;
}

interface ApiResponse {
  success: boolean;
  questions: ApiQuestion[];
  count?: number; // Only in Hard
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hint?: string;
}

interface QuizQuestions {
  easy: QuizQuestion[];
  medium: QuizQuestion[];
  hard: QuizQuestion[];
}

// Convert correctAnswer (e.g., "C") to correct (e.g., 2)
const answerToIndex = (answer: string): number => {
  const index = answer.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  if (index < 0 || index > 3) throw new Error(`Invalid answer: ${answer}`);
  return index;
};

// Fetch with infinite retries and exponential backoff
const fetchWithRetry = async (
  url: string,
  data: any,
  initialDelay: number = 1000,
  maxDelay: number = 16000,
): Promise<ApiResponse> => {
  let attempt = 0;
  while (true) {
    try {
      const response = await axios.post<ApiResponse>(url, data, { timeout: 60000 });
      if (!response.data.success) {
        throw new Error(`${url} returned success: false`);
      }
      console.log(`Fetched ${url} successfully on attempt ${attempt + 1}`);
      return response.data;
    } catch (error) {
      attempt++;
      const delay = Math.min(initialDelay * 2 ** (attempt - 1), maxDelay);
      console.error(`Error fetching ${url} (attempt ${attempt}):`, error);
      console.log(`Retrying ${url} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const getQuestions = async (): Promise<QuizQuestions> => {
  const videoId = localStorage.getItem('currentVideoId');
  if (!videoId) {
    throw new Error('No video ID found. Please select a video.');
  }

  const endpoints = [
    { url: 'http://localhost:3000/KnowledgeCheckEasy', difficulty: 'easy' },
    { url: 'http://localhost:3000/KnowledgeCheckMedium', difficulty: 'medium' },
    { url: 'http://localhost:3000/KnowledgeCheckHard', difficulty: 'hard' },
  ];

  const result: QuizQuestions = { easy: [], medium: [], hard: [] };

  for (const { url, difficulty } of endpoints) {
    const data = await fetchWithRetry(url, { videoId });
    const questions = data.questions || [];
    const mappedQuestions: QuizQuestion[] = questions
      .filter(
        (q: ApiQuestion) =>
          q.question &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctAnswer === 'string',
      )
      .map((q: ApiQuestion) => ({
        question: q.question,
        options: q.options,
        correct: answerToIndex(q.correctAnswer),
        explanation: q.explanation || 'Review the problem constraints and solution approach.',
        hint: q.hint || `Consider the key concepts in: ${q.question.slice(0, 50)}...`,
      }));

    if (mappedQuestions.length === 0) {
      console.warn(`No valid questions received from ${url}`);
    }

    result[difficulty as keyof QuizQuestions] = mappedQuestions;
  }

  console.log('Fetched questions:', result);
  return result;
};