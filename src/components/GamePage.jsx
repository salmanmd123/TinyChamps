
import { useNavigate, useParams } from "react-router-dom";
import subjectGames from "../data/subjectGames";

function GamePage() {
  const { slug, gameId } = useParams();
  const navigate = useNavigate();

  const subject = subjectGames[slug];
  const game = subject?.games.find(
    (item) => item.id === gameId
  );

  if (!game) {
    return (
      <div className="games-not-found">
        <h2>Game not found 😕</h2>
        <button onClick={() => navigate("/home")}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <main>
       </main> 
  );
}

export default GamePage;
