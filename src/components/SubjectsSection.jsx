
import { useNavigate } from "react-router-dom";

import SubjectCard from "./SubjectCard";
import "../styles/SubjectsSection.css";

function SubjectsSection() {

  const navigate = useNavigate();

  const subjects = [
    {
      id: 1,
      title: "Math Magic",
      slug: "math",
      image: "/assets/subjects/math.png",
    },
    {
      id: 2,
      title: "English Quest",
      slug: "english",
      image: "/assets/subjects/english.png",
    },
    {
      id: 3,
      title: "Science Safari",
      slug: "science",
      image: "/assets/subjects/science.png",
    },
    {
      id: 4,
      title: "Social Explorers",
      slug: "social",
      image: "/assets/subjects/social.png",
    },
    {
      id: 5,
      title: "Art Corner",
      slug: "art",
      image: "/assets/subjects/art.png",
    },
    {
      id: 6,
      title: "Music Melodies",
      slug: "music",
      image: "/assets/subjects/music.png",
    },
    {
      id: 7,
      title: "Happy Habits",
      slug: "habits",
      image: "/assets/subjects/manners.png",
    },
    {
      id: 8,
      title: "Mind Masters",
      slug: "mind",
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
            onPlay={() => navigate(`/subjects/${subject.slug}`)}
          />
        ))}

      </div>

    </section>
  );
}

export default SubjectsSection;
