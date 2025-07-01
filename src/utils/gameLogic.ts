import { Question } from '../types/index';

// Cache for generated questions to avoid duplicates
const questionCache = new Map<string, Question[]>();
const CACHE_SIZE = 50;

// Optimized random number generator
const generateNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Optimized options generator with better distribution
const generateOptions = (answer: number, count: number = 4): number[] => {
  const options = new Set<number>([answer]);
  const range = Math.max(10, answer * 2);
  const attempts = count * 3; // Limit attempts to prevent infinite loops
  
  let attempt = 0;
  while (options.size < count && attempt < attempts) {
    const option = generateNumber(Math.max(0, answer - range), answer + range);
    if (option !== answer) {
      options.add(option);
    }
    attempt++;
  }
  
  // Fill remaining slots if needed
  while (options.size < count) {
    const option = answer + generateNumber(-range, range);
    if (option !== answer && option >= 0) {
      options.add(option);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateProblem = (difficulty: 'easy' | 'medium' | 'hard'): Question => {
  // Check cache first
  const cacheKey = difficulty;
  const cachedQuestions = questionCache.get(cacheKey);
  
  if (cachedQuestions && cachedQuestions.length > 0) {
    const question = cachedQuestions.pop()!;
    return {
      ...question,
      id: Date.now() // Ensure unique ID
    };
  }

  let maxNumber: number;
  let operations: string[];

  switch (difficulty) {
    case 'easy':
      maxNumber = 10;
      operations = ['+', '-'];
      break;
    case 'medium':
      maxNumber = 20;
      operations = ['+', '-', '*'];
      break;
    case 'hard':
      maxNumber = 50;
      operations = ['+', '-', '*', '/'];
      break;
  }

  const num1 = generateNumber(1, maxNumber);
  const num2 = generateNumber(1, maxNumber);
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let answer: number;
  let question: string;
  let larger: number;
  let smaller: number;

  switch (operation) {
    case '+':
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case '-':
      // Ensure positive result for subtraction
      larger = Math.max(num1, num2);
      smaller = Math.min(num1, num2);
      answer = larger - smaller;
      question = `${larger} - ${smaller} = ?`;
      break;
    case '*':
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    case '/':
      // Ensure clean division with whole numbers
      answer = num1;
      question = `${num1 * num2} ÷ ${num2} = ?`;
      break;
    default:
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
  }

  const newQuestion: Question = {
    id: Date.now(),
    question,
    answer,
    options: generateOptions(answer),
    difficulty
  };

  // Pre-generate questions for cache
  pregenerateQuestions(difficulty);

  return newQuestion;
};

// Pre-generate questions for better performance
const pregenerateQuestions = (difficulty: 'easy' | 'medium' | 'hard'): void => {
  const cacheKey = difficulty;
  const cachedQuestions = questionCache.get(cacheKey) || [];
  
  if (cachedQuestions.length < CACHE_SIZE / 2) {
    const questions: Question[] = [];
    for (let i = 0; i < 10; i++) {
      const question = generateProblemInternal(difficulty);
      questions.push(question);
    }
    
    questionCache.set(cacheKey, [...cachedQuestions, ...questions]);
  }
};

// Internal function to avoid recursion
const generateProblemInternal = (difficulty: 'easy' | 'medium' | 'hard'): Question => {
  let maxNumber: number;
  let operations: string[];

  switch (difficulty) {
    case 'easy':
      maxNumber = 10;
      operations = ['+', '-'];
      break;
    case 'medium':
      maxNumber = 20;
      operations = ['+', '-', '*'];
      break;
    case 'hard':
      maxNumber = 50;
      operations = ['+', '-', '*', '/'];
      break;
  }

  const num1 = generateNumber(1, maxNumber);
  const num2 = generateNumber(1, maxNumber);
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let answer: number;
  let question: string;
  let larger: number;
  let smaller: number;

  switch (operation) {
    case '+':
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case '-':
      larger = Math.max(num1, num2);
      smaller = Math.min(num1, num2);
      answer = larger - smaller;
      question = `${larger} - ${smaller} = ?`;
      break;
    case '*':
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    case '/':
      answer = num1;
      question = `${num1 * num2} ÷ ${num2} = ?`;
      break;
    default:
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
  }

  return {
    id: Date.now(),
    question,
    answer,
    options: generateOptions(answer),
    difficulty
  };
};

export const checkAnswer = (question: Question, selectedAnswer: number): boolean => {
  return question.answer === selectedAnswer;
}; 