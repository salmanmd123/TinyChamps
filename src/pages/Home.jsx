
import { useRef } from "react";
import "../styles/Home.css";
import SubjectsSection from "../components/SubjectsSection";


function Home({ onSelectSubject }) {

  const subjectsRef = useRef(null);

  const handlePlay = () => {
    subjectsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <main className="home-container">

      {/* Hero Section */}

      <section className="home-page">

        <div className="home-overlay"></div>

        <div className="hero-content">

          <span className="welcome-tag">
            ✨ LET'S LEARN & PLAY ✨
          </span>

          <h1>
            Hello,
            <br />
            <span>Little Learner!</span>
          </h1>

          <p>
            Let’s play and learn something new today! 💗
          </p>

          <button
            className="play-button"
            onClick={handlePlay}
          >
            <span>▶</span>
            Start Playing
          </button>

        </div>

      </section>

      {/* Subjects Section */}

      <div ref={subjectsRef}>
        <SubjectsSection onSelectSubject={onSelectSubject} />
      </div>

    </main>
  );
}

export default Home;
