import confetti from "canvas-confetti";
import { useState, useEffect, useRef } from "react";
import "./memory-match.css";

const TOTAL_LEVELS = 50;
const LEVELS_PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

const EMOJIS = [
  "🐶", "🐱", "🦁", "🐼", "🐸", "🐵",
  "🐰", "🦊", "🐻", "🐯", "🐨", "🐷",
  "🐮", "🐔", "🦋", "🐢", "🐬", "🦄",
  "🍎", "🍌", "🍇", "🍉", "🍓", "🍍",
  "🥕", "🍒", "🥝", "🍊", "🍋", "🥑",
  "🚗", "🚀", "✈️", "🚲", "🚂", "🚁",
  "⚽", "🏀", "🎸", "🎹", "🎨", "🎈",
  "⭐", "🌙", "☀️", "🌈", "🌻", "🌺"
];

function getPairCount(level) {
  return Math.min(
    18,
    3 + Math.floor((level - 1) * 15 / 49)
  );
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createDeck(level) {
  const pairCount = getPairCount(level);
  const selectedEmojis = shuffle(EMOJIS).slice(0, pairCount);

  const cards = selectedEmojis.flatMap((emoji, index) => [
    { id: `${level}-${index}-a`, pair: index, emoji },
    { id: `${level}-${index}-b`, pair: index, emoji }
  ]);

  return shuffle(cards);
}

function App() {
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = Number(localStorage.getItem("memoryUnlocked"));
    return Math.min(50, Math.max(1, saved || 1));
  });

  const [level, setLevel] = useState(1);
  const [screen, setScreen] = useState("levels");

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = Number(localStorage.getItem("memoryUnlocked"));
    const validLevel = Math.min(50, Math.max(1, saved || 1));

    return Math.floor((validLevel - 1) / LEVELS_PER_PAGE);
  });

  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);

  const [paused, setPaused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const mismatchTimer = useRef(null);

  const pairCount = getPairCount(level);

  const completedCount = unlockedLevel - 1;

  const progress = Math.round(
    (completedCount / TOTAL_LEVELS) * 100
  );

  // LEVEL PAGINATION

  const firstLevel = currentPage * LEVELS_PER_PAGE + 1;

  const visibleLevels = Array.from(
    { length: LEVELS_PER_PAGE },
    (_, index) => firstLevel + index
  ).filter(num => num <= TOTAL_LEVELS);

  const previousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const nextPage = () => {
    setCurrentPage(prev =>
      Math.min(TOTAL_PAGES - 1, prev + 1)
    );
  };

  // START LEVEL

  const startLevel = (newLevel) => {
    clearTimeout(mismatchTimer.current);

    setLevel(newLevel);
    setDeck(createDeck(newLevel));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setTime(0);
    setLocked(false);
    setWon(false);
    setPaused(false);
    setShowHelp(false);
    setScreen("game");
  };

  // TIMER

  useEffect(() => {
    if (screen !== "game" || won || paused) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, won, paused]);

  // LEVEL COMPLETION CELEBRATION

  // FULL SCREEN CONFETTI UNTIL USER CONTINUES

useEffect(() => {
  if (!won) return;

  const colors = [
    "#FFD700",
    "#FFF1A8",
    "#F6BB24",
    "#FFFFFF",
    "#EAC65C",
    "#FF765F",
    "#B78BFF"
  ];

  const defaults = {
    startVelocity: 35,
    spread: 360,
    ticks: 80,
    zIndex: 2000,
    colors,
    gravity: 0.9,
    scalar: 1.2
  };

  const interval = setInterval(() => {

    // Left side
    confetti({
      ...defaults,
      particleCount: 35,
      origin: {
        x: Math.random() * 0.3,
        y: Math.random() * 0.5
      }
    });

    // Right side
    confetti({
      ...defaults,
      particleCount: 35,
      origin: {
        x: 0.7 + Math.random() * 0.3,
        y: Math.random() * 0.5
      }
    });

  }, 300);

  return () => {
    clearInterval(interval);
    confetti.reset();
  };

}, [won]);

  // CHECK VICTORY

  useEffect(() => {
    if (
      screen !== "game" ||
      deck.length === 0 ||
      matched.length !== deck.length
    ) {
      return;
    }

    setWon(true);

    const nextUnlocked = Math.min(
      TOTAL_LEVELS,
      level + 1
    );

    if (nextUnlocked > unlockedLevel) {
      setUnlockedLevel(nextUnlocked);

      localStorage.setItem(
        "memoryUnlocked",
        String(nextUnlocked)
      );

      setCurrentPage(
        Math.floor((nextUnlocked - 1) / LEVELS_PER_PAGE)
      );
    }
  }, [matched, deck, screen, level, unlockedLevel]);

  // CLEANUP TIMEOUT

  useEffect(() => {
    return () => clearTimeout(mismatchTimer.current);
  }, []);

  // FLIP CARDS

  const handleFlip = (card) => {
    if (
      screen !== "game" ||
      won ||
      paused ||
      locked ||
      flipped.includes(card.id) ||
      matched.includes(card.id)
    ) {
      return;
    }

    if (flipped.length === 0) {
      setFlipped([card.id]);
      return;
    }

    const firstCard = deck.find(
      item => item.id === flipped[0]
    );

    if (!firstCard) return;

    setMoves(prev => prev + 1);

    if (firstCard.pair === card.pair) {
      setFlipped([]);

      setMatched(prev => [
        ...prev,
        firstCard.id,
        card.id
      ]);

      setScore(prev => prev + 100);
    } else {
      setFlipped([firstCard.id, card.id]);
      setLocked(true);

      mismatchTimer.current = setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, 900);
    }
  };

  // RESTART

  const restartGame = () => {
    startLevel(level);
  };

  // BACK TO LEVELS

  const backToLevels = () => {
    clearTimeout(mismatchTimer.current);

    setLocked(false);
    setFlipped([]);
    setWon(false);
    setPaused(false);
    setShowHelp(false);
    setScreen("levels");
  };

  // NEXT LEVEL

  const nextLevel = () => {
    if (level < TOTAL_LEVELS) {
      startLevel(level + 1);
    } else {
      backToLevels();
    }
  };

  // TIMER FORMAT

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // GAME GRID COLUMNS

  const gridColumns = Math.min(
    6,
    Math.ceil(Math.sqrt(deck.length))
  );

  return (
    <div className="app">

      {/* ==================================
          LEVEL SELECTION
      ================================== */}

      {screen === "levels" && (
        <div className="levels-page">

          <section className="level-board">

            <div className="board-inner">

              <div className="board-title">
                <span>SELECT LEVEL</span>
              </div>

              <button
                className="page-arrow left-arrow"
                onClick={previousPage}
                disabled={currentPage === 0}
                aria-label="Previous levels"
              >
                ◀
              </button>

              <div className="level-grid">

                {visibleLevels.map(num => {
                  const isUnlocked = num <= unlockedLevel;
                  const isCompleted = num < unlockedLevel;
                  const isCurrent = num === unlockedLevel;

                  return (
                    <button
                      key={num}
                      disabled={!isUnlocked}
                      onClick={() => startLevel(num)}
                      className={`
                        level-card
                        ${isCompleted ? "completed" : ""}
                        ${isCurrent ? "current" : ""}
                        ${!isUnlocked ? "locked" : ""}
                      `}
                    >
                      <span className="level-number">
                        {!isUnlocked ? "🔒" : num}
                      </span>

                      <span className="level-stars">
                        ★★★
                      </span>

                      {isCurrent && (
                        <span className="play-indicator">
                          PLAY
                        </span>
                      )}
                    </button>
                  );
                })}

              </div>

              <button
                className="page-arrow right-arrow"
                onClick={nextPage}
                disabled={currentPage === TOTAL_PAGES - 1}
                aria-label="Next levels"
              >
                ▶
              </button>

              <div className="page-dots">

                {Array.from(
                  { length: TOTAL_PAGES },
                  (_, index) => index
                ).map(page => (
                  <button
                    key={page}
                    className={
                      currentPage === page
                        ? "page-dot active"
                        : "page-dot"
                    }
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page + 1}`}
                  />
                ))}

              </div>

            </div>

          </section>

        </div>
      )}

      {/* ==================================
          GAME SCREEN
      ================================== */}

      {screen === "game" && (
        <div className="game-page">

          {/* TOP CORNER CONTROLS */}

          <button
            className="corner-button pause-control"
            onClick={() => setPaused(prev => !prev)}
            aria-label={paused ? "Resume game" : "Pause game"}
          >
            {paused ? "▶" : "⏸"}
          </button>

          <button
            className="corner-button help-control"
            onClick={() => setShowHelp(true)}
            aria-label="Game instructions"
          >
            ?
          </button>

          {/* GAME HEADING */}

          <section className="game-heading">
            <h1>Memory Match</h1>
            <h2>Find the matching pairs!</h2>
            <p>
              Remember the pictures and match them together.
            </p>
          </section>

          {/* MAIN GAME BOARD */}

          <main className="game-board-container">

            <div className="game-board">

              {/* BOARD HEADER */}

              <div className="board-game-header">

                <div className="game-timer">
                  <span>⏳</span>
                  <strong>{formatTime(time)}</strong>
                </div>

                <div className="game-level-label">
                  LEVEL {String(level).padStart(2, "0")}
                </div>

                <button
                  className="board-restart"
                  onClick={restartGame}
                >
                  <span>↻</span>
                  Restart
                </button>

              </div>

              {/* MEMORY CARDS */}

              <div
                className="memory-grid"
                style={{
                  gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
                }}
              >

                {deck.map(card => {
                  const isFlipped =
                    flipped.includes(card.id) ||
                    matched.includes(card.id);

                  const isMatched = matched.includes(card.id);

                  return (
                    <button
                      key={card.id}
                      className={`
                        memory-card
                        ${isFlipped ? "flipped" : ""}
                        ${isMatched ? "matched" : ""}
                      `}
                      onClick={() => handleFlip(card)}
                      disabled={
                        isMatched ||
                        won ||
                        paused ||
                        locked
                      }
                      aria-label={
                        isFlipped
                          ? card.emoji
                          : "Flip hidden card"
                      }
                    >

                      <span className="card-inner">

                        <span className="card-front">
                          ?
                        </span>

                        <span className="card-back">
                          {card.emoji}
                        </span>

                      </span>

                    </button>
                  );
                })}

              </div>

              {/* BOARD HINT */}

              <div className="game-hint">
                💡 Find two identical pictures to make a match!
              </div>

            </div>

            {/* PAUSE OVERLAY */}

            {paused && !won && (
              <div className="game-popup-overlay">
                <div className="game-popup">

                  <div className="popup-icon">⏸️</div>

                  <h2>Game Paused</h2>

                  <p>
                    Take your time. Your game is waiting for you!
                  </p>

                  <button
                    className="popup-primary-button"
                    onClick={() => setPaused(false)}
                  >
                    ▶ RESUME GAME
                  </button>

                  <button
                    className="popup-secondary-button"
                    onClick={backToLevels}
                  >
                    BACK TO LEVELS
                  </button>

                </div>
              </div>
            )}

          </main>

          {/* HELP MODAL */}

          {showHelp && (
            <div
              className="game-popup-overlay"
              onClick={() => setShowHelp(false)}
            >
              <div
                className="game-popup help-popup"
                onClick={e => e.stopPropagation()}
              >

                <button
                  className="popup-close"
                  onClick={() => setShowHelp(false)}
                  aria-label="Close help"
                >
                  ×
                </button>

                <div className="popup-icon">💡</div>

                <h2>How to Play</h2>

                <ul>
                  <li>Tap any card to reveal its picture.</li>
                  <li>Find another card with the same picture.</li>
                  <li>Match all pairs to complete the level.</li>
                  <li>Every successful match gives you 100 points.</li>
                  <li>Complete a level to unlock the next one.</li>
                </ul>

                <button
                  className="popup-primary-button"
                  onClick={() => setShowHelp(false)}
                >
                  GOT IT!
                </button>

              </div>
            </div>
          )}

          {/* VICTORY MODAL */}

          {won && (
            <div className="modal-overlay">

              <div className="win-modal">

                <div className="win-decoration">🎉</div>
                <div className="win-trophy">🏆</div>

                <h2>
                  {level === TOTAL_LEVELS
                    ? "MEMORY MASTER!"
                    : "AWESOME JOB!"}
                </h2>

                <p>
                  {level === TOTAL_LEVELS
                    ? "You completed all 50 levels!"
                    : "You found all the matching pairs!"}
                </p>

                <div className="win-stats">

                  <div>
                    <span>⭐</span>
                    <strong>{score}</strong>
                    <small>SCORE</small>
                  </div>

                  <div>
                    <span>🔄</span>
                    <strong>{moves}</strong>
                    <small>MOVES</small>
                  </div>

                  <div>
                    <span>⏱️</span>
                    <strong>{formatTime(time)}</strong>
                    <small>TIME</small>
                  </div>

                </div>

                <button
                  className="next-button"
                  onClick={nextLevel}
                >
                  {level === TOTAL_LEVELS
                    ? "BACK TO LEVELS"
                    : "NEXT LEVEL ➜"}
                </button>

                <button
                  className="levels-link"
                  onClick={backToLevels}
                >
                  LEVEL SELECTION
                </button>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default App;
