import './Home.css';
import mathImage from '../../assets/math-removebg-preview.png';
import literatureImage from '../../assets/literature-removebg-preview.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
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
          <button className="home__button" type="button">
            Learn Math
          </button>
          <button className="home__button" type="button">
            Learn English
          </button>
          {!loggedIn ? (
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
