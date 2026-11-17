
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import IntroScreen from "./components/IntroScreen";
import SubjectGames from "./components/SubjectGames";
import GamePage from "./components/GamePage";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<IntroScreen />} />

        <Route path="/home" element={<Home />} />

        {/* Individual Subject Games */}
        <Route
          path="/subjects/:slug"
          element={<SubjectGames />}
        />

        {/* Individual Game Page */}
        <Route
          path="/subjects/:slug/games/:gameId"
          element={<GamePage />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
