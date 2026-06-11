import { useId } from "react";
import { useTheme } from "../context/ThemeContext";

function MoonIcon({ fillId, lightTrack = false }) {
  const stops = lightTrack
    ? ["#6f8099", "#4f6178", "#364558"]
    : ["#dfe6f2", "#b8c4d9", "#8f9eb8"];

  return (
    <svg viewBox="0 0 24 24" className="theme-toggle-graphic" aria-hidden="true">
      <defs>
        <linearGradient id={fillId} x1="4" y1="3" x2="20" y2="20">
          <stop offset="0%" stopColor={stops[0]} />
          <stop offset="55%" stopColor={stops[1]} />
          <stop offset="100%" stopColor={stops[2]} />
        </linearGradient>
      </defs>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill={`url(#${fillId})`}
        stroke={lightTrack ? "#2f3d4f" : "none"}
        strokeWidth={lightTrack ? "0.75" : "0"}
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="theme-toggle-graphic" aria-hidden="true">
      <circle cx="12" cy="12" r="4.75" fill="#f5c542" />
      <g stroke="#f0a72d" strokeWidth="1.85" strokeLinecap="round">
        <line x1="12" y1="2.25" x2="12" y2="5.25" />
        <line x1="12" y1="18.75" x2="12" y2="21.75" />
        <line x1="2.25" y1="12" x2="5.25" y2="12" />
        <line x1="18.75" y1="12" x2="21.75" y2="12" />
        <line x1="4.9" y1="4.9" x2="7.05" y2="7.05" />
        <line x1="16.95" y1="16.95" x2="19.1" y2="19.1" />
        <line x1="4.9" y1="19.1" x2="7.05" y2="16.95" />
        <line x1="16.95" y1="7.05" x2="19.1" y2="4.9" />
      </g>
    </svg>
  );
}

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const moonFillId = useId().replace(/:/g, "");

  return (
    <button
      type="button"
      className={`theme-toggle${className ? ` ${className}` : ""}`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle-track">
        <span
          className={`theme-toggle-icon theme-toggle-icon--sun${isDark ? "" : " is-active"}`}
        >
          <SunIcon />
        </span>
        <span
          className={`theme-toggle-icon theme-toggle-icon--moon${isDark ? " is-active" : ""}`}
        >
          <MoonIcon fillId={moonFillId} lightTrack={!isDark} />
        </span>
        <span
          className="theme-toggle-thumb"
          aria-hidden="true"
        />
      </span>
      <span className="theme-toggle-label">Theme</span>
    </button>
  );
}
