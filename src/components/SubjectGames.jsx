
import { useNavigate, useParams } from "react-router-dom";
import subjectGames from "../data/subjectGames";
import "../styles/SubjectGames.css";

function SubjectGames() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const subject = subjectGames[slug];

    if (!subject) {
        return (
            <div className="games-not-found">
                <h2>Oops! Subject not found 😕</h2>
                <button onClick={() => navigate("/home")}>
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <main
            className="games-page"
        >

            <button
                className="back-button"
                onClick={() => navigate("/home")}
            >
                ← Back to Subjects
            </button>

            <div className="games-heading">

                <div className="heading-crown">👑</div>

                <h1>{subject.title}</h1>

                <p>{subject.subtitle}</p>

            </div>

            <section className="games-content">

                <h2>Choose Your Game</h2>

                <div className="games-grid">

                    {subject.games.map((game, index) => (
                        <article className="game-card" key={game.id}>

                            <div className="game-card-top">
                                <span className="game-number">
                                    GAME {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="game-level">
                                    {game.level}
                                </span>
                            </div>

                            <div className="game-icon">
                                <img src={game.image} alt={game.title} />
                            </div>

                            <h3>{game.title}</h3>

                            <button
                                className="game-play-button"
                                onClick={() =>
                                    navigate(
                                        `/subjects/${slug}/games/${game.id}`
                                    )
                                }
                            >
                                Play Now <span>▶</span>
                            </button>

                        </article>
                    ))}

                </div>

            </section>

        </main>
    );
}

export default SubjectGames;
