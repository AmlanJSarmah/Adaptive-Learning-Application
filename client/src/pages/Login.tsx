import "./Home.css";
import mathImage from "../../assets/math-removebg-preview.png";
import literatureImage from "../../assets/literature-removebg-preview.png";
import {Link} from "react-router-dom";

function Login() {
  return (
    <div className="home">
      <header className="home__header">
        <Link to="/" className="home__logo">Study Pal</Link>
      </header>

      <main className="home__body">
        <div className="home__hero">
          <img src={literatureImage} alt="Student reading" />
        </div>

        <form className="home__form">
          <label className="home__field">
            <span className="home__label">Username</span>
            <input className="home__input" type="text" name="username" />
          </label>
          <label className="home__field">
            <span className="home__label">Password</span>
            <input className="home__input" type="password" name="password" />
          </label>
          <button className="home__button home__submit" type="submit">
            Submit
          </button>
        </form>

        <div className="home__decor">
          <img src={mathImage} alt="Learning guide" />
        </div>
      </main>
    </div>
  );
}

export default Login;
