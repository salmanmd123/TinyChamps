import { useEffect } from "react";
import "../styles/IntroScreen.css";

function IntroScreen({ onComplete }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="intro-screen">

      <video
        className="intro-video"
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/assets/videos/intro.mp4"
          type="video/mp4"
        />
      </video>

    </div>
  );
}

export default IntroScreen;