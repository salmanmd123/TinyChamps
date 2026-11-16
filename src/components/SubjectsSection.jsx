
import SubjectCard from "./SubjectCard";
import "../styles/SubjectsSection.css";

function SubjectsSection({ onSelectSubject }) {
  const subjects = [
    {
      id: 1,
      title: "Math Magic",
      image: "/assets/subjects/math.png",
    },
    {
      id: 2,
      title: "English Quest",
      image: "/assets/subjects/english.png",
    },
    {
      id: 3,
      title: "Science Safari",
      image: "/assets/subjects/science.png",
    },
    {
      id: 4,
      title: "Social Explorers",
      image: "/assets/subjects/social.png",
    },
    {
      id: 5,
      title: "Art Corner",
      image: "/assets/subjects/art.png",
    },
    {
      id: 6,
      title: "Music Melodies",
      image: "/assets/subjects/music.png",
    },
    {
      id: 7,
      title: "Happy Habits",
      image: "/assets/subjects/manners.png",
    },
    {
      id: 8,
      title: "Mind Masters",
      image: "/assets/subjects/mind.png",
    },
  ];

  return (
    <section className="subjects-section" id="subjects">
      <h1 className="section-title">
        Choose Your Subject
      </h1>

      <div className="subject-grid">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onPlay={onSelectSubject}
          />
        ))}
      </div>
    </section>
  );
}

export default SubjectsSection;
