import type { Request, Response } from 'express';

type MathProblem = {
  question: string;
  options: number[];
  answerIndex: number;
};

type EnglishProblem = {
  question: string;
  options: string[];
  answerIndex: number;
};

type EnglishQuestionTemplate = {
  question: string;
  correct: string;
  distractors: string[];
};

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T>(values: T[]) => {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const buildOptions = (correct: number, spread: number) => {
  const options = new Set<number>([correct]);
  while (options.size < 4) {
    const delta = getRandomInt(-spread, spread);
    const candidate = correct + delta;
    if (candidate >= 0 && candidate !== correct) {
      options.add(candidate);
    }
  }
  return shuffle(Array.from(options));
};

const getDifficultyConfig = (grade: number) => {
  if (grade <= 3) {
    return { max: 20, allowMultiplication: false, allowDivision: false };
  }
  if (grade <= 5) {
    return { max: 50, allowMultiplication: true, allowDivision: false };
  }
  if (grade <= 8) {
    return { max: 200, allowMultiplication: true, allowDivision: true };
  }
  return { max: 500, allowMultiplication: true, allowDivision: true };
};

const englishQuestionBank = {
  easy: [
    {
      question: 'The sun is very ___.',
      correct: 'hot',
      distractors: ['cold', 'tall', 'wet'],
    },
    {
      question: 'A baby cat is called a ___.',
      correct: 'kitten',
      distractors: ['puppy', 'calf', 'chick'],
    },
    {
      question: 'The opposite of "up" is ___.',
      correct: 'down',
      distractors: ['over', 'around', 'above'],
    },
    {
      question: 'We use our eyes to ___.',
      correct: 'see',
      distractors: ['hear', 'smell', 'touch'],
    },
    {
      question: 'The plural of "book" is ___.',
      correct: 'books',
      distractors: ['bookes', 'book', 'bookies'],
    },
    {
      question: 'A bird lives in a ___.',
      correct: 'nest',
      distractors: ['cave', 'den', 'pond'],
    },
    {
      question: 'The color of grass is ___.',
      correct: 'green',
      distractors: ['red', 'blue', 'black'],
    },
    {
      question: 'You wear shoes on your ___.',
      correct: 'feet',
      distractors: ['hands', 'head', 'ears'],
    },
  ],
  medium: [
    {
      question: 'Choose the correct synonym of "big".',
      correct: 'large',
      distractors: ['small', 'tiny', 'narrow'],
    },
    {
      question: 'Choose the correct antonym of "early".',
      correct: 'late',
      distractors: ['fast', 'soon', 'quick'],
    },
    {
      question: 'She ___ to school every day.',
      correct: 'walks',
      distractors: ['walk', 'walking', 'walked'],
    },
    {
      question: 'The book is ___ the table.',
      correct: 'on',
      distractors: ['in', 'under', 'behind'],
    },
    {
      question: 'Past tense of "go" is ___.',
      correct: 'went',
      distractors: ['goed', 'goes', 'going'],
    },
    {
      question: 'Choose the correct synonym of "smart".',
      correct: 'clever',
      distractors: ['lazy', 'dull', 'slow'],
    },
    {
      question: 'Choose the correct antonym of "clean".',
      correct: 'dirty',
      distractors: ['pure', 'neat', 'tidy'],
    },
    {
      question: 'We ___ playing in the park.',
      correct: 'are',
      distractors: ['is', 'am', 'be'],
    },
  ],
  hard: [
    {
      question: 'Choose the correct synonym of "brave".',
      correct: 'courageous',
      distractors: ['timid', 'weak', 'afraid'],
    },
    {
      question: 'Choose the correct antonym of "ancient".',
      correct: 'modern',
      distractors: ['old', 'antique', 'historic'],
    },
    {
      question: 'She has ___ her homework.',
      correct: 'finished',
      distractors: ['finish', 'finishing', 'finishes'],
    },
    {
      question: 'He insisted ___ paying.',
      correct: 'on',
      distractors: ['at', 'in', 'for'],
    },
    {
      question: 'Choose the correct synonym of "observe".',
      correct: 'notice',
      distractors: ['ignore', 'avoid', 'forget'],
    },
    {
      question: 'Choose the correct antonym of "expand".',
      correct: 'shrink',
      distractors: ['grow', 'widen', 'enlarge'],
    },
    {
      question: 'Neither of the answers ___ correct.',
      correct: 'is',
      distractors: ['are', 'were', 'be'],
    },
    {
      question: 'He was absent ___ his illness.',
      correct: 'because of',
      distractors: ['despite', 'although', 'until'],
    },
  ],
  advanced: [
    {
      question: 'Choose the correct synonym of "meticulous".',
      correct: 'thorough',
      distractors: ['careless', 'rushed', 'sloppy'],
    },
    {
      question: 'Choose the correct antonym of "benevolent".',
      correct: 'malicious',
      distractors: ['kind', 'friendly', 'gentle'],
    },
    {
      question: 'Her explanation was quite ___.',
      correct: 'concise',
      distractors: ['vague', 'lengthy', 'confusing'],
    },
    {
      question: 'The results were ___ with our expectations.',
      correct: 'consistent',
      distractors: ['opposite', 'distant', 'unrelated'],
    },
    {
      question: 'Choose the correct synonym of "inevitable".',
      correct: 'unavoidable',
      distractors: ['optional', 'uncertain', 'preventable'],
    },
    {
      question: 'Choose the correct antonym of "transparent".',
      correct: 'opaque',
      distractors: ['clear', 'evident', 'obvious'],
    },
    {
      question: 'He apologized ___ the mistake.',
      correct: 'for',
      distractors: ['of', 'to', 'at'],
    },
    {
      question: 'The committee reached a ___.',
      correct: 'consensus',
      distractors: ['conflict', 'debate', 'argument'],
    },
  ],
};

const getEnglishBank = (grade: number): EnglishQuestionTemplate[] => {
  if (grade <= 3) return englishQuestionBank.easy;
  if (grade <= 5) return englishQuestionBank.medium;
  if (grade <= 8) return englishQuestionBank.hard;
  return englishQuestionBank.advanced;
};

const generateEnglishProblem = (grade: number): EnglishProblem => {
  const bank = getEnglishBank(grade);
  const entry = bank[getRandomInt(0, Math.max(0, bank.length - 1))];
  const options = shuffle([entry.correct, ...entry.distractors]);
  const answerIndex = options.indexOf(entry.correct);

  return {
    question: entry.question,
    options,
    answerIndex,
  };
};

const generateProblem = (grade: number): MathProblem => {
  const { max, allowMultiplication, allowDivision } =
    getDifficultyConfig(grade);
  const operations = ['+', '-'];
  if (allowMultiplication) operations.push('x');
  if (allowDivision) operations.push('/');

  const operation =
    operations[getRandomInt(0, Math.max(0, operations.length - 1))];
  let a = getRandomInt(0, max);
  let b = getRandomInt(1, max);
  let correct = 0;
  let question = '';

  switch (operation) {
    case '+':
      correct = a + b;
      question = `${a} + ${b} = ?`;
      break;
    case '-':
      if (b > a) [a, b] = [b, a];
      correct = a - b;
      question = `${a} - ${b} = ?`;
      break;
    case 'x':
      a = getRandomInt(1, grade <= 5 ? 10 : 12);
      b = getRandomInt(1, grade <= 5 ? 10 : 12);
      correct = a * b;
      question = `${a} x ${b} = ?`;
      break;
    case '/': {
      const divisor = getRandomInt(2, grade <= 8 ? 12 : 20);
      const quotient = getRandomInt(2, grade <= 8 ? 12 : 20);
      const dividend = divisor * quotient;
      correct = quotient;
      question = `${dividend} / ${divisor} = ?`;
      break;
    }
    default:
      correct = a + b;
      question = `${a} + ${b} = ?`;
  }

  const options = buildOptions(correct, Math.max(3, Math.floor(max / 10)));
  const answerIndex = options.indexOf(correct);

  return { question, options, answerIndex };
};

export const fetchMathProblems = (req: Request, res: Response) => {
  const grade = req.authenticatedUser?.studentClass;
  if (!grade) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const problems = Array.from({ length: 5 }, () => generateProblem(grade));

  return res.status(200).json({ grade, problems });
};

export const fetchEnglishProblems = (req: Request, res: Response) => {
  const grade = req.authenticatedUser?.studentClass;
  if (!grade) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const problems = Array.from({ length: 5 }, () => generateEnglishProblem(grade));

  return res.status(200).json({ grade, problems });
};
