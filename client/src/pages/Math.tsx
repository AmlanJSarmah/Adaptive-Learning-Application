import './Home.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Problem = {
  question: string;
  options: string[];
  answerIndex: number;
};

function MathPage() {
  const navigate = useNavigate();
  const [studentClass, setStudentClass] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<number[]>(Array(5).fill(0));
  const [timeTaken, setTimeTaken] = useState<number[]>(Array(5).fill(0));
  const [attempts, setAttempts] = useState<number[]>(Array(5).fill(0));
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reviewQueue, setReviewQueue] = useState<number[]>([]);
  const [isReview, setIsReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastAttemptKey = useRef<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    const token = localStorage.getItem('token');
    const storedClass = localStorage.getItem('studentClass');
    setStudentClass(storedClass);

    const load = async () => {
      try {
        const response = await fetch(
          'https://adaptive-learning-application-main-api.onrender.com/app/math',
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          }
        );
        const data = await response.json();
        const loadedProblems: Problem[] = Array.isArray(data?.problems)
          ? data.problems
          : [];

        if (!response.ok || loadedProblems.length === 0) {
          setError('Unable to load questions.');
          setLoading(false);
          return;
        }

        setProblems(loadedProblems.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError('Unable to load questions.');
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalQuestions = problems.length;
  const activeIndex = useMemo(() => {
    if (isReview && reviewQueue.length > 0) {
      return reviewQueue[0];
    }
    return currentIndex;
  }, [currentIndex, isReview, reviewQueue]);

  const activeProblem = problems[activeIndex];
  const isComplete = totalQuestions === 5 && currentIndex >= totalQuestions;

  useEffect(() => {
    if (!activeProblem) {
      return;
    }
    const attemptKey = `${activeIndex}-${isReview}-${reviewQueue.length}`;
    if (lastAttemptKey.current === attemptKey) {
      return;
    }
    lastAttemptKey.current = attemptKey;
    setStartTime(Date.now());
    setAttempts(prev => {
      const next = [...prev];
      next[activeIndex] = next[activeIndex] + 1;
      return next;
    });
  }, [activeIndex, activeProblem, isReview, reviewQueue.length]);

  const recordAnswer = (isCorrect: boolean) => {
    const now = Date.now();
    const elapsedSeconds = startTime
      ? Math.max(1, Math.round((now - startTime) / 1000))
      : 1;

    setResults(prev => {
      const next = [...prev];
      next[activeIndex] = isCorrect ? 1 : 0;
      return next;
    });
    setTimeTaken(prev => {
      const next = [...prev];
      next[activeIndex] = elapsedSeconds;
      return next;
    });

    if (isReview) {
      setReviewQueue(prev => prev.slice(1));
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    recordAnswer(false);
  };

  const handleAnswer = (index: number) => {
    if (!activeProblem) {
      return;
    }
    recordAnswer(index === activeProblem.answerIndex);
  };

  const handleReattempt = () => {
    const wrongIndexes = results
      .map((value, index) => (value === 0 ? index : -1))
      .filter(value => value !== -1);
    if (wrongIndexes.length === 0) {
      handleSubmit();
      return;
    }
    setIsReview(true);
    setReviewQueue(wrongIndexes);
    setStartTime(Date.now());
  };

  const handleSubmit = () => {
    localStorage.setItem(
      'testResults',
      JSON.stringify({
        subject: 'Math',
        results,
        timeTaken,
        attempts,
      })
    );
    navigate('/results');
  };

  useEffect(() => {
    const reviewDone = isReview && reviewQueue.length === 0;
    if (!isComplete && !reviewDone) {
      return;
    }
    const hasWrong = results.some(value => value === 0);
    if (!hasWrong) {
      handleSubmit();
    }
  }, [isComplete, isReview, reviewQueue, results]);

  return (
    <div className="home">
      <header className="home__header">
        <span className="home__logo">Study Pal</span>
        {studentClass ? (
          <span className="home__student">Class {studentClass}</span>
        ) : null}
      </header>
      <main className="home__body">
        {loading ? <div className="home__page">Loading...</div> : null}
        {error ? <div className="home__page">{error}</div> : null}
        {!loading && !error && isComplete && reviewQueue.length === 0 ? (
          <div className="home__page">
            <div className="home__summary">Test complete</div>
            <div className="home__actions">
              <button className="home__button" onClick={handleReattempt}>
                Reattempt wrong questions
              </button>
              <button className="home__button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        ) : null}
        {!loading && !error && activeProblem && (!isComplete || isReview) ? (
          <div className="home__quiz">
            <div className="home__question">
              <span className="home__question-count">
                Question {activeIndex + 1} of 5
              </span>
              <h2 className="home__question-text">{activeProblem.question}</h2>
            </div>
            <div className="home__options">
              {activeProblem.options.map((option, index) => (
                <button
                  key={`${activeIndex}-${option}`}
                  className="home__option"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="home__skip" onClick={handleSkip}>
              Skip
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default MathPage;
