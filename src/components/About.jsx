import { site } from "../data/site";

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-heading">
      <div className="about-grid">
        <h2 id="about-heading" className="section-title">
          About
        </h2>
        <div className="about-body">
          <div className="about-copy">
            {site.about.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <figure className="about-photo">
            <img
              src={site.aboutImage}
              alt={`${site.name}, UI/UX designer`}
              width={640}
              height={640}
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
