import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import { AdaptiveSection } from "./AdaptiveSection";
import { GradientOrbs } from "./GradientOrbs";

const STAGGER_MS = 480;

function TimelineEntry({ item, index, isLast, revealed }) {
  return (
    <li
      className={`timeline-entry${revealed ? " is-visible" : ""}`}
      style={{ "--reveal-delay": `${index * STAGGER_MS}ms` }}
    >
      <div className="timeline-marker" aria-hidden="true">
        <span className="timeline-dot" />
        {!isLast && <span className="timeline-line" />}
      </div>

      <div className="timeline-content">
        <div className="timeline-meta">
          <span className="timeline-period">{item.period}</span>
          <span className="timeline-dates">{item.dates}</span>
        </div>

        <h3 className="timeline-role">
          {item.title}
          <span className="timeline-company"> · {item.company}</span>
        </h3>

        <p className="timeline-location">{item.location}</p>

        <ul className="timeline-highlights">
          {item.highlights.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function RecentRoles() {
  const timelineRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    observer.observe(timeline);
    return () => observer.disconnect();
  }, []);

  return (
    <AdaptiveSection
      id="roles"
      className="recent-roles"
      aria-labelledby="roles-heading"
      probeSelectors={[".adaptive-probe", ".timeline-content"]}
    >
      <GradientOrbs className="gradient-orbs--experience" />
      <div className="recent-roles-inner">
        <h2 id="roles-heading" className="recent-roles-title adaptive-probe">
          Experience
        </h2>

        <ol ref={timelineRef} className="timeline">
          {site.timeline.map((item, index) => (
            <TimelineEntry
              key={item.id}
              item={item}
              index={index}
              isLast={index === site.timeline.length - 1}
              revealed={revealed}
            />
          ))}
        </ol>
      </div>
    </AdaptiveSection>
  );
}
