import { useState } from "react";

export function MediaPlaceholder({ label }) {
  return (
    <div
      className="media-placeholder"
      aria-hidden={label ? undefined : true}
      aria-label={label || undefined}
    >
      <span className="media-placeholder-shimmer" />
    </div>
  );
}

export function ImageWithPlaceholder({ src, alt, className = "", loading = "lazy" }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`media-shell mock-image ${className}${loaded ? " is-loaded" : ""}${
        failed ? " is-failed" : ""
      }`}
    >
      <MediaPlaceholder />
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
