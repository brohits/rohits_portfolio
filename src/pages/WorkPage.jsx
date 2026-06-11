import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ProjectCard } from "../components/ProjectCard";
import { allProjects } from "../data/projects";

export function WorkPage() {
  return (
    <Layout skipTo="#work-list">
      <section className="works-page" aria-labelledby="works-heading">
        <div className="works-page-inner">
          <header className="works-header">
            <Link to="/#work" className="works-back">
              ← Selected work
            </Link>
            <h1 id="works-heading" className="works-title">
              All work
            </h1>
            <p className="works-lede">
              Case studies, product explorations, and interface work across
              healthcare, education, fintech, and platform design.
            </p>
          </header>

          <div id="work-list" className="project-grid works-grid">
            {allProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
