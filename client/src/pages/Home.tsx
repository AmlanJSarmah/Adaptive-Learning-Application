import './Home.css';
import mathImage from '../../assets/math-removebg-preview.png';
import literatureImage from '../../assets/literature-removebg-preview.png';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    setIsLoggedIn(storedLoggedIn);
    setUser(storedUser);
    setToken(storedToken);
  }, []);

  const mathTarget = isLoggedIn ? '/math' : '/signup';
  const englishTarget = isLoggedIn ? '/english' : '/signup';
  return (
    <div className="home">
      <header className="home__header">
        <Link to="/" className="home__logo">
          Study Pal
        </Link>
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
