import './Home.css';
import mathImage from '../../assets/math-removebg-preview.png';
import literatureImage from '../../assets/literature-removebg-preview.png';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const parseToken = (token: string) => {
  const payload = token.split('.')[1];
  if (!payload) {
    return null;
  }
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '='
  );
  try {
    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
};

const isTokenValid = (token: string | null) => {
  if (!token) {
    return false;
  }
  const payload = parseToken(token);
  if (!payload || typeof payload.exp !== 'number') {
    return false;
  }
  return payload.exp * 1000 > Date.now();
};

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const tokenValid = isTokenValid(storedToken);

    if (!tokenValid) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('studentClass');
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
      return;
    }

    setIsLoggedIn(true);
    setUser(storedUser);
    setToken(storedToken);
  }, []);

  const mathTarget = isLoggedIn && token ? '/math' : '/signup';
  const englishTarget = isLoggedIn && token ? '/english' : '/signup';
  return (
    <div className="home">
      <header className="home__header">
        <Link to="/" className="home__logo">
          Study Pal
        </Link>
        {isLoggedIn && user ? (
          <span className="home__student">{user}</span>
        ) : null}
      </header>

      <main className="home__body">
        <div className="home__hero">
          <img src={literatureImage} alt="Student reading" />
        </div>

        <div className="home__actions">
          <Link className="home__button" to={mathTarget}>
            Learn Math
          </Link>
          <Link className="home__button" to={englishTarget}>
            Learn English
          </Link>
          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="home__button" type="button">
                Sign up
              </Link>

              <Link to="/login" className="home__button" type="button">
                Login
              </Link>
            </>
          ) : (
            ''
          )}
        </div>

        <div className="home__decor">
          <img src={mathImage} alt="Learning guide" />
        </div>
      </main>
    </div>
  );
}

export default Home;
