
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IntroScreen.css";

function IntroScreen() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {
      navigate("/home");
    }, 7000);

    return () => clearTimeout(timer);

  }, [navigate]);

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
