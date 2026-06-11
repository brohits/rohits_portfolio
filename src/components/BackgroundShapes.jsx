export function BackgroundShapes() {
  return (
    <div className="bg-shapes" aria-hidden="true">
      <svg
        className="bg-shapes-svg"
        viewBox="0 0 1440 3200"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bg-blob-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--shape-blob)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--shape-blob)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bg-blob-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--shape-accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--shape-accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bg-blob-c" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--shape-blob)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--shape-blob)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="1180" cy="180" r="320" fill="url(#bg-blob-a)" />
        <circle cx="260" cy="340" r="200" fill="url(#bg-blob-c)" opacity="0.65" />
        <circle cx="120" cy="620" r="260" fill="url(#bg-blob-b)" />
        <circle cx="720" cy="820" r="170" fill="url(#bg-blob-b)" opacity="0.55" />
        <circle cx="1320" cy="1100" r="200" fill="url(#bg-blob-c)" />

        <circle
          cx="300"
          cy="420"
          r="88"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.06"
        />
        <path
          d="M 80 260 A 120 120 0 0 1 200 140"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.05"
        />

        <circle
          cx="1050"
          cy="480"
          r="155"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.07"
        />
        <circle
          cx="1050"
          cy="480"
          r="95"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.05"
        />

        <rect
          x="60"
          y="920"
          width="180"
          height="180"
          fill="none"
          stroke="var(--shape-line)"
          strokeWidth="1"
          opacity="0.04"
          transform="rotate(-12 150 1010)"
        />

        <circle cx="380" cy="1380" r="10" fill="var(--shape-accent)" opacity="0.1" />
        <circle cx="1080" cy="1680" r="6" fill="var(--shape-accent)" opacity="0.14" />
        <circle cx="1280" cy="720" r="5" fill="var(--shape-accent)" opacity="0.12" />
        <circle cx="160" cy="1180" r="7" fill="var(--shape-accent)" opacity="0.09" />

        <rect
          x="1180"
          y="640"
          width="120"
          height="120"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.045"
          transform="rotate(18 1240 700)"
        />

        <path
          d="M 900 1520 L 980 1440 L 1060 1520 Z"
          fill="none"
          stroke="var(--shape-line)"
          strokeWidth="1"
          opacity="0.035"
        />

        <path
          d="M 0 1580 Q 480 1480 960 1580 T 1440 1580"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.04"
        />

        <path
          d="M 0 2100 Q 360 1980 720 2100 T 1440 2100"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.05"
        />

        <circle cx="200" cy="2480" r="280" fill="url(#bg-blob-a)" opacity="0.7" />
        <circle cx="1100" cy="2280" r="150" fill="url(#bg-blob-c)" opacity="0.5" />
        <circle
          cx="1240"
          cy="2720"
          r="120"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.06"
        />
        <circle
          cx="1240"
          cy="2720"
          r="72"
          fill="none"
          stroke="var(--shape-accent)"
          strokeWidth="1"
          opacity="0.04"
        />
      </svg>
    </div>
  );
}
