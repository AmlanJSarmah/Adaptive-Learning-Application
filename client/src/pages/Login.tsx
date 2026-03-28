import "./Home.css";
import mathImage from "../../assets/math-removebg-preview.png";
import literatureImage from "../../assets/literature-removebg-preview.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || !password.trim()) {
      alert("Please enter your name and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          password,
        }),
      });

      let data: { message?: string; token?: string; user?: string } = {};
      try {
        data = await response.json();
      } catch (error) {
        data = {};
      }

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", data.user ?? trimmedName);
        if (data.token) {
          localStorage.setItem("token", data.token);
        } else {
          localStorage.removeItem("token");
        }
        alert(data.message ?? "Login successful");
        navigate("/");
      } else {
        alert(data.message ?? "Login failed. Please try again.");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

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

        <form className="home__form" onSubmit={handleSubmit}>
          <label className="home__field">
            <span className="home__label">Name</span>
            <input
              className="home__input"
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="home__field">
            <span className="home__label">Password</span>
            <input
              className="home__input"
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
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
