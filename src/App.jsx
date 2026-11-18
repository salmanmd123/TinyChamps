
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import IntroScreen from "./components/IntroScreen";
import SubjectGames from "./components/SubjectGames";
import Home from "./pages/Home";
import JustDivide from "./pages/games/Maths/Just Divide/just-divide";
import MemoryMatch from "./pages/games/Brain/Memory Match/memory-match";

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
          path="/games/just-divide"
          element={<JustDivide />}
        />

        <Route
          path="/games/memory-match"
          element={<MemoryMatch />}
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
