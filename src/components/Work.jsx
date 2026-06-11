import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { ProjectCard } from "./ProjectCard";

export function Work() {
  return (
    <section id="work" className="work" aria-labelledby="work-heading">
      <div className="work-header">
        <h2 id="work-heading" className="section-title">
          Selected work
        </h2>
        <p className="work-sub">
          MeDoc, GyanConnect, and True Pay — open a card for the case study or
          Figma files.
        </p>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      <div className="work-more">
        <Link to="/work" className="work-more-btn">
          View more
        </Link>
      </div>
    </section>
  );
}
