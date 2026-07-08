import './Home.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type StoredResults = {
  subject: string;
  results: number[];
  timeTaken: number[];
  attempts: number[];
};

function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState<StoredResults | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('testResults');
    if (!raw) {
      navigate('/');
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredResults;
      setData(parsed);
    } catch (error) {
      navigate('/');
    }
  }, [navigate]);

  const correctCount = useMemo(() => {
    if (!data) {
      return 0;
    }
    return data.results.reduce((sum, value) => sum + value, 0);
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const sendResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/app/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            correctness: data.results,
            attempts: data.attempts,
            time_taken: data.timeTaken,
          }),
        });
        let payload: { message?: string } = {};
        try {
          payload = await response.json();
        } catch (error) {
          payload = {};
        }
        if (payload.message) {
          setServerMessage(payload.message);
        } else if (response.ok) {
          setServerMessage('Results submitted');
        } else {
          setServerMessage('Unable to submit results.');
        }
      } catch (error) {
        setServerMessage('Unable to submit results.');
      }
    };

    sendResults();
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <div className="home">
      <header className="home__header">
        <span className="home__logo">Study Pal</span>
      </header>
      <main className="home__body">
        <div className="home__page">
          {data.subject} Results
          <div className="home__summary">
            {serverMessage ?? 'Submitting results...'}
          </div>
          <div className="home__summary">
            Correct answers: {correctCount} / {data.results.length}
          </div>
        </div>
        <div className="home__results">
          {data.results.map((value, index) => (
            <div key={`result-${index}`} className="home__result-card">
              <div className="home__result-title">Question {index + 1}</div>
              <div className="home__result-row">
                Result: {value === 1 ? 'Correct' : 'Wrong'}
              </div>
              <div className="home__result-row">
                Time: {data.timeTaken[index]}s
              </div>
              <div className="home__result-row">
                Attempts: {data.attempts[index]}
              </div>
            </div>
          ))}
        </div>
        <div className="home__results-actions">
          <button className="home__button" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </main>
    </div>
  );
}

export default Results;
