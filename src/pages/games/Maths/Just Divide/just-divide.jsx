
import { useState, useEffect } from "react";
import "./just-divide.css";

import timer from "./assets/timer.png";
import cat from "./assets/Cat.png";
import trash from "./assets/trash.svg";

function App() {

  const colors = ["red", "blue", "pink", "purple", "orange"];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomTile = () => {
    const values = [2, 3, 4, 6, 8, 9, 12, 15, 32];
    return {
      value: values[Math.floor(Math.random() * values.length)],
      color: getRandomColor()
    };
  };

  const [grid, setGrid] = useState(Array(16).fill(null));

  const [queue, setQueue] = useState([
    getRandomTile(),
    getRandomTile()
  ]);

  const activeTile = queue[0];
  const nextTile = queue[1];

  const getTileClass = (tile) => {
    if (!tile) return "tile";
    return `tile ${tile.color}`;
  };

  const updateQueue = () => {
    setQueue(prev => [
      prev[1],
      getRandomTile()
    ]);
  };

  const [keepVal, setKeepVal] = useState(null);
  const [time, setTime] = useState(180);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [trashCount, setTrashCount] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const isTouchDevice = "ontouchstart" in window;

  const [draggingTile, setDraggingTile] = useState(null);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });

  const getNeighbors = (index) => {
    const neighbors = [];

    const row = Math.floor(index / 4);
    const col = index % 4;

    if (row > 0) neighbors.push(index - 4);
    if (row < 3) neighbors.push(index + 4);
    if (col > 0) neighbors.push(index - 1);
    if (col < 3) neighbors.push(index + 1);

    return neighbors;
  };

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();

    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  useEffect(() => {
    if (time <= 0 || isPaused) return;

    const interval = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, isPaused]);

  const formatTime = (t) => {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;

    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleMerge = (grid, index) => {
    let newGrid = [...grid];
    let changed = true;
    let gainedScore = 0;

    while (changed) {
      changed = false;

      for (let i = 0; i < 16; i++) {
        const current = newGrid[i];
        if (!current) continue;

        const neighbors = getNeighbors(i);

        for (let nIndex of neighbors) {
          const neighbor = newGrid[nIndex];
          if (!neighbor) continue;

          const a = current.value;
          const b = neighbor.value;

          if (a === b) {
            newGrid[i] = null;
            newGrid[nIndex] = null;

            gainedScore += a;
            changed = true;
            break;
          }

          if (a > b && a % b === 0) {
            const result = a / b;

            newGrid[i] = result === 1 ? null : {
              value: result,
              color: getRandomColor()
            };

            newGrid[nIndex] = null;

            gainedScore += result;
            changed = true;
            break;
          }

          else if (b > a && b % a === 0) {
            const result = b / a;

            newGrid[nIndex] = result === 1 ? null : {
              value: result,
              color: getRandomColor()
            };

            newGrid[i] = null;

            gainedScore += result;
            changed = true;
            break;
          }
        }
      }
    }

    return { newGrid, gainedScore };
  };

  useEffect(() => {
    const newLevel = Math.floor(score / 10) + 1;
    setLevel(newLevel);
  }, [score]);

  const isGameOver = (grid) => {
    if (grid.some(cell => cell === null)) return false;

    for (let i = 0; i < 16; i++) {
      const current = grid[i];
      const neighbors = getNeighbors(i);

      for (let nIndex of neighbors) {
        const neighbor = grid[nIndex];

        if (!neighbor) continue;

        const a = current.value;
        const b = neighbor.value;

        if (a === b || a % b === 0 || b % a === 0) {
          return false;
        }
      }
    }

    return true;
  };

  useEffect(() => {
    if (time === 0) {
      setGameOver(true);
    }
  }, [time]);

  const handleRestart = () => {
    setGrid(Array(16).fill(null));
    setQueue([getRandomTile(), getRandomTile()]);
    setKeepVal(null);
    setScore(0);
    setLevel(1);
    setTrashCount(10);
    setTime(180);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="app">

      {/* FLOATING BUTTONS */}
      <div className="floating-buttons">

        <div
          className="pause-btn"
          onClick={() => setIsPaused(prev => !prev)}
        >
          ⏸
        </div>

        <div
          className="help-btn"
          onClick={() => setShowHelp(true)}
        >
          ?
        </div>

      </div>

      {/* TITLE */}
      <h1 className="title">JUST DIVIDE</h1>

      {/* TIMER */}
      <div className="timer">
        <img src={timer} alt="timer" className="timer-icon" />
        <span className="timer-text">{formatTime(time)}</span>
      </div>

      {/* INSTRUCTIONS */}
      <div className="instruction">
        DIVIDE WITH THE NUMBERS TO SOLVE THE ROWS AND COLUMNS.
      </div>

      <div className="game-container">

        <div className="board-section">

          {/* CAT IMAGE */}
          <img src={cat} alt="cat" className="cat" />

          {/* TOP BAR */}
          <div className="top-bar">
            <div className="level">LEVEL {level}</div>
            <div className="score">SCORE {score}</div>
          </div>

          {/* GRID */}
          <div className="grid">
            {grid.map((cell, i) => (
              <div
                key={i}
                className="cell"
                data-index={i}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (gameOver || isPaused) return;

                  const tileData = JSON.parse(e.dataTransfer.getData("tile"));

                  if (grid[i] !== null) return;

                  let newGrid = [...grid];
                  newGrid[i] = tileData;

                  const result = handleMerge(newGrid, i);

                  setGrid(result.newGrid);
                  setScore(prev => prev + result.gainedScore);

                  if (isGameOver(result.newGrid)) {
                    setGameOver(true);
                  }

                  updateQueue();
                }}
              >
                {cell && (
                  <div className={getTileClass(cell)}>
                    {cell.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="side-panel">

          {/* KEEP BOX */}
          <div className="keep-section">

            <div
              className="keep-box"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                if (gameOver || isPaused) return;

                const tileData = JSON.parse(e.dataTransfer.getData("tile"));

                if (!keepVal) {
                  setKeepVal(tileData);
                  updateQueue();
                } else {
                  setQueue(prev => [keepVal, prev[1]]);
                  setKeepVal(tileData);
                }
              }}
            >
              {keepVal && (
                <div className={getTileClass(keepVal)}>
                  {keepVal.value}
                </div>
              )}
            </div>

            <div className="keep-text">KEEP</div>

          </div>

          {/* CURRENT TILES */}
          <div className="tile-holder">

            {/* ACTIVE TILE */}
            <div
              className={getTileClass(activeTile)}
              draggable={!isTouchDevice && !gameOver && !isPaused}
              onDragStart={(e) => {
                if (isTouchDevice) return;
                e.dataTransfer.setData("tile", JSON.stringify(activeTile));
              }}
              onTouchStart={(e) => {
                if (!isTouchDevice) return;
                if (gameOver || isPaused) return;

                const touch = e.touches[0];

                setDraggingTile(activeTile);
                setTouchPos({
                  x: touch.clientX,
                  y: touch.clientY
                });
              }}
              onTouchMove={(e) => {
                if (!isTouchDevice) return;

                const touch = e.touches[0];

                setTouchPos({
                  x: touch.clientX,
                  y: touch.clientY
                });
              }}
              onTouchEnd={() => {
                if (!isTouchDevice || !draggingTile) return;

                const element = document.elementFromPoint(
                  touchPos.x,
                  touchPos.y
                );

                if (!element) {
                  setDraggingTile(null);
                  return;
                }

                const cell = element.closest(".cell");

                if (cell) {
                  const index = Number(cell.dataset.index);

                  if (grid[index] === null && !gameOver && !isPaused) {
                    let newGrid = [...grid];
                    newGrid[index] = draggingTile;

                    const result = handleMerge(newGrid, index);

                    setGrid(result.newGrid);
                    setScore(prev => prev + result.gainedScore);

                    if (isGameOver(result.newGrid)) {
                      setGameOver(true);
                    }

                    updateQueue();
                  }
                }

                if (element.closest(".keep-box") && !gameOver && !isPaused) {
                  if (!keepVal) {
                    setKeepVal(draggingTile);
                    updateQueue();
                  } else {
                    setQueue(prev => [keepVal, prev[1]]);
                    setKeepVal(draggingTile);
                  }
                }

                if (element.closest(".trash-box") && trashCount > 0 && !gameOver && !isPaused) {
                  setTrashCount(prev => prev - 1);
                  updateQueue();
                }

                setDraggingTile(null);
              }}
            >
              {activeTile?.value}
            </div>

            {/* NEXT TILE */}
            <div className={`${getTileClass(nextTile)} next`}>
              {nextTile?.value}
            </div>

          </div>

          {/* TRASH */}
          <div className={`trash-section ${trashCount === 0 ? "disabled" : ""}`}>

            <div className="trash-text">TRASH</div>

            <div
              className="trash-box"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                if (gameOver || isPaused || trashCount <= 0) return;

                setTrashCount(prev => prev - 1);
                updateQueue();
              }}
            >
              <img
                className="trash-icon"
                src={trash}
                alt="trash icon"
              />
              x{trashCount}
            </div>

          </div>
        </div>
      </div>

      {/* HELP */}
      {showHelp && (
        <div className="help-overlay">
          <div className="help-card">

            <h2 className="help-title">HOW TO PLAY</h2>

            <p>• Drag tiles to the grid</p>
            <p>• Divide numbers to clear them</p>
            <p>• Use KEEP to store a tile</p>
            <p>• Use TRASH to remove tiles</p>

            <button
              className="help-close"
              onClick={() => setShowHelp(false)}
            >
              GOT IT
            </button>

          </div>
        </div>
      )}

      {/* GAME OVER */}
      {gameOver && (
        <div className="overlay">
          <div className="card">

            <h2 className="card-title">GAME OVER</h2>

            <p className="card-text">Score: {score}</p>

            <button className="card-btn" onClick={handleRestart}>
              RESTART
            </button>

          </div>
        </div>
      )}

      {/* PAUSE */}
      {isPaused && !gameOver && (
        <div className="overlay">
          <div className="card">

            <h2 className="card-title">GAME PAUSED</h2>

            <button
              className="card-btn"
              onClick={() => setIsPaused(false)}
            >
              RESUME
            </button>

          </div>
        </div>
      )}

      {/* ROTATE DEVICE */}
      {isPortrait && (
        <div className="rotate-overlay">
          <div className="rotate-card">
            <h2>Rotate Device</h2>
            <p>Please rotate your device to landscape mode</p>
          </div>
        </div>
      )}

      {/* TOUCH DRAG TILE */}
      {draggingTile && (
        <div
          className={`tile ${draggingTile.color}`}
          style={{
            position: "fixed",
            left: touchPos.x - 25,
            top: touchPos.y - 25,
            pointerEvents: "none",
            zIndex: 9999
          }}
        >
          {draggingTile.value}
        </div>
      )}

    </div>
  );
}

export default App;
