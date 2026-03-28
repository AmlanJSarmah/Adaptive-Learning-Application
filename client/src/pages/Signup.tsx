import "./Home.css";
import mathImage from "../../assets/math-removebg-preview.png";
import literatureImage from "../../assets/literature-removebg-preview.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [studentClass, setStudentClass] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const classNumber = Number(studentClass);
    if (!trimmedName || !password.trim() || Number.isNaN(classNumber)) {
      alert("Please enter a name, password, and class number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          password,
          studentClass: classNumber,
        }),
      });

      if (response.ok) {
        alert("Signed up");
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      alert("Signup failed. Please try again.");
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
          <label className="home__field">
            <span className="home__label">Student Class</span>
            <input
              className="home__input"
              type="number"
              name="studentClass"
              value={studentClass}
              onChange={(event) => setStudentClass(event.target.value)}
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

export default Signup;
