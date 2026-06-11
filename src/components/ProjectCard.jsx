import { useReveal } from "../hooks/useReveal";
import { CardVisual } from "./CardVisual";

function layoutClasses(layout = {}) {
  return [
    "project-card",
    layout.wide && "span-wide",
    layout.tall && "tall",
    layout.spanTall && "span-tall",
  ]
    .filter(Boolean)
    .join(" ");
}

export function ProjectCard({ project, index }) {
  const { ref, visible, style } = useReveal(index);
  const { links = {} } = project;
  const caseStudyUrl = links.caseStudy || project.href;

  return (
    <article
      ref={ref}
      className={`${layoutClasses(project.layout)}${visible ? " is-visible" : ""}`}
      style={style}
    >
      <a
        href={caseStudyUrl}
        className="project-card-hitarea"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title} case study`}
      />
      <div className="card-inner">
        <CardVisual
          mock={project.mock}
          image={project.image}
          video={project.video}
          title={project.title}
        />
      </div>

      <div className="card-meta">
        <p className="card-title">{project.title}</p>
        <p className="card-desc">{project.description}</p>
        <p className="card-tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>
        {(links.caseStudy || links.figma) && (
          <div className="card-links">
            {links.caseStudy && (
              <a
                href={links.caseStudy}
                target="_blank"
                rel="noopener noreferrer"
              >
                Case study →
              </a>
            )}
            {links.figma && (
              <a href={links.figma} target="_blank" rel="noopener noreferrer">
                Figma files →
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
