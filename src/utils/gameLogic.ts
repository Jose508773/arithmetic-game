import { Question } from '../types/index';

const generateNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateOptions = (answer: number, count: number = 4): number[] => {
  const options = new Set<number>([answer]);
  const range = Math.max(10, answer * 2);

  while (options.size < count) {
    const option = generateNumber(Math.max(0, answer - range), answer + range);
    if (option !== answer) {
      options.add(option);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateProblem = (difficulty: 'easy' | 'medium' | 'hard'): Question => {
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

  return {
    id: Date.now(), // Unique ID for each question
    question,
    answer,
    options: generateOptions(answer),
    difficulty
  };
};

export const checkAnswer = (question: Question, selectedAnswer: number): boolean => {
  return question.answer === selectedAnswer;
}; 