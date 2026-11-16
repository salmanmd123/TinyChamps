
function SubjectCard({ subject, onPlay }) {
  return (
    <div className="subject-card">

      <div className="subject-image-wrapper">
        <img
          src={subject.image}
          alt={subject.title}
          className="subject-image"
          loading="lazy"
        />
      </div>

      <h3 className="subject-title">
        {subject.title}
      </h3>

      <button
        className="subject-play-button"
        onClick={() => onPlay?.(subject)}
        aria-label={`Play ${subject.title}`}
        type="button"
      >
        <span className="play-icon">Explore ▶</span>
      </button>

    </div>
  );
}

export default SubjectCard;
