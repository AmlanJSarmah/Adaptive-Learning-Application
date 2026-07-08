import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import userModel from '../models/user.model.js';
import { resultsSchema } from '../schemas/results.schema.js';
import { env } from '../config/env.js';

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

const openAiMathSchema = z.object({
  problems: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z.array(z.number()).length(4),
        answerIndex: z.number().int().min(0).max(3),
      })
    )
    .length(5),
});

const openAiEnglishSchema = z.object({
  problems: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z.array(z.string().min(1)).length(4),
        answerIndex: z.number().int().min(0).max(3),
      })
    )
    .length(5),
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createOpenAiResponse = async (
  prompt: string,
  responseSchema: z.ZodSchema,
  attempts = 3
) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.OPEN_AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4.1-nano',
            temperature: 0.4,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content:
                  'You generate quiz questions and must return valid JSON only.',
              },
              { role: 'user', content: prompt },
            ],
          }),
        }
      );

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = undefined;
        }
        const requestId = response.headers.get('x-request-id');
        console.error('OpenAI request failed', {
          status: response.status,
          requestId,
          error: errorBody,
        });

        if (response.status === 429 && attempt < attempts) {
          const backoff = 300 * 2 ** (attempt - 1) + getRandomInt(0, 200);
          await wait(backoff);
          continue;
        }

        throw new Error('OpenAI request failed');
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content || typeof content !== 'string') {
        throw new Error('OpenAI returned no content');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch {
        throw new Error('OpenAI returned invalid JSON');
      }

      return responseSchema.parse(parsed) as {
        problems: MathProblem[] | EnglishProblem[];
      };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        const backoff = 300 * 2 ** (attempt - 1) + getRandomInt(0, 200);
        await wait(backoff);
      }
    }
  }

  throw lastError ?? new Error('OpenAI request failed');
};

const buildMathPrompt = (grade: number) =>
  [
    `Generate 5 NCERT-style arithmetic questions for grade ${grade}.`,
    'Use only basic operations: addition, subtraction, multiplication, division.',
    'Return JSON in this exact shape:',
    '{"problems":[{"question":"...","options":[1,2,3,4],"answerIndex":0}]}',
    'Rules:',
    '- Exactly 5 problems.',
    '- Each options array has exactly 4 numbers.',
    '- answerIndex points to the correct option.',
    '- No negative answers for grades 1-3.',
    '- Division should be whole-number only.',
  ].join('\n');

const buildEnglishPrompt = (grade: number) =>
  [
    `Generate 5 NCERT-style English questions for grade ${grade}.`,
    'Focus on grammar, vocabulary, and usage appropriate for the grade.',
    'Return JSON in this exact shape:',
    '{"problems":[{"question":"...","options":["a","b","c","d"],"answerIndex":0}]}',
    'Rules:',
    '- Exactly 5 problems.',
    '- Each options array has exactly 4 strings.',
    '- answerIndex points to the correct option.',
    '- Keep questions short and age-appropriate.',
  ].join('\n');

export const fetchMathProblems = async (req: Request, res: Response) => {
  const grade = req.authenticatedUser?.studentClass;
  if (!grade) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const result = await createOpenAiResponse(
      buildMathPrompt(grade),
      openAiMathSchema
    );

    return res.status(200).json({ grade, problems: result.problems });
  } catch (error) {
    console.error('OpenAI math generation failed, using fallback', error);
    const problems = Array.from({ length: 5 }, () => generateProblem(grade));
    return res.status(200).json({ grade, problems });
  }
};

export const fetchEnglishProblems = async (req: Request, res: Response) => {
  const grade = req.authenticatedUser?.studentClass;
  if (!grade) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const result = await createOpenAiResponse(
      buildEnglishPrompt(grade),
      openAiEnglishSchema
    );

    return res.status(200).json({ grade, problems: result.problems });
  } catch (error) {
    console.error('OpenAI english generation failed, using fallback', error);
    const problems = Array.from({ length: 5 }, () =>
      generateEnglishProblem(grade)
    );
    return res.status(200).json({ grade, problems });
  }
};

export const getResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userName =
      req.authenticatedUser?.userName ??
      (req.authenticatedUser as { name?: string } | undefined)?.name;
    if (!userName) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const parsedResults = resultsSchema.parse(req.body);
    const { correctness, time_taken, attempts } = parsedResults;

    const user = await userModel.findOneAndUpdate(
      { name: userName },
      {
        correctness,
        timeTakenPerQuestion: time_taken,
        attemptsPerQuestion: attempts,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const predictResponse = await fetch(
      'https://adaptive-learning-application.onrender.com/predict',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedResults),
      }
    );

    if (!predictResponse.ok) {
      return res.status(502).json({ message: 'Prediction service failed' });
    }

    const predictBody = await predictResponse.json();
    const isReady = predictBody.IsReady as number;

    if (isReady == 0) {
      return res
        .status(200)
        .json({ message: 'You will have to practice more' });
    }

    await userModel.updateOne(
      { name: userName },
      { studentClass: user.studentClass + 1 }
    );

    return res
      .status(200)
      .json({ message: 'Congratulations! you are promoted' });
  } catch (error) {
    next(error);
  }
};
