import { useEffect, useRef, useState } from "react";

function EyeIcon() {
  return (
    <svg
      className="custom-cursor-eye"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CustomCursor() {
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: -100, y: -100 });
  const onProjectRef = useRef(false);
  const frameRef = useRef(0);
  const dirtyRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canHover || reduced) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.body.classList.add("custom-cursor-active");
    setEnabled(true);

    const setProjectState = (isProject) => {
      if (onProjectRef.current === isProject) return;
      onProjectRef.current = isProject;
      cursor.classList.toggle("is-project", isProject);
    };

    const scheduleFrame = () => {
      if (dirtyRef.current) return;
      dirtyRef.current = true;
      frameRef.current = requestAnimationFrame(renderFrame);
    };

    const handleMove = (event) => {
      positionRef.current.x = event.clientX;
      positionRef.current.y = event.clientY;
      scheduleFrame();
    };

    const renderFrame = () => {
      dirtyRef.current = false;
      const { x, y } = positionRef.current;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const handleOver = (event) => {
      setProjectState(!!event.target.closest(".project-card"));
    };

    const handleOut = (event) => {
      const card = event.target.closest(".project-card");
      const next = event.relatedTarget;
      if (card && (!next || !card.contains(next))) {
        setProjectState(false);
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{ visibility: enabled ? "visible" : "hidden" }}
      aria-hidden="true"
    >
      <div className="custom-cursor-inner">
        <span className="custom-cursor-dot" />
        <span className="custom-cursor-label">
          <EyeIcon />
          View
        </span>
      </div>
    </div>
  );
}
