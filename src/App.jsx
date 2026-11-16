import { useState, useCallback } from "react";

import IntroScreen from "./components/IntroScreen";
import Home from "./pages/Home";
import SubjectsSection from "./components/SubjectsSection";

function App() {

  const [currentScreen, setCurrentScreen] = useState("intro");

  const handleIntroComplete = useCallback(() => {
    setCurrentScreen("home");
  }, []);

  const handlePlay = () => {
    setCurrentScreen("subjects");
  };

  return (
    <>

      {currentScreen === "intro" && (
        <IntroScreen
          onComplete={handleIntroComplete}
        />
      )}

      {currentScreen === "home" && (
        <Home onPlay={handlePlay} />
      )}

      {currentScreen === "subjects" && (
        <SubjectsSection />
      )}

    </>
  );
}

export default App;